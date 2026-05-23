import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Field({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[var(--alouma-ink)]">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-11 rounded-[12px] border border-[var(--alouma-hairline-strong)] bg-white px-4 text-sm text-[var(--alouma-jet)] outline-none transition placeholder:text-[var(--alouma-muted-soft)] focus:border-[var(--alouma-jet)] focus:ring-4 focus:ring-[var(--alouma-focus)]",
        className,
      )}
      {...props}
    />
  );
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-36 rounded-[12px] border border-[var(--alouma-hairline-strong)] bg-white p-4 text-sm leading-6 text-[var(--alouma-jet)] outline-none transition placeholder:text-[var(--alouma-muted-soft)] focus:border-[var(--alouma-jet)] focus:ring-4 focus:ring-[var(--alouma-focus)]",
        className,
      )}
      {...props}
    />
  );
}
