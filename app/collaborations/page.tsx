import { redirect } from "next/navigation"
import type { Metadata } from "next"

import { Topbar } from "@/components/Topbar"
import { CollaborationsTable } from "@/components/CollaborationsTable"
import { requireViewer } from "@/lib/db/owner"

export const metadata: Metadata = {
  title: "Collaborations · Naano-8x",
  description: "Track every collaboration from brief to payout.",
}

export default async function CollaborationsPage() {
  // Per-user collaborations, so an unauthenticated visitor is sent to sign in
  // rather than shown another account's deals.
  const viewer = await requireViewer()
  if (!viewer) redirect("/sign-in")

  return (
    <div className="flex flex-1 flex-col bg-[oklch(0.982_0.003_265)]">
      <Topbar />

      <main className="mx-auto w-full max-w-[1392px] px-5 py-8 sm:px-[34px]">
        <h1 className="text-[32px] leading-10 font-extrabold tracking-tight text-foreground sm:text-[40px] sm:leading-[48px]">
          Collaborations
        </h1>
        <p className="mt-1 text-[14px] leading-5 text-muted-foreground">
          Every step tells you where you stand, what to do, and what happens
          if you do nothing.
        </p>

        <div className="mt-6">
          <CollaborationsTable />
        </div>
      </main>
    </div>
  )
}
