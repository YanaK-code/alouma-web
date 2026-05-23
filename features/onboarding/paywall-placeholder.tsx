"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/stores/app-store";

/**
 * Prototype paywall step — not payment, not trial activation, not entitlements.
 * TODO: App Store / RevenueCat → webhook → Supabase entitlement mirror → server-side access DTO.
 */
export function PaywallPlaceholder() {
  const router = useRouter();
  const completeMockPaywallStep = useAppStore((state) => state.completeMockPaywallStep);

  function handleContinue() {
    completeMockPaywallStep();
    router.replace("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 p-8">
      <Card className="w-full max-w-md">
        <p className="text-sm font-medium text-neutral-500">Paywall placeholder</p>
        <h1 className="mt-2 text-2xl font-semibold">Subscribe to Alouma</h1>
        <p className="mt-3 text-sm text-neutral-600">
          UI placeholder only. Buttons mark the prototype paywall step complete — not payment,
          not a trial, and not subscription or entitlement state.
        </p>
        <div className="mt-6 grid gap-3">
          <Button onClick={handleContinue}>Continue (prototype)</Button>
          <Button onClick={handleContinue} variant="secondary">
            Skip for now (prototype)
          </Button>
        </div>
      </Card>
    </main>
  );
}
