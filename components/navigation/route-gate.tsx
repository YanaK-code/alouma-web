"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { resolveNextRoute } from "@/lib/router/resolve-next-route";
import { useAppStore } from "@/lib/stores/app-store";

type GateArea = "auth" | "funnel" | "app";

function isAllowed(area: GateArea, pathname: string, nextRoute: string) {
  if (pathname === nextRoute) {
    return true;
  }

  if (area === "auth") {
    return pathname === "/login";
  }

  if (area === "funnel") {
    return pathname === nextRoute;
  }

  return nextRoute === "/dashboard";
}

/**
 * Temporary client-side placeholder funnel redirect only — not authentication,
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
  const authPlaceholderComplete = useAppStore(
    (state) => state.authPlaceholderComplete,
  );
  const onboardingPlaceholderComplete = useAppStore(
    (state) => state.onboardingPlaceholderComplete,
  );
  const paywallPlaceholderComplete = useAppStore(
    (state) => state.paywallPlaceholderComplete,
  );
  const nextRoute = resolveNextRoute({
    authPlaceholderComplete,
    onboardingPlaceholderComplete,
    paywallPlaceholderComplete,
  });

  useEffect(() => {
    if (!hasHydrated || isAllowed(area, pathname, nextRoute)) {
      return;
    }

    router.replace(nextRoute);
  }, [
    area,
    hasHydrated,
    authPlaceholderComplete,
    onboardingPlaceholderComplete,
    paywallPlaceholderComplete,
    nextRoute,
    pathname,
    router,
  ]);

  if (!hasHydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--alouma-canvas)] p-8">
        <p className="rounded-2xl border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] px-5 py-4 text-sm text-[var(--alouma-muted)] shadow-[var(--alouma-shadow-soft)]">
          Loading placeholder flow...
        </p>
      </main>
    );
  }

  if (!isAllowed(area, pathname, nextRoute)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--alouma-canvas)] p-8">
        <p className="rounded-2xl border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] px-5 py-4 text-sm text-[var(--alouma-muted)] shadow-[var(--alouma-shadow-soft)]">
          Redirecting...
        </p>
      </main>
    );
  }

  return children;
}
