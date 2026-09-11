"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertTriangle, X } from "lucide-react"

/**
 * Non-blocking banner for the `?notice=` query param set after signup when
 * account creation succeeded but the optional LinkedIn import failed. Clears
 * the param from the URL once shown so it doesn't reappear on refresh.
 */
export function DashboardNotice() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const notice = searchParams.get("notice")

  useEffect(() => {
    if (!notice) return

    const params = new URLSearchParams(searchParams.toString())
    params.delete("notice")
    const query = params.toString()
    router.replace(query ? `/?${query}` : "/", { scroll: false })
    // Only re-run when the param itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notice])

  if (!notice) return null

  return (
    <div
      role="status"
      className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-foreground"
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
      <p className="flex-1">{notice}</p>
      <button
        type="button"
        onClick={() => router.replace("/", { scroll: false })}
        aria-label="Dismiss"
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}
