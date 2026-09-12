"use client"

import { useId, useState } from "react"
import {
  Briefcase,
  Check,
  Eye,
  Link2,
  MessageCircle,
  Network,
  Send,
  Share2,
  ThumbsUp,
  UsersRound,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ProfileEditView } from "@/components/ProfileEditView"
import { cn } from "@/lib/utils"
import type { LinkedInImportResult } from "@/lib/linkedin"

type EditPreviewMode = "edit" | "preview"

/**
 * Segmented Edit/Preview control. Local UI state only — no editor or preview
 * flow is wired up in this task.
 */
function EditPreviewToggle({
  mode,
  onChange,
}: {
  mode: EditPreviewMode
  onChange: (mode: EditPreviewMode) => void
}) {
  const groupLabelId = useId()

  return (
    <div
      role="group"
      aria-labelledby={groupLabelId}
      className="inline-flex h-[42px] w-full shrink-0 items-center rounded-full border border-border bg-background p-1 lg:w-[145px]"
    >
      <span id={groupLabelId} className="sr-only">
        Card view
      </span>
      {(["edit", "preview"] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={mode === option}
          onClick={() => onChange(option)}
          className={cn(
            "h-full flex-1 rounded-full text-sm font-medium capitalize transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            mode === option
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

type ProfileStorefrontProps = {
  /** Persisted import for the current owner, loaded on the server. */
  importResult?: LinkedInImportResult | null
}

export function ProfileStorefront({ importResult = null }: ProfileStorefrontProps) {
  const [mode, setMode] = useState<EditPreviewMode>("preview")

  return (
    <section
      aria-labelledby="storefront-heading"
      className="rounded-[22px] border border-border bg-card p-6 lg:p-8"
    >
      <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.08em] text-primary uppercase">
            Your creator storefront
          </p>
          <h1
            id="storefront-heading"
            className="mt-2 text-[28px] leading-9 font-bold tracking-tight text-foreground lg:text-[32px] lg:leading-10"
          >
            Your Naano card, ready to travel.
          </h1>
          <p className="mt-2 max-w-[650px] text-[15px] leading-6 text-muted-foreground lg:text-base">
            Share clear proof of your positioning, audience and offers. Every
            improvement makes the card more useful to brands.
          </p>
        </div>

        <EditPreviewToggle mode={mode} onChange={setMode} />
      </header>

      {mode === "edit" ? (
        <ProfileEditView profile={importResult?.profile ?? null} />
      ) : (
        <>
          <DealLinkHero />
          <PublicProfileCard importResult={importResult ?? null} />
        </>
      )}
    </section>
  )
}

function DealLinkHero() {
  const [copied, setCopied] = useState(false)

  async function copyDealLink() {
    try {
      await navigator.clipboard.writeText("https://naano.com/c/your-handle")
    } catch {
      // Clipboard access can be unavailable in preview environments.
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative mt-6 overflow-hidden rounded-[22px] border border-primary/15 bg-[linear-gradient(160deg,oklch(0.975_0.012_255)_0%,var(--color-card)_55%)] p-6 lg:min-h-[298px] lg:p-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(220px_140px_at_88%_18%,oklch(1_0_0/0.8),transparent_70%),radial-gradient(260px_160px_at_96%_60%,oklch(0.95_0.02_250/0.6),transparent_72%)]"
      />

      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            <span aria-hidden="true" className="size-[7px] shrink-0 rounded-full bg-primary/60" />
            Your card is your deal link
          </p>
          <h2 className="mt-3 max-w-[560px] text-[24px] leading-8 font-bold tracking-tight text-balance text-foreground lg:text-[28px] lg:leading-9">
            Put it on LinkedIn. Earn when a brand joins through it.
          </h2>
          <p className="mt-3 max-w-[600px] text-[14px] leading-6 text-muted-foreground lg:text-[15px]">
            Your public card presents your profile and keeps you selected when a brand creates its account.
          </p>

          <div className="mt-6 grid max-w-[680px] grid-cols-1 gap-3 lg:grid-cols-2">
            <FeatureCard
              icon={Briefcase}
              title="Add it as a LinkedIn experience"
              description="Keep your card visible on your profile so brands can discover and book you."
            />
            <FeatureCard
              icon={Send}
              title="Send it when a brand contacts you"
              description="When you receive a collaboration request, share your card so the deal runs through Naano."
            />
          </div>

          <Button
            type="button"
            onClick={copyDealLink}
            className="mt-6 h-12 gap-2 rounded-[13px] bg-foreground px-6 text-sm font-semibold text-background hover:bg-foreground/90"
          >
            {copied ? <Check data-icon="inline-start" /> : <Share2 data-icon="inline-start" />}
            {copied ? "Copied!" : "Copy or share my Deal Link"}
          </Button>
        </div>

        <div className="flex shrink-0 flex-col justify-center gap-5 rounded-2xl border border-border bg-card px-6 py-6 shadow-sm lg:w-[210px]">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">Your share</p>
            <p className="mt-1.5 text-[30px] leading-9 font-bold text-foreground">25%</p>
          </div>
          <div className="h-px w-full bg-border" aria-hidden="true" />
          <div>
            <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">Reward period</p>
            <p className="mt-1.5 text-[20px] leading-7 font-bold text-foreground">3 months</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Briefcase
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-background/70 p-4">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-[18px]" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[13px] leading-5 font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-[12px] leading-5 text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function formatMetric(value: number | null): string {
  return value === null ? "—" : new Intl.NumberFormat("en-US").format(value)
}

function averageMetric(total: number, count: number): number | null {
  return count > 0 ? Math.round(total / count) : null
}

function PublicProfileCard({
  importResult,
}: {
  importResult: LinkedInImportResult | null
}) {
  const [flipped, setFlipped] = useState(false)
  const profile = importResult?.profile ?? null
  const posts = importResult?.posts ?? []
  const engagementCount = importResult?.stats.engagementCount ?? 0
  const postCount = posts.length
  const reactions = posts.reduce((sum, post) => sum + (post.reactions ?? 0), 0)
  const comments = posts.reduce((sum, post) => sum + (post.comments ?? 0), 0)
  const estimatedImpressions = importResult?.stats.estimatedImpressions ?? null
  const engagementRate =
    profile?.followers && engagementCount > 0
      ? `${((engagementCount / profile.followers) * 100).toFixed(1)}%`
      : "—"

  function toggleFlip() {
    setFlipped((current) => !current)
  }

  return (
    <div className="mx-auto mt-6 w-full max-w-[400px] [perspective:1200px]">
      <button
        type="button"
        onClick={toggleFlip}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            toggleFlip()
          }
        }}
        aria-label={flipped ? "Show profile card" : "Show detailed profile metrics"}
        aria-pressed={flipped}
        className="block h-[510px] w-full rounded-[30px] text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
      >
        <div
          className={cn(
            "relative size-full transition-transform duration-700 [transform-style:preserve-3d]",
            flipped && "[transform:rotateY(180deg)]"
          )}
        >
          <div className="absolute inset-0 overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_18px_35px_-20px_rgba(15,23,42,0.45)] [backface-visibility:hidden]">
            <CardSurface profile={profile} posts={posts} estimatedImpressions={estimatedImpressions} />
          </div>

          <div className="absolute inset-0 overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_18px_35px_-20px_rgba(15,23,42,0.45)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="h-full overflow-y-auto px-6 pb-5 text-center">
              <div className="pt-7">
                <h2 className="text-[20px] font-bold tracking-[-0.04em] text-slate-800">
                  Performance &amp; ICP
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Public LinkedIn profile data from Apify (Basic card).
                </p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <Metric icon={UsersRound} label="Followers" value={formatMetric(profile?.followers ?? null)} />
                <Metric icon={ThumbsUp} label="Reactions per post" value={formatMetric(averageMetric(reactions, postCount))} suffix="Average" />
                <Metric icon={Eye} label="Typical impressions per post" value={formatMetric(averageMetric(estimatedImpressions ?? 0, postCount))} />
                <Metric icon={MessageCircle} label="Comments per post" value={formatMetric(averageMetric(comments, postCount))} suffix="Average" />
                <Metric icon={Network} label="Engagement rate" value={engagementRate} />
              </div>

              <span className="mt-3 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] text-slate-500">
                Public LinkedIn data estimated by Naano
              </span>

              <div className="mt-4 rounded-2xl border border-slate-200 p-4 text-left">
                <p className="text-xs font-bold text-slate-800">About</p>
                <div className="mt-2 max-h-[150px] overflow-y-auto pr-2 text-xs leading-5 text-slate-600">
                  {profile?.about || "Not added yet."}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 p-4 text-left">
                <div className="flex items-start gap-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UsersRound className="size-3.5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Who you target (est.)</p>
                    <p className="text-[10px] leading-4 text-slate-400">
                      Estimated from your public posts + bio (dominant themes).
                    </p>
                  </div>
                </div>
                <div className="mt-3 rounded-xl border border-dashed border-slate-300 px-3 py-4 text-center">
                  <p className="text-xs font-semibold text-slate-500">Target pending</p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    Re-import LinkedIn to estimate your target from public posts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  )
}

function CardSurface({
  profile,
  posts,
  estimatedImpressions,
}: {
  profile: LinkedInImportResult["profile"] | null
  posts: LinkedInImportResult["posts"]
  estimatedImpressions: number | null
}) {
  return (
    <>
      <div className="relative h-[100px] overflow-hidden bg-[linear-gradient(115deg,#1558e8_0%,#2165ed_52%,#7195f8_100%)] px-5 py-4 text-white">
        <div className="absolute -left-10 -bottom-14 size-28 rounded-full border border-white/10" />
        <div className="relative flex items-center justify-between">
          <span className="flex size-9 items-center justify-center rounded-xl bg-white text-[#2165ed]">
            <Link2 className="size-5" aria-hidden="true" />
          </span>
          <span className="text-[19px] font-bold tracking-[-0.05em]">naano</span>
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-white/80 text-xs font-semibold text-slate-400">
              {profile?.location?.slice(0, 2).toUpperCase() || "PK"}
            </span>
            <span className="flex size-9 items-center justify-center rounded-xl bg-white/90 text-[#2165ed]">
              <Share2 className="size-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>

      <div className="relative px-6 pb-5 text-center">
        <div className="-mt-10 flex justify-center">
          <Avatar className="size-[68px] border-[3px] border-[#2165ed] bg-white p-0.5 shadow-[0_4px_12px_-4px_rgba(37,99,235,0.55)]">
            {profile?.avatarUrl ? <AvatarImage src={profile.avatarUrl} alt={profile.name ?? "Profile photo"} /> : null}
            <AvatarFallback className="bg-slate-100 text-sm font-semibold text-slate-700">
              {profile?.name?.slice(0, 2).toUpperCase() || "—"}
            </AvatarFallback>
          </Avatar>
        </div>

        <h2 className="mt-3 text-[20px] font-bold tracking-[-0.04em] text-slate-800">
          {profile?.name || "Your profile"}
        </h2>
        <p className="mt-0.5 text-xs text-slate-400">
          {profile?.skills?.slice(0, 3).join(" · ") || "—"}
        </p>
        <p className="mx-auto mt-4 max-w-[280px] truncate text-xs leading-5 text-slate-500">
          {profile?.headline || "Not added yet."}
        </p>

        <span className="mt-4 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] text-slate-500">
          No post data available
        </span>

        <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400">
          <span>Data</span>
          <span className="h-1.5 flex-1 rounded-full bg-slate-200" />
          <span>{posts.length > 0 ? "Imported" : "Pending"}</span>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-200">
        <div className="px-2 py-5 text-center">
          <p className="text-xl font-bold text-slate-800">{formatMetric(profile?.followers ?? null)}</p>
          <p className="mt-1 text-[10px] text-slate-400">Followers</p>
        </div>
        <div className="px-2 py-5 text-center">
          <p className="text-xl font-bold text-slate-800">{formatMetric(estimatedImpressions)}</p>
          <p className="mt-1 text-[10px] text-slate-400">Est. impressions</p>
        </div>
        <div className="px-2 py-5 text-center">
          <p className="text-xl font-bold text-slate-800">—</p>
          <p className="mt-1 text-[10px] text-slate-400">Chosen cost</p>
        </div>
      </div>
    </>
  )
}

function Metric({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: typeof UsersRound
  label: string
  value: string
  suffix?: string
}) {
  return (
    <div className="flex min-h-[112px] flex-col items-center justify-center rounded-2xl border border-slate-200 px-2 py-3">
      <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-3.5" aria-hidden="true" />
      </span>
      <p className="mt-1 text-[9px] leading-3 text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-bold leading-5 text-slate-800">{value}</p>
      {suffix ? <p className="mt-1 text-[9px] text-slate-400">{suffix}</p> : null}
    </div>
  )
}
