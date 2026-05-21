export type GateFlags = {
  isLoggedIn: boolean;
  hasCompletedOnboarding: boolean;
  hasActiveSubscription: boolean;
  hasDismissedPaywall: boolean;
};

export function resolveNextRoute(flags: GateFlags) {
  if (!flags.isLoggedIn) {
    return "/login";
  }

  if (!flags.hasCompletedOnboarding) {
    return "/onboarding";
  }

  if (!flags.hasActiveSubscription && !flags.hasDismissedPaywall) {
    return "/subscribe";
  }

  return "/dashboard";
}
