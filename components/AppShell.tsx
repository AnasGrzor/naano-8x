"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"

import { Sidebar } from "@/components/Sidebar"

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAuthRoute = pathname === "/sign-in" || pathname === "/sign-up"

  if (isAuthRoute) return <>{children}</>

  return (
    <div className="flex min-h-svh w-full">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col pb-24">{children}</div>
    </div>
  )
}
