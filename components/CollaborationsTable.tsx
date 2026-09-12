"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const COLUMNS = [
  "Brand",
  "Campaign",
  "Status",
  "Performance",
  "Next action",
  "Due date",
  "Your net",
] as const

const TABS = [
  "All",
  "Active",
  "Needs action",
  "Applications sent",
  "Declined",
  "Completed",
] as const

type Tab = (typeof TABS)[number]

// No collaboration yet ships with data, so every tab reads zero until brand
// invitations and accepted applications start landing.
const TAB_COUNTS: Record<Tab, number> = {
  All: 0,
  Active: 0,
  "Needs action": 0,
  "Applications sent": 0,
  Declined: 0,
  Completed: 0,
}

export function CollaborationsTable() {
  const [activeTab, setActiveTab] = useState<Tab>("All")

  return (
    <div>
      <div className="flex items-center gap-6 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex items-center gap-2 border-b-2 pb-3 text-sm font-medium transition-colors",
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
            <span
              className={cn(
                "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {TAB_COUNTS[tab]}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs font-medium text-muted-foreground">
                {COLUMNS.map((column) => (
                  <th key={column} scope="col" className="px-4 py-3 font-medium">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  No collaborations yet. Brand invitations and your accepted
                  applications land here.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-sm text-muted-foreground">
            {TAB_COUNTS[activeTab]} collaborations
          </p>
          <div className="flex items-center gap-1">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-sm font-medium text-primary">
              1
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
