import { headers } from 'next/headers'
import type { Metadata } from 'next'
import { authErrorQuery } from '@/modules/auth/utils'
import { ModerationPage } from '@/modules/moderation/components/ModerationPage'

export const metadata: Metadata = { title: 'Letter moderation', robots: { index: false, follow: false } }

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [requestHeaders, query] = await Promise.all([headers(), searchParams])
  return <ModerationPage requestHeaders={requestHeaders} signInError={Boolean(authErrorQuery.safeParse(query).data?.error)} />
}
