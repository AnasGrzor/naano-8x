import { Dashboard } from "@/components/Dashboard"
import { getStoredImport } from "@/lib/db/creator-repository"
import { getViewer } from "@/lib/db/owner"

/**
 * Server component that loads the persisted import for the current owner and
 * hands it to the client dashboard as initial state. Keeping the database call
 * here means no UI component imports database code.
 */
export async function DashboardLoader() {
  let initialResult = null

  try {
    const viewer = await getViewer()
    initialResult = await getStoredImport(viewer.ownerKey, viewer.userId)
  } catch (error) {
    // A read failure should degrade to the empty/import state, not a crash.
    console.error("Failed to load the stored LinkedIn import", error)
  }

  return <Dashboard initialResult={initialResult} />
}
