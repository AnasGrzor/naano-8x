import Link from "next/link"

const COLUMNS = ["Brand", "Status", "Next action", "Due", "Net"] as const

export function ActiveCollaborationsCard() {
  return (
    <div className="flex flex-col self-start rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Active collaborations
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Everything currently moving from brief to publication.
          </p>
        </div>
        <Link
          href="/collaborations"
          className="shrink-0 text-sm font-medium text-primary hover:underline"
        >
          See all
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {COLUMNS.map((column) => (
                <th key={column} scope="col" className="pb-2 pr-4 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={COLUMNS.length}
                className="py-6 text-center text-sm text-muted-foreground"
              >
                No active collaborations.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
