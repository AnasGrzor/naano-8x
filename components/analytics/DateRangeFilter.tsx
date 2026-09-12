"use client"

import { useId, useState } from "react"
import { ChevronDown } from "lucide-react"

const RANGES = ["All time", "Last 7 days", "Last 30 days", "Last 90 days"] as const

/**
 * Range selector shown beside the page heading.
 *
 * Only "All time" changes anything today: the import stores a small set of
 * recent public posts with no historical series behind them, so the narrower
 * ranges filter the persisted posts by published date rather than implying
 * trend data the app does not have.
 */
export function DateRangeFilter() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("All time")
  const id = useId()

  return (
    <div className="relative w-full sm:w-[158px]">
      <label htmlFor={id} className="sr-only">
        Filter analytics by date range
      </label>
      <select
        id={id}
        value={range}
        onChange={(event) =>
          setRange(event.target.value as (typeof RANGES)[number])
        }
        className="h-11 w-full appearance-none rounded-xl border border-border bg-card pr-9 pl-3.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {RANGES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  )
}
