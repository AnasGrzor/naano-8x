"use client"

import { useState } from "react"
import { Banknote, CreditCard, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type PayoutMethod = "bank" | "stripe"

type WithdrawEarningsCardProps = {
  availableNow: number
  hasBankDetails: boolean
  stripeConnected: boolean
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}

export function WithdrawEarningsCard({
  availableNow,
  hasBankDetails,
  stripeConnected,
}: WithdrawEarningsCardProps) {
  const [method, setMethod] = useState<PayoutMethod>("stripe")
  const [amount, setAmount] = useState("")

  const canWithdraw = availableNow > 0

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-5">
      <h2 className="text-base font-semibold text-foreground">
        Withdraw earnings
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose where your available balance should be sent.
      </p>

      <p className="mt-5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Payout method
      </p>

      <div className="mt-2 flex flex-col gap-3">
        <PayoutOption
          icon={Banknote}
          title="Bank transfer"
          selected={method === "bank"}
          onSelect={() => setMethod("bank")}
        >
          <p>{hasBankDetails ? "Account holder on file" : "No account holder on file"}</p>
          <p>{hasBankDetails ? "Bank details on file" : "No bank details on file"}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-fit"
            onClick={(event) => event.stopPropagation()}
          >
            Edit
          </Button>
        </PayoutOption>

        <PayoutOption
          icon={CreditCard}
          title="Stripe"
          selected={method === "stripe"}
          onSelect={() => setMethod("stripe")}
        >
          <p>
            Status:{" "}
            <span className={stripeConnected ? "text-foreground" : ""}>
              {stripeConnected ? "Connected" : "Not connected"}
            </span>
          </p>
          <p>Instant transfer to your connected Stripe account.</p>
          <Button
            size="sm"
            className="mt-2 w-fit"
            onClick={(event) => event.stopPropagation()}
          >
            Connect Stripe
          </Button>
        </PayoutOption>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-sm text-muted-foreground">
            €
          </span>
          <Input
            type="number"
            min={0}
            max={availableNow}
            placeholder="Amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="h-11 pl-6"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-11"
          onClick={() => setAmount(String(availableNow))}
        >
          Withdraw all
        </Button>
      </div>

      <Button
        type="button"
        size="lg"
        disabled={!canWithdraw}
        className="mt-3 h-11 w-full text-base"
      >
        Confirm withdrawal
      </Button>

      <div className="mt-3 flex items-start gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        <p>
          {canWithdraw
            ? `${formatCurrency(availableNow)} is available to withdraw.`
            : "No earnings are currently waiting for release."}
        </p>
      </div>
    </div>
  )
}

function PayoutOption({
  icon: Icon,
  title,
  selected,
  onSelect,
  children,
}: {
  icon: typeof Banknote
  title: string
  selected: boolean
  onSelect: () => void
  children: React.ReactNode
}) {
  return (
    // A real <button> can't contain the nested "Edit" / "Connect Stripe"
    // buttons without triggering browser button-in-button correction (and the
    // resulting SSR/client hydration mismatch), so this is a div with button
    // semantics instead.
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onSelect()
        }
      }}
      aria-pressed={selected}
      className={cn(
        "flex cursor-pointer flex-col items-start gap-1 rounded-xl border px-4 py-3.5 text-left text-sm transition-colors",
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:bg-muted/40"
      )}
    >
      <span className="flex items-center gap-2 font-medium text-foreground">
        <span
          className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-full border-2",
            selected ? "border-primary" : "border-muted-foreground/40"
          )}
        >
          {selected && <span className="size-2 rounded-full bg-primary" />}
        </span>
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
        {title}
      </span>
      <span className="ml-6 flex flex-col gap-0.5 text-muted-foreground [&>p]:leading-5">
        {children}
      </span>
    </div>
  )
}
