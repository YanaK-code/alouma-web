"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  activelyApplyingOptions,
  applicationConcernOptions,
  atsConcernOptions,
  buildRevelationContent,
  buildStrategyInput,
  careerStageOptions,
  cvChallengeOptions,
  initialUserProfile,
  normalizedStage,
  onboardingSteps,
  sectorOptions,
  visibleGoalOptions,
  type OnboardingStep,
  type Option,
  type UserProfile,
} from "@/lib/onboarding/web-onboarding";
import { useAppStore } from "@/lib/stores/app-store";
import { cn } from "@/lib/utils/cn";

const PROFILE_STORAGE_KEY = "alouma_web_onboarding_profile";
const COMPLETE_STORAGE_KEY = "alouma_web_onboarding_complete";
const STRATEGY_INPUT_STORAGE_KEY = "alouma_web_strategy_input";
const TARGET_INDUSTRY_STORAGE_KEY = "alouma_web_target_industry_id";
const MAX_SECTORS = 2;

const questionContent: Partial<
  Record<OnboardingStep, { title: string; subtitle?: string }>
> = {
  careerStage: {
    title: "What's your current situation?",
  },
  goal: {
    title: "What are you aiming for right now?",
    subtitle: "So we can tailor your CV strategy.",
  },
  sector: {
    title: "Where are you applying?",
    subtitle: "Select all that apply.",
  },
  cvChallenge: {
    title: "What feels most challenging about your CV right now?",
    subtitle: "This helps us guide you better.",
  },
  atsConcern: {
    title: "Should we account for ATS readability?",
    subtitle: "We'll handle it through clean structure, labels, and formatting.",
  },
  applicationConcern: {
    title: "What feels most stressful about applying right now?",
    subtitle: "We'll tailor your guidance around this.",
  },
  activelyApplying: {
    title: "Are you actively applying right now?",
    subtitle: "This helps us adjust the guidance.",
  },
};

function safeParseProfile(value: string | null): UserProfile | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<UserProfile>;

    return {
      ...initialUserProfile,
      ...parsed,
      sectors: Array.isArray(parsed.sectors) ? parsed.sectors : [],
      selectedRoleBySector:
        parsed.selectedRoleBySector &&
        typeof parsed.selectedRoleBySector === "object"
          ? parsed.selectedRoleBySector
          : {},
    };
  } catch {
    return null;
  }
}

function isQuestionStep(step: OnboardingStep) {
  return (
    step === "careerStage" ||
    step === "goal" ||
    step === "sector" ||
    step === "cvChallenge" ||
    step === "atsConcern" ||
    step === "applicationConcern" ||
    step === "activelyApplying"
  );
}

function revelationKindForStep(step: OnboardingStep) {
  switch (step) {
    case "revelation1":
      return "first";
    case "revelation2":
      return "second";
    case "revelationATS":
      return "ats";
    case "revelationFinal":
      return "final";
    default:
      return null;
  }
}

function optionSelected(profile: UserProfile, step: OnboardingStep, id: string) {
  switch (step) {
    case "careerStage":
      return profile.careerStage === id;
    case "goal":
      return profile.goal === id;
    case "sector":
      return profile.sectors.includes(id);
    case "cvChallenge":
      return profile.cvChallenge === id;
    case "atsConcern":
      return profile.atsConcern === id;
    case "applicationConcern":
      return profile.applicationProcessConcern === id;
    case "activelyApplying":
      return profile.activelyApplying === id;
    default:
      return false;
  }
}

function isStepValid(step: OnboardingStep, profile: UserProfile) {
  switch (step) {
    case "careerStage":
      return Boolean(profile.careerStage);
    case "goal":
      return visibleGoalOptions(profile).some((option) => option.id === profile.goal);
    case "sector":
      return profile.sectors.length > 0;
    case "cvChallenge":
      return Boolean(profile.cvChallenge);
    case "atsConcern":
      return Boolean(profile.atsConcern);
    case "applicationConcern":
      return Boolean(profile.applicationProcessConcern);
    case "activelyApplying":
      return Boolean(profile.activelyApplying);
    default:
      return true;
  }
}

function questionOptions(step: OnboardingStep, profile: UserProfile) {
  switch (step) {
    case "careerStage":
      return careerStageOptions;
    case "goal":
      return visibleGoalOptions(profile);
    case "sector":
      return sectorOptions;
    case "cvChallenge":
      return cvChallengeOptions;
    case "atsConcern":
      return atsConcernOptions;
    case "applicationConcern":
      return applicationConcernOptions;
    case "activelyApplying":
      return activelyApplyingOptions;
    default:
      return [];
  }
}

function SelectableOption({
  disabled,
  option,
  selected,
  onSelect,
}: {
  disabled?: boolean;
  option: Option;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      className={cn(
        "flex min-h-14 w-full items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alouma-focus)]",
        selected
          ? "border-[var(--alouma-mustard)] bg-[#f5ead0] text-[var(--alouma-jet)] shadow-[0_10px_24px_rgba(91,69,20,0.10)]"
          : "border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] text-[var(--alouma-ink)] hover:border-[#d6b66b] hover:bg-white",
        disabled ? "cursor-not-allowed opacity-55" : "",
      )}
      disabled={disabled}
      onClick={onSelect}
      type="button"
    >
      <span>{option.label}</span>
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold uppercase tracking-normal",
          selected
            ? "border-[var(--alouma-mustard)] bg-[var(--alouma-mustard)] text-[var(--alouma-jet)]"
            : "border-[var(--alouma-hairline-strong)] bg-white text-transparent",
        )}
      >
        {selected ? "On" : ""}
      </span>
    </button>
  );
}

function RoleRefinement({
  profile,
  setProfile,
}: {
  profile: UserProfile;
  setProfile: (updater: (profile: UserProfile) => UserProfile) => void;
}) {
  if (profile.sectors.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 rounded-2xl border border-[var(--alouma-hairline)] bg-[var(--alouma-surface-soft)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--alouma-mustard-strong)]">
        Refine
      </p>
      <div className="mt-3 grid gap-3">
        {profile.sectors.map((sectorId) => {
          const sector = sectorOptions.find((option) => option.id === sectorId);

          return (
            <label className="grid gap-2" key={sectorId}>
              <span className="text-sm font-semibold text-[var(--alouma-ink)]">
                {sector?.label ?? sectorId}
              </span>
              <input
                className="min-h-11 rounded-xl border border-[var(--alouma-hairline-strong)] bg-white px-3 text-sm text-[var(--alouma-jet)] outline-none transition focus:border-[var(--alouma-mustard)] focus:ring-4 focus:ring-[var(--alouma-focus)]"
                onChange={(event) => {
                  const role = event.target.value;

                  setProfile((current) => ({
                    ...current,
                    selectedRoleBySector: {
                      ...current.selectedRoleBySector,
                      [sectorId]: role,
                    },
                  }));
                }}
                placeholder="Optional role or direction"
                value={profile.selectedRoleBySector[sectorId] ?? ""}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}

export function OnboardingWizard() {
  const router = useRouter();
  const completeOnboardingPlaceholder = useAppStore(
    (state) => state.completeOnboardingPlaceholder,
  );
  const resetPlaceholderFlow = useAppStore((state) => state.resetPlaceholderFlow);
  const [stepIndex, setStepIndex] = useState(0);
  const [profile, setProfile] = useState<UserProfile>(initialUserProfile);
  const [hasLoadedProfile, setHasLoadedProfile] = useState(false);
  const [sectorLimitMessage, setSectorLimitMessage] = useState("");

  const step = onboardingSteps[stepIndex];
  const progressValue = ((stepIndex + 1) / onboardingSteps.length) * 100;
  const isQuestion = isQuestionStep(step);
  const options = useMemo(() => questionOptions(step, profile), [profile, step]);
  const currentRevelationKind = revelationKindForStep(step);
  const revelationContent = currentRevelationKind
    ? buildRevelationContent(currentRevelationKind, profile)
    : null;
  const canContinue = !isQuestion || isStepValid(step, profile);

  useEffect(() => {
    const storedProfile = safeParseProfile(
      window.localStorage.getItem(PROFILE_STORAGE_KEY),
    );

    if (storedProfile) {
      setProfile(storedProfile);
    }

    setHasLoadedProfile(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedProfile) {
      return;
    }

    // Temporary local draft only. Real account/profile persistence should replace this.
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }, [hasLoadedProfile, profile]);

  function updateSingleValue(stepToUpdate: OnboardingStep, id: string) {
    setProfile((current) => {
      if (stepToUpdate === "careerStage") {
        const nextProfile = {
          ...current,
          careerStage: id,
        };

        if (
          normalizedStage(nextProfile) !== "earlyCareer" &&
          current.goal === "landing_first_job"
        ) {
          nextProfile.goal = "";
        }

        return nextProfile;
      }

      if (stepToUpdate === "goal") {
        return { ...current, goal: id };
      }

      if (stepToUpdate === "cvChallenge") {
        return { ...current, cvChallenge: id };
      }

      if (stepToUpdate === "atsConcern") {
        return { ...current, atsConcern: id };
      }

      if (stepToUpdate === "applicationConcern") {
        return { ...current, applicationProcessConcern: id };
      }

      if (stepToUpdate === "activelyApplying") {
        return { ...current, activelyApplying: id };
      }

      return current;
    });
  }

  function toggleSector(id: string) {
    setProfile((current) => {
      if (current.sectors.includes(id)) {
        setSectorLimitMessage("");
        const remainingSectors = current.sectors.filter((sectorId) => sectorId !== id);
        const selectedRoleBySector = { ...current.selectedRoleBySector };
        delete selectedRoleBySector[id];

        return {
          ...current,
          sectors: remainingSectors,
          selectedRoleBySector,
        };
      }

      if (current.sectors.length >= MAX_SECTORS) {
        setSectorLimitMessage("Pick up to 2");
        return current;
      }

      setSectorLimitMessage("");

      return {
        ...current,
        sectors: [...current.sectors, id],
      };
    });
  }

  function handleBack() {
    setSectorLimitMessage("");
    setStepIndex((current) => Math.max(0, current - 1));
  }

  function persistFinalOnboardingState() {
    const completedProfile = {
      ...profile,
      completedAt: new Date().toISOString(),
    };
    const strategyInput = buildStrategyInput(profile);

    // Temporary local placeholder state only. Backend profile persistence replaces this later.
    window.localStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify(completedProfile),
    );
    window.localStorage.setItem(COMPLETE_STORAGE_KEY, "true");
    window.localStorage.setItem(
      STRATEGY_INPUT_STORAGE_KEY,
      JSON.stringify(strategyInput),
    );
    window.localStorage.setItem(
      TARGET_INDUSTRY_STORAGE_KEY,
      profile.sectors[0] ?? "",
    );
  }

  function handleContinue() {
    setSectorLimitMessage("");

    if (step === "revelationFinal") {
      persistFinalOnboardingState();
      completeOnboardingPlaceholder();
      router.replace("/paywall");
      return;
    }

    setStepIndex((current) => Math.min(onboardingSteps.length - 1, current + 1));
  }

  function handleReset() {
    resetPlaceholderFlow();
    router.replace("/login");
  }

  return (
    <main className="min-h-screen bg-[var(--alouma-canvas)] px-4 py-6 text-[var(--alouma-jet)] sm:px-6 sm:py-10 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-3xl flex-col sm:min-h-[calc(100vh-5rem)]">
        <div className="rounded-2xl border border-[var(--alouma-hairline)] bg-[rgba(251,250,246,0.88)] p-4 shadow-[var(--alouma-shadow-soft)] sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-[var(--alouma-muted)]">
              Step {stepIndex + 1} of {onboardingSteps.length}
            </p>
            <button
              className="rounded-sm text-xs font-semibold uppercase tracking-[0.16em] text-[var(--alouma-mustard-strong)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alouma-focus)]"
              onClick={handleReset}
              type="button"
            >
              Reset local flow
            </button>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#11110f]/10">
            <div
              className="h-full rounded-full bg-[var(--alouma-mustard)] transition-all duration-200"
              style={{ width: `${progressValue}%` }}
            />
          </div>
        </div>

        <div className="flex flex-1 items-center py-8">
          {isQuestion ? (
            <section className="w-full">
              <div className="mb-7 text-left">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--alouma-mustard-strong)]">
                  Alouma onboarding
                </p>
                <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">
                  {questionContent[step]?.title}
                </h1>
                {questionContent[step]?.subtitle ? (
                  <p className="mt-4 text-base leading-7 text-[var(--alouma-muted)]">
                    {questionContent[step]?.subtitle}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-3">
                {options.map((option) => {
                  const selected = optionSelected(profile, step, option.id);

                  return (
                    <SelectableOption
                      key={option.id}
                      onSelect={() => {
                        if (step === "sector") {
                          toggleSector(option.id);
                          return;
                        }

                        updateSingleValue(step, option.id);
                      }}
                      option={option}
                      selected={selected}
                    />
                  );
                })}
              </div>

              {step === "sector" ? (
                <>
                  {sectorLimitMessage ? (
                    <p className="mt-3 text-sm font-semibold text-[var(--alouma-mustard-strong)]">
                      {sectorLimitMessage}
                    </p>
                  ) : null}
                  <RoleRefinement profile={profile} setProfile={setProfile} />
                </>
              ) : null}
            </section>
          ) : (
            <section className="w-full overflow-hidden rounded-[1.5rem] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-7 shadow-[var(--alouma-shadow-card)] sm:p-10">
              <div className="mb-7 grid grid-cols-[auto_1fr] items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl border border-[#c99a2e]/35 bg-[#f5ead0]">
                  <div className="h-5 w-5 rounded-full bg-[var(--alouma-mustard)]" />
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--alouma-mustard-strong)]">
                  Personalization
                </p>
              </div>
              <h1 className="text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">
                {revelationContent?.title}
              </h1>
              <p className="mt-5 text-lg leading-8 text-[var(--alouma-muted)]">
                {revelationContent?.subtitle}
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[var(--alouma-hairline)] bg-[var(--alouma-surface-soft)] p-4">
                  <div className="h-1.5 w-10 rounded-full bg-[var(--alouma-mustard)]" />
                  <p className="mt-3 text-sm font-semibold">Fit</p>
                </div>
                <div className="rounded-2xl border border-[var(--alouma-hairline)] bg-[var(--alouma-surface-soft)] p-4">
                  <div className="h-1.5 w-10 rounded-full bg-[#11110f]/25" />
                  <p className="mt-3 text-sm font-semibold">Signal</p>
                </div>
                <div className="rounded-2xl border border-[var(--alouma-hairline)] bg-[var(--alouma-surface-soft)] p-4">
                  <div className="h-1.5 w-10 rounded-full bg-[#11110f]/25" />
                  <p className="mt-3 text-sm font-semibold">Structure</p>
                </div>
              </div>
            </section>
          )}
        </div>

        <div className="sticky bottom-0 -mx-4 border-t border-[var(--alouma-hairline)] bg-[rgba(243,240,234,0.92)] px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-0">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
            {stepIndex > 0 ? (
              <Button
                className="min-h-12 px-6"
                onClick={handleBack}
                variant="secondary"
              >
                Back
              </Button>
            ) : (
              <div />
            )}
            <Button
              className="min-h-12 px-7"
              disabled={!canContinue}
              onClick={handleContinue}
            >
              {isQuestion ? "Next" : "Continue"}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
