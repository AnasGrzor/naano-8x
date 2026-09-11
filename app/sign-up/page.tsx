import { redirect } from "next/navigation"

import { AuthForm } from "@/components/AuthForm"
import { requireViewer } from "@/lib/db/owner"

export const metadata = { title: "Sign up · Naano-8x" }

export default async function SignUpPage() {
  if (await requireViewer()) redirect("/")

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Create your account
      </h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        Start building your creator workspace.
      </p>
      <AuthForm mode="sign-up" />
    </main>
  )
}
