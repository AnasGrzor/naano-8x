import { cn } from "@/lib/utils"

type SummaryRow = {
  label: string
  /** Persisted figure, or null when the value is genuinely unavailable. */
  value: number | null
  /** Track fill, 0–100. Derived from the row's own value, never invented. */
  fill: number
}

const numberFormatter = new Intl.NumberFormat("en-US")

function formatValue(value: number | null): string {
  return value === null ? "—" : numberFormatter.format(value)
}

export function ProfileSummaryCard({ rows }: { rows: SummaryRow[] }) {
  return (
    <section
      aria-labelledby="profile-summary-heading"
      className="flex flex-col rounded-[18px] border border-border bg-card p-[22px]"
    >
      <header>
        <h2
          id="profile-summary-heading"
          className="text-[15px] leading-6 font-semibold text-foreground"
        >
          Public profile summary
        </h2>
        <p className="mt-1 text-[12px] leading-4 text-muted-foreground">
          Automatically collected from public LinkedIn data.
        </p>
      </header>

      <dl className="mt-5 flex flex-col gap-[18px]">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-[13px] leading-5 text-muted-foreground">
                {row.label}
              </dt>
              <dd className="text-[13px] leading-5 font-semibold text-foreground">
                {formatValue(row.value)}
              </dd>
            </div>

            <div
              aria-hidden="true"
              className="mt-2.5 h-[5px] w-full overflow-hidden rounded-full bg-muted"
            >
              <div
                className={cn(
                  "h-full rounded-full bg-primary/40",
                  // An unfilled track stays flat rather than showing a stub of
                  // colour that would read as partial progress.
                  row.fill === 0 && "bg-transparent"
                )}
                style={{ width: `${row.fill}%` }}
              />
            </div>
          </div>
        ))}
      </dl>
    </section>
  )
}
