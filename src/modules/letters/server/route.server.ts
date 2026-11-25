import { requireDlsuUser } from '@/modules/auth/server/access.server'
import { hasCrisisLanguage } from '@/modules/support/crisis'
import { enforceLetterSenderLimit, enforceRequestLimit } from '@/shared/http/rate-limit.server'
import { json, readJson, respond } from '@/shared/http/route.server'
import { letterInputError, letterInputSchema } from '../validation/model'
import { listApprovedLetters, saveLetter } from './store.server'

export function getLetters(request: Request) {
  return respond(async () => {
    await enforceRequestLimit('publicLetters', request.headers)
    return json({ letters: await listApprovedLetters() })
  })
}

export function submitLetter(request: Request) {
  return respond(async () => {
    await enforceRequestLimit('submitLetter', request.headers)
    const user = await requireDlsuUser(request)
    const { message } = await readJson(request, letterInputSchema, letterInputError)
    if (hasCrisisLanguage(message)) {
      return json({ error: 'Please use the support resources shown.', code: 'crisis' }, 422)
    }
    await enforceLetterSenderLimit(user.id)
    return json(await saveLetter(message, user), 201)
  })
}
