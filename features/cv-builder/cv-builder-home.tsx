"use client";

import { AIHelperPlaceholder } from "@/components/ai/ai-helper-placeholder";
import { DesignPanel } from "@/components/design/design-panel";
import { PageHeader } from "@/components/layout/page-header";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CVSectionSidebar } from "@/features/cv-builder/cv-section-sidebar";
import { PreviewPanel } from "@/features/preview/preview-panel";
import {
  getNextBestAction,
  getReadinessScore,
  hasEnoughContentForMatch,
} from "@/lib/resume/readiness";
import { useResumeStore } from "@/lib/stores/resume-store";

export function CVBuilderHome() {
  const resume = useResumeStore((state) => state.activeResume);
  const hasActiveDraft = useResumeStore((state) => state.hasActiveDraft);
  const hasHydrated = useResumeStore((state) => state.hasHydrated);
  const createBaseDraft = useResumeStore((state) => state.createBaseDraft);
  const saveDraft = useResumeStore((state) => state.saveDraft);
  const resetDraft = useResumeStore((state) => state.resetDraft);

  if (!hasHydrated) {
    return (
      <div className="rounded-[10px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-5 text-sm text-[var(--alouma-muted)]">
        Loading CV builder...
      </div>
    );
  }

  if (!hasActiveDraft) {
    return (
      <>
        <PageHeader
          description="Start with a reusable base CV, then create matched copies for specific jobs."
          title="CV Builder"
        />
        <Card className="max-w-2xl rounded-[12px] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--alouma-muted-soft)]">
            No active draft
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.01em] text-[var(--alouma-jet)]">
            Create a base CV to begin.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--alouma-muted)]">
            The builder edits the active local draft. Once created, changes persist in browser
            storage and the draft appears on your dashboard and Saved CVs list.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={() => createBaseDraft()} variant="dark">
              Create New CV
            </Button>
            <ButtonLink href="/saved" variant="secondary">
              Open Saved CVs
            </ButtonLink>
          </div>
        </Card>
      </>
    );
  }

  const readinessScore = getReadinessScore(resume);
  const nextAction = getNextBestAction(resume);
  const matchReady = hasEnoughContentForMatch(resume);

  return (
    <>
      <PageHeader
        actions={
          <div className="flex gap-2">
            <Button onClick={saveDraft} variant="secondary">
              Save Draft
            </Button>
            <Button onClick={resetDraft} variant="ghost">
              Reset
            </Button>
          </div>
        }
        description={`Active resume: ${resume.meta.title}. Move through the guided sections, then preview and match.`}
        title="CV Builder"
      />

      <div className="grid min-w-0 gap-6 xl:grid-cols-[220px_minmax(0,1fr)] 2xl:grid-cols-[220px_minmax(560px,1fr)_minmax(420px,520px)]">
        <CVSectionSidebar />

        <section className="grid min-w-0 gap-4">
          <Card className="rounded-[12px] p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--alouma-muted-soft)]">
                  Guided workspace
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.01em] text-[var(--alouma-jet)]">
                  Build the draft in order, then inspect the rendered CV.
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--alouma-muted)]">
                  Next: {nextAction.label}. The section hub keeps CV content inside the builder
                  instead of the global app navigation.
                </p>
              </div>
              <div className="w-full max-w-xs">
                <div className="flex items-end justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--alouma-muted-soft)]">
                    Readiness
                  </span>
                  <span className="text-2xl font-semibold text-[var(--alouma-jet)]">
                    {readinessScore}%
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--alouma-surface-strong)]">
                  <div
                    className="h-full rounded-full bg-[var(--alouma-jet)]"
                    style={{ width: `${readinessScore}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <ButtonLink href={`/cv/${nextAction.section}`} variant="dark">
                Continue next section
              </ButtonLink>
              <ButtonLink href="/cv/preview" variant="secondary">
                Live preview
              </ButtonLink>
              <ButtonLink href="/match" variant={matchReady ? "primary" : "secondary"}>
                Match to Job
              </ButtonLink>
            </div>
          </Card>

          <AIHelperPlaceholder
            actionLabel="Check status"
            description="AI review will check clarity, gaps, and role fit once the secure AI gateway is connected."
            title="Overall CV review helper"
          />

          <details className="border-t border-[var(--alouma-hairline)] py-4 2xl:hidden">
            <summary className="cursor-pointer text-sm font-semibold text-[var(--alouma-jet)]">
              Live preview and personalization
            </summary>
            <div className="mt-4 grid gap-4">
              <PreviewPanel />
              <DesignPanel compact />
            </div>
          </details>
        </section>

        <aside className="hidden min-w-0 gap-4 2xl:grid">
          <section className="min-w-0">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--alouma-muted-soft)]">
                  Preview
                </p>
                <h2 className="mt-1 text-base font-semibold text-[var(--alouma-jet)]">
                  Live CV output
                </h2>
              </div>
              <ButtonLink className="min-h-9 px-3 text-xs" href="/cv/preview" variant="secondary">
                Open
              </ButtonLink>
            </div>
            <PreviewPanel />
          </section>
          <DesignPanel />
        </aside>
      </div>
    </>
  );
}
