import "server-only"

import { Pool, neonConfig } from "@neondatabase/serverless"
import { drizzle, type NeonDatabase } from "drizzle-orm/neon-serverless"

import * as schema from "./schema"

// The WebSocket driver (not neon-http) is used because interactive
// transactions are required for profile + post persistence. Node 18+ and all
// edge runtimes expose a global WebSocket, so no polyfill package is needed.
if (!neonConfig.webSocketConstructor && typeof WebSocket !== "undefined") {
  neonConfig.webSocketConstructor = WebSocket
}

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("DATABASE_URL is not set.")
    this.name = "DatabaseNotConfiguredError"
  }
}

let pool: Pool | undefined
let database: NeonDatabase<typeof schema> | undefined

/**
 * Returns the shared Drizzle client.
 *
 * The pool is created lazily so that importing this module during a build, or
 * in an environment without a database, does not throw. Callers that need to
 * degrade gracefully should check `isDatabaseConfigured()` first.
 */
export function getDb(): NeonDatabase<typeof schema> {
  if (database) return database

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new DatabaseNotConfiguredError()

  pool ??= new Pool({ connectionString })
  database = drizzle(pool, { schema })
  return database
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL)
}

export { schema }
export * from "./schema"
