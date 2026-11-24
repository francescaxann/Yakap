import { z } from '@/shared/validation'

const originSchema = z.url({ protocol: /^https?$/ }).transform((value) => new URL(value).origin)

export function getSiteOrigin() {
  return originSchema.safeParse(process.env.BETTER_AUTH_URL).data ?? 'http://localhost:3000'
}
