"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cvSections, cvSectionLabels } from "@/lib/router/routes";
import { cn } from "@/lib/utils/cn";

const primaryLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/cv", label: "CV Builder" },
  { href: "/cv/preview", label: "Preview" },
  { href: "/match", label: "Match to Job" },
  { href: "/saved", label: "Saved CVs" },
  { href: "/settings", label: "Settings" },
  { href: "/profile", label: "Profile" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="shrink-0 border-b border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)] px-4 py-4 md:sticky md:top-0 md:h-screen md:w-72 md:border-b-0 md:border-r md:p-6">
      <Link
        className="mb-4 flex items-center justify-between rounded-[8px] px-2 py-1.5 text-lg font-semibold tracking-[-0.01em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alouma-focus)] md:mb-8"
        href="/dashboard"
      >
        <span>Alouma</span>
        <span className="hidden h-1 w-10 rounded-full bg-[var(--alouma-mustard)] md:block" />
      </Link>
      <nav className="flex gap-1 overflow-x-auto pb-1 md:grid md:overflow-visible md:pb-0">
        {primaryLinks.map((link) => (
          <Link
            className={cn(
              "whitespace-nowrap rounded-[8px] px-3 py-2 text-sm font-medium text-[var(--alouma-muted)] transition-colors hover:bg-[var(--alouma-jet)]/5 hover:text-[var(--alouma-jet)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alouma-focus)]",
              pathname === link.href &&
                "bg-[var(--alouma-surface-soft)] text-[var(--alouma-jet)] hover:bg-[var(--alouma-surface-soft)]",
            )}
            href={link.href}
            key={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8 hidden md:block">
        <p className="alouma-eyebrow mb-3 px-3 text-[var(--alouma-muted-soft)]">
          CV Sections
        </p>
        <nav className="grid gap-1">
          {cvSections.map((section) => {
            const href = `/cv/${section}`;

            return (
              <Link
                className={cn(
                  "rounded-[8px] px-3 py-2 text-sm font-medium text-[var(--alouma-muted)] transition-colors hover:bg-[var(--alouma-jet)]/5 hover:text-[var(--alouma-jet)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alouma-focus)]",
                  pathname === href &&
                    "bg-[var(--alouma-surface-soft)] text-[var(--alouma-jet)]",
                )}
                href={href}
                key={section}
              >
                {cvSectionLabels[section]}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
