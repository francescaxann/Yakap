import 'server-only'
import { and, desc, eq, ne } from 'drizzle-orm'
import { user } from '@/modules/auth/server/schema.server'
import { letters } from '@/modules/letters/server/schema.server'
import { withModeratorAccess } from '../../moderators/server/store.server'
import type { ReviewDecision } from '../types/letter'

const moderationFields = {
  id: letters.id,
  message: letters.message,
  senderEmail: letters.senderEmail,
  status: letters.status,
  createdAt: letters.createdAt,
}

export function listPendingLetters(email: string) {
  return withModeratorAccess(email, async (db) =>
    db.select(moderationFields).from(letters).where(eq(letters.status, 'pending')).orderBy(desc(letters.id)),
  )
}

export function listModerationLetters(email: string) {
  return withModeratorAccess(email, async (db) =>
    db.select({ ...moderationFields, senderImage: user.image, senderName: user.name })
      .from(letters)
      .leftJoin(user, and(eq(letters.senderId, user.id), eq(user.emailVerified, true)))
      .orderBy(desc(letters.id)),
  )
}

export function reviewLetter(email: string, id: number, status: ReviewDecision) {
  return withModeratorAccess(email, async (db) => {
    const [updated] = await db.update(letters).set({ status })
      .where(and(eq(letters.id, id), eq(letters.status, 'pending')))
      .returning(moderationFields)
    return updated
  })
}

export function deleteLetter(email: string, id: number) {
  return withModeratorAccess(email, async (db) => {
    const [deleted] = await db.update(letters).set({ status: 'deleted' })
      .where(and(eq(letters.id, id), ne(letters.status, 'deleted')))
      .returning({ id: letters.id })
    return deleted
  })
}
