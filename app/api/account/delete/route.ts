import { eq } from "drizzle-orm"

import { requireAuthenticatedUser } from "@/lib/db/owner"
import { getDb, isDatabaseConfigured } from "@/lib/db"
import { creatorProfiles, user } from "@/lib/db/schema"

export const dynamic = "force-dynamic"

export async function POST() {
  const viewer = await requireAuthenticatedUser()
  if (!viewer) {
    return Response.json({ error: "Authentication required." }, { status: 401 })
  }

  if (!isDatabaseConfigured()) {
    return Response.json({ error: "Database is not configured." }, { status: 500 })
  }

  try {
    const db = getDb()
    await db.transaction(async (tx) => {
      // Delete the creator row explicitly; its LinkedIn posts cascade from it.
      await tx
        .delete(creatorProfiles)
        .where(eq(creatorProfiles.userId, viewer.userId))

      // Auth sessions and accounts cascade from the user row.
      await tx.delete(user).where(eq(user.id, viewer.userId))
    })

    return Response.json({ ok: true })
  } catch (error) {
    console.error("Failed to delete account", error)
    return Response.json({ error: "Failed to delete your account." }, { status: 500 })
  }
}
