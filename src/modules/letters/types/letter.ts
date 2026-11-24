import type { z } from 'zod'
import type { letterFeedSchema, letterStatuses } from '../validation/model'

export type LetterStatus = typeof letterStatuses[number]
export type LetterFeed = z.infer<typeof letterFeedSchema>
