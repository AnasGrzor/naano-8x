import { redirect } from "next/navigation"
import type { Metadata } from "next"

import { Topbar } from "@/components/Topbar"
import { SettingsPanel } from "@/components/SettingsPanel"
import { getStoredImport } from "@/lib/db/creator-repository"
import { getViewer, requireViewer } from "@/lib/db/owner"

export const metadata: Metadata = {
  title: "Settings · Naano-8x",
  description: "Manage your profile and payment details.",
}

export default async function SettingsPage() {
  const viewer = await requireViewer()
  if (!viewer) redirect("/sign-in")

  let importResult = null
  try {
    const currentViewer = await getViewer()
    importResult = await getStoredImport(
      currentViewer.ownerKey,
      currentViewer.userId
    )
  } catch (error) {
    console.error("Failed to load settings profile", error)
  }

  return (
    <div className="flex flex-1 flex-col bg-[oklch(0.982_0.003_265)]">
      <Topbar />
      <main className="mx-auto w-full max-w-[1080px] px-5 py-8 sm:px-8 lg:py-8">
        <div className="mb-6">
          <h1 className="text-[32px] leading-10 font-extrabold tracking-[-0.04em] text-foreground">
            Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your profile and payment details.
          </p>
        </div>
        <SettingsPanel profile={importResult?.profile ?? null} />
      </main>
    </div>
  )
}
