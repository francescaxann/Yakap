import type { z } from 'zod'
import type { LetterStatus } from '@/modules/letters/types/letter'
import type { historyFilterSchema, reviewSchema } from '../validation/model'

export type ReviewDecision = z.infer<typeof reviewSchema>['status']
export type HistoryFilter = z.infer<typeof historyFilterSchema>

export type ModerationLetter = {
  id: number
  message: string
  createdAt: Date
  senderEmail: string
  senderImage: string | null
  senderName: string | null
  status: LetterStatus
}
