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
    <aside className="w-64 shrink-0 border-r border-neutral-200 bg-neutral-50 p-4">
      <Link className="mb-6 block text-lg font-semibold" href="/dashboard">
        Alouma
      </Link>
      <nav className="grid gap-1">
        {primaryLinks.map((link) => (
          <Link
            className={cn(
              "rounded-md px-3 py-2 text-sm text-neutral-700",
              pathname === link.href && "bg-white font-medium text-neutral-950 shadow-sm",
            )}
            href={link.href}
            key={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          CV Sections
        </p>
        <nav className="grid gap-1">
          {cvSections.map((section) => {
            const href = `/cv/${section}`;

            return (
              <Link
                className={cn(
                  "rounded-md px-3 py-2 text-sm text-neutral-700",
                  pathname === href && "bg-white font-medium text-neutral-950 shadow-sm",
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
