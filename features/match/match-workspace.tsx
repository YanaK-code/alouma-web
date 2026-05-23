"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
      <div className="rounded-md border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
        Loading match workspace...
      </div>
    );
  }

  const jobDescription = resume.jobMatch.jobDescription;
  const result = resume.jobMatch.result;

  return (
    <>
      <PageHeader
        description="Stores a target job description on the active local draft."
        title="Match to Job"
      />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <Field label="Paste job description">
            <TextArea
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
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Mock Result</h2>
          {result ? (
            <div className="mt-4 grid gap-3 text-sm">
              <p>
                <span className="font-medium">Match score:</span> {result.score}%
              </p>
              <p>
                <span className="font-medium">Strengths:</span>{" "}
                {result.strengths.join(", ")}
              </p>
              <div>
                <p className="font-medium">Gaps</p>
                <ul className="mt-2 list-disc pl-5 text-neutral-600">
                  {result.gaps.map((gap) => (
                    <li key={gap}>{gap}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-neutral-600">
              Generate a match to see a deterministic placeholder result.
            </p>
          )}
        </Card>
      </div>
    </>
  );
}
