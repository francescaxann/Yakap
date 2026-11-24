import { requireDlsuUser } from '@/modules/auth/server/access.server'
import { hasCrisisLanguage } from '@/modules/support/crisis'
import { json, readJson, respond } from '@/shared/http/route.server'
import { letterInputError, letterInputSchema } from '../validation/model'
import { listApprovedLetters, saveLetter } from './store.server'

export function getLetters() {
  return respond(async () => json({ letters: await listApprovedLetters() }))
}

export function submitLetter(request: Request) {
  return respond(async () => {
    const user = await requireDlsuUser(request)
    const { message } = await readJson(request, letterInputSchema, letterInputError)
    if (hasCrisisLanguage(message)) {
      return json({ error: 'Please use the support resources shown.', code: 'crisis' }, 422)
    }
    return json(await saveLetter(message, user), 201)
  })
}
