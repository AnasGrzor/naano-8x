import "server-only"

import { headers } from "next/headers"

import { auth } from "@/lib/auth"

/**
 * Owner key used for the signed-out demo dashboard.
 *
 * It is only ever reachable without a session, so an authenticated user can
 * never be scoped to it.
 */
export const DEMO_OWNER_KEY = "demo-user"

export type Viewer =
  | { kind: "user"; userId: string; ownerKey: string }
  | { kind: "demo"; userId: null; ownerKey: string }

/**
 * Resolves the current viewer from the Better Auth session cookie.
 *
 * Returns the authenticated user when a valid session exists, otherwise the
 * shared demo identity. The session is read through the official server API
 * (`auth.api.getSession`), never by parsing cookies by hand.
 */
export async function getViewer(): Promise<Viewer> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session?.user?.id) {
    // The Better Auth user id is the tenancy key, so each account only ever
    // reads and writes its own rows.
    return { kind: "user", userId: session.user.id, ownerKey: session.user.id }
  }

  return { kind: "demo", userId: null, ownerKey: DEMO_OWNER_KEY }
}

/** Returns the current viewer, or null when there is no signed-in user. */
export async function requireViewer(): Promise<Viewer | null> {
  const viewer = await getViewer()
  return viewer.kind === "user" ? viewer : null
}

export type AuthenticatedUser = { userId: string; ownerKey: string }

/**
 * Resolves the authenticated user for an API route, straight from the
 * official Better Auth server API (`auth.api.getSession`) — no manual cookie
 * or token parsing.
 *
 * Returns `null` when there is no session or no valid user id, so callers can
 * reject the request before doing any other work (parsing the body,
 * validating input, or calling a paid third-party API).
 */
export async function requireAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  const userId = session?.user?.id
  if (!userId) return null
  return { userId, ownerKey: userId }
}

/**
 * Owner key the current request should read and write.
 *
 * Kept as a named helper so callers never inline the demo constant.
 */
export async function getCurrentOwnerKey(): Promise<string> {
  return (await getViewer()).ownerKey
}
