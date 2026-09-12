import { redirect } from "next/navigation"

import { AuthForm } from "@/components/AuthForm"
import { requireViewer } from "@/lib/db/owner"

export const metadata = { title: "Sign in · Naano-8x" }

export default async function SignInPage() {
  if (await requireViewer()) redirect("/")

  return (
    <main>
      <h1 className="text-[26px] leading-8 font-bold tracking-[-0.03em] text-foreground">
        Welcome back
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">Sign in to your account</p>
      <AuthForm mode="sign-in" />
    </main>
  )
}
