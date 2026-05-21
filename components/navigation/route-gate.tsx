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
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const hasCompletedOnboarding = useAppStore(
    (state) => state.hasCompletedOnboarding,
  );
  const hasActiveSubscription = useAppStore(
    (state) => state.hasActiveSubscription,
  );
  const hasDismissedPaywall = useAppStore(
    (state) => state.hasDismissedPaywall,
  );
  const nextRoute = resolveNextRoute({
    isLoggedIn,
    hasCompletedOnboarding,
    hasActiveSubscription,
    hasDismissedPaywall,
  });

  useEffect(() => {
    if (!hasHydrated || isAllowed(area, pathname, nextRoute)) {
      return;
    }

    router.replace(nextRoute);
  }, [area, hasHydrated, nextRoute, pathname, router]);

  if (!hasHydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <p className="text-sm text-neutral-600">Loading app state...</p>
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
