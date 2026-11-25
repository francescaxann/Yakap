import { toNextJsHandler } from 'better-auth/next-js'
import { handleAuthRequest } from '@/modules/auth/server/route.server'

export const { GET, POST } = toNextJsHandler(handleAuthRequest)
