"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/stores/app-store";
import { resolveNextRoute } from "@/lib/router/resolve-next-route";

/**
 * Prototype login screen — not real authentication.
 * TODO: Supabase Auth (or equivalent) + server session + middleware route protection.
 */
export function LoginScreen() {
  const router = useRouter();
  const completeMockAuthFlow = useAppStore((state) => state.completeMockAuthFlow);

  function handleContinue() {
    completeMockAuthFlow();
    router.replace(
      resolveNextRoute({
        mockAuthCompleted: true,
        mockOnboardingCompleted: false,
        mockPaywallCompleted: false,
      }),
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 p-8">
      <Card className="w-full max-w-md">
        <p className="text-sm font-medium text-neutral-500">Launch</p>
        <h1 className="mt-2 text-2xl font-semibold">Alouma Web</h1>
        <p className="mt-3 text-sm text-neutral-600">
          Prototype account step for local development. This is not sign-in or identity verification.
        </p>
        <Button className="mt-6 w-full" onClick={handleContinue}>
          Continue
        </Button>
      </Card>
    </main>
  );
}
