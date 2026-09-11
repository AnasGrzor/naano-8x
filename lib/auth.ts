import "server-only"

import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"

import { getDb } from "@/lib/db"
import * as schema from "@/lib/db/schema"

/**
 * The public origin this app is served from.
 *
 * `BETTER_AUTH_URL` is the canonical name Better Auth reads itself; the other
 * names are reused when the project already defines them for a deployment, so
 * no duplicate URL variable is introduced.
 */
function resolveBaseUrl(): string {
  return (
    process.env.BETTER_AUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined) ??
    "http://localhost:3000"
  )
}

const baseURL = resolveBaseUrl()

/**
 * Origins allowed to drive the auth endpoints. Better Auth already trusts
 * `baseURL`; local dev hosts are added so the same build works when run
 * locally against either `localhost` or `127.0.0.1`.
 */
const trustedOrigins = [
  ...new Set([
    baseURL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ]),
]

/**
 * Server-side auth instance.
 *
 * It reuses the existing Neon/Drizzle client from `@/lib/db` — no second
 * database client and no separate connection pool. `BETTER_AUTH_SECRET` is
 * read from the server environment only and is never sent to the client.
 */
export const auth = betterAuth({
  appName: "Naano-8x",
  baseURL,
  trustedOrigins,
  database: drizzleAdapter(getDb(), {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  // `nextCookies` must stay last so it can attach Set-Cookie headers after
  // every other hook has run.
  plugins: [nextCookies()],
})

export type Session = typeof auth.$Infer.Session
