import { z } from '@/shared/validation'
import { json, noContent, readJson, RequestError, respond, validate } from '@/shared/http/route.server'
import { requireModerator } from '../../server/access.server'
import { reviewSchema } from '../validation/model'
import { deleteLetter, listPendingLetters, reviewLetter } from './store.server'

const idSchema = z.string().regex(/^\d+$/).transform(Number).pipe(z.int().min(1).max(2_147_483_647))
type LetterRoute = { params: Promise<{ id: string }> }

export function getModerationQueue(request: Request) {
  return respond(async () => {
    const moderator = await requireModerator(request)
    const letters = await listPendingLetters(moderator.email)
    if (letters === null) throw new RequestError(403, 'Moderator access is required.')
    return json({ letters })
  })
}

export function changeLetterStatus(request: Request, { params }: LetterRoute) {
  return respond(async () => {
    const moderator = await requireModerator(request)
    const id = validate(idSchema, (await params).id, 404, 'Letter not found.')
    const { status } = await readJson(request, reviewSchema, 'Choose approved or declined.')
    const updated = await reviewLetter(moderator.email, id, status)
    if (updated === null) throw new RequestError(403, 'Moderator access is required.')
    if (!updated) throw new RequestError(409, 'This letter is no longer pending.')
    return json(updated)
  })
}

export function removeLetter(request: Request, { params }: LetterRoute) {
  return respond(async () => {
    const moderator = await requireModerator(request)
    const id = validate(idSchema, (await params).id, 404, 'Letter not found.')
    const deleted = await deleteLetter(moderator.email, id)
    if (deleted === null) throw new RequestError(403, 'Moderator access is required.')
    if (!deleted) throw new RequestError(404, 'Letter not found or already deleted.')
    return noContent()
  })
}
