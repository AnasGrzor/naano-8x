"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Bell, CreditCard, LogOut } from "lucide-react"
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
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    await authClient.signOut()
    // Refresh so server components drop the previous user's data immediately.
    router.replace("/sign-in")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-end gap-2 border-b border-border bg-background px-8">
      <div className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-foreground">
        <CreditCard className="size-4 text-muted-foreground" aria-hidden="true" />
        €0
      </div>

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

      <button
        type="button"
        aria-label="Notifications"
        className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Bell className="size-[18px]" aria-hidden="true" />
      </button>

      {isPending ? null : session?.user ? (
        <div className="flex items-center gap-2">
          <Avatar>
            {session.user.image ? (
              <AvatarImage
                src={session.user.image}
                alt={session.user.name || session.user.email}
              />
            ) : null}
            <AvatarFallback>
              {initialsOf(session.user.name, session.user.email)}
            </AvatarFallback>
            <AvatarBadge className="bg-emerald-500" />
          </Avatar>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            aria-label="Sign out"
            title="Sign out"
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
          >
            <LogOut className="size-[18px]" aria-hidden="true" />
          </button>
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
