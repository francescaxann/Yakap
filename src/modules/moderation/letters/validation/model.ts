import { z } from '@/shared/validation'

export const reviewSchema = z.object({ status: z.enum(['approved', 'declined']) })

export const historyStatuses = ['all', 'approved', 'declined', 'deleted'] as const
export const historyFilterSchema = z.enum(historyStatuses)
