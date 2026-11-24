'use client'

import Link from 'next/link'
import { useRef, useState, type FormEvent } from 'react'
import { AccountButton } from '@/modules/auth/components/AccountButton'
import { CrisisModal } from '@/modules/support/components/CrisisModal'
import { hasCrisisLanguage } from '@/modules/support/crisis'
import { http, requestStatus } from '@/shared/http/client'
import { Alert } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/shared/ui/field'
import { kicker } from '@/shared/ui/SectionHeading'
import { Textarea } from '@/shared/ui/textarea'
import { cn } from '@/shared/utils'
import { letterInputError, letterInputSchema, letterMaxLength } from '../validation/model'

export type LetterFormProps = {
  email?: string
  canModerate: boolean
  canSignIn: boolean
  signInError: boolean
}

export function LetterForm({ email, canModerate, canSignIn, signInError }: LetterFormProps) {
  const [notice, setNotice] = useState('')
  const [invalid, setInvalid] = useState(false)
  const [sending, setSending] = useState(false)
  const [crisisOpen, setCrisisOpen] = useState(false)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return
    const form = event.currentTarget
    const result = letterInputSchema.safeParse({ message: new FormData(form).get('message') })
    setNotice('')
    setInvalid(!result.success)

    if (!result.success) {
      setNotice(letterInputError)
      messageRef.current?.focus()
      return
    }
    if (hasCrisisLanguage(result.data.message)) {
      setCrisisOpen(true)
      return
    }

    setSending(true)
    try {
      await http.post('/api/letters', result.data)
      form.reset()
      setNotice('Your letter was saved and is pending review.')
    } catch (error) {
      const status = requestStatus(error)
      if (status === 422) setCrisisOpen(true)
      else if (status === 401 || status === 403) setNotice('Sign in with your verified DLSU account before sending.')
      else setNotice('Your letter could not be saved. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <Card variant="ink" className="p-[26px]">
      <CardHeader className="mb-7">
        <span className={cn(kicker, 'text-ink-accent')}>WRITE A NOTE</span>
        <CardTitle className="text-[26px] leading-[1.1]">Someone may need this today.</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-4">
        {email ? (
          <>
            <p className="[overflow-wrap:anywhere]">Signed in as {email}</p>
            {canModerate && <Button asChild><Link href="/moderation">Open moderation</Link></Button>}
            <form className="grid w-full gap-4" onSubmit={submit} aria-busy={sending}>
              <FieldGroup>
                <Field data-invalid={invalid || undefined}>
                  <FieldLabel className="font-mono text-[11px] text-ink-muted" htmlFor="hope-message">
                    Your message <span aria-hidden="true">*</span>
                  </FieldLabel>
                  <Textarea ref={messageRef} id="hope-message" name="message" rows={5} placeholder="A gentle thought for someone else…"
                    maxLength={letterMaxLength} required readOnly={sending} variant="ink"
                    aria-invalid={invalid || undefined} aria-describedby={invalid ? 'letter-hint letter-notice' : 'letter-hint'} />
                  <FieldDescription className="text-xs text-ink-muted" id="letter-hint">
                    Only moderators can see your account. Leave identifying details out of your note.
                  </FieldDescription>
                </Field>
              </FieldGroup>
              <Button className="justify-self-start" type="submit" aria-disabled={sending}>
                {sending ? 'Sending…' : 'Send with care'} <span aria-hidden="true">→</span>
              </Button>
            </form>
            <p className="text-xs text-ink-success empty:absolute" id="letter-notice" role="status">{notice}</p>
            <AccountButton returnTo="/letters" signedIn />
          </>
        ) : (
          <>
            <p>Sign in with your DLSU Google account to send a letter.</p>
            {signInError && <Alert variant="destructive">Sign-in requires a verified DLSU Google account.</Alert>}
            {canSignIn ? <AccountButton returnTo="/letters" /> : <p>DLSU sign-in is unavailable right now.</p>}
          </>
        )}
      </CardContent>
      <CrisisModal open={crisisOpen} onClose={() => setCrisisOpen(false)} onReturnFocus={() => messageRef.current?.focus()} />
    </Card>
  )
}
