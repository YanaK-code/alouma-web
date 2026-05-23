"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/stores/app-store";
import { resolveNextRoute } from "@/lib/router/resolve-next-route";

export default function LaunchPage() {
  const router = useRouter();
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const mockAuthCompleted = useAppStore((state) => state.mockAuthCompleted);
  const mockOnboardingCompleted = useAppStore(
    (state) => state.mockOnboardingCompleted,
  );
  const mockPaywallCompleted = useAppStore((state) => state.mockPaywallCompleted);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    router.replace(
      resolveNextRoute({
        mockAuthCompleted,
        mockOnboardingCompleted,
        mockPaywallCompleted,
      }),
    );
  }, [
    hasHydrated,
    mockAuthCompleted,
    mockOnboardingCompleted,
    mockPaywallCompleted,
    router,
  ]);

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <p className="text-sm text-neutral-600">Launching Alouma...</p>
    </main>
  );
}
