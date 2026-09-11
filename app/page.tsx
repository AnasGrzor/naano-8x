import { Suspense } from "react"
import { redirect } from "next/navigation"
import { Topbar } from "@/components/Topbar"
import { Dashboard } from "@/components/Dashboard"
import { DashboardLoader } from "@/components/DashboardLoader"
import { DashboardNotice } from "@/components/DashboardNotice"
import { requireViewer } from "@/lib/db/owner"

export default async function Home() {
  // The dashboard is per-user data, so an unauthenticated visitor is sent to
  // sign in rather than shown another account's workspace.
  const viewer = await requireViewer()
  if (!viewer) redirect("/sign-in")

  return (
    <div className="flex flex-1 flex-col">
      <Topbar />

      <main className="mx-auto w-full max-w-[1392px] px-4 py-10 sm:px-8">
        <div className="mb-[30px]">
          <p className="text-sm font-medium text-primary">Creator workspace</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            Good to see you
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your creator activity, at a glance.
          </p>
        </div>

        <Suspense fallback={null}>
          <DashboardNotice />
        </Suspense>

        {/* The saved profile is read at request time; the empty dashboard is
            streamed immediately as the fallback. */}
        <Suspense fallback={<Dashboard />}>
          <DashboardLoader />
        </Suspense>
      </main>
    </div>
  )
}
