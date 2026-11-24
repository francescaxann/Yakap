import { sql } from 'drizzle-orm'
import { pgPolicy, pgTable, text } from 'drizzle-orm/pg-core'
import { accessScope, actorEmail, appRole } from '../../../../shared/rls.ts'

export const moderators = pgTable.withRLS('moderators', {
  email: text('email').primaryKey(),
}, (table) => [
  pgPolicy('read_memberships', {
    for: 'select',
    to: appRole,
    using: sql`${accessScope} IN ('bootstrap', 'manage-moderators') OR (
      ${accessScope} IN ('membership', 'moderation') AND ${table.email} = ${actorEmail}
    )`,
  }),
  pgPolicy('add_membership', {
    for: 'insert',
    to: appRole,
    withCheck: sql`${accessScope} IN ('bootstrap', 'manage-moderators')`,
  }),
  pgPolicy('remove_other_membership', {
    for: 'delete',
    to: appRole,
    using: sql`${accessScope} = 'manage-moderators' AND ${table.email} <> ${actorEmail}`,
  }),
])
