"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { isValidLinkedInProfileUrl } from "@/lib/linkedin"

type Mode = "sign-in" | "sign-up"

type FieldErrors = {
  name?: string
  email?: string
  password?: string
  linkedinUrl?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Mirrors the Better Auth default of an 8 character minimum password. */
const MIN_PASSWORD_LENGTH = 8

function validate(mode: Mode, values: {
  name: string
  email: string
  password: string
  linkedinUrl: string
}): FieldErrors {
  const errors: FieldErrors = {}

  if (mode === "sign-up" && values.name.trim().length < 2) {
    errors.name = "Please enter your name (at least 2 characters)."
  }

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address."
  }

  if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
  }

  // Optional: only validated when the user actually typed something.
  if (
    mode === "sign-up" &&
    values.linkedinUrl.trim().length > 0 &&
    !isValidLinkedInProfileUrl(values.linkedinUrl.trim())
  ) {
    errors.linkedinUrl =
      "Enter a valid public LinkedIn profile URL (e.g. https://www.linkedin.com/in/username)."
  }

  return errors
}

/**
 * Email + password form for both sign-in and sign-up.
 *
 * All network calls go through the Better Auth client, never through a
 * hand-rolled fetch to the auth endpoints.
 */
export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter()
  const isSignUp = mode === "sign-up"

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const errors = validate(mode, { name, email, password, linkedinUrl })
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setPending(true)

    const { error } = isSignUp
      ? await authClient.signUp.email({
          name: name.trim(),
          email: email.trim(),
          password,
        })
      : await authClient.signIn.email({ email: email.trim(), password })

    if (error) {
      // Better Auth returns a safe, generic message; nothing server-internal
      // is surfaced here.
      setFormError(
        error.message ??
          (isSignUp
            ? "Could not create your account. Please try again."
            : "Invalid email or password.")
      )
      setPending(false)
      return
    }

    // The Better Auth account (and session cookie) now exists. Only after
    // that do we optionally kick off the LinkedIn import — Apify is never
    // called before the account exists or without an authenticated session.
    const trimmedLinkedinUrl = linkedinUrl.trim()
    let importWarning: string | null = null

    if (isSignUp && trimmedLinkedinUrl.length > 0) {
      try {
        const res = await fetch("/api/linkedin/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileUrl: trimmedLinkedinUrl }),
        })

        if (!res.ok) {
          // Never expose the raw API/Apify error to the user; the account
          // still succeeds regardless of import outcome.
          importWarning =
            "Account created, but your LinkedIn profile could not be imported. You can retry from your dashboard."
        }
      } catch {
        importWarning =
          "Account created, but your LinkedIn profile could not be imported. You can retry from your dashboard."
      }
    }

    // The session cookie is set by now; refresh so server components re-read it.
    router.replace(
      importWarning ? `/?notice=${encodeURIComponent(importWarning)}` : "/"
    )
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {isSignUp && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Name
          </label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            disabled={pending}
          />
          {fieldErrors.name && (
            <p id="name-error" className="text-sm text-destructive">
              {fieldErrors.name}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
          disabled={pending}
        />
        {fieldErrors.email && (
          <p id="email-error" className="text-sm text-destructive">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete={isSignUp ? "new-password" : "current-password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={fieldErrors.password ? "password-error" : undefined}
          disabled={pending}
        />
        {fieldErrors.password && (
          <p id="password-error" className="text-sm text-destructive">
            {fieldErrors.password}
          </p>
        )}
      </div>

      {isSignUp && (
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="linkedinUrl"
            className="text-sm font-medium text-foreground"
          >
            LinkedIn profile URL
          </label>
          <Input
            id="linkedinUrl"
            name="linkedinUrl"
            type="url"
            autoComplete="url"
            placeholder="https://www.linkedin.com/in/username"
            value={linkedinUrl}
            onChange={(event) => setLinkedinUrl(event.target.value)}
            aria-invalid={Boolean(fieldErrors.linkedinUrl)}
            aria-describedby={
              fieldErrors.linkedinUrl ? "linkedinUrl-error" : "linkedinUrl-hint"
            }
            disabled={pending}
          />
          {fieldErrors.linkedinUrl ? (
            <p id="linkedinUrl-error" className="text-sm text-destructive">
              {fieldErrors.linkedinUrl}
            </p>
          ) : (
            <p id="linkedinUrl-hint" className="text-xs text-muted-foreground">
              Optional. You can add or import this later from your dashboard.
            </p>
          )}
        </div>
      )}

      {formError && (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      )}

      <Button type="submit" disabled={pending} className="mt-1">
        {pending
          ? isSignUp
            ? "Creating account…"
            : "Signing in…"
          : isSignUp
            ? "Create account"
            : "Sign in"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {isSignUp ? "Already have an account? " : "No account yet? "}
        <Link
          href={isSignUp ? "/sign-in" : "/sign-up"}
          className="font-medium text-primary hover:underline"
        >
          {isSignUp ? "Sign in" : "Create one"}
        </Link>
      </p>
    </form>
  )
}
