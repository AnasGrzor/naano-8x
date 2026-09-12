"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Building2, ChevronDown, ChevronRight, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authClient } from "@/lib/auth-client"
import type { NormalizedProfile } from "@/lib/linkedin"

type SettingsPanelProps = {
  profile: NormalizedProfile | null
}

function formatDate(value: string | null): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function SettingsPanel({ profile }: SettingsPanelProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("Profile")
  const [billingOpen, setBillingOpen] = useState(false)
  const [displayName, setDisplayName] = useState(profile?.name ?? "")
  const [xUrl, setXUrl] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const lastUpdated = formatDate(profile?.updatedAt ?? null)

  async function refreshProfile() {
    if (!profile?.profileUrl || isRefreshing) return
    setIsRefreshing(true)
    setMessage(null)

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
        throw new Error(data?.error ?? "Could not refresh your profile.")
      }
      setMessage("Profile refreshed successfully.")
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not refresh your profile.")
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="grid gap-7 lg:grid-cols-[220px_minmax(0,1fr)]">
      <nav aria-label="Settings sections" className="space-y-1">
        {["Profile", "Payments", "Account"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex h-11 w-full items-center rounded-xl px-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-primary/5 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <section className="rounded-2xl border border-border bg-card p-6 sm:p-7">
        {activeTab === "Profile" ? (
          <>
            <div className="mb-5 flex items-center gap-3">
              <Avatar className="size-11 border border-border">
                {profile?.avatarUrl ? (
                  <AvatarImage src={profile.avatarUrl} alt={profile.name ?? "Profile picture"} />
                ) : null}
                <AvatarFallback className="text-sm font-semibold">
                  {displayName.slice(0, 2).toUpperCase() || "—"}
                </AvatarFallback>
                <AvatarBadge className="bg-emerald-500" />
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">Profile picture</p>
                <p className="text-xs text-muted-foreground">Shown across your Naano account.</p>
              </div>
            </div>
            <h2 className="text-lg font-bold text-foreground">Personal profile</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              This name appears on your creator card, messages and collaborations.
            </p>

            <div className="mt-4">
              <label htmlFor="display-name" className="text-sm font-medium text-foreground">
                Display name
              </label>
              <div className="mt-1.5 flex gap-3">
                <Input
                  id="display-name"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Your name"
                  className="h-11"
                />
                <Button type="button" variant="outline" className="h-11 shrink-0">
                  Save name
                </Button>
              </div>
            </div>

            <div className="my-6 h-px bg-border" />

            <h2 className="text-lg font-bold text-foreground">Social links</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your public profile links.
            </p>

            <div className="mt-4">
              <label htmlFor="linkedin-url" className="text-sm font-medium text-foreground">
                LinkedIn
              </label>
              <div className="mt-1.5 flex gap-3">
                <Input
                  id="linkedin-url"
                  value={profile?.profileUrl ?? ""}
                  readOnly
                  placeholder="https://www.linkedin.com/in/your-profile"
                  className="h-11"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 shrink-0"
                  onClick={refreshProfile}
                  disabled={!profile?.profileUrl || isRefreshing}
                >
                  <RefreshCw className={isRefreshing ? "animate-spin" : undefined} data-icon="inline-start" />
                  {isRefreshing ? "Refreshing…" : "Refresh profile"}
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {lastUpdated
                  ? `Profile last updated: ${lastUpdated}. Refresh your profile, followers and authorized recent posts.`
                  : "Refresh your profile, followers and authorized recent posts."}
              </p>
              {message ? <p role="status" className="mt-1 text-xs text-muted-foreground">{message}</p> : null}
            </div>

            <div className="my-5 h-px bg-border" />

            <button type="button" className="flex items-center gap-1 text-sm font-medium text-primary">
              <ChevronRight className="size-4" aria-hidden="true" />
              Industries · {profile?.skills?.slice(0, 3).join(", ") || "Not added yet"}
            </button>

            <div className="mt-4">
              <label htmlFor="x-url" className="text-sm font-medium text-foreground">
                X (Twitter)
              </label>
              <Input
                id="x-url"
                value={xUrl}
                onChange={(event) => setXUrl(event.target.value)}
                placeholder="https://x.com/your-account"
                className="mt-1.5 h-11"
              />
            </div>

            <div className="mt-7 flex justify-end">
              <Button type="button" className="h-11 px-5">
                Save profile settings
              </Button>
            </div>
          </>
        ) : activeTab === "Payments" ? (
          <PaymentSettings
            billingOpen={billingOpen}
            onBillingToggle={() => setBillingOpen((open) => !open)}
          />
        ) : activeTab === "Account" ? (
          <AccountSettings isDeleting={isDeleting} onDeleteStart={() => setIsDeleting(true)} onDeleteEnd={() => setIsDeleting(false)} />
        ) : (
          <div className="flex min-h-[420px] items-center justify-center text-sm text-muted-foreground">
            Payments settings are not configured yet.
          </div>
        )}
      </section>
    </div>
  )
}

function AccountSettings({
  isDeleting,
  onDeleteStart,
  onDeleteEnd,
}: {
  isDeleting: boolean
  onDeleteStart: () => void
  onDeleteEnd: () => void
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  async function deleteAccount() {
    if (isDeleting) return
    const confirmed = window.confirm(
      "Delete your account and all associated data? This cannot be undone."
    )
    if (!confirmed) return

    onDeleteStart()
    setError(null)
    try {
      const response = await fetch("/api/account/delete", { method: "POST" })
      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null
      if (!response.ok) {
        throw new Error(data?.error ?? "Could not delete your account.")
      }

      await authClient.signOut().catch(() => undefined)
      router.replace("/sign-in")
      router.refresh()
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete your account."
      )
      onDeleteEnd()
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-7">
      <h2 className="text-lg font-bold text-red-500">Delete your account</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Permanently delete your creator account and all associated data. This cannot be undone.
      </p>
      <Button
        type="button"
        onClick={deleteAccount}
        disabled={isDeleting}
        className="mt-4 h-11 bg-red-500 px-4 font-bold text-white hover:bg-red-600"
      >
        {isDeleting ? "Deleting…" : "Delete my account"}
      </Button>
      {error ? <p className="mt-3 text-sm text-red-500" role="alert">{error}</p> : null}
    </div>
  )
}

function PaymentSettings({
  billingOpen,
  onBillingToggle,
}: {
  billingOpen: boolean
  onBillingToggle: () => void
}) {
  return (
    <div>
      <section>
        <h2 className="text-lg font-bold text-foreground">Company and billing</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete your billing details to receive payments.
        </p>

        <div className="my-4 h-px bg-border" />

        <button
          type="button"
          onClick={onBillingToggle}
          aria-expanded={billingOpen}
          className="flex items-center gap-1 text-sm font-semibold text-primary"
        >
          {billingOpen ? (
            <ChevronDown className="size-4" aria-hidden="true" />
          ) : (
            <ChevronRight className="size-4" aria-hidden="true" />
          )}
          Edit billing details
        </button>

        {billingOpen ? (
          <div className="mt-6 space-y-4 border-t border-border pt-5">
            <div>
              <label htmlFor="registration-country" className="text-sm font-medium text-foreground">
                Registration country
              </label>
              <Input id="registration-country" defaultValue="Pakistan" className="mt-1.5 h-12" />
            </div>

            <fieldset>
              <legend className="text-sm font-medium text-foreground">
                Do you have a registered business?
              </legend>
              <div className="mt-1.5 grid gap-3 sm:grid-cols-2">
                <label className="flex h-12 items-center gap-3 rounded-xl border border-border px-4 text-sm text-foreground">
                  <input type="radio" name="registered-business" className="size-4 accent-primary" />
                  Yes
                </label>
                <label className="flex h-12 items-center gap-3 rounded-xl border border-primary bg-primary/5 px-4 text-sm text-primary">
                  <input type="radio" name="registered-business" defaultChecked className="size-4 accent-primary" />
                  No
                </label>
              </div>
            </fieldset>

            <div>
              <label htmlFor="legal-name" className="text-sm font-medium text-foreground">
                Legal name
              </label>
              <Input id="legal-name" placeholder="Full name or company name" className="mt-1.5 h-12" />
            </div>

            <div>
              <label htmlFor="legal-address" className="text-sm font-medium text-foreground">
                Legal address
              </label>
              <Input id="legal-address" placeholder="Full billing address" className="mt-1.5 h-12" />
            </div>

            <label className="flex gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-4 text-sm leading-5 text-amber-900">
              <input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-primary" />
              <span>
                I confirm that I am solely responsible for declaring and paying taxes on this income to the tax authorities in my country.
              </span>
            </label>

            <label className="flex gap-3 rounded-xl border border-border px-4 py-4 text-sm leading-5 text-foreground">
              <input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-primary" />
              <span>
                I authorize Naano to issue invoices in my name and on my behalf for services delivered through the platform.
              </span>
            </label>

            <label className="flex gap-3 rounded-xl border border-border px-4 py-4 text-sm leading-5 text-foreground">
              <input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-primary" />
              <span>
                I certify that I am legally allowed to provide paid services in my country and that the information provided here is accurate.
              </span>
            </label>

            <Button type="button" className="h-12 w-full text-sm font-bold">
              Save my information
            </Button>
          </div>
        ) : null}
      </section>

      {!billingOpen ? (
        <>
          <div className="my-6 h-px bg-border" />
          <section>
            <h2 className="text-lg font-bold text-foreground">Bank details</h2>
            <p className="mt-1 text-sm text-muted-foreground">Your saved payout details.</p>
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-foreground">No bank details saved</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Add your details to receive bank transfers.</p>
              </div>
              <Button type="button" variant="outline" className="h-11 shrink-0">
                Edit
              </Button>
            </div>
          </section>
        </>
      ) : null}
    </div>
  )
}
