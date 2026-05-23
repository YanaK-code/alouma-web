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
    <main className="min-h-screen bg-[var(--alouma-canvas)] px-4 py-10 text-[var(--alouma-jet)] sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-5xl gap-8 rounded-[1.5rem] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-7 shadow-[var(--alouma-shadow-card)] sm:p-10 lg:grid-cols-[0.9fr_1fr]">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--alouma-mustard-strong)]">
            Placeholder paywall
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
            Build with clarity first.
          </h1>
          <p className="mt-5 text-base leading-7 text-[var(--alouma-muted)]">
            Premium features will live here later: guided AI suggestions, deeper CV
            review, job tailoring, and cloud sync.
          </p>
          <p className="mt-5 rounded-2xl border border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)] p-4 text-sm leading-6 text-[var(--alouma-muted)]">
            This placeholder does not create a subscription, activate a trial, or grant
            a real entitlement.
          </p>
        </div>
        <article className="rounded-2xl border border-white/10 bg-[var(--alouma-jet)] p-6 text-white shadow-[0_20px_45px_rgba(32,29,24,0.16)]">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c99a2e]">
                Alouma Pro
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Coming soon</h2>
            </div>
            <span className="rounded-xl bg-[var(--alouma-mustard)] px-3 py-1 text-xs font-semibold text-[var(--alouma-jet)]">
              Placeholder
            </span>
          </div>
          <ul className="mt-6 grid gap-3 text-sm leading-6 text-white/75">
            {planBullets.map((bullet) => (
              <li className="flex gap-3" key={bullet}>
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c99a2e]" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Button
              className="min-h-12"
              onClick={handleContinue}
            >
              Continue to dashboard
            </Button>
            <Button
              className="min-h-12 border-white/15 bg-white/10 text-white hover:border-white/25 hover:bg-white/15"
              onClick={handleContinue}
              variant="secondary"
            >
              Not now
            </Button>
          </div>
          <button
            className="mt-6 rounded-sm text-xs font-semibold uppercase tracking-[0.16em] text-[var(--alouma-mustard)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alouma-focus)]"
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
