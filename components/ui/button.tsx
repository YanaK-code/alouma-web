import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "dark";
};

const variants = {
  primary:
    "border-[var(--alouma-mustard)] bg-[var(--alouma-mustard)] text-[var(--alouma-jet)] shadow-[0_12px_26px_rgba(91,69,20,0.14)] hover:border-[#d4a43a] hover:bg-[#d4a43a] active:translate-y-px",
  secondary:
    "border-[var(--alouma-hairline-strong)] bg-[var(--alouma-surface)] text-[var(--alouma-jet)] hover:border-[rgba(17,17,15,0.25)] hover:bg-white active:translate-y-px",
  ghost:
    "border-transparent bg-transparent text-[var(--alouma-muted)] hover:bg-[var(--alouma-jet)]/5 hover:text-[var(--alouma-jet)] active:translate-y-px",
  dark:
    "border-[var(--alouma-jet)] bg-[var(--alouma-jet)] text-white hover:bg-[#24211d] active:translate-y-px",
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-xl border px-5 text-sm font-semibold leading-none transition duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alouma-focus)]",
        variants[variant],
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-[var(--alouma-hairline)] disabled:bg-[var(--alouma-surface-strong)] disabled:text-[var(--alouma-muted-soft)] disabled:shadow-none",
        className,
      )}
      type={type}
      {...props}
    />
  );
}

export function ButtonLink({
  children,
  className,
  href,
  variant = "primary",
}: {
  children: ReactNode;
  className?: string;
  href: string;
  variant?: ButtonProps["variant"];
}) {
  return (
    <Link
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-xl border px-5 text-sm font-semibold leading-none transition duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alouma-focus)]",
        variants[variant],
        className,
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
