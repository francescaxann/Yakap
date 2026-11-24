import 'server-only'
import { requireDlsuUser } from '@/modules/auth/server/access.server'
import { RequestError } from '@/shared/http/route.server'
import { isModerator } from '../moderators/server/store.server'

export async function requireModerator(request: Request) {
  const user = await requireDlsuUser(request)
  if (!(await isModerator(user.email))) throw new RequestError(403, 'Moderator access is required.')
  return user
}
