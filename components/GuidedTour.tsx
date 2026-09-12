"use client"

import { Suspense } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type TourStep = {
  route: string
  title: string
  description: string
}

const steps: TourStep[] = [
  {
    route: "/card",
    title: "Your Marketplace card",
    description:
      "This is your private preview and editor. Keep your positioning, packs and price clear before sharing your card.",
  },
  {
    route: "/",
    title: "Your creator overview",
    description:
      "Start here to see your card, priority actions and active collaborations at a glance.",
  },
  {
    route: "/opportunities",
    title: "Open opportunities",
    description:
      "Browse open brand campaigns and apply to the opportunities that match your profile.",
  },
  {
    route: "/collaborations",
    title: "Your collaborations",
    description:
      "Track active brand collaborations, deliverables, messages and booking status in one place.",
  },
  {
    route: "/analytics",
    title: "Your analytics",
    description:
      "Review your public LinkedIn performance, audience signals and imported post data.",
  },
]

export function GuidedTour() {
  return (
    <Suspense fallback={null}>
      <GuidedTourContent />
    </Suspense>
  )
}

function GuidedTourContent() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const isTour = params.get("tour") === "1"
  const requestedStep = Number(params.get("step") ?? "1")
  const step = isTour && requestedStep >= 1 && requestedStep <= steps.length
    ? requestedStep
    : null

  if (!step) return null

  const current = steps[step - 1]
  const isLastStep = step === steps.length

  function closeTour() {
    router.replace(pathname)
  }

  function moveTo(nextStep: number) {
    const next = steps[nextStep - 1]
    router.push(`${next.route}?tour=1&step=${nextStep}`)
  }

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/45" aria-label="Guided tour">
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        className="fixed right-4 bottom-4 w-[min(390px,calc(100vw-2rem))] rounded-2xl border border-primary/20 bg-card p-5 shadow-[0_20px_55px_-18px_rgba(15,23,42,0.5)] sm:right-6 sm:bottom-6"
      >
        <div className="flex items-center justify-between text-[10px] font-bold tracking-wide text-muted-foreground uppercase">
          <span>Step {step} of {steps.length}</span>
          <button
            type="button"
            onClick={closeTour}
            className="text-xs normal-case tracking-normal text-muted-foreground hover:text-foreground"
          >
            Skip
          </button>
        </div>

        <h2 id="tour-title" className="mt-5 text-lg font-bold text-foreground">
          {current.title}
        </h2>
        <p className="mt-2 text-sm leading-5 text-muted-foreground">
          {current.description}
        </p>

        <div className="mt-4 flex items-center gap-1.5" aria-hidden="true">
          {steps.map((_, index) => (
            <span
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index + 1 === step ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/25"
              }`}
            />
          ))}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => moveTo(step - 1)}
              className="h-10 rounded-xl border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Back
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => (isLastStep ? closeTour() : moveTo(step + 1))}
            className="h-10 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85"
          >
            {isLastStep ? "Finish" : "Next"}
          </button>
        </div>
      </aside>
    </div>
  )
}
