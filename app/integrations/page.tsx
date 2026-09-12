import { redirect } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import {
  Check,
  Eye,
  LayoutGrid,
  Link2,
  Send,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react"

import { Topbar } from "@/components/Topbar"
import { Button } from "@/components/ui/button"
import { getViewer, requireViewer } from "@/lib/db/owner"

export const metadata = {
  title: "Integrations · Naano-8x",
  description: "Connect your AI assistant to Naano.",
}

type Integration = {
  name: string
  description: string
  action: string
  icon: LucideIcon
  iconClassName: string
}

const integrations: Integration[] = [
  {
    name: "Claude",
    description: "Use Naano from Claude or Cowork.",
    action: "Connect Claude",
    icon: Sparkles,
    iconClassName: "border-orange-200 bg-orange-50 text-orange-600",
  },
  {
    name: "ChatGPT",
    description: "Use Naano from a custom ChatGPT app.",
    action: "Connect ChatGPT",
    icon: Sparkles,
    iconClassName: "border-slate-200 bg-slate-50 text-slate-800",
  },
  {
    name: "Gemini CLI",
    description: "Use Naano from Google Gemini CLI.",
    action: "Connect Gemini",
    icon: Sparkles,
    iconClassName: "border-indigo-200 bg-indigo-50 text-indigo-500",
  },
  {
    name: "Cursor",
    description: "Use Naano from Cursor agents.",
    action: "Connect Cursor",
    icon: LayoutGrid,
    iconClassName: "border-slate-200 bg-slate-50 text-slate-800",
  },
  {
    name: "GitHub Copilot",
    description: "Use Naano from Copilot Chat in VS Code.",
    action: "Connect Copilot",
    icon: UsersRound,
    iconClassName: "border-violet-200 bg-violet-50 text-violet-600",
  },
  {
    name: "Other MCP client",
    description: "Use any remote MCP client that supports OAuth.",
    action: "Connect another app",
    icon: Link2,
    iconClassName: "border-blue-200 bg-blue-50 text-blue-600",
  },
]

export default async function IntegrationsPage() {
  const viewer = await requireViewer()
  if (!viewer) redirect("/sign-in")

  // Keep the viewer lookup request-bound and ready for connector ownership
  // checks when the connection actions are implemented.
  await getViewer()

  return (
    <div className="flex flex-1 flex-col bg-[oklch(0.982_0.003_265)]">
      <Topbar />

      <main className="mx-auto w-full max-w-[1080px] px-5 py-8 sm:px-8 lg:py-8">
        <div className="mb-5 flex items-end justify-between gap-5">
          <div>
            <p className="text-[11px] font-bold tracking-[0.12em] text-primary uppercase">
              Integrations
            </p>
            <h1 className="mt-2 text-[32px] leading-10 font-extrabold tracking-[-0.04em] text-foreground sm:text-[36px]">
              Connect your AI assistant
            </h1>
            <p className="mt-1 max-w-[700px] text-sm leading-5 text-muted-foreground">
              Connect Claude, ChatGPT, Gemini, Cursor, Copilot or another
              compatible MCP assistant to your own Naano account.
            </p>
          </div>

          <span className="mb-1 hidden shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 sm:inline-flex">
            <Check className="size-3.5" aria-hidden="true" />
            Available
          </span>
        </div>

        <section className="rounded-[20px] border border-border bg-card p-5 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.35)] sm:p-6">
          <div className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-primary/[0.035] px-4 py-3.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="size-[18px]" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[13px] font-bold text-foreground">
                Stay focused on the collaboration, not the admin
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Review briefs and conversations, then prepare the next step
                from the AI tool you already use.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.map((integration) => {
              const Icon = integration.icon
              return (
                <article
                  key={integration.name}
                  className="rounded-2xl border border-border bg-muted/20 p-4"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex size-12 shrink-0 items-center justify-center rounded-xl border ${integration.iconClassName}`}
                    >
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <h2 className="text-sm font-bold text-foreground">
                        {integration.name}
                      </h2>
                      <p className="mt-1 text-xs leading-4 text-muted-foreground">
                        {integration.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-bold tracking-wide text-emerald-700 uppercase">
                      Available
                    </span>
                    <Button type="button" size="sm" className="h-9 px-3 text-xs">
                      {integration.action}
                    </Button>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <InfoCard
              icon={Eye}
              title="What it can review"
              badge="Read access"
              items={[
                "Your collaboration briefs and deadlines",
                "Your draft history and post status",
                "Your conversations and messages",
              ]}
            />
            <InfoCard
              icon={Send}
              title="Actions it can prepare"
              badge="Confirmed actions"
              items={[
                "Submit a draft to the brand for review",
                "Ask whether you want to attach an image before submitting a draft",
                "Reply in an existing collaboration conversation",
                "Every action requires explicit confirmation",
              ]}
            />
          </div>

          <div className="mt-3 flex items-start gap-3 rounded-2xl border border-border bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
            <p>
              The assistant only receives access to your own creator account
              after OAuth consent. Naano rechecks ownership, collaboration
              access, rate limits and duplicate actions on the server.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

function InfoCard({
  icon: Icon,
  title,
  badge,
  items,
}: {
  icon: LucideIcon
  title: string
  badge: string
  items: string[]
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-primary" aria-hidden="true" />
          <h2 className="text-[13px] font-bold text-foreground">{title}</h2>
        </div>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-bold tracking-wide text-emerald-700 uppercase">
          {badge}
        </span>
      </div>
      <ul className="mt-3 space-y-1.5 text-xs leading-4 text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/50" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
