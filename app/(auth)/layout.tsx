import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { RouteGate } from "@/components/navigation/route-gate";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell variant="public">
      <RouteGate area="auth">{children}</RouteGate>
    </AppShell>
  );
}
