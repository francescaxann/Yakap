import 'server-only'
import { desc, eq } from 'drizzle-orm'
import { withDatabaseAccess } from '@/shared/database.server'
import { letters } from './schema.server'

export async function listApprovedLetters() {
  const approved = await withDatabaseAccess({ scope: 'public' }, async (db) =>
    db.select({ id: letters.id, message: letters.message, createdAt: letters.createdAt })
      .from(letters).where(eq(letters.status, 'approved')).orderBy(desc(letters.id)),
  )

  return approved.map((letter) => ({
    ...letter,
    message: letter.message.replace(/[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@dlsu\.edu\.ph/gi, '[email removed]'),
  }))
}

export async function saveLetter(message: string, sender: { id: string; email: string }) {
  const email = sender.email.toLowerCase()
  return withDatabaseAccess({ scope: 'submission', email, userId: sender.id }, async (db) => {
    const [saved] = await db.insert(letters).values({ message, senderEmail: email, senderId: sender.id })
      .returning({ status: letters.status })
    return saved
  })
}
