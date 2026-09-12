import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  Camera,
  Eye,
  EyeOff,
  GripVertical,
  HelpCircle,
  Pencil,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { NormalizedProfile } from "@/lib/linkedin"

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
})

/** Formats a persisted ISO date as e.g. "Sep 11", or null when unavailable. */
function formatShortDate(value: string | null): string | null {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : dateFormatter.format(parsed)
}

const numberFormatter = new Intl.NumberFormat("en-US")

function formatFollowers(value: number | null): string {
  return value === null ? "—" : numberFormatter.format(value)
}

function initialsOf(name: string | null): string {
  if (!name) return "—"
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const initials = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")
  return initials ? initials.toUpperCase() : "—"
}

type SectionCardProps = {
  title: string
  action?: ReactNode
  children: ReactNode
}

/** Draggable-looking section card shell shared by About, Audience, Pricing. */
function SectionCard({ title, action, children }: SectionCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <GripVertical
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground/50"
          />
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {action}
          <button
            type="button"
            aria-label={`Hide ${title} section`}
            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <EyeOff className="size-[15px]" aria-hidden="true" />
          </button>
        </div>
      </div>
      {children}
    </div>
  )
}

type ProfileEditViewProps = {
  profile: NormalizedProfile | null
  pricePerPost: string
  bundle: string
  onPricingChange: (pricing: { pricePerPost: string; bundle: string }) => void
}

export function ProfileEditView({
  profile,
  pricePerPost,
  bundle,
  onPricingChange,
}: ProfileEditViewProps) {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null)
  const [pricingEditing, setPricingEditing] = useState(false)
  const name = profile?.name ?? null
  const headline = profile?.headline ?? null
  const about = profile?.about ?? null
  const location = profile?.location ?? null
  const followers = profile?.followers ?? null
  const skills = profile?.skills ?? []
  const lastUpdate = formatShortDate(profile?.updatedAt ?? null)
  const hasProfile = Boolean(profile)

  async function handleRefresh() {
    if (!profile?.profileUrl || isRefreshing) return

    setIsRefreshing(true)
    setRefreshMessage(null)

    try {
      const response = await fetch("/api/linkedin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileUrl: profile.profileUrl }),
      })
      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null

      if (!response.ok) {
        throw new Error(data?.error ?? "Could not refresh the LinkedIn profile.")
      }

      setRefreshMessage("Profile refreshed successfully.")
      router.refresh()
    } catch (error) {
      setRefreshMessage(
        error instanceof Error
          ? error.message
          : "Could not refresh the LinkedIn profile."
      )
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
      {/* Left column: the editable card content itself. */}
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <Avatar className="size-16">
                  {profile?.avatarUrl ? (
                    <AvatarImage src={profile.avatarUrl} alt={name ?? "Profile photo"} />
                  ) : null}
                  <AvatarFallback className="text-base font-semibold">
                    {initialsOf(name)}
                  </AvatarFallback>
                </Avatar>
                <span
                  aria-hidden="true"
                  className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full border-2 border-card bg-muted text-muted-foreground"
                >
                  <Camera className="size-3" />
                </span>
              </div>

              <div className="min-w-0 pt-0.5">
                <h2 className="text-lg font-bold text-foreground">
                  {name ?? "—"}
                </h2>
                <button
                  type="button"
                  className="mt-1.5 inline-flex h-7 items-center rounded-full border border-border px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  Change profile photo
                </button>
                <p className="mt-2 max-w-[560px] text-sm leading-5 text-muted-foreground">
                  {headline ?? "Not added yet"}
                </p>
                {lastUpdate ? (
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    Synced {lastUpdate}
                    <HelpCircle className="size-3" aria-hidden="true" />
                  </p>
                ) : null}
              </div>
            </div>

            <Badge
              variant="outline"
              className="h-6 gap-1.5 rounded-full border-border px-2.5 text-[11px] font-medium text-muted-foreground"
            >
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-muted-foreground/60"
              />
              Private marketplace card
            </Badge>
          </div>

          <div className="mt-5">
            <p className="text-2xl leading-8 font-bold text-foreground">
              {formatFollowers(followers)}
            </p>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Followers
            </p>
          </div>
        </div>

        <SectionCard
          title="About"
          action={
            <button
              type="button"
              aria-label="Edit About section"
              className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <Pencil className="size-[15px]" aria-hidden="true" />
            </button>
          }
        >
          {about ? (
            <p className="text-sm leading-6 whitespace-pre-line text-foreground">
              {about}
            </p>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">
              Not added yet.
            </p>
          )}

          {skills.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {skills.slice(0, 8).map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="rounded-full px-2.5 py-1 text-xs font-medium"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          ) : null}
        </SectionCard>

        <SectionCard title="Audience & average metrics">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border px-4 py-3">
              <p className="text-xl leading-7 font-bold text-foreground">
                {formatFollowers(followers)}
              </p>
              <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                Followers
              </p>
            </div>
            <div className="rounded-xl border border-border px-4 py-3">
              <p className="text-xl leading-7 font-bold text-foreground">
                {location ?? "—"}
              </p>
              <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                Based in
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Pricing">
          {pricingEditing ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="price-per-post" className="text-xs font-medium text-muted-foreground">
                    Price per post
                  </label>
                  <Input
                    id="price-per-post"
                    value={pricePerPost}
                    onChange={(event) =>
                      onPricingChange({ pricePerPost: event.target.value, bundle })
                    }
                    placeholder="€240"
                    className="mt-1.5 h-11"
                  />
                </div>
                <div>
                  <label htmlFor="bundle" className="text-xs font-medium text-muted-foreground">
                    Bundle
                  </label>
                  <Input
                    id="bundle"
                    value={bundle}
                    onChange={(event) =>
                      onPricingChange({ pricePerPost, bundle: event.target.value })
                    }
                    placeholder="e.g. 3 posts · €600"
                    className="mt-1.5 h-11"
                  />
                </div>
              </div>
              <Button type="button" size="sm" onClick={() => setPricingEditing(false)}>
                Save price &amp; bundles
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border px-4 py-3.5">
                  <p className="text-lg leading-7 font-bold text-foreground">{pricePerPost || "—"}</p>
                  <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                    Price per post
                  </p>
                </div>
                <div className="rounded-xl border border-border px-4 py-3.5">
                  <p className="text-lg leading-7 font-bold text-foreground">{bundle || "None set"}</p>
                  <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                    Bundle
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3.5"
                onClick={() => setPricingEditing(true)}
              >
                Edit price &amp; bundles
              </Button>
            </>
          )}
        </SectionCard>
      </div>

      {/* Right column: LinkedIn sync status and section management. */}
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-start gap-2.5">
            <span
              aria-hidden="true"
              className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
            >
              <ShieldCheck className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                LinkedIn data
              </p>
              <p className="text-xs text-muted-foreground">
                {hasProfile ? "Public profile · unverified" : "Not connected yet"}
              </p>
            </div>
          </div>

          {lastUpdate ? (
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Last update</span>
              <span className="font-medium text-foreground">{lastUpdate}</span>
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={!profile?.profileUrl || isRefreshing}
            className="mt-3 flex w-full items-center gap-1.5 rounded-lg border border-border px-2.5 py-2 text-xs font-medium text-primary transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={isRefreshing ? "size-3.5 animate-spin" : "size-3.5"}
              aria-hidden="true"
            />
            {isRefreshing ? "Refreshing…" : "Refresh profile and followers"}
          </button>

          {refreshMessage ? (
            <p
              role="status"
              className="mt-2 text-[11px] leading-4 text-muted-foreground"
            >
              {refreshMessage}
            </p>
          ) : null}

          <p className="mt-2.5 text-[11px] leading-4 text-muted-foreground">
            Available once a week. Updates your profile and followers, not
            your post history. Naano collaboration posts are added
            automatically after their published link.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-sm font-semibold text-foreground">
            Become Naano Verified
          </p>
          <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
            Public profile refresh is fine for basic card data. To unlock
            Naano Verified analytics, connect with the Naano browser
            extension.
          </p>
          <Button type="button" size="sm" className="mt-3 w-full gap-1.5">
            <Sparkles className="size-3.5" data-icon="inline-start" />
            Use the extension
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full justify-between rounded-2xl border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
        >
          <span className="flex items-center gap-1.5">
            <Plus className="size-4" data-icon="inline-start" />
            Add a section
          </span>
        </Button>

        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Hidden sections
          </p>
          <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-muted-foreground">
            <Eye className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            Sections you hide move here. Click one to add it back.
          </p>
        </div>
      </div>
    </div>
  )
}
