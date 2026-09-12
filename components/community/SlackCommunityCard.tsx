import { Check } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const BENEFITS = [
  "Get feedback before you publish",
  "Share campaign tips that work",
  "Talk directly with the Naano team",
] as const

// Placeholder faces for the community preview strip — no member roster is
// wired up yet.
const MEMBER_AVATARS = [
  "https://i.pravatar.cc/64?img=12",
  "https://i.pravatar.cc/64?img=32",
  "https://i.pravatar.cc/64?img=47",
  "https://i.pravatar.cc/64?img=5",
  "https://i.pravatar.cc/64?img=68",
]

const SLACK_INVITE_URL = "https://naano.com/slack"

export function SlackCommunityCard() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start gap-4">
        <div className="flex size-[72px] shrink-0 items-center justify-center rounded-2xl bg-[#f7f5f2]">
          <svg viewBox="0 0 122.8 122.8" className="size-9" aria-hidden="true">
            <path
              d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9z"
              fill="#e01e5a"
            />
            <path
              d="M32.3 77.6c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"
              fill="#e01e5a"
            />
            <path
              d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2z"
              fill="#36c5f0"
            />
            <path
              d="M45.2 32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"
              fill="#36c5f0"
            />
            <path
              d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2z"
              fill="#2eb67d"
            />
            <path
              d="M90.5 45.2c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"
              fill="#2eb67d"
            />
            <path
              d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9z"
              fill="#ecb22e"
            />
            <path
              d="M77.6 90.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"
              fill="#ecb22e"
            />
          </svg>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            Naano creators on Slack
          </p>
          <h2 className="mt-1 text-lg leading-6 font-bold text-foreground">
            The room where B2B creators get better together.
          </h2>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex -space-x-2">
              {MEMBER_AVATARS.map((src, index) => (
                <Avatar key={src} className="size-6 border-2 border-card">
                  <AvatarImage src={src} alt="" />
                  <AvatarFallback className="text-[10px]">
                    {index + 1}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <p className="text-sm leading-5 text-muted-foreground">
              Ask for feedback on a sponsored post, compare campaign lessons,
              meet creators in your language and help shape what Naano builds
              next.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <ul className="flex flex-col gap-2.5">
          {BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2.5 text-sm text-foreground">
              <span
                aria-hidden="true"
                className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
              >
                <Check className="size-2.5" strokeWidth={3} />
              </span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <a
        href={SLACK_INVITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
      >
        <span className="flex items-center gap-2">
          <svg viewBox="0 0 122.8 122.8" className="size-4" aria-hidden="true">
            <path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9z" fill="#e01e5a" />
            <path d="M32.3 77.6c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#e01e5a" />
            <path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2z" fill="#36c5f0" />
            <path d="M45.2 32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36c5f0" />
            <path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2z" fill="#2eb67d" />
            <path d="M90.5 45.2c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2eb67d" />
            <path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9z" fill="#ecb22e" />
            <path d="M77.6 90.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ecb22e" />
          </svg>
          Join the Slack community
        </span>
        <svg
          viewBox="0 0 24 24"
          className="size-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <path d="M15 3h6v6" />
          <path d="M10 14 21 3" />
        </svg>
      </a>
    </div>
  )
}
