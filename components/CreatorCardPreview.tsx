"use client"

import Image from "next/image";
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Copy, IdCard, Share2 } from "lucide-react"
import { LinkedInImportPanel } from "@/components/LinkedInImportPanel"
import type { LinkedInImportResult, NormalizedProfile } from "@/lib/linkedin"


type CreatorCardPreviewProps = {
  profile?: NormalizedProfile | null
  postCount?: number | null
  /**
   * Estimated from public post engagement only — not official LinkedIn
   * Analytics data. Null when there are no posts/engagement to estimate from.
   */
  estimatedImpressions?: number | null
  /** Omitted on the server-rendered fallback, where importing is not wired up. */
  onImported?: (result: LinkedInImportResult) => void
}

function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—"
  return new Intl.NumberFormat("en-US").format(value)
}

export function CreatorCardPreview({
  profile,
  postCount,
  estimatedImpressions,
  onImported,
}: CreatorCardPreviewProps) {
  const [showImport, setShowImport] = useState(false)
  const [chosenCost, setChosenCost] = useState("")

  useEffect(() => {
    let active = true
    fetch("/api/profile/pricing")
      .then((response) => (response.ok ? response.json() : null))
      .then((pricing: { pricePerPost?: string | null } | null) => {
        if (active) setChosenCost(pricing?.pricePerPost ?? "")
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [])
  const displayName = profile?.name ?? null
  const headline = profile?.headline ?? null
  const specialties = profile?.skills?.slice(0, 3).join(" · ") || null
  const followers = profile?.followers ?? null

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-5 ">
      <div className="mb-4 flex items-start gap-0 max-[480px]:flex-col">
        <div className="min-w-0 flex-1 max-[480px]:w-full">
          <h2 className="text-base font-semibold text-foreground">
            Your creator card
          </h2>
          <p className="mt-1 max-w-[235px] text-xs leading-5 text-muted-foreground">
            This is how brands discover your positioning and collaboration
            offer.
          </p>
        </div>

        <div className="flex w-[214px] shrink-0 flex-col items-end gap-2 max-[480px]:mt-3 max-[480px]:w-full max-[480px]:items-start">
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="xs"
              className="shrink-0 px-2.5"
              onClick={() => setShowImport((open) => !open)}
              aria-expanded={showImport}
            >
              <IdCard data-icon="inline-start" />
              Open card
            </Button>
            <Button variant="outline" size="xs" className="shrink-0 px-2.5">
              <Copy data-icon="inline-start" />
              Copy card link
            </Button>
          </div>
          <Button size="xs" className="shrink-0">
            <Share2 data-icon="inline-start" />
            Share my card
          </Button>
        </div>
      </div>

      {/* Import lives here instead of a full-width panel: it is shown by
          default until a profile exists, and on demand afterwards. */}
      {onImported && (!profile || showImport) && (
        <div className="mb-4">
          <LinkedInImportPanel
            embedded
            onImported={(result) => {
              setShowImport(false)
              onImported(result)
            }}
          />
        </div>
      )}

      <div className="mx-auto w-full min-w-0 max-w-[390px] overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_14px_32px_-20px_rgba(15,23,42,0.38)]">
        <div className="relative h-[98px] overflow-hidden bg-[linear-gradient(115deg,#1558e8_0%,#2165ed_48%,#7195f8_100%)] px-4 py-4 text-white">
          <div className="absolute -left-8 -top-12 size-36 rounded-full border border-white/10" />
          <div className="absolute -right-14 -bottom-20 size-44 rounded-full border border-white/10" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2 text-[19px] font-bold tracking-[-0.04em]">
              <span className="flex size-8 items-center justify-center rounded-[9px] bg-white text-[#2165ed] shadow-sm">
                <Image
                  src="https://naano.com/lp/naano-logomark.png"
                  alt="naano"
                  width={24}
                  height={24}
                />
              </span>
              naano
            </div>
            <div className="flex items-center gap-2">
              <span className="flex size-10 items-center justify-center rounded-xl bg-white/80 text-[11px] font-semibold text-slate-400">
                —
              </span>
              <span className="flex size-10 items-center justify-center rounded-xl bg-white/90 text-[#2165ed]">
                <Share2 className="size-4" aria-hidden="true" />
              </span>
            </div>
          </div>
        </div>

        <div className="relative px-5 pb-0 text-center">
          <div className="-mt-10 flex justify-center">
            <Avatar className="size-[82px] border-[3px] border-[#2165ed] bg-white p-0.5 shadow-[0_4px_12px_-4px_rgba(37,99,235,0.55)]">
              {profile?.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={displayName ?? "Profile photo"} />}
              <AvatarFallback className="bg-slate-100 text-lg font-semibold text-slate-700">
                {displayName ? displayName.slice(0, 2).toUpperCase() : "—"}
              </AvatarFallback>
            </Avatar>
          </div>

          <h3 className="mt-3 text-[25px] font-bold tracking-[-0.045em] text-slate-800">
            {displayName ?? "—"}
          </h3>
          <p className="mt-0.5 text-[15px] font-medium text-slate-400">
            {specialties ?? "—"}
          </p>
          <p className="mx-auto mt-5 max-w-[320px] truncate px-1 text-[15px] leading-6 text-slate-500">
            {headline ?? "—"}
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-500">
            <CalendarDays className="size-3.5 text-[#2165ed]" aria-hidden="true" />
            {postCount ? `${postCount} post${postCount === 1 ? "" : "s"} imported` : "No post data available"}
          </div>

          <div className="mt-5 flex items-center gap-3 text-left text-[12px] text-slate-400">
            <span>Data</span>
            <span className="h-1.5 flex-1 rounded-full bg-slate-200" />
            <span>Pending</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-200">
          <div className="px-2 py-5 text-center">
            <p className="text-[23px] font-bold tracking-[-0.04em] text-slate-800">{formatCount(followers)}</p>
            <p className="mt-1 text-[11px] text-slate-400">Followers</p>
          </div>
          <div className="px-2 py-5 text-center">
            <p className="text-[23px] font-bold tracking-[-0.04em] text-slate-800">
              {formatCount(estimatedImpressions)}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">Estimated reach</p>
          </div>
          <div className="px-2 py-5 text-center">
            <p className="text-[23px] font-bold tracking-[-0.04em] text-slate-800">{chosenCost || "—"}</p>
            <p className="mt-1 text-[11px] text-slate-400">Chosen cost</p>
          </div>
        </div>

        <p className="px-5 pb-4 pt-3 text-center text-[11px] leading-4 text-slate-400">
          Estimated from public post engagement. Official LinkedIn Analytics
          data is unavailable.
        </p>
      </div>
    </div>
  )
}
