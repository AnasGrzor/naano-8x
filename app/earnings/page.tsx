import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { Coins } from "lucide-react"

import { Topbar } from "@/components/Topbar"
import { EarningsSummary } from "@/components/earnings/EarningsSummary"
import { EarningsChart } from "@/components/earnings/EarningsChart"
import { WithdrawEarningsCard } from "@/components/earnings/WithdrawEarningsCard"
import { requireViewer } from "@/lib/db/owner"

export const metadata: Metadata = {
  title: "Earnings · Naano-8x",
  description: "Track revenue from your paid collaborations and withdraw available funds.",
}

// Rolling six-month window shown on the chart, oldest first. No earnings
// table exists yet, so every month reads €0 until paid collaborations land.
const EARNINGS_MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sept"].map(
  (month) => ({ month, amount: 0 })
)

export default async function EarningsPage() {
  // Per-user earnings, so an unauthenticated visitor is sent to sign in
  // rather than shown another account's balance.
  const viewer = await requireViewer()
  if (!viewer) redirect("/sign-in")

  return (
    <div className="flex flex-1 flex-col bg-[oklch(0.982_0.003_265)]">
      <Topbar />

      <main className="mx-auto w-full max-w-[1392px] px-5 py-8 sm:px-[34px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <h1 className="text-[32px] leading-10 font-extrabold tracking-tight text-foreground sm:text-[40px] sm:leading-[48px]">
              Earnings
            </h1>
            <p className="mt-1 text-[14px] leading-5 text-muted-foreground">
              Track revenue from your paid collaborations and withdraw
              available funds.
            </p>
          </div>

          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-foreground">
            <Coins className="size-3.5 text-primary" aria-hidden="true" />
            Paid collaborations
          </span>
        </div>

        <div className="mt-6">
          <EarningsSummary
            totalEarned={0}
            paidCollaborationCount={0}
            averagePerCollaboration={0}
            inTransit={0}
            availableNow={0}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] xl:items-start">
          <EarningsChart months={EARNINGS_MONTHS} />
          <WithdrawEarningsCard
            availableNow={0}
            hasBankDetails={false}
            stripeConnected={false}
          />
        </div>
      </main>
    </div>
  )
}
