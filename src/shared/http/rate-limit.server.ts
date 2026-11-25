import 'server-only'
import { createHash, createHmac, randomInt } from 'node:crypto'
import { isIP } from 'node:net'
import { eq, lt, or, sql } from 'drizzle-orm'
import { DatabaseUnavailableError, withDatabaseAccess, type Database } from '@/shared/database.server'
import { z } from '@/shared/validation'
import { rateLimitBuckets } from './rate-limit-schema.server'
import { RequestError } from './route.server'

const requestLimits = {
  publicLetters: { seconds: 60, network: 60, total: 600 },
  submitLetter: { seconds: 60, network: 20, total: 120 },
  readModeration: { seconds: 60, network: 60, total: 300 },
  reviewLetters: { seconds: 60, network: 30, total: 180 },
  manageModerators: { seconds: 60, network: 20, total: 120 },
  authSignIn: { seconds: 10, network: 3, total: 30 },
  authCallback: { seconds: 60, network: 30, total: 180 },
  authSession: { seconds: 60, network: 100, total: 900 },
  authSignOut: { seconds: 60, network: 30, total: 180 },
  authOther: { seconds: 60, network: 30, total: 240 },
} as const

const ipHeader = z.string().regex(/^[a-z0-9-]+$/i).safeParse(process.env.YAKAP_RATE_LIMIT_IP_HEADER).data
const keySecret = process.env.BETTER_AUTH_SECRET

type Bucket = { key: string; max: number; seconds: number }

function networkIdentity(ip: string) {
  const version = isIP(ip)
  if (version === 4) return ip
  if (version !== 6 || ip.includes('%')) return undefined

  const address = new URL(`http://[${ip}]`).hostname.slice(1, -1)
  const mapped = /^::ffff:([0-9a-f]+):([0-9a-f]+)$/.exec(address)
  if (mapped) {
    const high = parseInt(mapped[1], 16)
    const low = parseInt(mapped[2], 16)
    return [high >> 8, high & 255, low >> 8, low & 255].join('.')
  }

  const [start, end] = address.split('::')
  const prefix = start ? start.split(':') : []
  const suffix = end ? end.split(':') : []
  if (end !== undefined) prefix.push(...Array<string>(8 - prefix.length - suffix.length).fill('0'), ...suffix)
  return prefix.slice(0, 4).join(':')
}

async function consume(db: Database, { key, max, seconds }: Bucket) {
  const { hits, expiresAt } = rateLimitBuckets
  const expired = sql`${expiresAt} <= statement_timestamp()`
  const consumed = await db.insert(rateLimitBuckets).values({
    key,
    hits: 1,
    expiresAt: sql`statement_timestamp() + make_interval(secs => ${seconds})`,
  }).onConflictDoUpdate({
    target: rateLimitBuckets.key,
    set: {
      hits: sql`CASE WHEN ${expired} THEN 1 ELSE ${hits} + 1 END`,
      expiresAt: sql`CASE WHEN ${expired} THEN excluded.expires_at ELSE ${expiresAt} END`,
    },
    setWhere: or(expired, lt(hits, max)),
  }).returning({ hits })
  if (consumed.length > 0) return

  const [bucket] = await db.select({
    retryAfter: sql<number>`greatest(1, ceil(extract(epoch FROM ${expiresAt} - statement_timestamp())))::integer`,
  }).from(rateLimitBuckets).where(eq(rateLimitBuckets.key, key))
  return bucket?.retryAfter ?? 1
}

async function enforceBuckets(buckets: Bucket[]) {
  let retryAfter: number | undefined
  try {
    retryAfter = await withDatabaseAccess({ scope: 'rate-limit' }, async (db) => {
      // Reject over-limit networks before charging the shared quota.
      for (const bucket of buckets) {
        const retry = await consume(db, bucket)
        if (retry !== undefined) return retry
      }
      // Keep pruning bounded and skip rows held by other requests.
      if (randomInt(100) === 0) {
        await db.execute(sql`
          WITH expired AS (
            SELECT key FROM public.rate_limit_buckets
            WHERE expires_at < statement_timestamp() - interval '1 hour'
            ORDER BY expires_at
            LIMIT 200
            FOR UPDATE SKIP LOCKED
          )
          DELETE FROM public.rate_limit_buckets AS bucket USING expired WHERE bucket.key = expired.key
        `)
      }
    })
  } catch (error) {
    if (!(error instanceof DatabaseUnavailableError)) console.error('Request rate limit storage is unavailable.')
    throw new DatabaseUnavailableError()
  }
  if (retryAfter !== undefined) {
    throw new RequestError(429, 'Too many requests. Please wait and try again.', { 'Retry-After': String(retryAfter) })
  }
}

export function enforceRequestLimit(scope: keyof typeof requestLimits, headers: Headers) {
  const rule = requestLimits[scope]
  const buckets: Bucket[] = []
  const network = ipHeader && keySecret && networkIdentity(headers.get(ipHeader)?.trim() ?? '')
  if (network && keySecret) {
    const hash = createHmac('sha256', keySecret).update(network).digest('hex')
    buckets.push({ key: `network:${scope}:${hash}`, max: rule.network, seconds: rule.seconds })
  }
  buckets.push({ key: `global:${scope}`, max: rule.total, seconds: rule.seconds })
  return enforceBuckets(buckets)
}

export function enforceLetterSenderLimit(userId: string) {
  const hash = createHash('sha256').update(userId).digest('hex')
  return enforceBuckets([{ key: `sender:${hash}`, max: 5, seconds: 600 }])
}
