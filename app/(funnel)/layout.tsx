import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { RouteGate } from "@/components/navigation/route-gate";

export default function FunnelLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell variant="public">
      <RouteGate area="funnel">{children}</RouteGate>
    </AppShell>
  );
}
