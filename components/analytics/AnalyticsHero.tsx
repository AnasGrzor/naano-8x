import { cn } from "@/lib/utils"

type AnalyticsHeroProps = {
  /** True once at least one public post has been persisted for the viewer. */
  hasPosts: boolean
  /** Share of imported posts that carry engagement data, 0–100. */
  reachCoverage: number
}

export function AnalyticsHero({ hasPosts, reachCoverage }: AnalyticsHeroProps) {
  return (
    <section
      aria-labelledby="analytics-hero-heading"
      className="relative isolate overflow-hidden rounded-[18px] border border-primary/15 bg-[linear-gradient(105deg,var(--color-card)_0%,var(--color-card)_42%,oklch(0.965_0.021_255)_100%)]"
    >
      {/* Soft cloud texture on the right, drawn with layered radial gradients
          so the card needs no image asset or extra dependency. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-full max-w-[620px] opacity-70 [background:radial-gradient(60px_38px_at_78%_34%,oklch(1_0_0/0.95),transparent_70%),radial-gradient(86px_52px_at_86%_44%,oklch(1_0_0/0.9),transparent_72%),radial-gradient(70px_44px_at_68%_62%,oklch(1_0_0/0.75),transparent_70%),radial-gradient(120px_70px_at_96%_70%,oklch(0.93_0.03_248/0.7),transparent_75%)]"
      />

      <div className="flex flex-col gap-6 p-6 md:min-h-[162px] md:flex-row md:items-center md:justify-between md:gap-8 md:px-7 md:py-6">
        <div className="min-w-0 md:max-w-[720px]">
          <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            <span
              aria-hidden="true"
              className="size-[7px] shrink-0 rounded-full bg-success"
            />
            Public LinkedIn snapshot
          </p>

          <h2
            id="analytics-hero-heading"
            className="mt-2.5 text-[24px] leading-8 font-bold tracking-tight text-balance text-foreground sm:text-[30px] sm:leading-10"
          >
            {hasPosts
              ? "Public LinkedIn posts are imported"
              : "Public LinkedIn posts are being imported"}
          </h2>

          <p className="mt-2 text-[13px] leading-5 text-muted-foreground">
            {hasPosts
              ? "The profile is ready. Figures below come from the public posts saved for this profile."
              : "The profile is ready. Post history and reach will appear after the public-data job completes."}
          </p>
        </div>

        <div
          className={cn(
            // Stacked and full-width on mobile; a fixed-width column with a
            // divider only once it sits beside the heading.
            "min-w-0 border-t border-primary/10 pt-5",
            "md:shrink-0 md:min-w-[236px] md:border-t-0 md:border-l md:pt-0 md:pl-8"
          )}
        >
          <p className="text-[30px] leading-9 font-bold tracking-tight text-foreground">
            {reachCoverage}%
          </p>
          <p className="mt-1 text-[12px] leading-4 text-muted-foreground">
            of imported posts include reach data
          </p>

          <p
            className={cn(
              "mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5",
              "text-[12px] font-medium text-foreground"
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "size-[7px] shrink-0 rounded-full",
                hasPosts ? "bg-success" : "bg-success/70"
              )}
            />
            {hasPosts ? "Import complete" : "Import in progress"}
          </p>
        </div>
      </div>
    </section>
  )
}
