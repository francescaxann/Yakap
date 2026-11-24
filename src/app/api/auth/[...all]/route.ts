import { toNextJsHandler } from 'better-auth/next-js'
import { runWithAuth } from '@/modules/auth/server/auth.server'
import { json } from '@/shared/http/route.server'

export const { GET, POST } = toNextJsHandler(async (request) => {
  const response = await runWithAuth((auth) => auth.handler(request))
  return response ?? json({ error: 'DLSU sign-in is unavailable.' }, 503)
})
