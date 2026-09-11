"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutGrid,
  IdCard,
  Store,
  Layers,
  LineChart,
  Users,
  Wallet,
  Percent,
  MessageCircle,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Image from "next/image"

type NavItem = {
  label: string
  href: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { label: "Overview", href: "/", icon: LayoutGrid },
  { label: "My card", href: "/card", icon: IdCard },
  { label: "Opportunities", href: "/opportunities", icon: Store },
  { label: "Collaborations", href: "/collaborations", icon: Layers },
  { label: "Analytics", href: "/analytics", icon: LineChart },
  { label: "Community", href: "/community", icon: Users },
  { label: "Earnings", href: "/earnings", icon: Wallet },
  { label: "Affiliate program", href: "/affiliate", icon: Percent },
  { label: "Messages", href: "/messages", icon: MessageCircle },
]

export function Sidebar() {
  const [hovered, setHovered] = useState(false)
  const [locked, setLocked] = useState(false)
  const asideRef = useRef<HTMLElement>(null)
  const pathname = usePathname()

  const expanded = hovered || locked

  useEffect(() => {
    if (!locked) return

    function handlePointerDown(e: PointerEvent) {
      if (!asideRef.current) return
      if (!asideRef.current.contains(e.target as Node)) {
        setLocked(false)
        setHovered(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [locked])

  return (
    <aside
      ref={asideRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "sticky top-0 z-40 flex h-svh shrink-0 flex-col overflow-hidden border-r border-border bg-background transition-[width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
        expanded ? "w-64" : "w-[72px]",
      )}
    >
      <div className="flex h-16 shrink-0 items-center overflow-hidden border-b border-border px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-foreground text-background">
            <Image
              src="https://naano.com/lp/naano-logomark.png"
              alt="naano"
              width={24}
              height={24}
            />
          </span>
          <span
            className={cn(
              "truncate text-base font-semibold whitespace-nowrap transition-[opacity,max-width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
              expanded ? "max-w-[10rem] opacity-100" : "max-w-0 opacity-0",
            )}
          >
            naano
          </span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <SidebarLink
            key={item.href}
            item={item}
            expanded={expanded}
            active={pathname === item.href}
            onNavigate={() => setLocked(true)}
          />
        ))}
      </nav>
    </aside>
  );
}

function SidebarLink({
  item,
  expanded,
  active,
  onNavigate,
}: {
  item: NavItem
  expanded: boolean
  active: boolean
  onNavigate: () => void
}) {
  const Icon = item.icon

  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-10 items-center gap-3 overflow-hidden rounded-lg px-1.5 text-sm font-medium transition-colors",
        active
          ? "text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors",
          active && "bg-primary/10"
        )}
      >
        <Icon className="size-[18px] shrink-0" aria-hidden="true" />
      </span>
      <span
        className={cn(
          "truncate whitespace-nowrap transition-[opacity,max-width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
          expanded ? "max-w-[10rem] opacity-100" : "max-w-0 opacity-0"
        )}
      >
        {item.label}
      </span>
    </Link>
  )

  if (expanded) return link

  return (
    <Tooltip>
      <TooltipTrigger render={link} />
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  )
}
