import Image from "next/image"
import type { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <section className="flex min-h-svh justify-center bg-white px-6 py-10 sm:px-10">
        <div className="w-full max-w-[448px] pt-20 sm:pt-24">
          <div className="mb-10 flex items-center justify-between">
            <Image
              src="https://naano.com/lp/naano-logomark.png"
              alt="naano"
              width={34}
              height={34}
              className="size-8 object-contain"
            />
            <span className="text-sm font-medium text-foreground">◎ EN</span>
          </div>
          {children}
        </div>
      </section>

      <aside className="hidden min-h-svh items-center bg-[#2864e9] px-16 text-white lg:flex">
        <div className="mx-auto max-w-[390px]">
          <h2 className="text-[34px] leading-tight font-bold tracking-[-0.04em]">
            Welcome back.
          </h2>
          <p className="mt-4 text-lg leading-7 text-white/90">
            Sign in to manage your campaigns, creators and payouts, all in one place.
          </p>
        </div>
      </aside>
    </div>
  )
}
