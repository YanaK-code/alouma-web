"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { OnboardingStep } from "@/lib/router/routes";

type AppState = {
  isLoggedIn: boolean;
  hasCompletedOnboarding: boolean;
  hasActiveSubscription: boolean;
  hasDismissedPaywall: boolean;
  hasSeenIntro: boolean;
  onboardingAnswers: Partial<Record<OnboardingStep, string>>;
  hasHydrated: boolean;
  continueAsMockUser: () => void;
  setOnboardingAnswer: (step: OnboardingStep, answer: string) => void;
  completeOnboarding: () => void;
  startTrial: () => void;
  dismissPaywall: () => void;
  resetAppFlow: () => void;
  setHasHydrated: (value: boolean) => void;
};

const initialFlags = {
  isLoggedIn: false,
  hasCompletedOnboarding: false,
  hasActiveSubscription: false,
  hasDismissedPaywall: false,
  hasSeenIntro: false,
  onboardingAnswers: {},
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialFlags,
      hasHydrated: false,
      continueAsMockUser: () =>
        set({
          isLoggedIn: true,
          hasSeenIntro: true,
        }),
      setOnboardingAnswer: (step, answer) =>
        set((state) => ({
          onboardingAnswers: {
            ...state.onboardingAnswers,
            [step]: answer,
          },
        })),
      completeOnboarding: () =>
        set({
          hasCompletedOnboarding: true,
        }),
      startTrial: () =>
        set({
          hasActiveSubscription: true,
          hasDismissedPaywall: true,
        }),
      dismissPaywall: () =>
        set({
          hasDismissedPaywall: true,
        }),
      resetAppFlow: () =>
        set({
          ...initialFlags,
        }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "alouma-app-state",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        hasActiveSubscription: state.hasActiveSubscription,
        hasDismissedPaywall: state.hasDismissedPaywall,
        hasSeenIntro: state.hasSeenIntro,
        onboardingAnswers: state.onboardingAnswers,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
