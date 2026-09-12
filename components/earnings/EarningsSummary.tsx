import { ArrowLeftRight, TrendingUp, Wallet } from "lucide-react"

type EarningsSummaryProps = {
  totalEarned: number
  paidCollaborationCount: number
  averagePerCollaboration: number
  inTransit: number
  availableNow: number
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}

export function EarningsSummary({
  totalEarned,
  paidCollaborationCount,
  averagePerCollaboration,
  inTransit,
  availableNow,
}: EarningsSummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex flex-col justify-center gap-2 rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 py-5">
        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <TrendingUp className="size-4 text-primary" aria-hidden="true" />
          Total earned
        </div>
        <p className="text-3xl font-bold tracking-tight text-foreground">
          {formatCurrency(totalEarned)}
        </p>
        <p className="text-xs text-muted-foreground">
          {paidCollaborationCount} paid collaborations · {formatCurrency(averagePerCollaboration)} average
        </p>
      </div>

      <div className="flex flex-col justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-5">
        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <ArrowLeftRight className="size-4 text-muted-foreground" aria-hidden="true" />
          In transit
        </div>
        <p className="text-3xl font-bold tracking-tight text-foreground">
          {formatCurrency(inTransit)}
        </p>
        <p className="text-xs text-muted-foreground">
          International transfers usually arrive within 1–7 days, depending on
          the destination and banking network.
        </p>
      </div>

      <div className="flex flex-col justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-5">
        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <Wallet className="size-4 text-muted-foreground" aria-hidden="true" />
        </div>
        <p className="text-3xl font-bold tracking-tight text-foreground">
          {formatCurrency(availableNow)}
        </p>
        <p className="text-xs text-muted-foreground">Available now</p>
        <p className="text-xs text-muted-foreground">
          Ready to withdraw to your selected payout method.
        </p>
      </div>
    </div>
  )
}
