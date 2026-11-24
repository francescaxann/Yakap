import 'server-only'
import pg from 'pg'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { z } from '@/shared/validation'

function createDatabase(connectionString: string) {
  const pool = new pg.Pool({
    connectionString,
    connectionTimeoutMillis: 10_000,
    enableChannelBinding: true,
    allowExitOnIdle: true,
  })
  pool.on('error', () => console.error('An idle PostgreSQL connection failed.'))
  return drizzle({ client: pool, paramsInErrors: false })
}

const databaseUrl = z.url({ protocol: /^postgres(?:ql)?$/ }).safeParse(process.env.DATABASE_URL).data
let database: ReturnType<typeof createDatabase> | undefined

export type Database = Parameters<Parameters<NonNullable<typeof database>['transaction']>[0]>[0]

type Access =
  | { scope: 'auth' | 'public' | 'bootstrap' }
  | { scope: 'membership' | 'moderation' | 'manage-moderators'; email: string }
  | { scope: 'submission'; email: string; userId: string }

export class DatabaseUnavailableError extends Error {}

export function hasDatabase() {
  return databaseUrl !== undefined
}

export async function withDatabaseAccess<T>(access: Access, run: (db: Database) => Promise<T>) {
  if (!databaseUrl) throw new DatabaseUnavailableError()
  const db = (database ??= createDatabase(databaseUrl))
  const accessMode = access.scope === 'public' || access.scope === 'membership' ? 'read only' : 'read write'

  return db.transaction(async (tx) => {
    // Both the restricted role and request context are reset when the transaction ends.
    await tx.execute(sql`SET LOCAL ROLE yakap_app`)
    const email = 'email' in access ? access.email.toLowerCase() : ''
    const userId = 'userId' in access ? access.userId : ''
    await tx.execute(sql`
      SELECT set_config('yakap.scope', ${access.scope}, true),
             set_config('yakap.actor_email', ${email}, true),
             set_config('yakap.actor_id', ${userId}, true)
    `)
    return run(tx)
  }, { isolationLevel: 'read committed', accessMode })
}
