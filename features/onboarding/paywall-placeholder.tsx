"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/stores/app-store";

const planBullets = [
  "Guided CV builder",
  "PDF export",
  "Job tailoring tools",
  "AI suggestions with review before applying",
  "Cloud backup when account sync is connected",
];

/**
 * Local placeholder paywall — not payment, not trial activation, not entitlements.
 * TODO: App Store / RevenueCat -> webhook -> Supabase entitlement mirror -> server-side access DTO.
 */
export function PaywallPlaceholder() {
  const router = useRouter();
  const completePaywallPlaceholder = useAppStore(
    (state) => state.completePaywallPlaceholder,
  );
  const resetPlaceholderFlow = useAppStore((state) => state.resetPlaceholderFlow);

  function handleContinue() {
    completePaywallPlaceholder();
    router.replace("/dashboard");
  }

  function handleReset() {
    resetPlaceholderFlow();
    router.replace("/login");
  }

  return (
    <main className="min-h-screen bg-[var(--alouma-canvas)] px-4 py-16 text-[var(--alouma-jet)] sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-5xl items-stretch gap-8 lg:grid-cols-[5fr_7fr]">
        <div className="flex flex-col justify-center">
          <p className="alouma-eyebrow">Placeholder paywall</p>
          <h1 className="alouma-display-section mt-4 text-4xl sm:text-5xl">
            Build with clarity first.
          </h1>
          <p className="mt-5 text-base leading-7 text-[var(--alouma-muted)]">
            Premium features will live here later: guided AI suggestions, deeper CV
            review, job tailoring, and cloud sync.
          </p>
          <p className="mt-6 rounded-[12px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-4 text-sm leading-6 text-[var(--alouma-muted)]">
            This placeholder does not create a subscription, activate a trial, or grant
            a real entitlement.
          </p>
        </div>
        <article className="rounded-[24px] border border-[var(--alouma-mustard)] bg-[var(--alouma-mustard-soft)] p-8 sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--alouma-mustard)]/40 pb-6">
            <div>
              <p className="alouma-eyebrow">Alouma Pro</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.01em] text-[var(--alouma-jet)]">
                Coming soon
              </h2>
            </div>
            <span className="rounded-full border border-[var(--alouma-jet)] bg-[var(--alouma-jet)] px-3 py-1 text-xs font-semibold text-[var(--alouma-mustard)]">
              Placeholder
            </span>
          </div>
          <ul className="mt-7 grid gap-3 text-sm leading-6 text-[var(--alouma-ink)]">
            {planBullets.map((bullet) => (
              <li className="flex gap-3" key={bullet}>
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--alouma-jet)]" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Button onClick={handleContinue} variant="dark">
              Continue to dashboard
            </Button>
            <Button
              className="border-[var(--alouma-jet)] bg-transparent text-[var(--alouma-jet)] hover:bg-[var(--alouma-jet)]/10"
              onClick={handleContinue}
              variant="secondary"
            >
              Not now
            </Button>
          </div>
          <button
            className="mt-6 rounded-[6px] text-xs font-semibold uppercase tracking-[0.16em] text-[var(--alouma-mustard-strong)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alouma-focus)]"
            onClick={handleReset}
            type="button"
          >
            Reset local placeholder flow
          </button>
        </article>
      </section>
    </main>
  );
}
