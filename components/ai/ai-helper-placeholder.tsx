"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function AIHelperPlaceholder({
  actionLabel = "View status",
  title,
  description,
}: {
  actionLabel?: string;
  title: string;
  description: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="rounded-[10px] border-dashed p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--alouma-muted-soft)]">
            AI helper · Coming soon
          </p>
          <h3 className="mt-1 text-base font-semibold text-[var(--alouma-jet)]">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--alouma-muted)]">{description}</p>
        </div>
        <Button
          className="shrink-0"
          onClick={() => setIsOpen((value) => !value)}
          variant="secondary"
        >
          {actionLabel}
        </Button>
      </div>
      {isOpen ? (
        <div className="mt-4 rounded-[8px] border border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)] p-3 text-sm leading-6 text-[var(--alouma-muted)]">
          The secure AI gateway is not connected yet. Suggestions will be previewed before they
          change your CV, and this placeholder does not store or generate AI output.
        </div>
      ) : null}
    </Card>
  );
}
