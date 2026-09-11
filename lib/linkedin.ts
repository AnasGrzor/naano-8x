const LINKEDIN_PROFILE_URL_PATTERN =
  /^https:\/\/([a-z]{2,3}\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_%]+\/?(\?.*)?$/i

export function isValidLinkedInProfileUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.trim().length === 0) return false

  let url: URL
  try {
    url = new URL(value)
  } catch {
    return false
  }

  if (url.protocol !== "https:") return false

  return LINKEDIN_PROFILE_URL_PATTERN.test(value)
}

export type NormalizedProfile = {
  profileUrl: string
  name: string | null
  headline: string | null
  location: string | null
  avatarUrl: string | null
  followers: number | null
  experience: unknown[]
  education: unknown[]
  skills: string[]
}

export type NormalizedPost = {
  id: string
  url: string | null
  text: string | null
  publishedAt: string | null
  reactions: number | null
  comments: number | null
  shares: number | null
  isRepost: boolean
}

export type LinkedInImportResult = {
  profile: NormalizedProfile
  posts: NormalizedPost[]
  stats: {
    postCount: number
    engagementCount: number
    followerCount: number | null
  }
}

function toStringOrNull(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null
}

function toNumberOrNull(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

function toArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => {
      if (typeof item === "string") return item
      if (item && typeof item === "object" && "name" in item) {
        const name = (item as Record<string, unknown>).name
        return typeof name === "string" ? name : null
      }
      return null
    })
    .filter((item): item is string => Boolean(item))
}

function pick(source: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null) return source[key]
  }
  return undefined
}

export function normalizeProfile(
  profileUrl: string,
  raw: unknown
): NormalizedProfile {
  const item = (Array.isArray(raw) ? raw[0] : raw) as
    | Record<string, unknown>
    | undefined

  if (!item || typeof item !== "object") {
    return {
      profileUrl,
      name: null,
      headline: null,
      location: null,
      avatarUrl: null,
      followers: null,
      experience: [],
      education: [],
      skills: [],
    }
  }

  const fallbackName =
    [toStringOrNull(item.firstName), toStringOrNull(item.lastName)]
      .filter(Boolean)
      .join(" ") || null

  const name = toStringOrNull(
    pick(item, ["fullName", "name", "full_name"]) ?? fallbackName
  )

  const location = item.location as Record<string, unknown> | undefined
  const locationText =
    toStringOrNull(location?.linkedinText) ??
    toStringOrNull(pick(item, ["location", "locationName", "addressWithCountry"]))

  const profilePicture = item.profilePicture as Record<string, unknown> | undefined
  const avatarUrl =
    toStringOrNull(profilePicture?.url) ??
    toStringOrNull(pick(item, ["photo", "avatarUrl", "profilePic", "imageUrl"]))

  return {
    profileUrl,
    name,
    headline: toStringOrNull(pick(item, ["headline", "title", "occupation"])),
    location: locationText,
    avatarUrl,
    followers: toNumberOrNull(
      pick(item, ["followerCount", "followers", "followersCount"])
    ),
    experience: toArray(pick(item, ["experience", "currentPosition", "experiences", "positions"])),
    education: toArray(pick(item, ["education", "profileTopEducation", "educations", "schools"])),
    skills: toStringArray(pick(item, ["skills"])),
  }
}

function extractPostItems(raw: unknown): Record<string, unknown>[] {
  if (Array.isArray(raw)) return raw as Record<string, unknown>[]

  if (raw && typeof raw === "object") {
    const data = (raw as Record<string, unknown>).data
    if (data && typeof data === "object") {
      const posts = (data as Record<string, unknown>).posts
      if (Array.isArray(posts)) return posts as Record<string, unknown>[]
    }
  }

  return []
}

export function normalizePosts(raw: unknown): NormalizedPost[] {
  const items = extractPostItems(raw)

  return items
    .filter((item) => item && typeof item === "object")
    .map((item, index) => {
      const stats = item.stats as Record<string, unknown> | undefined
      const postedAt = item.posted_at as Record<string, unknown> | undefined

      const id =
        toStringOrNull(
          pick(item, ["full_urn", "urn", "id", "postId", "activityId"])
        ) ?? `post-${index}`

      return {
        id,
        url: toStringOrNull(pick(item, ["url", "postUrl", "link"])),
        text: toStringOrNull(pick(item, ["text", "content", "postText"])),
        publishedAt:
          toStringOrNull(postedAt?.date) ??
          toStringOrNull(pick(item, ["publishedAt", "postedAt", "date", "timestamp"])),
        reactions:
          toNumberOrNull(stats?.total_reactions) ??
          toNumberOrNull(pick(item, ["reactions", "likes", "numLikes", "reactionCount"])),
        comments:
          toNumberOrNull(stats?.comments) ??
          toNumberOrNull(pick(item, ["comments", "numComments", "commentCount"])),
        shares:
          toNumberOrNull(stats?.reposts) ??
          toNumberOrNull(pick(item, ["shares", "numShares", "shareCount", "reposts"])),
        isRepost:
          pick(item, ["post_type"]) === "repost" ||
          Boolean(pick(item, ["isRepost", "is_repost", "reposted"])),
      }
    })
}

export function buildStats(
  profile: NormalizedProfile,
  posts: NormalizedPost[]
): LinkedInImportResult["stats"] {
  const engagementCount = posts.reduce((sum, post) => {
    return sum + (post.reactions ?? 0) + (post.comments ?? 0) + (post.shares ?? 0)
  }, 0)

  return {
    postCount: posts.length,
    engagementCount,
    followerCount: profile.followers,
  }
}

export function hasUsableProfileData(profile: NormalizedProfile): boolean {
  return Boolean(profile.name || profile.headline || profile.followers !== null)
}
