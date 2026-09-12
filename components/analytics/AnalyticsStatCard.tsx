import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type AnalyticsStatCardProps = {
  icon: LucideIcon
  label: string
  value: string
  caption: string
  className?: string
}

/**
 * KPI tile used across the analytics grid: label and icon on the top row, the
 * value beneath it, and a short caption explaining where the number comes from.
 */
export function AnalyticsStatCard({
  icon: Icon,
  label,
  value,
  caption,
  className,
}: AnalyticsStatCardProps) {
  return (
    <article
      className={cn(
        "flex min-h-[126px] flex-col justify-center rounded-[18px] border border-border bg-card px-[18px] py-4 shadow-[0_1px_2px_0_oklch(0_0_0/0.04)]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[13px] leading-5 font-medium text-muted-foreground">
          {label}
        </h3>
        <span
          aria-hidden="true"
          className="flex size-7 shrink-0 items-center justify-center rounded-[9px] bg-primary/10 text-primary"
        >
          <Icon className="size-[15px]" />
        </span>
      </div>

      {/* A single line-height across every tile keeps the four values on a
          shared baseline, whatever their length. */}
      <p
        className={cn(
          "mt-2 leading-9 font-bold tracking-tight text-foreground",
          // "Pending" is a word, not a figure, so it reads a step down from
          // the numeric values it sits beside.
          value === "Pending" ? "text-[26px]" : "text-[30px]"
        )}
      >
        {value}
      </p>

      <p className="mt-1.5 text-[12px] leading-4 text-muted-foreground">
        {caption}
      </p>
    </article>
  )
}
