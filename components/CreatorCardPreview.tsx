import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IdCard, Copy, Share2 } from "lucide-react"
import type { NormalizedProfile } from "@/lib/linkedin"

type CreatorCardPreviewProps = {
  profile?: NormalizedProfile | null
}

export function CreatorCardPreview({ profile }: CreatorCardPreviewProps) {
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

      {profile ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-border p-4">
          <div className="flex items-center gap-3">
            <Avatar size="lg">
              {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={profile.name ?? "Profile photo"} />}
              <AvatarFallback>
                {(profile.name ?? "?").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {profile.name ?? "Unknown name"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {profile.headline ?? "No headline available"}
              </p>
            </div>
          </div>
          {profile.location && (
            <p className="text-xs text-muted-foreground">{profile.location}</p>
          )}
          {profile.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.slice(0, 6).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-[4/5] w-full animate-pulse rounded-2xl bg-muted" />
      )}
    </div>
  )
}
