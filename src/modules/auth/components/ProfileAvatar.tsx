import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { z } from '@/shared/validation'

const googleAvatarSchema = z.url({ protocol: /^https$/, hostname: /^lh3\.googleusercontent\.com$/ })
  .transform((image) => new URL(image))
  .refine((url) => !url.port && !url.username && !url.password)

export function ProfileAvatar({ email, name, image }: {
  email: string
  name?: string | null
  image?: string | null
}) {
  const url = googleAvatarSchema.safeParse(image).data
  const parts = (name?.trim() || email.split('@')[0]).split(/[\s._-]+/).filter(Boolean)
  const initials = parts.slice(0, 2).map((part) => Array.from(part)[0]).join('').toUpperCase() || '?'

  return (
    <Avatar aria-hidden="true">
      <AvatarImage src={url?.href} alt="" referrerPolicy="no-referrer" />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}
