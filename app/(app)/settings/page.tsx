"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/stores/app-store";
import { useResumeStore } from "@/lib/stores/resume-store";

export default function SettingsPage() {
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const hasCompletedOnboarding = useAppStore(
    (state) => state.hasCompletedOnboarding,
  );
  const hasActiveSubscription = useAppStore(
    (state) => state.hasActiveSubscription,
  );
  const hasDismissedPaywall = useAppStore(
    (state) => state.hasDismissedPaywall,
  );
  const hasSeenIntro = useAppStore((state) => state.hasSeenIntro);
  const resetAppFlow = useAppStore((state) => state.resetAppFlow);
  const resetDraft = useResumeStore((state) => state.resetDraft);
  const appFlags = {
    isLoggedIn,
    hasCompletedOnboarding,
    hasActiveSubscription,
    hasDismissedPaywall,
    hasSeenIntro,
  };

  return (
    <>
      <PageHeader
        description="Mock local state controls for skeleton testing."
        title="Settings"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">App Flags</h2>
          <dl className="mt-4 grid gap-2 text-sm">
            {Object.entries(appFlags).map(([key, value]) => (
              <div className="flex justify-between gap-4 border-b border-neutral-100 py-2" key={key}>
                <dt className="font-medium">{key}</dt>
                <dd className="text-neutral-600">{String(value)}</dd>
              </div>
            ))}
          </dl>
          <Button className="mt-5" onClick={resetAppFlow} variant="secondary">
            Reset App Flow
          </Button>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Resume Draft</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Reset the active local resume fixture and keep the rest of the app flow untouched.
          </p>
          <Button className="mt-5" onClick={resetDraft} variant="secondary">
            Reset Resume Draft
          </Button>
        </Card>
      </div>
    </>
  );
}
