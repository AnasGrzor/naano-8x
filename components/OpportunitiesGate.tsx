import { Lock } from "lucide-react"

type OpportunitiesGateProps = {
  followerCount: number | null
  threshold: number
}

function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value)
}

/**
 * Full-screen version of the dashboard's locked-campaigns notice, shown while
 * the creator is under the paid-campaign follower threshold.
 */
export function OpportunitiesGate({
  followerCount,
  threshold,
}: OpportunitiesGateProps) {
  const followers = followerCount ?? 0

  return (
    <div className="flex justify-center pt-16">
      <div className="flex max-w-md flex-col items-center rounded-2xl border border-border bg-card px-8 py-10 text-center">
        <span
          aria-hidden="true"
          className="flex size-10 items-center justify-center text-muted-foreground"
        >
          <Lock className="size-6" />
        </span>
        <h2 className="mt-3 text-base font-semibold text-foreground">
          Paid campaigns open at {formatCount(threshold)} followers
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You have {formatCount(followers)} followers. Keep posting and come
          back — re-check your count once a week from Settings.
        </p>
      </div>
    </div>
  )
}
