"use client"

import { useState } from "react"
import { Bell, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Topbar() {
  const [locale, setLocale] = useState<"EN" | "FR">("EN")

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

      <Avatar>
        <AvatarImage src="/avatar.jpg" alt="Anas Khalid" />
        <AvatarFallback>AK</AvatarFallback>
        <AvatarBadge className="bg-emerald-500" />
      </Avatar>
    </header>
  )
}
