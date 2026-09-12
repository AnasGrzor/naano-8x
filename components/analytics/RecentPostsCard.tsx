import { ArrowUpRight, Heart, MessageCircle, Repeat2 } from "lucide-react"
import type { NormalizedPost } from "@/lib/linkedin"

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})

/** Formats a persisted ISO date, returning null when it is missing or invalid. */
function formatPublishedAt(value: string | null): string | null {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : dateFormatter.format(parsed)
}

function MetricItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Heart
  label: string
  value: number | null
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      <span>
        {value === null ? "—" : value}
        <span className="sr-only"> {label}</span>
      </span>
      <span aria-hidden="true" className="hidden sm:inline">
        {label}
      </span>
    </span>
  )
}

export function RecentPostsCard({ posts }: { posts: NormalizedPost[] }) {
  return (
    <section
      aria-labelledby="recent-posts-heading"
      className="flex min-h-[264px] flex-col rounded-[18px] border border-border bg-card p-[22px]"
    >
      <header>
        <h2
          id="recent-posts-heading"
          className="text-[15px] leading-6 font-semibold text-foreground"
        >
          Recent LinkedIn posts
        </h2>
        <p className="mt-1 text-[12px] leading-4 text-muted-foreground">
          Open the original post on LinkedIn.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 text-center">
          <p className="text-[14px] leading-5 font-semibold text-foreground">
            Public post import in progress
          </p>
          <p className="mt-1.5 text-[12px] leading-4 text-muted-foreground">
            The first public LinkedIn posts will appear here automatically.
          </p>
        </div>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {posts.map((post) => {
            const publishedAt = formatPublishedAt(post.publishedAt)

            return (
              <li
                key={post.id}
                className="rounded-2xl border border-border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 line-clamp-3 text-[13px] leading-5 text-foreground">
                    {post.text ?? "This post has no text content."}
                  </p>

                  {post.url ? (
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                      <span className="sr-only">
                        Open this post on LinkedIn (opens in a new tab)
                      </span>
                    </a>
                  ) : null}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-muted-foreground">
                  {publishedAt ? (
                    <time dateTime={post.publishedAt ?? undefined}>
                      {publishedAt}
                    </time>
                  ) : null}
                  <MetricItem icon={Heart} label="reactions" value={post.reactions} />
                  <MetricItem
                    icon={MessageCircle}
                    label="comments"
                    value={post.comments}
                  />
                  <MetricItem icon={Repeat2} label="reposts" value={post.shares} />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
