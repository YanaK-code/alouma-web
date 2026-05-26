import type { ReactNode } from "react";
import { TopBannerNav } from "@/components/navigation/top-banner-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--alouma-canvas)] text-[var(--alouma-jet)]">
      <TopBannerNav />
      <main className="min-w-0 px-4 py-5 sm:px-6 md:p-7 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
