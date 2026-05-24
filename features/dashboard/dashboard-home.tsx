"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { JobTrackerPanel } from "@/features/jobs/job-tracker-panel";
import {
  getMissingReadinessItems,
  getNextBestAction,
  getReadinessScore,
  hasEnoughContentForMatch,
} from "@/lib/resume/readiness";
import { useResumeStore } from "@/lib/stores/resume-store";

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function DashboardHome() {
  const resume = useResumeStore((state) => state.activeResume);
  const savedDrafts = useResumeStore((state) => state.savedDrafts);
  const hasHydrated = useResumeStore((state) => state.hasHydrated);
  const saveDraft = useResumeStore((state) => state.saveDraft);

  if (!hasHydrated) {
    return (
      <div className="rounded-[10px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-5 text-sm text-[var(--alouma-muted)]">
        Loading dashboard...
      </div>
    );
  }

  const candidateName = resume.basics.fullName.trim() || "your draft";
  const readinessScore = getReadinessScore(resume);
  const missingItems = getMissingReadinessItems(resume);
  const nextAction = getNextBestAction(resume);
  const matchReady = hasEnoughContentForMatch(resume);
  const recentDrafts = savedDrafts.slice(0, 3);

  return (
    <>
      <PageHeader
        description={`Active draft: ${resume.meta.title}. Last edited ${formatUpdatedAt(
          resume.meta.updatedAt,
        )}.`}
        title={`Good work, ${candidateName.split(" ")[0] || "there"}`}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
        <section className="grid gap-4">
          <Card className="rounded-[12px] p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--alouma-muted-soft)]">
                  Current CV
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.015em] text-[var(--alouma-jet)]">
                  {resume.basics.headline || "Build a focused, recruiter-ready draft"}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[var(--alouma-muted)]">
                  {resume.summary ||
                    "Complete the essentials, preview the rendered CV, then match it against a role before export."}
                </p>
              </div>
              <div className="min-w-36 rounded-[10px] border border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--alouma-muted-soft)]">
                  Readiness
                </p>
                <p className="mt-2 text-4xl font-semibold tracking-[-0.02em] text-[var(--alouma-jet)]">
                  {readinessScore}%
                </p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--alouma-surface-strong)]">
                  <div
                    className="h-full rounded-full bg-[var(--alouma-jet)]"
                    style={{ width: `${readinessScore}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <ButtonLink href="/cv" variant="dark">
                Continue building
              </ButtonLink>
              <ButtonLink href="/match" variant={matchReady ? "primary" : "secondary"}>
                Match this CV to a job
              </ButtonLink>
              <ButtonLink href="/cv/preview" variant="secondary">
                Preview
              </ButtonLink>
              <Button onClick={saveDraft} variant="ghost">
                Save draft
              </Button>
            </div>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="rounded-[12px] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--alouma-muted-soft)]">
                Next best action
              </p>
              <h2 className="mt-2 text-lg font-semibold text-[var(--alouma-jet)]">
                {nextAction.label}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--alouma-muted)]">
                Keep the draft moving through the guided builder. Essentials come before export,
                then matching gives the CV a target.
              </p>
              <ButtonLink className="mt-5" href={`/cv/${nextAction.section}`} variant="secondary">
                Open section
              </ButtonLink>
            </Card>

            <Card className="rounded-[12px] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--alouma-muted-soft)]">
                Export readiness
              </p>
              <h2 className="mt-2 text-lg font-semibold text-[var(--alouma-jet)]">
                {missingItems.length ? `${missingItems.length} items need attention` : "Ready to preview"}
              </h2>
              <div className="mt-4 grid gap-2">
                {(missingItems.length ? missingItems.slice(0, 4) : [{ label: "Preview and download the PDF" }]).map(
                  (item) => (
                    <div
                      className="rounded-[8px] border border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)] px-3 py-2 text-sm text-[var(--alouma-muted)]"
                      key={item.label}
                    >
                      {item.label}
                    </div>
                  ),
                )}
              </div>
            </Card>
          </div>
        </section>

        <aside className="grid gap-4">
          <Card variant="jet">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/55">
              Hero workflow
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.01em]">
              Match the active draft before sending it out.
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Paste a job description, review the deterministic placeholder score, and keep the
              matched role in your tracker.
            </p>
            <ButtonLink className="mt-5" href="/match" variant="on-color">
              Match to Job
            </ButtonLink>
          </Card>

          <JobTrackerPanel />

          <Card className="rounded-[12px] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--alouma-muted-soft)]">
              Saved CVs
            </p>
            <h2 className="mt-2 text-base font-semibold text-[var(--alouma-jet)]">
              {recentDrafts.length ? "Recent drafts" : "No saved drafts yet"}
            </h2>
            <div className="mt-4 grid gap-2">
              {recentDrafts.length ? (
                recentDrafts.map((draft) => (
                  <div
                    className="rounded-[8px] border border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)] px-3 py-2"
                    key={draft.meta.id}
                  >
                    <p className="truncate text-sm font-semibold text-[var(--alouma-jet)]">
                      {draft.meta.title}
                    </p>
                    <p className="mt-1 text-xs text-[var(--alouma-muted)]">
                      {formatUpdatedAt(draft.meta.updatedAt)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-6 text-[var(--alouma-muted)]">
                  Save the active draft to create a restorable local copy.
                </p>
              )}
            </div>
            <ButtonLink className="mt-5 w-full" href="/saved" variant="secondary">
              Open saved CVs
            </ButtonLink>
          </Card>
        </aside>
      </div>
    </>
  );
}
