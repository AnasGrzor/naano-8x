"use client"

import { Sparkles, AudioLines } from "lucide-react"
import { Input } from "@/components/ui/input"

export function GlobalAIBar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex h-11 w-full max-w-md items-center gap-2 rounded-full border border-border bg-background/95 pr-1.5 pl-4 shadow-lg backdrop-blur-sm">
        <Sparkles className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <Input
          type="text"
          placeholder="What would you like to do?"
          className="h-full flex-1 rounded-full border-none bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
        <button
          type="button"
          aria-label="Voice input"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
        >
          <AudioLines className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
