"use client"

import { useState } from "react"
import { Link2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { LinkedInImportResult } from "@/lib/linkedin"

type ImportStatus = "idle" | "loading" | "success" | "empty" | "error"

type LinkedInImportPanelProps = {
  onImported: (result: LinkedInImportResult) => void
}

export function LinkedInImportPanel({ onImported }: LinkedInImportPanelProps) {
  const [profileUrl, setProfileUrl] = useState("")
  const [status, setStatus] = useState<ImportStatus>("idle")
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("loading")
    setMessage(null)

    try {
      const res = await fetch("/api/linkedin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileUrl }),
      })

      const data = await res.json()

      if (res.status === 422) {
        setStatus("empty")
        setMessage(data.error ?? "No public profile data was found.")
        return
      }

      if (!res.ok) {
        setStatus("error")
        setMessage(data.error ?? "Something went wrong importing this profile.")
        return
      }

      setStatus("success")
      setMessage(null)
      onImported(data as LinkedInImportResult)
    } catch {
      setStatus("error")
      setMessage("Network error. Please try again.")
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        <Link2 className="size-3.5" aria-hidden="true" />
        Import LinkedIn profile
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="url"
          required
          placeholder="https://www.linkedin.com/in/username"
          value={profileUrl}
          onChange={(event) => setProfileUrl(event.target.value)}
          aria-label="Public LinkedIn profile URL"
        />
        <Button type="submit" disabled={status === "loading"} className="shrink-0">
          {status === "loading" ? (
            <>
              <Loader2 className="animate-spin" data-icon="inline-start" />
              Importing…
            </>
          ) : (
            "Import"
          )}
        </Button>
      </form>

      {status === "success" && (
        <p className="text-xs text-success">Profile imported successfully.</p>
      )}
      {status === "empty" && (
        <p className="text-xs text-muted-foreground">{message}</p>
      )}
      {status === "error" && (
        <p className="text-xs text-destructive">{message}</p>
      )}

      <p className="text-xs text-muted-foreground">
        Only public LinkedIn data is imported. Use imported data in line with
        LinkedIn&apos;s terms and applicable privacy laws.
      </p>
    </div>
  )
}
