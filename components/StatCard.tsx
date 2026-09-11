import type { LucideIcon } from "lucide-react"

type StatCardProps = {
  icon: LucideIcon
  label: string
  value: string
  caption: string
}

export function StatCard({ icon: Icon, label, value, caption }: StatCardProps) {
  return (
    <div className="flex min-h-[110px] flex-col justify-center gap-1.5 rounded-2xl border border-border bg-card px-5 py-4">
      <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </div>
      <div className="text-2xl leading-tight font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{caption}</div>
    </div>
  )
}
