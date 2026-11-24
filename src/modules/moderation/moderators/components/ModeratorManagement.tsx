'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState, useTransition, type FormEvent } from 'react'
import { http, requestMessage, requestStatus } from '@/shared/http/client'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { ConfirmAction } from '@/shared/ui/ConfirmAction'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/shared/ui/field'
import { Input } from '@/shared/ui/input'
import { moderatorInputError, moderatorInputSchema } from '../validation/model'

export function ModeratorManagement({ emails, currentEmail }: { emails: string[]; currentEmail: string }) {
  const router = useRouter()
  const [refreshing, startTransition] = useTransition()
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [invalid, setInvalid] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const emailInput = useRef<HTMLInputElement>(null)
  const busy = saving || refreshing

  async function change(email: string, action: 'add' | 'remove', form?: HTMLFormElement) {
    if (busy) return
    setSaving(true)
    setNotice('')
    setError('')
    setInvalid(false)
    let shouldRefresh = true

    try {
      const path = '/api/moderation/moderators'
      if (action === 'add') await http.post(path, { email })
      else await http.delete(path, { data: { email } })
      form?.reset()
      setNotice(action === 'add' ? `Added ${email}.` : `Removed ${email}.`)
      if (action === 'remove') heading.current?.focus()
    } catch (error) {
      const status = requestStatus(error)
      shouldRefresh = status === 403 || status === 404 || status === 409
      setError(requestMessage(error, 'Could not update moderator access. Try again.'))
    } finally {
      if (shouldRefresh) startTransition(() => router.refresh())
      setSaving(false)
    }
  }

  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const result = moderatorInputSchema.safeParse({ email: new FormData(form).get('email') })
    if (!result.success) {
      setNotice('')
      setInvalid(true)
      setError(moderatorInputError)
      emailInput.current?.focus()
      return
    }
    await change(result.data.email, 'add', form)
  }

  return (
    <section className="mt-9" aria-labelledby="manage-moderators">
      <h3 id="manage-moderators" className="text-2xl font-bold tracking-tight" tabIndex={-1} ref={heading}>Manage moderators</h3>
      <p className="mb-4 mt-2 text-[15px] leading-relaxed text-muted-foreground">Moderators can review letters and manage access. At least one moderator must remain.</p>
      <Card className="p-[clamp(16px,3vw,26px)]">
        <CardContent>
          <form onSubmit={add}>
            <FieldGroup>
              <Field data-invalid={invalid || undefined}>
                <FieldLabel htmlFor="moderator-email">DLSU email address</FieldLabel>
                <div className="flex flex-wrap gap-2.5">
                  <Input className="flex-[1_1_15rem]" ref={emailInput} id="moderator-email" name="email" type="email" autoComplete="off" required maxLength={254}
                    aria-invalid={invalid || undefined} aria-describedby={invalid ? 'moderator-error moderator-email-hint' : 'moderator-email-hint'} />
                  <Button type="submit" disabled={busy}>Add moderator</Button>
                </div>
                <FieldDescription id="moderator-email-hint">They’ll need to sign in with their verified DLSU Google account.</FieldDescription>
              </Field>
            </FieldGroup>
          </form>
          <p id="moderator-error" className="text-sm text-destructive-foreground [&:not(:empty)]:mt-3" role="alert">{error}</p>
          <p className="text-sm text-muted-foreground [&:not(:empty)]:mt-3" role="status">{notice}</p>
          <ul className="mt-5" aria-label="Current moderators" aria-busy={busy}>
            {emails.map((email) => (
              <li className="flex flex-wrap items-center justify-between gap-2 border-t border-border py-3 [overflow-wrap:anywhere]" key={email}>
                <span>{email}</span>
                {email === currentEmail ? <Badge variant="secondary">You</Badge> : (
                  <ConfirmAction title="Remove moderator?" description={`${email} will lose access to moderation.`} label="Remove moderator" destructive onConfirm={() => change(email, 'remove')}>
                    <Button variant="destructive" size="sm" type="button" disabled={busy} aria-label={`Remove ${email}`}>Remove</Button>
                  </ConfirmAction>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
