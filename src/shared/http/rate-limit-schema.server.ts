import { sql } from 'drizzle-orm'
import { index, integer, pgPolicy, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { accessScope, appRole } from '../rls.ts'

const rateLimitScope = sql`${accessScope} = 'rate-limit'`

export const rateLimitBuckets = pgTable.withRLS('rate_limit_buckets', {
  key: text('key').primaryKey(),
  hits: integer('hits').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
}, (table) => [
  index('rate_limit_buckets_expires_at_idx').on(table.expiresAt),
  pgPolicy('rate_limit_scope', { to: appRole, using: rateLimitScope, withCheck: rateLimitScope }),
])
