import { requireAuthenticatedUser } from "@/lib/db/owner"
import { getStoredImport } from "@/lib/db/creator-repository"

export const dynamic = "force-dynamic"

export async function GET() {
  const viewer = await requireAuthenticatedUser()
  if (!viewer) {
    return Response.json({ error: "Authentication required." }, { status: 401 })
  }

  try {
    const result = await getStoredImport(viewer.ownerKey, viewer.userId)
    return Response.json({ avatarUrl: result?.profile.avatarUrl ?? null })
  } catch (error) {
    console.error("Failed to load profile avatar", error)
    return Response.json({ avatarUrl: null })
  }
}
