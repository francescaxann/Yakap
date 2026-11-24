import { noContent, readJson, RequestError, respond } from '@/shared/http/route.server'
import { requireModerator } from '../../server/access.server'
import { moderatorInputError, moderatorInputSchema } from '../validation/model'
import { updateModerator } from './store.server'

export function changeModerators(request: Request) {
  return respond(async () => {
    const actor = await requireModerator(request)
    const { email } = await readJson(request, moderatorInputSchema, moderatorInputError)
    const result = await updateModerator(actor.email.toLowerCase(), email, request.method === 'POST' ? 'add' : 'remove')

    switch (result) {
      case 'forbidden': throw new RequestError(403, 'Moderator access is required.')
      case 'exists': throw new RequestError(409, 'This email already has moderator access.')
      case 'protected': throw new RequestError(409, 'You cannot remove your own access. Keep at least one moderator.')
      case 'missing': throw new RequestError(404, 'This email no longer has moderator access.')
      case 'updated': return noContent()
    }
  })
}
