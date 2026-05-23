/**
 * Prototype-only funnel routing for local development. This does not enforce security.
 * TODO: Replace with server middleware + session checks before production.
 */
export type PrototypeFlowFlags = {
  mockAuthCompleted: boolean;
  mockOnboardingCompleted: boolean;
  mockPaywallCompleted: boolean;
};

export function resolveNextRoute(flags: PrototypeFlowFlags) {
  if (!flags.mockAuthCompleted) {
    return "/login";
  }

  if (!flags.mockOnboardingCompleted) {
    return "/onboarding";
  }

  if (!flags.mockPaywallCompleted) {
    return "/subscribe";
  }

  return "/dashboard";
}
