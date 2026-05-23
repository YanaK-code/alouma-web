/**
 * Placeholder-only funnel routing for local development. This does not enforce security.
 * TODO: Replace with server middleware + session checks before production.
 */
export type PlaceholderFlowFlags = {
  authPlaceholderComplete: boolean;
  onboardingPlaceholderComplete: boolean;
  paywallPlaceholderComplete: boolean;
};

export function resolveNextRoute(flags: PlaceholderFlowFlags) {
  if (!flags.authPlaceholderComplete) {
    return "/login";
  }

  if (!flags.onboardingPlaceholderComplete) {
    return "/onboarding";
  }

  if (!flags.paywallPlaceholderComplete) {
    return "/paywall";
  }

  return "/dashboard";
}
