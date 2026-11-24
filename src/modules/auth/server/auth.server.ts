import 'server-only'
import { betterAuth, type User } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { z } from '@/shared/validation'
import { hasDatabase, withDatabaseAccess, type Database } from '@/shared/database.server'
import { dlsuDomain, dlsuEmailSchema } from '../utils'
import * as schema from './schema.server'

const configSchema = z.object({
  BETTER_AUTH_URL: z.url({ protocol: /^https?$/ }),
  BETTER_AUTH_SECRET: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
})

const googleProfileSchema = z.object({ email: dlsuEmailSchema, email_verified: z.literal(true) })

const authConfig = configSchema.safeParse(process.env).data

function createAuth(config: NonNullable<typeof authConfig>, db: Database) {
  return betterAuth({
    baseURL: config.BETTER_AUTH_URL,
    secret: config.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, { provider: 'pg', schema, transaction: true }),
    account: {
      accountLinking: { enabled: false },
      encryptOAuthTokens: true,
    },
    emailAndPassword: { enabled: false },
    trustedOrigins: [config.BETTER_AUTH_URL],
    socialProviders: {
      google: {
        clientId: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        hd: dlsuDomain,
        disableIdTokenSignIn: true,
        overrideUserInfoOnSignIn: true,
        mapProfileToUser(profile) {
          const verified = googleProfileSchema.safeParse(profile).data
          return verified ? { email: verified.email } : { email: null, emailVerified: false }
        },
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: { enabled: false },
    },
    rateLimit: { enabled: true, window: 60, max: 100 },
    advanced: {
      disableCSRFCheck: false,
      disableOriginCheck: false,
      useSecureCookies: process.env.NODE_ENV === 'production',
    },
  })
}

export function canSignIn() {
  return authConfig !== undefined && hasDatabase()
}

export async function runWithAuth<T>(run: (auth: ReturnType<typeof createAuth>) => Promise<T>) {
  if (!authConfig || !hasDatabase()) return null
  return withDatabaseAccess({ scope: 'auth' }, (db) => run(createAuth(authConfig, db)))
}

export async function getSignedInUser(requestHeaders: Headers) {
  if (!requestHeaders.has('cookie')) return null
  const session = await runWithAuth((auth) => auth.api.getSession({ headers: requestHeaders }))
  return session?.user ?? null
}

export function isVerifiedDlsuUser(user: User | null): user is User {
  return user?.emailVerified === true && dlsuEmailSchema.safeParse(user.email).success
}
