import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-6 shadow-[var(--alouma-shadow-soft)]",
        className,
      )}
    >
      {children}
    </section>
  );
}
