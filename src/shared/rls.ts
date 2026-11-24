import { sql } from 'drizzle-orm'
import { pgPolicy, pgRole } from 'drizzle-orm/pg-core'

export const appRole = pgRole('yakap_app', { createDb: false, createRole: false })

export const accessScope = sql`current_setting('yakap.scope', true)`
export const actorEmail = sql`current_setting('yakap.actor_email', true)`
export const actorId = sql`current_setting('yakap.actor_id', true)`

export const currentModerator = sql`
  ${accessScope} = 'moderation' AND EXISTS (
    SELECT 1 FROM public.moderators WHERE email = ${actorEmail}
  )
`

export function authPolicy() {
  const auth = sql`${accessScope} = 'auth'`
  return pgPolicy('auth_scope', { to: appRole, using: auth, withCheck: auth })
}
