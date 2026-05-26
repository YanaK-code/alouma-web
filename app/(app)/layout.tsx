import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { RouteGate } from "@/components/navigation/route-gate";

export default function MainAppLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <RouteGate area="app">{children}</RouteGate>
    </AppShell>
  );
}
