"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/stores/app-store";
import { resolveNextRoute } from "@/lib/router/resolve-next-route";

export default function LaunchPage() {
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

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    router.replace(
      resolveNextRoute({
        isLoggedIn,
        hasCompletedOnboarding,
        hasActiveSubscription,
        hasDismissedPaywall,
      }),
    );
  }, [
    hasActiveSubscription,
    hasCompletedOnboarding,
    hasDismissedPaywall,
    hasHydrated,
    isLoggedIn,
    router,
  ]);

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <p className="text-sm text-neutral-600">Launching Alouma...</p>
    </main>
  );
}
