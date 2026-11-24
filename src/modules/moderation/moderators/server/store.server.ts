import 'server-only'
import { eq, sql } from 'drizzle-orm'
import { normalizeDlsuEmail } from '@/modules/auth/utils'
import { hasDatabase, withDatabaseAccess, type Database } from '@/shared/database.server'
import { moderators } from './schema.server'

const membershipReadLock = sql`LOCK TABLE ${moderators} IN SHARE MODE`
const membershipWriteLock = sql`LOCK TABLE ${moderators} IN SHARE ROW EXCLUSIVE MODE`

async function hasModeratorRecord(db: Database, email: string) {
  const [moderator] = await db.select({ email: moderators.email }).from(moderators).where(eq(moderators.email, email))
  return moderator !== undefined
}

export function withModeratorAccess<T>(
  address: string,
  run: (db: Database) => Promise<T>,
  scope: 'moderation' | 'manage-moderators' = 'moderation',
) {
  const email = address.toLowerCase()
  return withDatabaseAccess({ scope, email }, async (db) => {
    // Keep membership stable from the authorization check through the final query.
    await db.execute(membershipReadLock)
    if (!(await hasModeratorRecord(db, email))) return null
    return run(db)
  })
}

export async function isModerator(address: string) {
  const email = normalizeDlsuEmail(address)
  if (!email || !hasDatabase()) return false

  if (await withDatabaseAccess({ scope: 'membership', email }, (db) => hasModeratorRecord(db, email))) return true

  const initialEmails = new Set((process.env.YAKAP_MODERATOR_EMAILS ?? '').split(/[\n,]/)
    .map(normalizeDlsuEmail).filter((email) => email !== null))
  if (!initialEmails.has(email)) return false

  return withDatabaseAccess({ scope: 'bootstrap' }, async (db) => {
    await db.execute(membershipWriteLock)
    const rows = await db.select().from(moderators)
    if (rows.length) return rows.some((row) => row.email === email)

    await db.insert(moderators).values([...initialEmails].map((email) => ({ email })))
    return true
  })
}

export function listModeratorEmails(email: string) {
  return withModeratorAccess(email, async (db) => {
    const rows = await db.select().from(moderators).orderBy(moderators.email)
    return rows.map((row) => row.email)
  }, 'manage-moderators')
}

export async function updateModerator(actor: string, email: string, action: 'add' | 'remove') {
  return withDatabaseAccess({ scope: 'manage-moderators', email: actor }, async (db) => {
    // Serialize membership changes so concurrent requests cannot both remove the other moderator.
    await db.execute(membershipWriteLock)
    const rows = await db.select().from(moderators)
    const emails = rows.map((row) => row.email)
    if (!emails.includes(actor)) return 'forbidden'

    if (action === 'add') {
      if (emails.includes(email)) return 'exists'
      await db.insert(moderators).values({ email })
    } else {
      if (actor === email || emails.length <= 1) return 'protected'
      if (!emails.includes(email)) return 'missing'
      await db.delete(moderators).where(eq(moderators.email, email))
    }
    return 'updated'
  })
}
