import { ApifyClient } from "apify-client"
import {
  buildStats,
  hasUsableProfileData,
  isValidLinkedInProfileUrl,
  normalizePosts,
  normalizeProfile,
} from "@/lib/linkedin"

export const dynamic = "force-dynamic"

function jsonError(status: number, message: string) {
  return Response.json({ error: message }, { status })
}

export async function POST(request: Request) {
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

  const stats = buildStats(profile, posts)

  return Response.json({ profile, posts, stats }, { status: 200 })
}
