import { redirect } from "next/navigation"
import type { Metadata } from "next"

import { Topbar } from "@/components/Topbar"
import { OpportunitiesGate } from "@/components/OpportunitiesGate"
import { getStoredImport } from "@/lib/db/creator-repository"
import { getViewer, requireViewer } from "@/lib/db/owner"

export const metadata: Metadata = {
  title: "Opportunities · Naano-8x",
  description: "Open brand campaigns matched to your audience.",
}

const FOLLOWER_THRESHOLD = 1000

export default async function OpportunitiesPage() {
  // Per-user campaign eligibility, so an unauthenticated visitor is sent to
  // sign in rather than shown another account's follower count.
  const viewer = await requireViewer()
  if (!viewer) redirect("/sign-in")

  let followerCount: number | null = null
  try {
    const { ownerKey, userId } = await getViewer()
    const importResult = await getStoredImport(ownerKey, userId)
    followerCount = importResult?.stats.followerCount ?? null
  } catch (error) {
    // A read failure degrades to the locked/zero-follower state, not a crash.
    console.error("Failed to load the stored LinkedIn import", error)
  }

  const unlocked = (followerCount ?? 0) >= FOLLOWER_THRESHOLD

  return (
    <div className="flex flex-1 flex-col bg-[oklch(0.982_0.003_265)]">
      <Topbar />

      <main className="mx-auto w-full max-w-[1392px] px-5 py-8 sm:px-[34px]">
        <h1 className="text-[32px] leading-10 font-extrabold tracking-tight text-foreground sm:text-[40px] sm:leading-[48px]">
          Opportunities
        </h1>
        <p className="mt-1 text-[14px] leading-5 text-muted-foreground">
          Open brand campaigns - apply, the brand accepts, and the booking is
          created on your terms.
        </p>

        {unlocked ? (
          <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-border py-16 text-center">
            <p className="text-sm font-medium text-foreground">
              No open campaigns yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Check back soon — new campaigns are matched to your audience as
              they open.
            </p>
          </div>
        ) : (
          <OpportunitiesGate
            followerCount={followerCount}
            threshold={FOLLOWER_THRESHOLD}
          />
        )}
      </main>
    </div>
  )
}
