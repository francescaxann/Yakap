import { sql } from 'drizzle-orm'
import { index, integer, pgEnum, pgPolicy, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { accessScope, actorEmail, actorId, appRole, currentModerator } from '../../../shared/rls.ts'
import { user } from '../../auth/server/schema.server.ts'
import { letterStatuses } from '../validation/model.ts'

export const letterStatus = pgEnum('letter_status', letterStatuses)

export const letters = pgTable.withRLS('letters', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  message: text('message').notNull(),
  senderEmail: text('sender_email').notNull(),
  senderId: text('sender_id').references(() => user.id, { onDelete: 'set null' }),
  status: letterStatus('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => {
  const ownLetter = sql`(${accessScope} = 'submission' AND ${table.senderId} = ${actorId} AND ${table.senderEmail} = ${actorEmail})`

  return [
    index('letters_sender_id_idx').on(table.senderId),
    pgPolicy('read_visible_letters', {
      for: 'select',
      to: appRole,
      using: sql`(${accessScope} = 'public' AND ${table.status} = 'approved') OR ${ownLetter} OR (${currentModerator})`,
    }),
    pgPolicy('submit_own_pending_letter', {
      for: 'insert',
      to: appRole,
      withCheck: sql`${ownLetter} AND ${table.status} = 'pending' AND EXISTS (
        SELECT 1 FROM public."user" WHERE id = ${actorId} AND email = ${actorEmail} AND email_verified
      )`,
    }),
    pgPolicy('moderate_letters', {
      for: 'update',
      to: appRole,
      using: sql`(${currentModerator}) AND ${table.status} <> 'deleted'`,
      withCheck: sql`(${currentModerator}) AND ${table.status} IN ('approved', 'declined', 'deleted')`,
    }),
  ]
})
