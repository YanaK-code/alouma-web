"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/stores/app-store";
import { cn } from "@/lib/utils/cn";

const primaryLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/cv", label: "CV Builder" },
  { href: "/match", label: "Match to Job" },
  { href: "/cv/preview", label: "Preview" },
  { href: "/saved", label: "Saved CVs" },
] as const;

function isActiveRoute(pathname: string, href: string) {
  if (href === "/cv") {
    return pathname === "/cv" || (pathname.startsWith("/cv/") && pathname !== "/cv/preview");
  }

  return pathname === href;
}

function ProfileControl() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const resetPlaceholderFlow = useAppStore((state) => state.resetPlaceholderFlow);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleLocalDemoSignOut() {
    setIsOpen(false);
    resetPlaceholderFlow();
    router.replace("/login");
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Open profile menu"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--alouma-hairline-strong)] bg-[var(--alouma-mustard-soft)] text-xs font-semibold text-[var(--alouma-jet)] transition hover:border-[var(--alouma-jet)] hover:bg-[var(--alouma-mustard)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alouma-focus)]"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        YP
      </button>
      {isOpen ? (
        <div
          aria-label="Profile menu"
          className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-48 rounded-[10px] border border-[var(--alouma-hairline)] bg-white p-1.5 shadow-[0_18px_45px_rgba(17,17,15,0.14)]"
          role="menu"
        >
          <Link
            className="block rounded-[8px] px-3 py-2 text-sm font-medium text-[var(--alouma-jet)] hover:bg-[var(--alouma-canvas)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alouma-focus)]"
            href="/profile"
            onClick={() => setIsOpen(false)}
            role="menuitem"
          >
            Account
          </Link>
          <Link
            className="block rounded-[8px] px-3 py-2 text-sm font-medium text-[var(--alouma-jet)] hover:bg-[var(--alouma-canvas)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alouma-focus)]"
            href="/settings"
            onClick={() => setIsOpen(false)}
            role="menuitem"
          >
            Settings
          </Link>
          <button
            className="block w-full rounded-[8px] px-3 py-2 text-left text-sm font-medium text-[var(--alouma-jet)] hover:bg-[var(--alouma-canvas)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alouma-focus)]"
            onClick={handleLocalDemoSignOut}
            role="menuitem"
            type="button"
          >
            Sign out
          </button>
          <p className="mt-1 border-t border-[var(--alouma-hairline)] px-3 pt-2 text-xs leading-5 text-[var(--alouma-muted)]">
            Local demo only. No real account session is connected yet.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function TopBannerNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <ProfileControl />
          <Link
            className="rounded-[8px] text-lg font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alouma-focus)]"
            href="/dashboard"
          >
            Alouma
          </Link>
        </div>
        <nav
          aria-label="Primary"
          className="flex gap-1 overflow-x-auto pb-1 lg:justify-end lg:overflow-visible lg:pb-0"
        >
          {primaryLinks.map((link) => {
            const isActive = isActiveRoute(pathname, link.href);

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative whitespace-nowrap rounded-[8px] px-3 py-2 text-sm font-medium text-[var(--alouma-muted)] transition-colors hover:bg-[var(--alouma-jet)]/5 hover:text-[var(--alouma-jet)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alouma-focus)]",
                  isActive &&
                    "bg-[var(--alouma-surface)] text-[var(--alouma-jet)] shadow-[inset_0_0_0_1px_var(--alouma-hairline)] after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:rounded-full after:bg-[var(--alouma-mustard)] hover:bg-[var(--alouma-surface)]",
                )}
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
