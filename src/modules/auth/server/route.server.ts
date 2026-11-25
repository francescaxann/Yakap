import { enforceRequestLimit } from '@/shared/http/rate-limit.server'
import { json, respond } from '@/shared/http/route.server'
import { runWithAuth } from './auth.server'

function authRateLimit(pathname: string) {
  const action = pathname.split('/')[3]
  switch (action) {
    case 'sign-in': return 'authSignIn'
    case 'callback': return 'authCallback'
    case 'get-session': return 'authSession'
    case 'sign-out': return 'authSignOut'
    default: return 'authOther'
  }
}

export function handleAuthRequest(request: Request) {
  return respond(async () => {
    await enforceRequestLimit(authRateLimit(new URL(request.url).pathname), request.headers)
    const response = await runWithAuth((auth) => auth.handler(request))
    return response ?? json({ error: 'DLSU sign-in is unavailable.' }, 503)
  })
}
