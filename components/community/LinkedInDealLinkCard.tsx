import { ArrowRight, Share2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { NormalizedProfile } from "@/lib/linkedin"

type LinkedInDealLinkCardProps = {
  profile: NormalizedProfile | null
  postCount: number | null
  estimatedImpressions: number | null
}

function formatCount(value: number | null): string {
  if (value === null) return "—"
  return new Intl.NumberFormat("en-US").format(value)
}

/** e.g. "Naano · Independent" from the first skill and headline's role hint. */
function subtitleOf(profile: NormalizedProfile | null): string {
  const specialty = profile?.skills?.[0]
  return specialty ? `Naano · ${specialty}` : "Naano · Independent"
}

export function LinkedInDealLinkCard({
  profile,
  postCount,
  estimatedImpressions,
}: LinkedInDealLinkCardProps) {
  const displayName = profile?.name ?? "Naano Creator"
  const specialties = profile?.skills?.slice(0, 3).join(" · ") || "B2B · Creator"
  const headline = profile?.headline

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#0a66c2] text-white">
          <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            LinkedIn visibility
          </p>
          <h2 className="mt-0.5 text-lg leading-6 font-bold text-foreground">
            Turn your LinkedIn profile into an always-on Deal Link
          </h2>
        </div>
      </div>

      <p className="mt-3 text-sm leading-5 text-muted-foreground">
        Add your creator card to LinkedIn so brands can discover your work and
        join Naano through your attributed link.
      </p>

      <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
        <p className="shrink-0 text-2xl font-bold tracking-tight text-foreground">25%</p>
        <p className="text-xs leading-4 text-muted-foreground">
          <span className="font-medium text-foreground">of Naano&apos;s commission</span>
          <br />
          for 3 months. Leave your card on your LinkedIn profile. If a brand
          joins Naano through it, your reward is tracked automatically.
        </p>
      </div>

      <div className="mt-3 flex items-center gap-3 rounded-xl border border-border px-4 py-3">
        <Avatar className="size-9 rounded-lg">
          {profile?.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={displayName} />}
          <AvatarFallback className="rounded-lg bg-foreground text-background">
            {displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
          <p className="truncate text-xs text-muted-foreground">{subtitleOf(profile)}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-1 items-center justify-center">
        <div className="w-full max-w-[300px] overflow-hidden rounded-[22px] border border-slate-200 bg-[linear-gradient(160deg,#1558e8_0%,#2f6ff2_55%,#5c8bf6_100%)] p-3 text-white shadow-[0_20px_40px_-24px_rgba(21,88,232,0.55)]">
          <div className="flex items-center justify-between">
            <span className="flex size-8 items-center justify-center rounded-lg bg-white text-[#0a66c2]">
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
              </svg>
            </span>
            <span className="flex items-center gap-1.5 text-sm font-bold tracking-tight">
              naano
            </span>
            <div className="flex items-center gap-1.5">
              <span className="flex size-7 items-center justify-center rounded-full bg-white/25 text-[10px] font-semibold">
                PK
              </span>
              <span className="flex size-7 items-center justify-center rounded-full bg-white/25">
                <Share2 className="size-3.5" aria-hidden="true" />
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-col items-center rounded-2xl bg-white px-4 pb-5 pt-8 text-center text-slate-800">
            <Avatar className="-mt-14 size-16 border-[3px] border-white shadow-md">
              {profile?.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={displayName} />}
              <AvatarFallback className="bg-slate-100 text-base font-semibold text-slate-700">
                {displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h3 className="mt-2 text-lg font-bold tracking-tight">{displayName}</h3>
            <p className="mt-0.5 text-xs font-medium text-slate-400">{specialties}</p>
            {headline && (
              <p className="mt-3 line-clamp-2 text-[13px] leading-5 text-slate-500">
                {headline}
              </p>
            )}

            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500">
              {postCount ? `${postCount} post${postCount === 1 ? "" : "s"} imported` : "No post data available"}
            </span>

            <div className="mt-4 grid w-full grid-cols-3 divide-x divide-slate-200 border-t border-slate-200 pt-3">
              <div>
                <p className="text-base font-bold tracking-tight">{formatCount(profile?.followers ?? null)}</p>
                <p className="mt-0.5 text-[10px] text-slate-400">Followers</p>
              </div>
              <div>
                <p className="text-base font-bold tracking-tight">{formatCount(estimatedImpressions)}</p>
                <p className="mt-0.5 text-[10px] text-slate-400">Est. impressions</p>
              </div>
              <div>
                <p className="text-base font-bold tracking-tight">€240</p>
                <p className="mt-0.5 text-[10px] text-slate-400">Chosen cost</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        size="lg"
        className="mt-4 h-12 w-full justify-between rounded-xl bg-[#1558e8] text-base font-semibold text-white hover:bg-[#1558e8]/90"
      >
        <span className="flex items-center gap-2">
          <Share2 className="size-4" aria-hidden="true" />
          Publish my card
        </span>
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>
    </div>
  )
}
