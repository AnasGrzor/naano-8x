import { toNextJsHandler } from "better-auth/next-js"

import { auth } from "@/lib/auth"

// Better Auth owns every /api/auth/* endpoint; no custom auth API is added.
export const { GET, POST } = toNextJsHandler(auth)
