import { redirect } from "next/navigation"
import type { Metadata } from "next"

import { Topbar } from "@/components/Topbar"
import { ProfileStorefront } from "@/components/ProfileStorefront"
import { getStoredImport, getStoredPricing } from "@/lib/db/creator-repository"
import { getViewer, requireViewer } from "@/lib/db/owner"

export const metadata: Metadata = {
  title: "My card · Naano-8x",
  description: "Your Naano card, ready to travel.",
}

export default async function CardPage() {
  // Per-user storefront, so an unauthenticated visitor is sent to sign in
  // rather than shown another account's card.
  const viewer = await requireViewer()
  if (!viewer) redirect("/sign-in")

  let importResult = null
  let pricing = null
  try {
    const { ownerKey, userId } = await getViewer()
    importResult = await getStoredImport(ownerKey, userId)
    if (userId) pricing = await getStoredPricing(ownerKey, userId)
  } catch (error) {
    // A read failure degrades to the empty/import state, not a crash.
    console.error("Failed to load the stored LinkedIn import", error)
  }

  return (
    <div className="flex flex-1 flex-col bg-[oklch(0.982_0.003_265)]">
      <Topbar />

      <main className="max-w-full px-4 py-[30px] sm:px-8">
          <ProfileStorefront importResult={importResult} pricing={pricing} />
      </main>
    </div>
  )
}
