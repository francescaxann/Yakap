'use client'

import { useState, type Ref } from 'react'
import { ProfileAvatar } from '@/modules/auth/components/ProfileAvatar'
import { letterDateFormat } from '@/modules/letters/validation/model'
import { Badge } from '@/shared/ui/badge'
import { Empty, EmptyDescription } from '@/shared/ui/empty'
import { Label } from '@/shared/ui/label'
import { NativeSelect, NativeSelectOption } from '@/shared/ui/native-select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'
import { DeleteLetterButton } from './DeleteLetterButton'
import type { HistoryFilter, ModerationLetter } from '../types/letter'
import { historyFilterSchema, historyStatuses } from '../validation/model'

const statusLabels = { all: 'All statuses', pending: 'Pending', approved: 'Accepted', declined: 'Rejected', deleted: 'Deleted' }
const statusVariants = { pending: 'outline', approved: 'default', declined: 'destructive', deleted: 'secondary' } as const

export function LetterHistory({ letters, busy, headingRef, onDelete }: {
  letters: ModerationLetter[]
  busy: boolean
  headingRef: Ref<HTMLHeadingElement>
  onDelete: (id: number) => Promise<void>
}) {
  const [filter, setFilter] = useState<HistoryFilter>('all')
  const visibleLetters = filter === 'all' ? letters : letters.filter((letter) => letter.status === filter)

  return (
    <section className="mt-9" aria-labelledby="letter-history" aria-busy={busy}>
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2.5">
        <h3 id="letter-history" className="text-2xl font-bold tracking-tight" tabIndex={-1} ref={headingRef}>Letter history</h3>
        {letters.length > 0 && (
          <div className="flex items-center gap-2.5">
            <Label htmlFor="history-status">Status</Label>
            <NativeSelect id="history-status" value={filter} onChange={(event) => {
              const result = historyFilterSchema.safeParse(event.target.value)
              if (result.success) setFilter(result.data)
            }}>
              {historyStatuses.map((status) => <NativeSelectOption key={status} value={status}>{statusLabels[status]}</NativeSelectOption>)}
            </NativeSelect>
          </div>
        )}
      </div>

      <Empty className={visibleLetters.length > 0 ? 'sr-only' : undefined}>
        <EmptyDescription role="status">
          {letters.length === 0 ? 'No accepted, rejected, or deleted letters yet.' : `${visibleLetters.length} ${visibleLetters.length === 1 ? 'letter' : 'letters'} shown.`}
        </EmptyDescription>
      </Empty>

      {visibleLetters.length > 0 && (
        <div className="mt-4 overflow-x-auto scroll-px-3 border border-border bg-background/85" role="region" aria-label="Scrollable letter history" tabIndex={0}>
          <Table className="min-w-[43rem] table-fixed [&_td]:align-top [&_th]:bg-muted [&_th]:font-bold [&_:is(th,td)]:p-4 [&_:is(th,td)]:[overflow-wrap:anywhere]" aria-labelledby="letter-history">
            <colgroup><col className="w-[31%]" /><col /><col className="w-32" /><col className="w-32" /></colgroup>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Sender</TableHead>
                <TableHead scope="col">Letter</TableHead>
                <TableHead scope="col">Status</TableHead>
                <TableHead scope="col">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleLetters.map((letter) => (
                <TableRow key={letter.id}>
                  <TableCell>
                    <div className="flex items-start gap-2.5">
                      <ProfileAvatar email={letter.senderEmail} name={letter.senderName} image={letter.senderImage} />
                      <div>
                        {letter.senderName && <strong className="block">{letter.senderName}</strong>}
                        <span className="text-[13px] text-muted-foreground">{letter.senderEmail}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <time className="mb-1 inline-block text-[13px] text-muted-foreground" dateTime={letter.createdAt.toISOString()}>
                      {letterDateFormat.format(letter.createdAt)}
                    </time>
                    <p className="whitespace-pre-wrap leading-[1.65]">{letter.message}</p>
                  </TableCell>
                  <TableCell><Badge variant={statusVariants[letter.status]}>{statusLabels[letter.status]}</Badge></TableCell>
                  <TableCell>
                    {letter.status !== 'deleted' && <DeleteLetterButton letter={letter} busy={busy} onDelete={() => onDelete(letter.id)} />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  )
}
