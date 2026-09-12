type MonthlyEarning = {
  month: string
  amount: number
}

type EarningsChartProps = {
  months: MonthlyEarning[]
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Flat bar chart for the last six months of net earnings. Every bar keeps a
 * visible minimum height even at €0 so the axis stays legible with no data.
 */
export function EarningsChart({ months }: EarningsChartProps) {
  const total = months.reduce((sum, month) => sum + month.amount, 0)
  const max = Math.max(1, ...months.map((month) => month.amount))
  const latestMonth = months[months.length - 1]?.month

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Earnings over time
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Net collaboration earnings from the last six months.
          </p>
        </div>
        <p className="shrink-0 text-sm text-muted-foreground">
          {formatCurrency(total)} over {months.length} months
        </p>
      </div>

      <div className="mt-6 grid grid-cols-6 items-end gap-3 sm:gap-4">
        {months.map((month) => {
          const isCurrent = month.month === latestMonth
          const heightPercent = Math.max(
            8,
            Math.round((month.amount / max) * 100)
          )

          return (
            <div key={month.month} className="flex flex-col items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {formatCurrency(month.amount)}
              </span>
              <div className="flex h-40 w-full items-end">
                <div
                  className={
                    "w-full rounded-t-md border-b-2 " +
                    (isCurrent
                      ? "border-primary bg-primary/10"
                      : "border-primary/40 bg-muted")
                  }
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <span
                className={
                  "text-xs font-medium " +
                  (isCurrent ? "text-primary" : "text-muted-foreground")
                }
              >
                {month.month}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
