import { z } from '@/shared/validation'
import { dlsuEmailSchema } from '@/modules/auth/utils'

export const moderatorInputSchema = z.object({ email: dlsuEmailSchema })
export const moderatorInputError = 'Enter a valid @dlsu.edu.ph email address.'
