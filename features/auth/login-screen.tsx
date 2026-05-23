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
    <main className="flex min-h-screen items-center justify-center bg-[var(--alouma-canvas)] px-4 py-16 text-[var(--alouma-jet)] sm:px-6 lg:px-8">
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
          <p className="alouma-eyebrow">Local placeholder</p>
          <h1 className="alouma-display-section mt-4 text-4xl">
            Create your Alouma account
          </h1>
          <p className="mt-5 text-base leading-7 text-[var(--alouma-muted)]">
            Your CV workspace will live here. For now, this is a placeholder before real
            Sign in with Apple and secure account sync are connected.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Button onClick={handleContinue}>Continue</Button>
            <Button onClick={handleContinue} variant="secondary">
              Already have an account
            </Button>
          </div>
          <p className="mt-6 rounded-[12px] border border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)] p-4 text-sm leading-6 text-[var(--alouma-muted)]">
            This button only advances a local development flag. It does not sign in,
            verify identity, or create an account.
          </p>
          <button
            className="mt-6 rounded-[6px] text-xs font-semibold uppercase tracking-[0.16em] text-[var(--alouma-mustard-strong)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alouma-focus)]"
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
