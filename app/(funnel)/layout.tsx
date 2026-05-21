import type { ReactNode } from "react";
import { RouteGate } from "@/components/navigation/route-gate";

export default function FunnelLayout({ children }: { children: ReactNode }) {
  return <RouteGate area="funnel">{children}</RouteGate>;
}
