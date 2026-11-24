import { defineConfig } from 'drizzle-kit'
import { z } from 'zod'
import './src/shared/env.server.ts'

const url = z.url({ protocol: /^postgres(?:ql)?$/ }).safeParse(process.env.DATABASE_URL_UNPOOLED).data

export default defineConfig({
  dialect: 'postgresql',
  schema: [
    './src/shared/rls.ts',
    './src/modules/auth/server/schema.server.ts',
    './src/modules/moderation/moderators/server/schema.server.ts',
    './src/modules/letters/server/schema.server.ts',
  ],
  out: './drizzle/postgres',
  dbCredentials: url ? { url } : undefined,
})
