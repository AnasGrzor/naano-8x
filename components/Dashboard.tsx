"use client"

import { useState } from "react"
import { Eye, FileText, Activity, Users2 } from "lucide-react"
import { StatCard } from "@/components/StatCard"
import { CreatorCardPreview } from "@/components/CreatorCardPreview"
import { LaunchGuideCard } from "@/components/LaunchGuideCard"
import { RecommendedOpportunitiesCard } from "@/components/RecommendedOpportunitiesCard"
import { ActiveCollaborationsCard } from "@/components/ActiveCollaborationsCard"
import type { LinkedInImportResult } from "@/lib/linkedin"

function formatCount(value: number | null): string {
  if (value === null) return "—"
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value)
}

type DashboardProps = {
  /** Profile persisted for the current owner, loaded on the server. */
  initialResult?: LinkedInImportResult | null
}

export function Dashboard({ initialResult = null }: DashboardProps) {
  const [importResult, setImportResult] = useState<LinkedInImportResult | null>(
    initialResult
  )

  const stats = importResult?.stats
  const profile = importResult?.profile

  return (
    <>
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Eye}
          label="Estimated reach"
          value={formatCount(stats?.estimatedImpressions ?? null)}
          caption="Estimated from public post engagement. Official LinkedIn Analytics data is unavailable."
        />
        <StatCard
          icon={FileText}
          label="Public posts"
          value={String(stats?.postCount ?? 0)}
          caption="Original LinkedIn posts found"
        />
        <StatCard
          icon={Activity}
          label="Public engagements"
          value={formatCount(stats?.engagementCount ?? null)}
          caption="Reactions, comments and reposts"
        />
        <StatCard
          icon={Users2}
          label="LinkedIn followers"
          value={formatCount(stats?.followerCount ?? null)}
          caption="Imported from the public profile"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.56fr)_minmax(0,1fr)] xl:items-start">
        {/* The import form lives inside the creator card panel, so the
            populated dashboard shows no separate import panel. */}
        <CreatorCardPreview
          profile={profile}
          postCount={stats?.postCount ?? null}
          estimatedImpressions={stats?.estimatedImpressions ?? null}
          onImported={setImportResult}
        />
        <LaunchGuideCard />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2 xl:items-start">
        <RecommendedOpportunitiesCard followerCount={stats?.followerCount ?? null} />
        <ActiveCollaborationsCard />
      </div>
    </>
  )
}
