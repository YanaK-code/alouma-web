"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const LOCAL_ONBOARDING_KEYS = [
  "alouma_web_onboarding_profile",
  "alouma_web_onboarding_complete",
  "alouma_web_strategy_input",
  "alouma_web_target_industry_id",
] as const;

function clearLocalOnboardingPersistence() {
  if (typeof window === "undefined") {
    return;
  }

  for (const key of LOCAL_ONBOARDING_KEYS) {
    window.localStorage.removeItem(key);
  }
}

/**
 * Temporary local placeholder funnel flags only — not authentication, not onboarding truth,
 * not entitlements, and not subscription state. Production must use server session,
 * middleware, RLS, and sanitized access DTOs from the backend.
 */
type AppState = {
  authPlaceholderComplete: boolean;
  onboardingPlaceholderComplete: boolean;
  paywallPlaceholderComplete: boolean;
  hasHydrated: boolean;
  completeAuthPlaceholder: () => void;
  completeOnboardingPlaceholder: () => void;
  completePaywallPlaceholder: () => void;
  resetPlaceholderFlow: () => void;
  setHasHydrated: (value: boolean) => void;
};

const initialFlags = {
  authPlaceholderComplete: false,
  onboardingPlaceholderComplete: false,
  paywallPlaceholderComplete: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialFlags,
      hasHydrated: false,
      completeAuthPlaceholder: () =>
        set({
          authPlaceholderComplete: true,
          onboardingPlaceholderComplete: false,
          paywallPlaceholderComplete: false,
        }),
      completeOnboardingPlaceholder: () =>
        set({
          onboardingPlaceholderComplete: true,
          paywallPlaceholderComplete: false,
        }),
      completePaywallPlaceholder: () =>
        set({
          paywallPlaceholderComplete: true,
        }),
      resetPlaceholderFlow: () => {
        clearLocalOnboardingPersistence();
        set({
          ...initialFlags,
        });
      },
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      // Local/dev placeholder UX state only. This must not become auth or entitlement truth.
      name: "alouma-web-entry-placeholder-flow-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        authPlaceholderComplete: state.authPlaceholderComplete,
        onboardingPlaceholderComplete: state.onboardingPlaceholderComplete,
        paywallPlaceholderComplete: state.paywallPlaceholderComplete,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
