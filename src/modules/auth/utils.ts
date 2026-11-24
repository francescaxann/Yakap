import { z } from '@/shared/validation'

export const dlsuDomain = 'dlsu.edu.ph'
export const dlsuEmailSchema = z.string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: 'Enter a valid @dlsu.edu.ph email address.' }).max(254))
  .refine((email) => email.endsWith(`@${dlsuDomain}`), 'Enter a valid @dlsu.edu.ph email address.')

export const authErrorQuery = z.object({ error: z.string().min(1).optional() })

export function normalizeDlsuEmail(value: unknown) {
  return dlsuEmailSchema.safeParse(value).data ?? null
}
