import { z } from '@/shared/validation'

export const letterMaxLength = 2000
export const letterInputError = `Enter a letter between 1 and ${letterMaxLength} characters.`
export const letterInputSchema = z.object({
  message: z.string().trim().min(1).max(letterMaxLength).refine((message) => !message.includes('\0')),
})

export const letterStatuses = ['pending', 'approved', 'declined', 'deleted'] as const

export const letterFeedSchema = z.object({
  letters: z.array(z.object({ id: z.int().positive(), message: z.string(), createdAt: z.iso.datetime() })),
})

export const letterDateFormat = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeZone: 'Asia/Manila' })
