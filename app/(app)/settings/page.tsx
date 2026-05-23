"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/stores/app-store";
import { useResumeStore } from "@/lib/stores/resume-store";

function prototypeStatus(completed: boolean) {
  return completed ? "completed" : "not completed";
}

export default function SettingsPage() {
  const mockAuthCompleted = useAppStore((state) => state.mockAuthCompleted);
  const mockOnboardingCompleted = useAppStore(
    (state) => state.mockOnboardingCompleted,
  );
  const mockPaywallCompleted = useAppStore((state) => state.mockPaywallCompleted);
  const mockIntroCompleted = useAppStore((state) => state.mockIntroCompleted);
  const resetAppFlow = useAppStore((state) => state.resetAppFlow);
  const resetDraft = useResumeStore((state) => state.resetDraft);

  return (
    <>
      <PageHeader
        description="Local prototype controls for skeleton testing — not account or billing state."
        title="Settings"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">Prototype flow (development)</h2>
          <p className="mt-2 text-sm text-neutral-600">
            These labels describe local UI steps only. They are not authentication, entitlements,
            or subscription status.
          </p>
          <dl className="mt-4 grid gap-2 text-sm">
            <div className="flex justify-between gap-4 border-b border-neutral-100 py-2">
              <dt className="font-medium">Prototype account flow</dt>
              <dd className="text-neutral-600">{prototypeStatus(mockAuthCompleted)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-neutral-100 py-2">
              <dt className="font-medium">Prototype intro step</dt>
              <dd className="text-neutral-600">{prototypeStatus(mockIntroCompleted)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-neutral-100 py-2">
              <dt className="font-medium">Prototype onboarding</dt>
              <dd className="text-neutral-600">{prototypeStatus(mockOnboardingCompleted)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-neutral-100 py-2">
              <dt className="font-medium">Prototype paywall step</dt>
              <dd className="text-neutral-600">{prototypeStatus(mockPaywallCompleted)}</dd>
            </div>
          </dl>
          <Button className="mt-5" onClick={resetAppFlow} variant="secondary">
            Reset prototype flow
          </Button>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Resume Draft</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Reset the active local resume fixture and keep the rest of the prototype flow untouched.
          </p>
          <Button className="mt-5" onClick={resetDraft} variant="secondary">
            Reset Resume Draft
          </Button>
        </Card>
      </div>
    </>
  );
}
