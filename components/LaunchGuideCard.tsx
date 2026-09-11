import Link from "next/link"
import { Check, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function LaunchGuideCard() {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Your launch guide
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            1 of 1 steps complete
          </p>
        </div>
        <Link
          href="/card"
          className="text-sm font-medium text-primary hover:underline"
        >
          Open card
        </Link>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-border p-3">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground">
          <Check className="size-3.5" aria-hidden="true" strokeWidth={3} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">
            Card and price ready
          </p>
          <p className="truncate text-xs text-muted-foreground">
            Your positioning and offer are ready to review.
          </p>
        </div>
        <Badge className="bg-success/10 text-success">Complete</Badge>
        <ChevronRight
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
