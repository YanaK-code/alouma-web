"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, TextArea } from "@/components/ui/field";
import { onboardingSteps } from "@/lib/router/routes";
import { useAppStore } from "@/lib/stores/app-store";
import { titleFromSlug } from "@/lib/utils/format";

export function OnboardingWizard() {
  const router = useRouter();
  const answers = useAppStore((state) => state.onboardingAnswers);
  const setAnswer = useAppStore((state) => state.setOnboardingAnswer);
  const completeMockOnboardingFlow = useAppStore(
    (state) => state.completeMockOnboardingFlow,
  );
  const [stepIndex, setStepIndex] = useState(0);
  const step = onboardingSteps[stepIndex];
  const progress = useMemo(
    () => `${stepIndex + 1} of ${onboardingSteps.length}`,
    [stepIndex],
  );

  function next() {
    if (stepIndex < onboardingSteps.length - 1) {
      setStepIndex((current) => current + 1);
      return;
    }

    completeMockOnboardingFlow();
    router.replace("/subscribe");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 p-8">
      <Card className="w-full max-w-2xl">
        <p className="text-sm font-medium text-neutral-500">Onboarding step {progress}</p>
        <h1 className="mt-2 text-2xl font-semibold">{titleFromSlug(step)}</h1>
        <p className="mt-3 text-sm text-neutral-600">
          Placeholder for the iOS onboarding step. Answers are stored locally for now.
        </p>
        <div className="mt-6">
          <Field label="Mock answer">
            <TextArea
              onChange={(event) => setAnswer(step, event.target.value)}
              placeholder={`Answer for ${titleFromSlug(step)}`}
              value={answers[step] ?? ""}
            />
          </Field>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <Button
            disabled={stepIndex === 0}
            onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
            title={stepIndex === 0 ? "Back is available after the first step." : undefined}
            variant="secondary"
          >
            Back
          </Button>
          <Button onClick={next}>
            {stepIndex === onboardingSteps.length - 1 ? "Complete" : "Next"}
          </Button>
        </div>
      </Card>
    </main>
  );
}
