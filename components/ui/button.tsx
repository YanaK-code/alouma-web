import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "dark" | "on-color";
};

const variants = {
  primary:
    "border-[var(--alouma-mustard)] bg-[var(--alouma-mustard)] text-[var(--alouma-jet)] hover:border-[var(--alouma-mustard-strong)] hover:bg-[var(--alouma-mustard-strong)] hover:text-white",
  secondary:
    "border-[var(--alouma-hairline-strong)] bg-[var(--alouma-canvas)] text-[var(--alouma-jet)] hover:border-[rgba(17,17,15,0.32)] hover:bg-[var(--alouma-surface)]",
  ghost:
    "border-transparent bg-transparent text-[var(--alouma-muted)] hover:bg-[var(--alouma-jet)]/5 hover:text-[var(--alouma-jet)]",
  dark:
    "border-[var(--alouma-jet)] bg-[var(--alouma-jet)] text-white hover:bg-[#1c1a16]",
  "on-color":
    "border-white bg-white text-[var(--alouma-jet)] hover:bg-[var(--alouma-surface)]",
};

const base =
  "inline-flex min-h-10 items-center justify-center rounded-[8px] border px-4 text-sm font-semibold leading-none transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alouma-focus)]";

const disabled =
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-[var(--alouma-hairline)] disabled:bg-[var(--alouma-surface-strong)] disabled:text-[var(--alouma-muted-soft)] disabled:shadow-none";

const contrastStyles: Partial<Record<NonNullable<ButtonProps["variant"]>, CSSProperties>> = {
  dark: {
    backgroundColor: "var(--alouma-jet)",
    borderColor: "var(--alouma-jet)",
    color: "#ffffff",
  },
  "on-color": {
    backgroundColor: "#ffffff",
    borderColor: "#ffffff",
    color: "var(--alouma-jet)",
  },
};

export function Button({
  className,
  style,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], disabled, className)}
      style={{ ...contrastStyles[variant], ...style }}
      type={type}
      {...props}
    />
  );
}

export function ButtonLink({
  children,
  className,
  href,
  style,
  variant = "primary",
}: {
  children: ReactNode;
  className?: string;
  href: string;
  style?: CSSProperties;
  variant?: ButtonProps["variant"];
}) {
  return (
    <Link
      className={cn(base, variants[variant], className)}
      style={{ ...contrastStyles[variant], ...style }}
      href={href}
    >
      {children}
    </Link>
  );
}
