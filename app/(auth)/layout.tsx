import type { ReactNode } from "react";
import { RouteGate } from "@/components/navigation/route-gate";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <RouteGate area="auth">{children}</RouteGate>;
}
