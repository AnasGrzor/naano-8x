import { Topbar } from "@/components/Topbar"
import { Dashboard } from "@/components/Dashboard"

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Topbar />

      <main className="flex-1 px-8 py-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">Creator workspace</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            Good to see you, Anas
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your creator activity, at a glance.
          </p>
        </div>

        <Dashboard />
      </main>
    </div>
  )
}
