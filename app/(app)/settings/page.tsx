"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/stores/app-store";
import { useResumeStore } from "@/lib/stores/resume-store";

function placeholderStatus(completed: boolean) {
  return completed ? "completed" : "not completed";
}

export default function SettingsPage() {
  const authPlaceholderComplete = useAppStore(
    (state) => state.authPlaceholderComplete,
  );
  const onboardingPlaceholderComplete = useAppStore(
    (state) => state.onboardingPlaceholderComplete,
  );
  const paywallPlaceholderComplete = useAppStore(
    (state) => state.paywallPlaceholderComplete,
  );
  const localDemoModeActive = useAppStore((state) => state.localDemoModeActive);
  const resetPlaceholderFlow = useAppStore((state) => state.resetPlaceholderFlow);
  const resetDraft = useResumeStore((state) => state.resetDraft);

  return (
    <>
      <PageHeader
        description="Local placeholder controls for skeleton testing — not account or billing state."
        title="Settings"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-[var(--alouma-jet)]">
            Placeholder flow (development)
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--alouma-muted)]">
            These labels describe local UI steps only. They are not authentication, entitlements,
            or subscription status.
          </p>
          <dl className="mt-4 grid gap-2 text-sm">
            <div className="flex justify-between gap-4 border-b border-[var(--alouma-hairline)] py-2">
              <dt className="font-semibold">Placeholder account flow</dt>
              <dd className="text-[var(--alouma-muted)]">
                {placeholderStatus(authPlaceholderComplete)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-[var(--alouma-hairline)] py-2">
              <dt className="font-semibold">Placeholder onboarding</dt>
              <dd className="text-[var(--alouma-muted)]">
                {placeholderStatus(onboardingPlaceholderComplete)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-[var(--alouma-hairline)] py-2">
              <dt className="font-semibold">Placeholder paywall step</dt>
              <dd className="text-[var(--alouma-muted)]">
                {placeholderStatus(paywallPlaceholderComplete)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-2">
              <dt className="font-semibold">Local demo mode</dt>
              <dd className="text-[var(--alouma-muted)]">
                {localDemoModeActive ? "active" : "not active"}
              </dd>
            </div>
          </dl>
          <Button className="mt-5" onClick={resetPlaceholderFlow} variant="secondary">
            Reset placeholder flow
          </Button>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-[var(--alouma-jet)]">Resume Draft</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--alouma-muted)]">
            Reset the active local resume fixture and keep the rest of the placeholder flow untouched.
          </p>
          <Button className="mt-5" onClick={resetDraft} variant="secondary">
            Reset Resume Draft
          </Button>
        </Card>
      </div>
    </>
  );
}
