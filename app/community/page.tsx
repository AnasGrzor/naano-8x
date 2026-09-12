import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { Users } from "lucide-react"

import { Topbar } from "@/components/Topbar"
import { SlackCommunityCard } from "@/components/community/SlackCommunityCard"
import { LinkedInDealLinkCard } from "@/components/community/LinkedInDealLinkCard"
import { getStoredImport } from "@/lib/db/creator-repository"
import { getViewer, requireViewer } from "@/lib/db/owner"

export const metadata: Metadata = {
  title: "Community · Naano-8x",
  description: "Learn with other B2B creators, share what works and make your Naano identity visible.",
}

export default async function CommunityPage() {
  // Per-user card preview, so an unauthenticated visitor is sent to sign in
  // rather than shown another account's profile.
  const viewer = await requireViewer()
  if (!viewer) redirect("/sign-in")

  let importResult = null
  try {
    const { ownerKey, userId } = await getViewer()
    importResult = await getStoredImport(ownerKey, userId)
  } catch (error) {
    // A read failure degrades to the empty card preview, not a crash.
    console.error("Failed to load the stored LinkedIn import", error)
  }

  return (
    <div className="flex flex-1 flex-col bg-[linear-gradient(160deg,oklch(0.94_0.02_255)_0%,oklch(0.97_0.01_255)_45%,oklch(0.982_0.003_265)_100%)]">
      <Topbar />

      <main className="mx-auto w-full max-w-[1392px] px-5 py-8 sm:px-[34px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <h1 className="text-[32px] leading-10 font-extrabold tracking-tight text-foreground sm:text-[40px] sm:leading-[48px]">
              Community
            </h1>
            <p className="mt-1 text-[14px] leading-5 text-muted-foreground">
              Learn with other B2B creators, share what works and make your
              Naano identity visible.
            </p>
          </div>

          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground">
            <Users className="size-3.5 text-primary" aria-hidden="true" />
            Creator network
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2 xl:items-stretch">
          <SlackCommunityCard />
          <LinkedInDealLinkCard
            profile={importResult?.profile ?? null}
            postCount={importResult?.stats.postCount ?? null}
            estimatedImpressions={importResult?.stats.estimatedImpressions ?? null}
          />
        </div>
      </main>
    </div>
  )
}
