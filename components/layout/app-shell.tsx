import type { ReactNode } from "react";
import Link from "next/link";
import { TopBannerNav } from "@/components/navigation/top-banner-nav";

type AppShellVariant = "app" | "public";

function PublicBrandHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)]/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Link
          aria-label="Go to Alouma home"
          className="rounded-[8px] text-lg font-semibold tracking-[-0.01em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alouma-focus)]"
          href="/"
        >
          Alouma
        </Link>
      </div>
    </header>
  );
}

export function AppShell({
  children,
  variant = "app",
}: {
  children: ReactNode;
  variant?: AppShellVariant;
}) {
  return (
    <div className="min-h-screen bg-[var(--alouma-canvas)] text-[var(--alouma-jet)]">
      {variant === "public" ? <PublicBrandHeader /> : <TopBannerNav />}
      <main className="min-w-0 px-4 py-5 sm:px-6 md:p-7 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
