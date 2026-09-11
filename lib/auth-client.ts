"use client"

import { createAuthClient } from "better-auth/react"

/**
 * Browser auth client.
 *
 * `baseURL` is left to the default (the current origin) so no server secret or
 * deployment URL needs to be inlined into the client bundle. Only
 * `NEXT_PUBLIC_` values would reach the browser, and no auth secret is one.
 */
export const authClient = createAuthClient()

export const { signIn, signUp, signOut, getSession, useSession } = authClient
