import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-10 flex flex-col gap-4 border-b border-[var(--alouma-hairline)] pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="alouma-eyebrow">Alouma</p>
        <h1 className="alouma-display-section mt-3 text-3xl">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--alouma-muted)]">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
