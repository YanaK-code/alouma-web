"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/stores/app-store";

/**
 * Local placeholder account screen — not real authentication.
 * TODO: Supabase Auth (or equivalent) + server session + middleware route protection.
 */
export function LoginScreen() {
  const router = useRouter();
  const [placeholderMessage, setPlaceholderMessage] = useState<string | null>(null);
  const enterLocalDemoMode = useAppStore((state) => state.enterLocalDemoMode);
  const resetPlaceholderFlow = useAppStore((state) => state.resetPlaceholderFlow);

  function showAuthPlaceholder() {
    setPlaceholderMessage(
      "Account login will be connected when the secure backend is enabled.",
    );
  }

  function handleEnterDemoMode() {
    enterLocalDemoMode();
    router.replace("/dashboard");
  }

  function handleReset() {
    resetPlaceholderFlow();
    setPlaceholderMessage(null);
    router.replace("/login");
  }

  return (
    <div className="flex min-h-[calc(100vh-9rem)] items-center justify-center py-10 text-[var(--alouma-jet)]">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[24px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] lg:grid-cols-[5fr_7fr]">
        <aside className="hidden flex-col justify-between border-r border-[var(--alouma-hairline)] bg-[var(--alouma-surface-soft)] p-12 lg:flex">
          <div>
            <p className="text-sm font-semibold tracking-[-0.01em]">Alouma</p>
            <h2 className="alouma-display-section mt-16 max-w-sm text-3xl">
              A quiet entry into your CV workspace.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-[var(--alouma-muted)]">
              Guided prompts, recruiter-readable structure, clean PDF export.
            </p>
          </div>
          <div className="rounded-[16px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-5">
            <div className="h-1 w-10 rounded-full bg-[var(--alouma-mustard)]" />
            <p className="mt-4 text-sm leading-6 text-[var(--alouma-muted)]">
              Placeholder today, secure account sync later. The visual entry point is ready for that handoff.
            </p>
          </div>
        </aside>
        <div className="p-8 sm:p-12">
          <p className="alouma-eyebrow">Auth placeholder</p>
          <h1 className="alouma-display-section mt-4 text-4xl">
            Sign in to Alouma
          </h1>
          <p className="mt-5 text-base leading-7 text-[var(--alouma-muted)]">
            This is the future account entry point. Google, Apple, and secure
            account sync are not connected in this local build.
          </p>
          <div className="mt-8 grid gap-3">
            <Button onClick={showAuthPlaceholder} variant="secondary">
              Continue with Google
            </Button>
            <Button onClick={showAuthPlaceholder} variant="secondary">
              Continue with Apple
            </Button>
          </div>
          {placeholderMessage ? (
            <div
              aria-live="polite"
              className="mt-5 rounded-[12px] border border-[var(--alouma-hairline-strong)] bg-[var(--alouma-canvas)] p-4 text-sm leading-6 text-[var(--alouma-muted)]"
              role="status"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p>{placeholderMessage}</p>
                <button
                  className="rounded-[6px] text-xs font-semibold uppercase tracking-[0.16em] text-[var(--alouma-mustard-strong)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alouma-focus)]"
                  onClick={() => setPlaceholderMessage(null)}
                  type="button"
                >
                  Close
                </button>
              </div>
            </div>
          ) : null}
          <div className="mt-6 rounded-[12px] border border-dashed border-[var(--alouma-hairline-strong)] bg-[var(--alouma-canvas)] p-4">
            <p className="text-sm font-semibold text-[var(--alouma-jet)]">
              Local demo mode
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--alouma-muted)]">
              Skips the placeholder onboarding and opens the internal dashboard.
              This does not sign in, create an account, verify identity, or grant
              production access.
            </p>
            <Button className="mt-4" onClick={handleEnterDemoMode} variant="dark">
              Skip to dashboard
            </Button>
          </div>
          <button
            className="mt-6 rounded-[6px] text-xs font-semibold uppercase tracking-[0.16em] text-[var(--alouma-mustard-strong)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alouma-focus)]"
            onClick={handleReset}
            type="button"
          >
            Reset local placeholder flow
          </button>
        </div>
      </section>
    </div>
  );
}
