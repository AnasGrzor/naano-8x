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
  /** Full "About" / summary section from the public profile, when present. */
  about: string | null
  location: string | null
  avatarUrl: string | null
  followers: number | null
  experience: unknown[]
  education: unknown[]
  skills: string[]
  /**
   * When the persisted row was last written. Only set when the profile comes
   * from the database (`rowToProfile`) — a freshly normalized Apify response
   * has no persisted timestamp yet, so it stays null.
   */
  updatedAt: string | null
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
    /**
     * Estimated reach derived only from public engagement counts — LinkedIn
     * does not expose real impressions through public scraping. `null` when
     * there are no posts or no engagement to estimate from.
     */
    estimatedImpressions: number | null
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

/**
 * Splits a delimited skills summary (e.g. harvestapi's `topSkills`:
 * "Pharmacology • Patient Counseling") into individual skill strings.
 */
function toSkillsFromDelimitedString(value: unknown): string[] {
  if (typeof value !== "string") return []
  return value
    .split(/[•·,;|]/)
    .map((skill) => skill.trim())
    .filter(Boolean)
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
      about: null,
      location: null,
      avatarUrl: null,
      followers: null,
      experience: [],
      education: [],
      skills: [],
      updatedAt: null,
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

  // `skills` (an array) covers actors that emit it directly; harvestapi's
  // profile scraper instead emits `topSkills` as one delimited string
  // ("Pharmacology • Patient Counseling").
  const skills = toStringArray(pick(item, ["skills"]))
  const skillsFromTopSkills = toSkillsFromDelimitedString(item.topSkills)

  return {
    profileUrl,
    name,
    headline: toStringOrNull(pick(item, ["headline", "title", "occupation"])),
    about: toStringOrNull(pick(item, ["about", "summary", "bio"])),
    location: locationText,
    avatarUrl,
    followers: toNumberOrNull(
      pick(item, ["followerCount", "followers", "followersCount"])
    ),
    experience: toArray(pick(item, ["experience", "currentPosition", "experiences", "positions"])),
    education: toArray(pick(item, ["education", "profileTopEducation", "educations", "schools"])),
    skills: skills.length > 0 ? skills : skillsFromTopSkills,
    updatedAt: null,
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

/**
 * Fallback assumed engagement rate used to back into an estimated reach from
 * public engagement counts. Overridable via `ESTIMATED_LINKEDIN_ENGAGEMENT_RATE`
 * so the estimate can be tuned without a code change.
 */
const DEFAULT_ENGAGEMENT_RATE = 0.02

function getEngagementRate(): number {
  const raw = process.env.ESTIMATED_LINKEDIN_ENGAGEMENT_RATE
  const parsed = raw ? Number(raw) : NaN
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_ENGAGEMENT_RATE
}

/**
 * Estimates reach from public engagement only. This is NOT LinkedIn
 * Analytics data — LinkedIn does not expose real impressions through public
 * profile/post scraping. Returns null when there is no engagement to
 * estimate from, so the UI can show "—" instead of a misleading zero.
 */
export function estimateImpressions(posts: NormalizedPost[]): number | null {
  const engagementRate = getEngagementRate()

  const total = posts.reduce((sum, post) => {
    const engagements = (post.reactions ?? 0) + (post.comments ?? 0) + (post.shares ?? 0)
    return sum + Math.round(engagements / engagementRate)
  }, 0)

  const hasEngagement = posts.some(
    (post) => (post.reactions ?? 0) + (post.comments ?? 0) + (post.shares ?? 0) > 0
  )

  return posts.length > 0 && hasEngagement ? total : null
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
    estimatedImpressions: estimateImpressions(posts),
  }
}

export function hasUsableProfileData(profile: NormalizedProfile): boolean {
  return Boolean(profile.name || profile.headline || profile.followers !== null)
}
