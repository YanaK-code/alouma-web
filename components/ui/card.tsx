import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type CardVariant = "default" | "cream" | "feature" | "mustard" | "jet";

const variants: Record<CardVariant, string> = {
  default:
    "rounded-[12px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-5",
  cream:
    "rounded-[12px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface-soft)] p-5",
  feature:
    "rounded-[12px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface-soft)] p-5",
  mustard:
    "rounded-[12px] border border-[var(--alouma-mustard)] bg-[var(--alouma-mustard-soft)] p-5 text-[var(--alouma-jet)]",
  jet:
    "rounded-[12px] border border-[var(--alouma-jet)] bg-[var(--alouma-jet)] p-5 text-white",
};

export function Card({
  children,
  className,
  style,
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  variant?: CardVariant;
}) {
  return (
    <section
      className={cn(variants[variant], className)}
      style={{
        ...(variant === "jet"
          ? {
              backgroundColor: "var(--alouma-jet)",
              borderColor: "var(--alouma-jet)",
              color: "#ffffff",
            }
          : {}),
        ...style,
      }}
    >
      {children}
    </section>
  );
}
