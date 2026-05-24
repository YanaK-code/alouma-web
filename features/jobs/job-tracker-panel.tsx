"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useJobTrackerStore } from "@/lib/stores/job-store";
import { cn } from "@/lib/utils/cn";

function statusClassName(status: string) {
  if (status === "Interview" || status === "Offer") {
    return "border-[#315944]/20 bg-[#315944]/10 text-[#315944]";
  }

  if (status === "Rejected" || status === "Archived") {
    return "border-[var(--alouma-hairline)] bg-[var(--alouma-surface-soft)] text-[var(--alouma-muted)]";
  }

  if (status === "Matched") {
    return "border-[var(--alouma-mustard)]/30 bg-[var(--alouma-mustard-soft)] text-[var(--alouma-ink)]";
  }

  return "border-[var(--alouma-hairline)] bg-white text-[var(--alouma-muted)]";
}

export function JobTrackerPanel({
  className,
  limit = 3,
}: {
  className?: string;
  limit?: number;
}) {
  const trackedJobs = useJobTrackerStore((state) => state.trackedJobs);
  const hasHydrated = useJobTrackerStore((state) => state.hasHydrated);
  const addPlaceholderJob = useJobTrackerStore((state) => state.addPlaceholderJob);
  const cycleJobStatus = useJobTrackerStore((state) => state.cycleJobStatus);
  const visibleJobs = trackedJobs.slice(0, limit);

  return (
    <section
      className={cn(
        "rounded-[10px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-4 shadow-[var(--alouma-shadow-soft)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--alouma-muted-soft)]">
            Job tracker
          </p>
          <h2 className="mt-1 text-base font-semibold text-[var(--alouma-jet)]">
            Tracked jobs
          </h2>
        </div>
        <Button className="min-h-9 px-3 text-xs" onClick={addPlaceholderJob} variant="secondary">
          Add job
        </Button>
      </div>

      <div className="mt-4 grid gap-2">
        {!hasHydrated ? (
          <p className="rounded-[8px] border border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)] p-3 text-sm text-[var(--alouma-muted)]">
            Loading tracked jobs...
          </p>
        ) : null}
        {hasHydrated && visibleJobs.length === 0 ? (
          <p className="rounded-[8px] border border-dashed border-[var(--alouma-hairline-strong)] bg-[var(--alouma-canvas)] p-3 text-sm leading-6 text-[var(--alouma-muted)]">
            Save matched roles here as the job tracker grows.
          </p>
        ) : null}
        {hasHydrated
          ? visibleJobs.map((job) => (
              <article
                className="rounded-[8px] border border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)] p-3"
                key={job.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-[var(--alouma-jet)]">
                      {job.role}
                    </h3>
                    <p className="mt-1 truncate text-xs text-[var(--alouma-muted)]">
                      {job.company}
                      {job.matchScore ? ` - ${job.matchScore}% match` : ""}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2 py-1 text-[11px] font-semibold",
                      statusClassName(job.status),
                    )}
                  >
                    {job.status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    className="min-h-8 px-3 text-xs"
                    onClick={() => cycleJobStatus(job.id)}
                    variant="secondary"
                  >
                    Update status
                  </Button>
                  <Link
                    className="inline-flex min-h-8 items-center rounded-[8px] px-3 text-xs font-semibold text-[var(--alouma-muted)] transition hover:bg-white hover:text-[var(--alouma-jet)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alouma-focus)]"
                    href="/match"
                  >
                    Open match report
                  </Link>
                </div>
              </article>
            ))
          : null}
      </div>
    </section>
  );
}
