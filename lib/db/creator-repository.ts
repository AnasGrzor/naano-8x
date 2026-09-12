import "server-only"

import { connection } from "next/server"
import { and, eq, isNull, sql } from "drizzle-orm"

import { getDb, isDatabaseConfigured } from "@/lib/db"
import {
  creatorProfiles,
  linkedinPosts,
  type CreatorProfileRow,
  type LinkedInPostRow,
} from "@/lib/db/schema"
import {
  buildStats,
  type LinkedInImportResult,
  type NormalizedPost,
  type NormalizedProfile,
} from "@/lib/linkedin"

/** Parses an arbitrary date-ish value, returning null when it is not valid. */
function toDateOrNull(value: string | null): Date | null {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

/**
 * References the row Postgres tried to insert, for use in the SET clause of an
 * ON CONFLICT DO UPDATE. Column names are schema-controlled, never user input.
 */
function excluded(column: string) {
  return sql.raw(`excluded."${column}"`)
}

function toArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : []
}

function rowToProfile(row: CreatorProfileRow): NormalizedProfile {
  return {
    profileUrl: row.linkedinUrl,
    name: row.name,
    headline: row.headline,
    about: row.about,
    location: row.location,
    avatarUrl: row.avatarUrl,
    followers: row.followers,
    experience: toArray(row.experience),
    education: toArray(row.education),
    skills: toStringArray(row.skills),
    updatedAt: row.updatedAt.toISOString(),
  }
}

function rowToPost(row: LinkedInPostRow): NormalizedPost {
  return {
    id: row.externalId,
    url: row.url,
    text: row.text,
    publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
    reactions: row.reactions,
    comments: row.comments,
    shares: row.shares,
    isRepost: row.isRepost,
  }
}

/**
 * Persists a freshly imported profile and its posts for `ownerKey`.
 *
 * `ownerKey` is the Better Auth user id for a signed-in import, so one
 * account's rows can never be overwritten by another.
 *
 * Both writes happen in a single transaction, and both are upserts, so
 * re-importing the same profile updates the existing rows instead of creating
 * duplicates. Returns the persisted data mapped back to the API shape, with
 * stats recalculated from what was actually stored.
 */
export async function saveImportedProfile(
  ownerKey: string,
  profile: NormalizedProfile,
  posts: NormalizedPost[],
  userId: string | null = null
): Promise<LinkedInImportResult> {
  const db = getDb()
  const now = new Date()

  return db.transaction(async (tx) => {
    const [profileRow] = await tx
      .insert(creatorProfiles)
      .values({
        ownerKey,
        userId,
        linkedinUrl: profile.profileUrl,
        name: profile.name,
        headline: profile.headline,
        about: profile.about,
        location: profile.location,
        avatarUrl: profile.avatarUrl,
        followers: profile.followers,
        experience: profile.experience,
        education: profile.education,
        skills: profile.skills,
      })
      .onConflictDoUpdate({
        target: creatorProfiles.ownerKey,
        set: {
          userId,
          linkedinUrl: profile.profileUrl,
          name: profile.name,
          headline: profile.headline,
          about: profile.about,
          location: profile.location,
          avatarUrl: profile.avatarUrl,
          followers: profile.followers,
          experience: profile.experience,
          education: profile.education,
          skills: profile.skills,
          updatedAt: now,
        },
      })
      .returning()

    // De-duplicate within the incoming batch: Postgres rejects an upsert that
    // touches the same conflict target twice in one statement.
    const uniquePosts = [
      ...new Map(posts.map((post) => [post.id, post])).values(),
    ]

    let postRows: LinkedInPostRow[] = []

    if (uniquePosts.length > 0) {
      postRows = await tx
        .insert(linkedinPosts)
        .values(
          uniquePosts.map((post) => ({
            profileId: profileRow.id,
            externalId: post.id,
            url: post.url,
            text: post.text,
            publishedAt: toDateOrNull(post.publishedAt),
            reactions: post.reactions,
            comments: post.comments,
            shares: post.shares,
            isRepost: post.isRepost,
          }))
        )
        .onConflictDoUpdate({
          target: [linkedinPosts.profileId, linkedinPosts.externalId],
          set: {
            url: excluded("url"),
            text: excluded("text"),
            publishedAt: excluded("published_at"),
            reactions: excluded("reactions"),
            comments: excluded("comments"),
            shares: excluded("shares"),
            isRepost: excluded("is_repost"),
            updatedAt: now,
          },
        })
        .returning()
    }

    const normalizedProfile = rowToProfile(profileRow)
    const normalizedPosts = postRows.map(rowToPost)

    return {
      profile: normalizedProfile,
      posts: normalizedPosts,
      stats: buildStats(normalizedProfile, normalizedPosts),
    }
  })
}

/**
 * Loads the persisted profile and posts for `ownerKey`, or null when nothing
 * has been imported yet.
 *
 * When `userId` is set the row must also belong to that user; when it is null
 * only the unowned demo row matches. Either way a user can never read another
 * user's profile or posts.
 */
export async function getStoredImport(
  ownerKey: string,
  userId: string | null = null
): Promise<LinkedInImportResult | null> {
  // Persisted data must be read per request, never baked into a static
  // prerender at build time.
  await connection()

  if (!isDatabaseConfigured()) return null

  const db = getDb()

  const [profileRow] = await db
    .select()
    .from(creatorProfiles)
    .where(
      // Signed-in reads are pinned to the session's user id as well as the
      // owner key, so a row belonging to anyone else is never returned.
      userId
        ? and(
            eq(creatorProfiles.ownerKey, ownerKey),
            eq(creatorProfiles.userId, userId)
          )
        : and(
            eq(creatorProfiles.ownerKey, ownerKey),
            isNull(creatorProfiles.userId)
          )
    )
    .limit(1)

  if (!profileRow) return null

  const postRows = await db
    .select()
    .from(linkedinPosts)
    .where(eq(linkedinPosts.profileId, profileRow.id))

  const normalizedProfile = rowToProfile(profileRow)
  const normalizedPosts = postRows
    .map(rowToPost)
    .sort((a, b) => {
      const left = a.publishedAt ? Date.parse(a.publishedAt) : 0
      const right = b.publishedAt ? Date.parse(b.publishedAt) : 0
      return right - left
    })

  return {
    profile: normalizedProfile,
    posts: normalizedPosts,
    stats: buildStats(normalizedProfile, normalizedPosts),
  }
}

export type CreatorPricing = {
  pricePerPost: string | null
  bundle: string | null
}

export async function getStoredPricing(
  ownerKey: string,
  userId: string
): Promise<CreatorPricing | null> {
  if (!isDatabaseConfigured()) return null

  const db = getDb()
  const [row] = await db
    .select({
      pricePerPost: creatorProfiles.pricePerPost,
      bundle: creatorProfiles.bundle,
    })
    .from(creatorProfiles)
    .where(
      and(eq(creatorProfiles.ownerKey, ownerKey), eq(creatorProfiles.userId, userId))
    )
    .limit(1)

  return row ?? null
}

export async function updateStoredPricing(
  ownerKey: string,
  userId: string,
  pricing: CreatorPricing
): Promise<CreatorPricing | null> {
  const db = getDb()
  const [row] = await db
    .update(creatorProfiles)
    .set({
      pricePerPost: pricing.pricePerPost,
      bundle: pricing.bundle,
      updatedAt: new Date(),
    })
    .where(
      and(eq(creatorProfiles.ownerKey, ownerKey), eq(creatorProfiles.userId, userId))
    )
    .returning({
      pricePerPost: creatorProfiles.pricePerPost,
      bundle: creatorProfiles.bundle,
    })

  return row ?? null
}
