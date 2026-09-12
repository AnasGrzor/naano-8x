import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100svh-4rem)] flex-1 items-center justify-center bg-[oklch(0.982_0.003_265)] px-6 py-16">
      <section className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-[0_18px_45px_-30px_rgba(15,23,42,0.35)] sm:p-12">
        <p className="text-xs font-bold tracking-[0.14em] text-primary uppercase">
          Coming soon
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">
          This page is coming soon
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          We’re still preparing this part of Naano. Check back soon for the
          next update.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to dashboard
        </Link>
      </section>
    </main>
  )
}
