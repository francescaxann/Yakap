import 'server-only'
import { RequestError } from '@/shared/http/route.server'
import { getSignedInUser, isVerifiedDlsuUser } from './auth.server'

export async function requireDlsuUser(request: Request) {
  const user = await getSignedInUser(request.headers)
  if (!user) throw new RequestError(401, 'Sign in with your DLSU Google account.')
  if (!isVerifiedDlsuUser(user)) throw new RequestError(403, 'A verified DLSU account is required.')
  return user
}
