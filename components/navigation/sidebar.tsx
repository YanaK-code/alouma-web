"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/stores/app-store";
import { useResumeStore } from "@/lib/stores/resume-store";
import { cn } from "@/lib/utils/cn";

const primaryLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/cv", label: "CV Builder" },
  { href: "/match", label: "Match to Job" },
  { href: "/cv/preview", label: "Preview" },
  { href: "/saved", label: "Saved CVs" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const resume = useResumeStore((state) => state.activeResume);
  const resetPlaceholderFlow = useAppStore((state) => state.resetPlaceholderFlow);
  const displayName = resume.basics.fullName.trim() || "Alouma User";
  const displayEmail = resume.basics.email.trim() || "alex@example.com";
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  function isActive(href: string) {
    if (href === "/cv") {
      return pathname === "/cv" || (pathname.startsWith("/cv/") && pathname !== "/cv/preview");
    }

    return pathname === href;
  }

  function signOut() {
    setIsUserMenuOpen(false);
    resetPlaceholderFlow();
    router.push("/login");
  }

  return (
    <aside className="shrink-0 border-b border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)] px-4 py-4 md:sticky md:top-0 md:flex md:h-screen md:w-64 md:flex-col md:border-b-0 md:border-r md:p-5">
      <Link
        className="mb-3 flex items-center justify-between rounded-[8px] px-2 py-1.5 text-lg font-semibold tracking-[-0.01em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alouma-focus)] md:mb-4"
        href="/dashboard"
      >
        <span>Alouma</span>
        <span className="hidden h-1 w-8 rounded-full bg-[var(--alouma-mustard)] md:block" />
      </Link>
      <div className="relative mb-4 md:mb-6">
        <button
          aria-expanded={isUserMenuOpen}
          className="flex w-full items-center gap-3 rounded-[8px] border border-transparent px-2 py-2 text-left transition hover:border-[var(--alouma-hairline)] hover:bg-[var(--alouma-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alouma-focus)]"
          onClick={() => setIsUserMenuOpen((value) => !value)}
          type="button"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--alouma-hairline-strong)] bg-[var(--alouma-surface)] text-xs font-semibold text-[var(--alouma-jet)]">
            {initials || "AU"}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-[var(--alouma-jet)]">
              {displayName}
            </span>
            <span className="block truncate text-xs text-[var(--alouma-muted)]">
              {displayEmail}
            </span>
          </span>
        </button>
        {isUserMenuOpen ? (
          <div className="absolute left-0 right-0 z-20 mt-2 rounded-[10px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-1 shadow-[var(--alouma-shadow-card)]">
            <Link
              className="block rounded-[8px] px-3 py-2 text-sm font-medium text-[var(--alouma-muted)] hover:bg-[var(--alouma-canvas)] hover:text-[var(--alouma-jet)]"
              href="/profile"
              onClick={() => setIsUserMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              className="block rounded-[8px] px-3 py-2 text-sm font-medium text-[var(--alouma-muted)] hover:bg-[var(--alouma-canvas)] hover:text-[var(--alouma-jet)]"
              href="/settings"
              onClick={() => setIsUserMenuOpen(false)}
            >
              Settings
            </Link>
            <button
              className="block w-full rounded-[8px] px-3 py-2 text-left text-sm font-medium text-[var(--alouma-muted)] hover:bg-[var(--alouma-canvas)] hover:text-[var(--alouma-jet)]"
              onClick={signOut}
              type="button"
            >
              Sign out
            </button>
          </div>
        ) : null}
      </div>
      <nav className="flex gap-1 overflow-x-auto pb-1 md:grid md:overflow-visible md:pb-0">
        {primaryLinks.map((link) => (
          <Link
            className={cn(
              "whitespace-nowrap rounded-[8px] px-3 py-2 text-sm font-medium text-[var(--alouma-muted)] transition-colors hover:bg-[var(--alouma-jet)]/5 hover:text-[var(--alouma-jet)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alouma-focus)]",
              isActive(link.href) &&
                "bg-[var(--alouma-surface)] text-[var(--alouma-jet)] shadow-[inset_0_0_0_1px_var(--alouma-hairline)] hover:bg-[var(--alouma-surface)]",
              link.href === "/match" &&
                !isActive(link.href) &&
                "text-[var(--alouma-jet)] shadow-[inset_0_0_0_1px_var(--alouma-hairline)]",
            )}
            href={link.href}
            key={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
