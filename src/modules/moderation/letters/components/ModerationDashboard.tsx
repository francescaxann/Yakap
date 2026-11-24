'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState, useTransition } from 'react'
import { http, requestStatus } from '@/shared/http/client'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card'
import { Empty, EmptyDescription } from '@/shared/ui/empty'
import { DeleteLetterButton } from './DeleteLetterButton'
import { LetterHistory } from './LetterHistory'
import type { ModerationLetter, ReviewDecision } from '../types/letter'

const successMessages = {
  approved: 'Letter accepted and published.',
  declined: 'Letter rejected.',
  deleted: 'Letter deleted.',
}

export function ModerationDashboard({ letters }: { letters: ModerationLetter[] }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [refreshing, startTransition] = useTransition()
  const [notice, setNotice] = useState('')
  const pendingHeading = useRef<HTMLHeadingElement>(null)
  const historyHeading = useRef<HTMLHeadingElement>(null)
  const busy = saving || refreshing
  const pending = letters.filter((letter) => letter.status === 'pending')
  const history = letters.filter((letter) => letter.status !== 'pending')

  async function update(id: number, status: ReviewDecision | 'deleted') {
    if (busy) return
    setSaving(true)
    setNotice('')
    const path = `/api/moderation/letters/${id}`
    let changed = false

    try {
      if (status === 'deleted') await http.delete(path)
      else await http.patch(path, { status })
      setNotice(successMessages[status])
      changed = true
    } catch (error) {
      const code = requestStatus(error)
      changed = code === 409 || code === 404
      if (changed) setNotice('This letter has already changed.')
      else if (code === 401 || code === 403) setNotice('Sign in with your moderator account again.')
      else setNotice('Could not update this letter. Please try again.')
    } finally {
      if (changed) {
        const heading = pending.some((letter) => letter.id === id) ? pendingHeading : historyHeading
        heading.current?.focus()
        startTransition(() => router.refresh())
      }
      setSaving(false)
    }
  }

  return (
    <>
      <p className="text-sm text-muted-foreground [&:not(:empty)]:mt-3" role="status">{notice}</p>
      <section className="mt-9" aria-labelledby="pending-letters" aria-busy={busy}>
        <h3 id="pending-letters" className="text-2xl font-bold tracking-tight" tabIndex={-1} ref={pendingHeading}>Pending review</h3>
        {pending.length === 0 ? (
          <Empty><EmptyDescription>No letters are pending review.</EmptyDescription></Empty>
        ) : (
          <div className="mt-4 grid gap-3.5">
            {pending.map((letter) => (
              <Card asChild key={letter.id} className="grid gap-3 p-5 [overflow-wrap:anywhere]">
                <article>
                  <CardHeader><h4 className="font-bold">{letter.senderEmail}</h4></CardHeader>
                  <CardContent><p className="whitespace-pre-wrap">{letter.message}</p></CardContent>
                  <CardFooter className="gap-3">
                    <Button size="sm" type="button" disabled={busy} onClick={() => update(letter.id, 'approved')}>Accept</Button>
                    <Button size="sm" variant="outline" type="button" disabled={busy} onClick={() => update(letter.id, 'declined')}>Decline</Button>
                    <DeleteLetterButton letter={letter} busy={busy} onDelete={() => update(letter.id, 'deleted')} />
                  </CardFooter>
                </article>
              </Card>
            ))}
          </div>
        )}
      </section>
      <LetterHistory letters={history} busy={busy} headingRef={historyHeading} onDelete={(id) => update(id, 'deleted')} />
    </>
  )
}
