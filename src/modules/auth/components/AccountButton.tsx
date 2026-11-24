'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ConfirmAction } from '@/shared/ui/ConfirmAction'
import { Button } from '@/shared/ui/button'
import { authClient } from '../client/auth-client'
import { cn } from '@/shared/utils'

export function AccountButton({ returnTo, signedIn = false, className }: {
  returnTo: '/letters' | '/moderation'
  signedIn?: boolean
  className?: string
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleClick() {
    if (busy) return
    setBusy(true)
    setError('')
    try {
      if (signedIn) {
        const result = await authClient.signOut()
        if (result.error) throw new Error()
        router.refresh()
      } else {
        const result = await authClient.signIn.social({
          provider: 'google',
          callbackURL: returnTo,
          errorCallbackURL: returnTo,
        })
        if (result.error) throw new Error()
      }
    } catch {
      setError(signedIn ? 'Could not sign out. Please try again.' : 'Could not start DLSU sign-in. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={cn("relative", className)}>
      {signedIn ? (
        <ConfirmAction title="Sign out of Yakap?" description="You can sign back in anytime with your DLSU Google account." label="Sign out" onConfirm={handleClick}>
          <Button type="button" disabled={busy}>Sign out</Button>
        </ConfirmAction>
      ) : (
        <Button type="button" onClick={handleClick} disabled={busy}>Sign in with DLSU Google</Button>
      )}
      <p className="text-sm empty:absolute [&:not(:empty)]:mt-3" role="alert">{error}</p>
    </div>
  )
}
