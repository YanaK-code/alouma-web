"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { JobTrackerPanel } from "@/features/jobs/job-tracker-panel";
import { Field, TextArea } from "@/components/ui/field";
import { useResumeStore } from "@/lib/stores/resume-store";
import type { Resume } from "@/schemas/resume";

function tokenize(value: string) {
  return new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 3),
  );
}

function generateMatchResult(resume: Resume) {
  const jobDescription = resume.jobMatch.jobDescription;
  const resumeTerms = tokenize(
    [
      resume.basics.headline,
      resume.summary,
      resume.skills.join(" "),
      resume.programsTools.join(" "),
      resume.experience.map((item) => `${item.role} ${item.company} ${item.bullets.join(" ")}`).join(" "),
    ].join(" "),
  );
  const jobTerms = Array.from(tokenize(jobDescription));
  const matchingTerms = jobTerms.filter((term) => resumeTerms.has(term));
  const score = Math.min(95, Math.max(35, 45 + matchingTerms.length * 7));
  const strengths = matchingTerms.slice(0, 4);
  const missingTools = jobTerms
    .filter((term) => !resumeTerms.has(term))
    .slice(0, 3);

  return {
    score,
    strengths: strengths.length > 0 ? strengths : ["clear draft structure"],
    gaps:
      missingTools.length > 0
        ? missingTools.map((term) => `Consider adding evidence for "${term}".`)
        : ["Add measurable outcomes for stronger targeting."],
  };
}

export function MatchWorkspace() {
  const resume = useResumeStore((state) => state.activeResume);
  const hasHydrated = useResumeStore((state) => state.hasHydrated);
  const updateResume = useResumeStore((state) => state.updateResume);

  if (!hasHydrated) {
    return (
      <div className="rounded-[16px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-6 text-sm text-[var(--alouma-muted)]">
        Loading match workspace...
      </div>
    );
  }

  const jobDescription = resume.jobMatch.jobDescription;
  const result = resume.jobMatch.result;

  return (
    <>
      <PageHeader
        description="Match the active local draft against a target role, then keep the opportunity visible in the tracker."
        title="Match to Job"
      />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="grid gap-4">
          <Card variant="jet">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/55">
              Hero workflow
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.01em]">
              Tailor the draft before it leaves your workspace.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
              This pass keeps matching deterministic and local. The entry point is now visible
              while future AI/backend matching remains out of scope.
            </p>
          </Card>

          <Card className="rounded-[12px] p-5">
          <Field label="Paste job description">
            <TextArea
              className="min-h-64"
              onChange={(event) =>
                updateResume((current) => ({
                  ...current,
                  jobMatch: {
                    ...current.jobMatch,
                    jobDescription: event.target.value,
                    result: null,
                  },
                }))
              }
              placeholder="Paste a role description here..."
              value={jobDescription}
            />
          </Field>
          <Button
            className="mt-4"
            disabled={jobDescription.trim().length === 0}
            title={
              jobDescription.trim().length === 0
                ? "Paste a job description to enable match generation."
                : undefined
            }
            onClick={() =>
              updateResume((current) => ({
                ...current,
                jobMatch: {
                  ...current.jobMatch,
                  result: generateMatchResult(current),
                },
              }))
            }
          >
            Generate Match
          </Button>
          {jobDescription.trim().length === 0 ? (
            <p className="mt-2 text-xs text-[var(--alouma-muted-soft)]">
              Paste a job description to enable this deterministic placeholder.
            </p>
          ) : null}
          </Card>
        </section>

        <aside className="grid content-start gap-4">
          <Card className="rounded-[12px] p-5">
          <h2 className="text-lg font-semibold text-[var(--alouma-jet)]">Mock Result</h2>
          {result ? (
            <div className="mt-4 grid gap-3 text-sm">
              <p className="rounded-[12px] border border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)] p-4">
                <span className="font-semibold">Match score:</span> {result.score}%
              </p>
              <p>
                <span className="font-semibold">Strengths:</span>{" "}
                {result.strengths.join(", ")}
              </p>
              <div>
                <p className="font-semibold">Gaps</p>
                <ul className="mt-2 list-disc pl-5 text-[var(--alouma-muted)]">
                  {result.gaps.map((gap) => (
                    <li key={gap}>{gap}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="mt-4 rounded-[12px] border border-dashed border-[var(--alouma-hairline-strong)] bg-[var(--alouma-canvas)] p-4 text-sm leading-6 text-[var(--alouma-muted)]">
              Generate a match to see a deterministic placeholder result.
            </p>
          )}
          </Card>
          <JobTrackerPanel />
        </aside>
      </div>
    </>
  );
}
