import { randomBytes } from 'node:crypto'
import { NextResponse, type NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const nonce = randomBytes(32).toString('base64')
  const development = process.env.NODE_ENV === 'development'
  const devSocket = new URL(request.url)
  devSocket.protocol = devSocket.protocol === 'https:' ? 'wss:' : 'ws:'

  const policy = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${development ? " 'unsafe-eval'" : ''}`,
    "script-src-attr 'none'",
    development ? "style-src 'self' 'unsafe-inline'" : `style-src 'self' 'nonce-${nonce}'`,
    "style-src-attr 'none'",
    "img-src 'self' data: blob: https://lh3.googleusercontent.com",
    "font-src 'self'",
    `connect-src 'self'${development ? ` ${devSocket.origin}` : ''}`,
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
    "worker-src 'self'",
    "manifest-src 'self'",
    "media-src 'self'",
    ...(development ? [] : ['upgrade-insecure-requests']),
  ].join('; ')

  const headers = new Headers(request.headers)
  headers.set('Content-Security-Policy', policy)

  const response = NextResponse.next({ request: { headers } })
  response.headers.set('Content-Security-Policy', policy)
  return response
}

export const config = {
  matcher: ['/((?!api/|_next/|assets/|(?:favicon\\.ico|robots\\.txt|sitemap\\.xml)$).*)'],
}
