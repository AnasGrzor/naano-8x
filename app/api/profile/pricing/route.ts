import { getStoredPricing, updateStoredPricing } from "@/lib/db/creator-repository"
import { requireAuthenticatedUser } from "@/lib/db/owner"

export const dynamic = "force-dynamic"

export async function GET() {
  const viewer = await requireAuthenticatedUser()
  if (!viewer) return Response.json({ error: "Authentication required." }, { status: 401 })

  const pricing = await getStoredPricing(viewer.ownerKey, viewer.userId)
  return Response.json(pricing ?? { pricePerPost: null, bundle: null })
}

export async function PATCH(request: Request) {
  const viewer = await requireAuthenticatedUser()
  if (!viewer) return Response.json({ error: "Authentication required." }, { status: 401 })

  const body = (await request.json().catch(() => null)) as {
    pricePerPost?: unknown
    bundle?: unknown
  } | null

  if (
    (body?.pricePerPost !== undefined && typeof body.pricePerPost !== "string") ||
    (body?.bundle !== undefined && typeof body.bundle !== "string")
  ) {
    return Response.json({ error: "Invalid pricing details." }, { status: 400 })
  }

  const pricing = await updateStoredPricing(viewer.ownerKey, viewer.userId, {
    pricePerPost: body?.pricePerPost?.trim() || null,
    bundle: body?.bundle?.trim() || null,
  })

  if (!pricing) return Response.json({ error: "Profile not found." }, { status: 404 })
  return Response.json(pricing)
}
