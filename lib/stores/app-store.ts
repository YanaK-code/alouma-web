"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { OnboardingStep } from "@/lib/router/routes";

/**
 * Temporary local prototype funnel flags only — not authentication, not entitlements,
 * not subscription state. Production must use server session, middleware, RLS, and
 * sanitized access DTOs from the backend.
 */
type AppState = {
  mockAuthCompleted: boolean;
  mockOnboardingCompleted: boolean;
  mockPaywallCompleted: boolean;
  mockIntroCompleted: boolean;
  onboardingAnswers: Partial<Record<OnboardingStep, string>>;
  hasHydrated: boolean;
  completeMockAuthFlow: () => void;
  setOnboardingAnswer: (step: OnboardingStep, answer: string) => void;
  completeMockOnboardingFlow: () => void;
  completeMockPaywallStep: () => void;
  resetAppFlow: () => void;
  setHasHydrated: (value: boolean) => void;
};

const initialFlags = {
  mockAuthCompleted: false,
  mockOnboardingCompleted: false,
  mockPaywallCompleted: false,
  mockIntroCompleted: false,
  onboardingAnswers: {},
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialFlags,
      hasHydrated: false,
      completeMockAuthFlow: () =>
        set({
          mockAuthCompleted: true,
          mockIntroCompleted: true,
        }),
      setOnboardingAnswer: (step, answer) =>
        set((state) => ({
          onboardingAnswers: {
            ...state.onboardingAnswers,
            [step]: answer,
          },
        })),
      completeMockOnboardingFlow: () =>
        set({
          mockOnboardingCompleted: true,
        }),
      completeMockPaywallStep: () =>
        set({
          mockPaywallCompleted: true,
        }),
      resetAppFlow: () =>
        set({
          ...initialFlags,
        }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      // v1 key: avoids rehydrating legacy client-trusted subscription/auth fields.
      name: "alouma-app-prototype-flow-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        mockAuthCompleted: state.mockAuthCompleted,
        mockOnboardingCompleted: state.mockOnboardingCompleted,
        mockPaywallCompleted: state.mockPaywallCompleted,
        mockIntroCompleted: state.mockIntroCompleted,
        onboardingAnswers: state.onboardingAnswers,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
