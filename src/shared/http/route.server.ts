import 'server-only'
import type { ZodType } from 'zod'
import { DatabaseUnavailableError } from '@/shared/database.server'

export class RequestError extends Error {
  constructor(readonly status: number, message: string) {
    super(message)
  }
}

export function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } })
}

export function noContent() {
  return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } })
}

export async function respond(handler: () => Promise<Response>) {
  try {
    return await handler()
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) return json({ error: 'The database is unavailable.' }, 503)
    if (error instanceof RequestError) return json({ error: error.message }, error.status)
    console.error('API request failed', error instanceof Error ? error.name : 'Unknown error')
    return json({ error: 'The service could not complete your request.' }, 500)
  }
}

export function validate<T>(schema: ZodType<T>, input: unknown, status: number, message: string) {
  const result = schema.safeParse(input)
  if (!result.success) throw new RequestError(status, message)
  return result.data
}

export async function readJson<T>(request: Request, schema: ZodType<T>, message: string) {
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    throw new RequestError(415, 'Send data as JSON.')
  }

  const reader = request.body?.getReader()
  const chunks: Uint8Array[] = []
  let bytes = 0
  if (reader) {
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        bytes += value.byteLength
        if (bytes > 16_384) {
          await reader.cancel()
          throw new RequestError(413, 'This request is too large.')
        }
        chunks.push(value)
      }
    } finally {
      reader.releaseLock()
    }
  }

  let body: unknown
  try {
    body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new RequestError(400, 'Send a valid JSON object.')
  }
  return validate(schema, body, 400, message)
}
