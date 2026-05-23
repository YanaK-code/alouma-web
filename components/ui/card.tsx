import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type CardVariant = "default" | "cream" | "feature" | "mustard" | "jet";

const variants: Record<CardVariant, string> = {
  default:
    "rounded-[16px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-6",
  cream:
    "rounded-[16px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface-soft)] p-6",
  feature:
    "rounded-[24px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface-soft)] p-8",
  mustard:
    "rounded-[24px] border border-[var(--alouma-mustard)] bg-[var(--alouma-mustard-soft)] p-8 text-[var(--alouma-jet)]",
  jet:
    "rounded-[24px] border border-[var(--alouma-jet)] bg-[var(--alouma-jet)] p-8 text-white",
};

export function Card({
  children,
  className,
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
}) {
  return (
    <section className={cn(variants[variant], className)}>{children}</section>
  );
}
