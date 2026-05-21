"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/stores/app-store";

export function PaywallPlaceholder() {
  const router = useRouter();
  const startTrial = useAppStore((state) => state.startTrial);
  const dismissPaywall = useAppStore((state) => state.dismissPaywall);

  function handleStartTrial() {
    startTrial();
    router.replace("/dashboard");
  }

  function handleNotNow() {
    dismissPaywall();
    router.replace("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 p-8">
      <Card className="w-full max-w-md">
        <p className="text-sm font-medium text-neutral-500">Paywall placeholder</p>
        <h1 className="mt-2 text-2xl font-semibold">Subscribe to Alouma</h1>
        <p className="mt-3 text-sm text-neutral-600">
          Payment, trial, and entitlement checks are intentionally mocked in this pass.
        </p>
        <div className="mt-6 grid gap-3">
          <Button onClick={handleStartTrial}>Start Trial</Button>
          <Button onClick={handleNotNow} variant="secondary">
            Not Now
          </Button>
        </div>
      </Card>
    </main>
  );
}
