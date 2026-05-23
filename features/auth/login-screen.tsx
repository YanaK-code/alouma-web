"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/stores/app-store";

/**
 * Local placeholder account screen — not real authentication.
 * TODO: Supabase Auth (or equivalent) + server session + middleware route protection.
 */
export function LoginScreen() {
  const router = useRouter();
  const completeAuthPlaceholder = useAppStore(
    (state) => state.completeAuthPlaceholder,
  );
  const resetPlaceholderFlow = useAppStore((state) => state.resetPlaceholderFlow);

  function handleContinue() {
    completeAuthPlaceholder();
    router.replace("/onboarding");
  }

  function handleReset() {
    resetPlaceholderFlow();
    router.replace("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--alouma-canvas)] px-4 py-10 text-[var(--alouma-jet)] sm:px-6 lg:px-8">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] shadow-[var(--alouma-shadow-card)] lg:grid-cols-[0.85fr_1fr]">
        <div className="hidden border-r border-[var(--alouma-hairline)] bg-[var(--alouma-surface-soft)] p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-semibold">Alouma</p>
            <h2 className="mt-16 max-w-sm text-3xl font-semibold leading-tight">
              A quiet entry into your CV workspace.
            </h2>
          </div>
          <div className="rounded-2xl border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-5">
            <div className="h-1.5 w-12 rounded-full bg-[var(--alouma-mustard)]" />
            <p className="mt-4 text-sm leading-6 text-[var(--alouma-muted)]">
              Placeholder today, secure account sync later. The visual entry point is ready for that handoff.
            </p>
          </div>
        </div>
        <div className="p-7 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--alouma-mustard-strong)]">
          Local placeholder
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-normal">
          Create your Alouma account
        </h1>
        <p className="mt-5 text-base leading-7 text-[var(--alouma-muted)]">
          Your CV workspace will live here. For now, this is a placeholder before real
          Sign in with Apple and secure account sync are connected.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Button
            className="min-h-12"
            onClick={handleContinue}
          >
            Continue
          </Button>
          <Button
            className="min-h-12"
            onClick={handleContinue}
            variant="secondary"
          >
            Already have an account
          </Button>
        </div>
        <p className="mt-5 rounded-2xl border border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)] p-4 text-sm leading-6 text-[var(--alouma-muted)]">
          This button only advances a local development flag. It does not sign in,
          verify identity, or create an account.
        </p>
        <button
          className="mt-6 rounded-sm text-xs font-semibold uppercase tracking-[0.16em] text-[var(--alouma-mustard-strong)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alouma-focus)]"
          onClick={handleReset}
          type="button"
        >
          Reset local placeholder flow
        </button>
        </div>
      </section>
    </main>
  );
}
