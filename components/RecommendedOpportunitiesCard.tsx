import Link from "next/link"
import { Lock } from "lucide-react"

type RecommendedOpportunitiesCardProps = {
  followerCount: number | null
}

const FOLLOWER_THRESHOLD = 1000

function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value)
}

export function RecommendedOpportunitiesCard({
  followerCount,
}: RecommendedOpportunitiesCardProps) {
  const followers = followerCount ?? 0

  return (
    <div className="flex flex-col self-start rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Recommended opportunities
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The 3 campaigns that best match your audience.
          </p>
        </div>
        <Link
          href="/opportunities"
          className="shrink-0 text-sm font-medium text-primary hover:underline"
        >
          Explore
        </Link>
      </div>

      <div className="flex items-start gap-2 text-sm text-muted-foreground">
        <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        <p>
          Paid campaigns open at {formatCount(FOLLOWER_THRESHOLD)} followers.
          You have {formatCount(followers)} followers. Keep posting and come
          back — re-check your count once a week from Settings.
        </p>
      </div>
    </div>
  )
}
