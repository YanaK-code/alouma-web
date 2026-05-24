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
    <label className="grid min-w-0 gap-1.5 text-sm font-medium text-[var(--alouma-ink)]">
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--alouma-muted)]">
        {label}
      </span>
      {children}
    </label>
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 min-w-0 rounded-[6px] border border-[var(--alouma-hairline-strong)] bg-white px-3 text-sm text-[var(--alouma-jet)] outline-none transition placeholder:text-[var(--alouma-muted-soft)] focus:border-[var(--alouma-jet)] focus:ring-[3px] focus:ring-[var(--alouma-focus)]",
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
        "min-h-28 min-w-0 resize-y rounded-[6px] border border-[var(--alouma-hairline-strong)] bg-white p-3 text-sm leading-6 text-[var(--alouma-jet)] outline-none transition placeholder:text-[var(--alouma-muted-soft)] focus:border-[var(--alouma-jet)] focus:ring-[3px] focus:ring-[var(--alouma-focus)]",
        className,
      )}
      {...props}
    />
  );
}
