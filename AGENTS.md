<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Yakap engineering rules

### Architecture and code quality

- Keep Yakap a modular monolith in one Next.js App Router app. Keep routes thin and place workflows under `src/modules` by capability.
- Co-locate the UI, Zod schemas, authorization, and persistence needed by a vertical slice. Keep public letters separate from moderator review and membership. Use `.server.ts` for server-only code and keep database and session access on the server.
- Put feature UI in `components/`, server-only code in `server/`, input schemas in `validation/`, and TypeScript contracts in `types/` where those folders have files. Keep shared shadcn components in `src/shared/ui`.
- Apply SOLID, DRY, KISS, and Clean Code pragmatically. Give functions and components clear responsibilities, keep business rules in one place, favor composition and readable names, and introduce shared abstractions only for real reuse. Remove dead code, unused files, and empty folders.
- Use Zod to validate untrusted inputs at the boundary, including API JSON, route params, query params, and form data. Reuse client-side schemas on the server where applicable. Verify account ownership through Better Auth and Google Workspace.
- Use the shared Axios client for application HTTP requests in the browser. Use Better Auth’s client for its sign-in and sign-out workflow. Await requests before updating dependent state, cancel obsolete reads, and keep Server Component data access in the feature’s server code.
- Use PostgreSQL through Drizzle and Neon. Keep migrations in `drizzle/postgres` and use the global `drizzle-kit` CLI. Protect sender details and moderator data from public API and UI output. Preserve the moderator membership invariant when changing access.

### UI and accessibility

- Use shadcn/ui components from `src/shared/ui` for controls, dropdowns, tables, cards, dialogs, and other supported patterns. Use the existing Radix-based shadcn configuration when adding components. Use semantic HTML for landmarks, typography, links, and native media.
- Style features with Tailwind utilities and theme tokens. Keep the global Tailwind entry focused on theme tokens and shared accessibility defaults. Preserve Yakap’s visual theme and responsive layout.
- Target [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/). Check names and labels, accessible errors and status updates, contrast, focus order and visibility, keyboard use, target size, reduced motion, and reflow at 320 CSS pixels. Give dialogs titles and verify focus returns to the trigger or an appropriate replacement. Review captions and audio description when adding media.

### Security and verification

- Follow the [OWASP HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html). Maintain baseline headers in `next.config.ts` and the request-specific CSP in `src/proxy.ts`. Keep CSP nonces per document, restrict origins and browser capabilities, and verify font, avatar, and shadcn behavior after policy changes. Use HSTS for production HTTPS and prevent caching of sensitive responses.
- Enforce verified identity and moderator access on the server. Use generic failure messages for unexpected errors and keep credentials and sender data out of logs and committed files.
- Run app queries through the restricted database role and transaction scopes in `src/shared/database.server.ts`. Derive actor context from verified sessions. Use the direct administrator URL for migrations and test RLS changes with a login that lacks `BYPASSRLS`.
- List public canonical pages in `src/app/sitemap.ts` and keep the sitemap origin aligned with `BETTER_AUTH_URL`. Mark private pages `noindex` and enforce their authorization on the server.
- Run lint and the production build when changing code. Check affected workflows through their normal routes, including authorization failures, privacy, validation, keyboard use, and narrow layouts. Use an isolated database for test writes.

### Documentation

- Use the [Best README Template](https://github.com/othneildrew/Best-README-Template) structure when updating `README.md`. Keep sections relevant to Yakap and include real setup commands, environment variables, usage, and architecture. Keep the template link out of the README.
