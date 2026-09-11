"use client"

import { useState } from "react"
import { Eye, FileText, Activity, Users2 } from "lucide-react"
import { StatCard } from "@/components/StatCard"
import { CreatorCardPreview } from "@/components/CreatorCardPreview"
import { LaunchGuideCard } from "@/components/LaunchGuideCard"
import { LinkedInImportPanel } from "@/components/LinkedInImportPanel"
import type { LinkedInImportResult } from "@/lib/linkedin"

function formatCount(value: number | null): string {
  if (value === null) return "—"
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value)
}

export function Dashboard() {
  const [importResult, setImportResult] = useState<LinkedInImportResult | null>(
    null
  )

  const stats = importResult?.stats
  const profile = importResult?.profile

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Eye}
          label="Public post reach"
          value={formatCount(stats?.engagementCount ?? null)}
          caption={stats ? "Reactions, comments and shares" : "Import in progress"}
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
          value={
            stats?.followerCount !== undefined && stats?.followerCount !== null
              ? formatCount(stats.followerCount)
              : "696"
          }
          caption="Imported from the public profile"
        />
      </div>

      <div className="mb-6">
        <LinkedInImportPanel onImported={setImportResult} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <CreatorCardPreview profile={profile} />
        <LaunchGuideCard />
      </div>
    </>
  )
}
