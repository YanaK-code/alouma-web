import type { ReactNode } from "react";
import { Sidebar } from "@/components/navigation/sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--alouma-canvas)] text-[var(--alouma-jet)] md:flex-row">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 md:p-7 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
