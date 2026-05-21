import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

const variants = {
  primary: "border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-700",
  secondary: "border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100",
  ghost: "border-transparent bg-transparent text-neutral-700 hover:bg-neutral-100",
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
        "inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium",
        variants[variant],
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
        "inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium",
        variants[variant],
        className,
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
