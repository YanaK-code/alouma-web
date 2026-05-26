"use client";

import Link from "next/link";
import type { CvSection } from "@/lib/router/routes";
import { cvSectionLabels } from "@/lib/router/routes";
import { builderSections } from "@/lib/resume/readiness";
import { cn } from "@/lib/utils/cn";

export function CVSectionSidebar({ activeSection }: { activeSection?: CvSection }) {
  return (
    <aside className="min-w-0">
      <nav className="grid gap-1 rounded-[10px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-3 xl:sticky xl:top-24">
        <p className="px-2 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--alouma-muted-soft)]">
          CV sections
        </p>
        {builderSections.map((section, index) => {
          const isActive = activeSection === section;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-[8px] px-2.5 py-2 text-sm font-medium text-[var(--alouma-muted)] transition hover:bg-[var(--alouma-canvas)] hover:text-[var(--alouma-jet)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alouma-focus)]",
                isActive && "bg-[var(--alouma-canvas)] text-[var(--alouma-jet)] shadow-[inset_0_0_0_1px_var(--alouma-hairline)]",
              )}
              href={`/cv/${section}`}
              key={section}
            >
              <span className="text-xs font-semibold text-[var(--alouma-muted-soft)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="truncate">{cvSectionLabels[section]}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
