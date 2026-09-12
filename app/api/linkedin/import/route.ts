import { ApifyClient } from "apify-client"
import {
  hasUsableProfileData,
  isValidLinkedInProfileUrl,
  normalizePosts,
  normalizeProfile,
} from "@/lib/linkedin"
import { isDatabaseConfigured } from "@/lib/db"
import { requireAuthenticatedUser } from "@/lib/db/owner"
import {
  getStoredImport,
  saveImportedProfile,
} from "@/lib/db/creator-repository"

export const dynamic = "force-dynamic"

const REFRESH_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000

function jsonError(status: number, message: string) {
  return Response.json({ error: message }, { status })
}

export async function POST(request: Request) {
  // Authentication is checked first, before the body is parsed, the
  // LinkedIn URL is validated, or ApifyClient is touched — an unauthenticated
  // caller must not be able to trigger a paid Apify run or write any row.
  const user = await requireAuthenticatedUser()
  if (!user) {
    return Response.json({ error: "Authentication required." }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonError(400, "Request body must be valid JSON.")
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("profileUrl" in body)
  ) {
    return jsonError(400, "profileUrl is required.")
  }

  const { profileUrl } = body as { profileUrl: unknown }

  if (!isValidLinkedInProfileUrl(profileUrl)) {
    return jsonError(
      400,
      "profileUrl must be a valid public LinkedIn profile URL (e.g. https://www.linkedin.com/in/username)."
    )
  }

  // The first import is allowed immediately. Once a profile exists, the
  // persisted update timestamp is the server-side source of truth for the
  // weekly refresh window.
  const existingImport = await getStoredImport(user.ownerKey, user.userId)
  const lastUpdatedAt = existingImport?.profile.updatedAt
    ? new Date(existingImport.profile.updatedAt).getTime()
    : null
  const nextAvailableAt =
    lastUpdatedAt && Number.isFinite(lastUpdatedAt)
      ? lastUpdatedAt + REFRESH_INTERVAL_MS
      : null

  if (nextAvailableAt && Date.now() < nextAvailableAt) {
    return Response.json(
      {
        error: "Your profile can only be refreshed once a week.",
        nextAvailableAt: new Date(nextAvailableAt).toISOString(),
      },
      { status: 429 }
    )
  }

  const apiKey = process.env.APIFY_API_KEY
  const profileActorId = process.env.APIFY_PROFILE_ACTOR_ID
  const postsActorId = process.env.APIFY_POSTS_ACTOR_ID

  if (!apiKey || !profileActorId || !postsActorId) {
    return jsonError(
      500,
      "LinkedIn import is not configured on the server."
    )
  }

  const client = new ApifyClient({ token: apiKey })

  let profileItems: unknown[]
  let postsItems: unknown[]
  try {
    const [profileResult, postsResult] = await Promise.all([
      client
        .actor(profileActorId)
        .call({
          profileScraperMode: "Profile details no email ($4 per 1k)",
          queries: [profileUrl],
        })
        .then((run) =>
          client.dataset(run.defaultDatasetId).listItems()
        ),
      client
        .actor(postsActorId)
        .call({
          username: profileUrl,
          total_posts: 3,
        })
        .then((run) =>
          client.dataset(run.defaultDatasetId).listItems()
        ),
    ])
    profileItems = profileResult.items
    postsItems = postsResult.items
  } catch {
    return jsonError(502, "Failed to import LinkedIn data. Please try again later.")
  }

  const profile = normalizeProfile(profileUrl, profileItems)
  const posts = normalizePosts(postsItems).filter((post) => !post.isRepost)

  if (!hasUsableProfileData(profile)) {
    return jsonError(422, "No public profile data could be found for this URL.")
  }

  if (!isDatabaseConfigured()) {
    return jsonError(500, "LinkedIn import is not configured on the server.")
  }

  // Persist first, then answer from what was actually stored, so the response
  // and a later page refresh always agree.
  try {
    const result = await saveImportedProfile(
      user.ownerKey,
      profile,
      posts,
      user.userId
    )
    return Response.json(result, { status: 200 })
  } catch (error) {
    // Never leak SQL, connection strings or stack traces to the client.
    console.error("Failed to persist LinkedIn import", error)
    return jsonError(500, "Failed to save the imported profile. Please try again.")
  }
}
