import { Suspense } from "react"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { Activity, Eye, FileText, ShieldCheck, Users2 } from "lucide-react"

import { Topbar } from "@/components/Topbar"
import { AnalyticsHero } from "@/components/analytics/AnalyticsHero"
import { AnalyticsStatCard } from "@/components/analytics/AnalyticsStatCard"
import { DateRangeFilter } from "@/components/analytics/DateRangeFilter"
import { ProfileSummaryCard } from "@/components/analytics/ProfileSummaryCard"
import { RecentPostsCard } from "@/components/analytics/RecentPostsCard"
import { getStoredImport } from "@/lib/db/creator-repository"
import { getViewer, requireViewer } from "@/lib/db/owner"
import type { LinkedInImportResult, NormalizedPost } from "@/lib/linkedin"

export const metadata: Metadata = {
  title: "Analytics · Naano-8x",
  description: "Public LinkedIn performance imported for this profile.",
}

const numberFormatter = new Intl.NumberFormat("en-US")

/** Clamps a ratio into the 0–100 range used by the summary progress tracks. */
function toPercent(value: number, total: number): number {
  if (total <= 0) return 0
  return Math.max(0, Math.min(100, Math.round((value / total) * 100)))
}

export default async function AnalyticsPage() {
  // Analytics are per-user data, so an unauthenticated visitor is sent to sign
  // in rather than shown another account's imported profile.
  const viewer = await requireViewer()
  if (!viewer) redirect("/sign-in")

  return (
    <div className="flex flex-1 flex-col bg-[oklch(0.982_0.003_265)]">
      <Topbar />

      <main className="mx-auto w-full max-w-[1392px] px-5 py-8 sm:px-[34px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <h1 className="text-[32px] leading-10 font-extrabold tracking-tight text-foreground sm:text-[40px] sm:leading-[48px]">
              Analytics
            </h1>
            <p className="mt-1 text-[14px] leading-5 text-muted-foreground">
              Public LinkedIn performance imported for this profile.
            </p>
          </div>

          <DateRangeFilter />
        </div>

        <Suspense fallback={<AnalyticsContent result={null} />}>
          <AnalyticsLoader />
        </Suspense>
      </main>
    </div>
  )
}

/**
 * Reads the persisted import for the current owner on the server, so no UI
 * component imports database or Apify code.
 */
async function AnalyticsLoader() {
  let result: LinkedInImportResult | null = null

  try {
    const viewer = await getViewer()
    result = await getStoredImport(viewer.ownerKey, viewer.userId)
  } catch (error) {
    // A read failure degrades to the empty/import state rather than crashing
    // the whole screen.
    console.error("Failed to load the stored LinkedIn import", error)
  }

  return <AnalyticsContent result={result} />
}

function AnalyticsContent({ result }: { result: LinkedInImportResult | null }) {
  const stats = result?.stats
  const posts: NormalizedPost[] = result?.posts ?? []

  const postCount = stats?.postCount ?? 0
  const followerCount = stats?.followerCount ?? null
  const engagementCount = postCount > 0 ? (stats?.engagementCount ?? 0) : 0

  // "Reach data" means a post carries public engagement to estimate from —
  // LinkedIn does not expose official impressions through public scraping.
  const postsWithReachData = posts.filter(
    (post) =>
      (post.reactions ?? 0) + (post.comments ?? 0) + (post.shares ?? 0) > 0
  ).length

  const reachCoverage = toPercent(postsWithReachData, postCount)
  const estimatedImpressions = stats?.estimatedImpressions ?? null

  return (
    <>
      <div className="mt-4">
        <AnalyticsHero hasPosts={postCount > 0} reachCoverage={reachCoverage} />
      </div>

      <div className="mt-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsStatCard
          icon={FileText}
          label="Public posts"
          value={numberFormatter.format(postCount)}
          caption="Original LinkedIn posts found"
        />
        <AnalyticsStatCard
          icon={Eye}
          label="Estimated post reach"
          value={
            estimatedImpressions === null
              ? "Pending"
              : numberFormatter.format(estimatedImpressions)
          }
          caption={
            estimatedImpressions === null
              ? "Waiting for public post data"
              : "Estimated from public engagement, not LinkedIn Analytics"
          }
        />
        <AnalyticsStatCard
          icon={Activity}
          label="Public engagements"
          value={numberFormatter.format(engagementCount)}
          caption="Reactions, comments and reposts"
        />
        <AnalyticsStatCard
          icon={Users2}
          label="LinkedIn followers"
          value={followerCount === null ? "—" : numberFormatter.format(followerCount)}
          caption="Imported from the public profile"
        />
      </div>

      <div className="mt-3.5 grid grid-cols-1 gap-3.5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] xl:items-stretch">
        <RecentPostsCard posts={posts} />
        <ProfileSummaryCard
          rows={[
            {
              label: "LinkedIn followers",
              value: followerCount,
              // Followers have no ceiling to measure against, so the track
              // simply reads as "present" once a count is imported.
              fill: followerCount && followerCount > 0 ? 100 : 0,
            },
            {
              label: "Public posts",
              value: postCount,
              fill: postCount > 0 ? 100 : 0,
            },
            {
              label: "Posts with reach data",
              value: postsWithReachData,
              fill: toPercent(postsWithReachData, postCount),
            },
            {
              label: "Public engagements",
              value: postCount > 0 ? engagementCount : null,
              fill: engagementCount > 0 ? 100 : 0,
            },
          ]}
        />
      </div>

      <aside className="mt-3.5 flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/[0.04] px-4 py-3.5 sm:min-h-[66px]">
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-primary/10 text-primary"
        >
          <ShieldCheck className="size-[18px]" />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] leading-5 font-semibold text-foreground">
            {postCount > 0
              ? "Public LinkedIn data is imported"
              : "Public LinkedIn data is being prepared"}
          </p>
          <p className="mt-0.5 text-[12px] leading-4 text-muted-foreground">
            {postCount > 0
              ? "Naano collected the creator’s recent public posts. No personal LinkedIn connection is required."
              : "Naano is collecting the creator’s recent public posts. No personal LinkedIn connection is required."}
          </p>
        </div>
      </aside>
    </>
  )
}
