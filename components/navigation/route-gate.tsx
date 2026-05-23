"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { resolveNextRoute } from "@/lib/router/resolve-next-route";
import { useAppStore } from "@/lib/stores/app-store";

type GateArea = "auth" | "funnel" | "app";

function isAllowed(area: GateArea, pathname: string, nextRoute: string) {
  if (area === "auth") {
    return nextRoute === "/login" || pathname === nextRoute;
  }

  if (area === "funnel") {
    return pathname === nextRoute;
  }

  return nextRoute === "/dashboard";
}

/**
 * Temporary client-side prototype funnel redirect only — not authentication,
 * not subscription enforcement, not production route protection.
 * TODO: Add Next.js middleware + server session (e.g. Supabase Auth) for real access control.
 */
export function RouteGate({
  area,
  children,
}: {
  area: GateArea;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const mockAuthCompleted = useAppStore((state) => state.mockAuthCompleted);
  const mockOnboardingCompleted = useAppStore(
    (state) => state.mockOnboardingCompleted,
  );
  const mockPaywallCompleted = useAppStore((state) => state.mockPaywallCompleted);
  const nextRoute = resolveNextRoute({
    mockAuthCompleted,
    mockOnboardingCompleted,
    mockPaywallCompleted,
  });

  useEffect(() => {
    if (!hasHydrated || isAllowed(area, pathname, nextRoute)) {
      return;
    }

    router.replace(nextRoute);
  }, [area, hasHydrated, mockAuthCompleted, mockOnboardingCompleted, mockPaywallCompleted, nextRoute, pathname, router]);

  if (!hasHydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <p className="text-sm text-neutral-600">Loading prototype flow...</p>
      </main>
    );
  }

  if (!isAllowed(area, pathname, nextRoute)) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <p className="text-sm text-neutral-600">Redirecting...</p>
      </main>
    );
  }

  return children;
}
