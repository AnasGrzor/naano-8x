import { Eye, FileText, Activity, Users2 } from "lucide-react"
import { Topbar } from "@/components/Topbar"
import { StatCard } from "@/components/StatCard"
import { CreatorCardPreview } from "@/components/CreatorCardPreview"
import { LaunchGuideCard } from "@/components/LaunchGuideCard"

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

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Eye}
            label="Public post reach"
            value="—"
            caption="Import in progress"
          />
          <StatCard
            icon={FileText}
            label="Public posts"
            value="0"
            caption="Original LinkedIn posts found"
          />
          <StatCard
            icon={Activity}
            label="Public engagements"
            value="0"
            caption="Reactions, comments and reposts"
          />
          <StatCard
            icon={Users2}
            label="LinkedIn followers"
            value="696"
            caption="Imported from the public profile"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <CreatorCardPreview />
          <LaunchGuideCard />
        </div>
      </main>
    </div>
  )
}
