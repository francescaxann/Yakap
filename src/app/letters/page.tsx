import { headers } from 'next/headers'
import type { Metadata } from 'next'
import { canSignIn, getSignedInUser, isVerifiedDlsuUser } from '@/modules/auth/server/auth.server'
import { authErrorQuery } from '@/modules/auth/utils'
import { LettersPage } from '@/modules/letters/components/LettersPage'
import { isModerator } from '@/modules/moderation/moderators/server/store.server'

export const metadata: Metadata = { title: 'Letters of hope', alternates: { canonical: '/letters' } }

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [requestHeaders, query] = await Promise.all([headers(), searchParams])
  const user = await getSignedInUser(requestHeaders)
  const email = isVerifiedDlsuUser(user) ? user.email : undefined

  return (
    <LettersPage
      email={email}
      canModerate={email !== undefined && await isModerator(email)}
      canSignIn={canSignIn()}
      signInError={Boolean(authErrorQuery.safeParse(query).data?.error)}
    />
  )
}
