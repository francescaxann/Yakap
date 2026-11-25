<p align="right"><a id="readme-top"></a></p>

<div align="center">
  <img src="public/assets/sticker.webp" alt="Yakap's CSG Bot mascot" width="112">
  <h1>Yakap</h1>
  <p>A wellbeing space for De La Salle University students, built for the Computer Studies Government.</p>
  <a href="https://github.com/francescaxann/Yakap/issues">Report a bug</a>
  ·
  <a href="https://github.com/francescaxann/Yakap/issues">Request a feature</a>
</div>

<details>
  <summary>Table of contents</summary>

- [About the Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)

</details>

## About the Project

Yakap brings together a CSG welcome message, anonymous letters of hope, a cookie with rotating affirmations, campus support resources, and the COSCA donation drive.

A verified DLSU Google Workspace account is required to submit a letter. Moderators review submissions before publication. The public feed displays only accepted letters and keeps sender accounts private.

### Built With

- [Next.js App Router](https://nextjs.org/docs/app) and [React](https://react.dev/) for the app, pages, and API routes.
- [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) for the interface and Yakap’s theme.
- [Better Auth](https://www.better-auth.com/) and [Google OAuth](https://www.better-auth.com/docs/authentication/google) for sign-in.
- [Drizzle ORM](https://orm.drizzle.team/) and [Neon PostgreSQL](https://neon.com/) for data and migrations.
- [Zod](https://zod.dev/) and [Axios](https://axios-http.com/) for input validation and browser API calls.

<p align="right"><a href="#readme-top">Back to top</a></p>

## Getting Started

### Prerequisites

- Node.js 24 or later and npm.
- A Neon PostgreSQL database with both pooled and direct connection URLs.
- A Google OAuth **Web application** client. Register `<BETTER_AUTH_URL>/api/auth/callback/google` for each environment. In Google’s testing mode, add the DLSU test accounts to the OAuth client’s test users.
- The global Drizzle Kit CLI. Install it with `npm install -g drizzle-kit@1.0.0-rc.6 drizzle-orm@1.0.0-rc.6 pg@8.23.1` if it is missing.

### Installation

1. Clone the app and install dependencies.

   ```sh
   git clone https://github.com/francescaxann/Yakap.git
   cd Yakap
   npm ci
   cp .env.example .env
   ```

2. Fill in `.env`.

   | Variable | Value |
   | --- | --- |
   | `DATABASE_URL` | Pooled Neon PostgreSQL URL for the restricted runtime login |
   | `DATABASE_URL_UNPOOLED` | Direct Neon PostgreSQL URL for the migration administrator |
   | `BETTER_AUTH_URL` | App origin for Google sign-in, canonical URLs, and the sitemap, such as `http://localhost:3000` locally |
   | `BETTER_AUTH_SECRET` | Random signing secret. Generate one with `openssl rand -base64 32`. |
   | `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` | Google OAuth web client credentials |
   | `YAKAP_MODERATOR_EMAILS` | Initial comma-separated DLSU emails for a fresh database. Optional once the `moderators` table has entries. |
   | `YAKAP_RATE_LIMIT_IP_HEADER` | Optional header containing one client IP. Set it only if your ingress overwrites it on every request and clients cannot reach the app directly. |

3. Apply the migrations as the database administrator.

   ```sh
   drizzle-kit migrate
   ```

4. On a fresh database, connect using the direct administrator URL and create the restricted login. The migration creates `yakap_app` and its row-level policies. The runtime login can assume that role inside an app transaction. Generate a password with `openssl rand -hex 32` and substitute it when running the SQL over the encrypted connection.

   ```sql
   CREATE ROLE yakap_runtime LOGIN NOINHERIT PASSWORD '<generated password>';
   GRANT yakap_app TO yakap_runtime WITH INHERIT FALSE, SET TRUE;
   ```

   Put the pooled connection URL for that login in `DATABASE_URL`.

5. Start the app and open [Yakap on localhost](http://localhost:3000).

   ```sh
   npm run dev
   ```

Use `npm run build` and `npm start` to run a production build. Set the deployed origin to HTTPS and register its callback URI with Google.

<p align="right"><a href="#readme-top">Back to top</a></p>

## Usage

| Route | What you can do |
| --- | --- |
| `/` or `/video` | View the CSG welcome page. It displays a poster while the welcome recording is unavailable. |
| `/letters` | Read accepted letters and sign in with a DLSU account to submit your own. |
| `/cookie` | Open the CSG Bot cookie for a reminder. |
| `/resources` | Find campus support contacts and crisis resources. |
| `/cosca` | View the COSCA donation drive page. |
| `/moderation` | Review pending letters, filter history, and manage moderator access. |

Accept publishes a letter anonymously. Decline keeps a letter private. Delete removes it from the feed and retains it in moderation history. History shows the sender’s verified Google avatar when available.

Once the moderator list is seeded, manage it through **Manage moderators**. Moderators can remove other members. The current moderator keeps their own access, so the list always retains at least one member after setup.

`/sitemap.xml` lists the public canonical pages, and `/robots.txt` points crawlers to it. The welcome page is canonical at `/`, with `/video` available as an alias. `/moderation` carries a `noindex` directive.

## Project Structure

```text
src/
  app/                         Next.js layouts, pages, and route handlers
  modules/
    auth/                      DLSU sign-in and account UI
    letters/                   Public feed, submission, and letter schema
    moderation/
      letters/                 Review queue, decisions, and history
      moderators/              Membership rules and management
    support/                   Resources and crisis guidance
    community/                 Welcome, CSG Bot cookie, and COSCA slices
  shared/
    http/                      Axios and server request handling
    ui/                        shadcn components and shared UI
  proxy.ts                     Per-request Content Security Policy
drizzle/postgres/              Versioned PostgreSQL migrations
```

Yakap runs as one Next.js app. Features group UI in `components/`, server-only work in `server/`, input schemas in `validation/`, and TypeScript contracts in `types/` where needed. Shared modules hold code used across features. Security headers are configured in `next.config.ts`, with the per-document CSP nonce generated in `src/proxy.ts`.

PostgreSQL row-level policies apply inside the app's transactions. Public reads see approved letters, submissions use the verified session's sender identity, and moderator access is checked against database membership. Better Auth uses a separate transaction scope for account and session data. Keep the administrator connection for migrations and use the restricted login for every deployed app instance.

### Request limits

Apply the rate-limit migration before deploying this version. All API operations share PostgreSQL counters across app instances. A request over its quota receives HTTP 429 with `Retry-After` in seconds. If the app cannot reach the counters, it returns HTTP 503.

| Operation | Site-wide quota | Quota per trusted client network |
| --- | --- | --- |
| Read public letters | 600 per minute | 60 per minute |
| Submit letters | 120 per minute | 20 per minute |
| Read the moderation queue | 300 per minute | 60 per minute |
| Approve, decline, or delete letters | 180 per minute | 30 per minute |
| Add or remove moderators | 120 per minute | 20 per minute |
| Start sign-in | 30 per 10 seconds | 3 per 10 seconds |
| OAuth callback | 180 per minute | 30 per minute |
| Check an auth session | 900 per minute | 100 per minute |
| Sign out | 180 per minute | 30 per minute |
| Other auth requests | 240 per minute | 30 per minute |

Each verified sender can also submit up to five letters per ten minutes. The optional ingress header enables network quotas for IPv4 addresses and IPv6 /64 networks. The app stores keyed hashes for network counters and uses site-wide quotas when the header is unavailable.

Each app process opens up to five database connections and queues up to 25 waiting transactions. The database enforces eight-second statement, two-second lock, and 30-second idle transaction timeouts for app transactions.

## Contributing

1. Create a branch for the change.
2. Keep the changes in the relevant feature and follow [AGENTS.md](AGENTS.md).
3. Run `npm run lint` and `npm run build`. For schema changes, run `drizzle-kit generate` and verify the migration on a development database.
4. Open a pull request with the behavior changed and the checks you ran.

## Acknowledgments

- The Computer Studies Government and De La Salle University.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) for accessibility guidance.
- [OWASP HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html) for security header guidance.

<p align="right"><a href="#readme-top">Back to top</a></p>
