import { Button } from "@/components/ui/button"
import { IdCard, Copy, Share2 } from "lucide-react"

// TODO: Connect to profile API response
export function CreatorCardPreview() {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Your creator card
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This is how brands discover your positioning and collaboration
            offer.
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant="outline" size="sm">
          <IdCard data-icon="inline-start" />
          Open card
        </Button>
        <Button variant="outline" size="sm">
          <Copy data-icon="inline-start" />
          Copy card link
        </Button>
        <Button size="sm">
          <Share2 data-icon="inline-start" />
          Share my card
        </Button>
      </div>

      {/* Card data is populated once the public-profile import completes. */}
      <div className="aspect-[4/5] w-full animate-pulse rounded-2xl bg-muted" />
    </div>
  )
}
