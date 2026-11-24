import { Button } from '@/shared/ui/button'
import { ConfirmAction } from '@/shared/ui/ConfirmAction'
import type { ModerationLetter } from '../types/letter'

export function DeleteLetterButton({ letter, busy, onDelete }: {
  letter: ModerationLetter
  busy: boolean
  onDelete: () => Promise<void>
}) {
  const description = letter.status === 'approved'
    ? 'It will be removed from the public feed and kept in letter history.'
    : 'It will be marked Deleted in letter history.'

  return (
    <ConfirmAction title="Delete this letter?" description={description} label="Delete letter" destructive onConfirm={onDelete}>
      <Button variant="destructive" size="sm" type="button" disabled={busy} aria-label={`Delete letter ${letter.id}`}>Delete</Button>
    </ConfirmAction>
  )
}
