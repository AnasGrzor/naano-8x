"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Bell, CreditCard, LayoutGrid, Link2, LogOut, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authClient, useSession } from "@/lib/auth-client"

/** Initials shown when the account has no avatar image. */
function initialsOf(name: string | null | undefined, email: string): string {
  const source = name?.trim() || email
  const parts = source.split(/[s@._-]+/).filter(Boolean)
  return (parts[0]?.[0] ?? "?").concat(parts[1]?.[0] ?? "").toUpperCase()
}

export function Topbar() {
  const [locale, setLocale] = useState<"EN" | "FR">("EN")
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [signingOut, setSigningOut] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!session?.user) return

    let cancelled = false
    fetch("/api/profile/avatar")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { avatarUrl?: string | null } | null) => {
        if (!cancelled && data?.avatarUrl) setProfileImage(data.avatarUrl)
      })
      .catch(() => undefined)

    return () => {
      cancelled = true
    }
  }, [session?.user])

  useEffect(() => {
    if (!menuOpen) return

    function handlePointerDown(event: PointerEvent) {
      if (
        !menuRef.current?.contains(event.target as Node) &&
        !notificationsRef.current?.contains(event.target as Node)
      ) {
        setMenuOpen(false)
        setNotificationsOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [menuOpen])

  async function handleSignOut() {
    setSigningOut(true)
    await authClient.signOut()
    // Refresh so server components drop the previous user's data immediately.
    router.replace("/sign-in")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-end gap-2 border-b border-border bg-background px-8">
      <button
        type="button"
        aria-label="Open earnings"
        onClick={() => router.push("/earnings")}
        className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        <CreditCard className="size-4 text-muted-foreground" aria-hidden="true" />
        €0
      </button>

      <div className="flex items-center rounded-full border border-border p-0.5 text-sm font-medium">
        {(["EN", "FR"] as const).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => setLocale(lang)}
            aria-pressed={locale === lang}
            className={cn(
              "rounded-full px-2.5 py-1 transition-colors",
              locale === lang
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {lang}
          </button>
        ))}
      </div>

      <div ref={notificationsRef} className="relative">
        <button
          type="button"
          aria-label="Notifications"
          aria-expanded={notificationsOpen}
          onClick={() => {
            setNotificationsOpen((open) => !open)
            setMenuOpen(false)
          }}
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell className="size-[18px]" aria-hidden="true" />
        </button>

        {notificationsOpen ? (
          <div className="absolute top-[calc(100%+10px)] right-0 z-50 h-[260px] w-[376px] overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_32px_-14px_rgba(15,23,42,0.35)]">
            <div className="flex h-14 items-center gap-3 border-b border-border px-4">
              <span className="flex size-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 text-primary">
                <Bell className="size-[18px]" aria-hidden="true" />
              </span>
              <h2 className="text-base font-bold text-foreground">Notifications</h2>
            </div>
            <div className="flex h-[204px] flex-col items-center justify-center px-5 text-center">
              <span className="flex size-6 items-center justify-center rounded-full border-2 border-slate-300 text-slate-400">
                <span className="text-[13px] leading-none">✓</span>
              </span>
              <p className="mt-3 text-sm font-bold text-foreground">You’re all caught up</p>
              <p className="mt-1 text-xs text-muted-foreground">
                New activity on your collaborations will show up here.
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {isPending ? null : session?.user ? (
        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-label="Open account menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <Avatar>
              {profileImage || session.user.image ? (
                <AvatarImage
                  src={profileImage || session.user.image || undefined}
                  alt={session.user.name || session.user.email}
                />
              ) : null}
              <AvatarFallback>
                {initialsOf(session.user.name, session.user.email)}
              </AvatarFallback>
              <AvatarBadge className="bg-emerald-500" />
            </Avatar>
          </button>

          {menuOpen ? (
            <div className="absolute top-[calc(100%+8px)] right-0 z-50 w-[248px] rounded-2xl border border-border bg-card p-2 shadow-[0_10px_28px_-12px_rgba(15,23,42,0.35)]">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  router.push("/integrations")
                }}
                className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm text-foreground transition-colors hover:bg-muted"
              >
                <Link2 className="size-[18px] text-muted-foreground" aria-hidden="true" />
                Integrations
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  router.push("/settings")
                }}
                className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm text-foreground transition-colors hover:bg-muted"
              >
                <Settings className="size-[18px] text-muted-foreground" aria-hidden="true" />
                Settings
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  router.push("/card?tour=1&step=1")
                }}
                className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm text-foreground transition-colors hover:bg-muted"
              >
                <LayoutGrid className="size-[18px] text-muted-foreground" aria-hidden="true" />
                Guided tour
              </button>

              <div className="my-2 h-px bg-border" />

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm text-foreground transition-colors hover:bg-muted disabled:opacity-50"
              >
                <LogOut className="size-[18px] text-muted-foreground" aria-hidden="true" />
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <Link
          href="/sign-in"
          className="rounded-full border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Sign in
        </Link>
      )}
    </header>
  )
}
