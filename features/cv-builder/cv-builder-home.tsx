"use client";

import Link from "next/link";
import { DesignPanel } from "@/components/design/design-panel";
import { PageHeader } from "@/components/layout/page-header";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PreviewPanel } from "@/features/preview/preview-panel";
import { cvSectionLabels } from "@/lib/router/routes";
import {
  builderSectionDescriptions,
  builderSections,
  getMissingReadinessItems,
  getNextBestAction,
  getReadinessScore,
  hasEnoughContentForMatch,
} from "@/lib/resume/readiness";
import { useResumeStore } from "@/lib/stores/resume-store";
import { cn } from "@/lib/utils/cn";

function sectionIsComplete(section: (typeof builderSections)[number], missingSections: Set<string>) {
  return !missingSections.has(section);
}

export function CVBuilderHome() {
  const resume = useResumeStore((state) => state.activeResume);
  const hasHydrated = useResumeStore((state) => state.hasHydrated);
  const saveDraft = useResumeStore((state) => state.saveDraft);
  const resetDraft = useResumeStore((state) => state.resetDraft);

  if (!hasHydrated) {
    return (
      <div className="rounded-[10px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-5 text-sm text-[var(--alouma-muted)]">
        Loading CV builder...
      </div>
    );
  }

  const readinessScore = getReadinessScore(resume);
  const missingItems = getMissingReadinessItems(resume);
  const nextAction = getNextBestAction(resume);
  const missingSections = new Set(missingItems.map((item) => item.section));
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

      <div className="grid min-w-0 gap-6 2xl:grid-cols-[minmax(640px,1fr)_minmax(420px,520px)]">
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

          <div className="grid gap-3 md:grid-cols-2">
            {builderSections.map((section, index) => {
              const complete = sectionIsComplete(section, missingSections);

              return (
                <Link
                  className={cn(
                    "rounded-[10px] border bg-[var(--alouma-surface)] p-4 transition-colors duration-150 hover:border-[var(--alouma-hairline-strong)] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alouma-focus)]",
                    complete
                      ? "border-[var(--alouma-hairline)]"
                      : "border-[var(--alouma-hairline-strong)]",
                  )}
                  href={`/cv/${section}`}
                  key={section}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-[var(--alouma-muted-soft)]">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h2 className="mt-1 font-semibold tracking-[-0.01em] text-[var(--alouma-jet)]">
                        {cvSectionLabels[section]}
                      </h2>
                    </div>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-1 text-[11px] font-semibold",
                        complete
                          ? "border-[#315944]/20 bg-[#315944]/10 text-[#315944]"
                          : "border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)] text-[var(--alouma-muted)]",
                      )}
                    >
                      {complete ? "Ready" : "Needs work"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--alouma-muted)]">
                    {builderSectionDescriptions[section]}
                  </p>
                </Link>
              );
            })}
          </div>

          <details className="border-t border-[var(--alouma-hairline)] py-4 2xl:hidden">
            <summary className="cursor-pointer text-sm font-semibold text-[var(--alouma-jet)]">
              Design and live preview
            </summary>
            <div className="mt-4 grid gap-4">
              <DesignPanel compact />
              <PreviewPanel />
            </div>
          </details>
        </section>

        <aside className="hidden min-w-0 gap-4 2xl:grid">
          <DesignPanel />
          <section className="min-w-0 border-t border-[var(--alouma-hairline)] pt-4">
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
        </aside>
      </div>
    </>
  );
}
