"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, TextArea, TextInput } from "@/components/ui/field";
import { JobTrackerPanel } from "@/features/jobs/job-tracker-panel";
import { useJobTrackerStore } from "@/lib/stores/job-store";
import { type LocalResumeDraft, useResumeStore } from "@/lib/stores/resume-store";
import { cn } from "@/lib/utils/cn";
import type { Resume } from "@/schemas/resume";

type PlaceholderMatchReport = {
  score: number;
  roleFocus: string;
  keywordsToCheck: string[];
  sectionsToReview: string[];
  suggestedNextStep: string;
};

function tokenize(value: string) {
  return Array.from(
    new Set(
      value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 3),
    ),
  );
}

function baseResumeText(resume: Resume) {
  return [
    resume.basics.headline,
    resume.summary,
    resume.skills.join(" "),
    resume.programsTools.join(" "),
    resume.experience.map((item) => `${item.role} ${item.company} ${item.bullets.join(" ")}`).join(" "),
  ].join(" ");
}

function makeMatchedTitle(baseTitle: string, role: string, company: string) {
  const cleanRole = role.trim();
  const cleanCompany = company.trim();

  if (cleanRole && cleanCompany) {
    return `${cleanRole} at ${cleanCompany}`;
  }

  if (cleanRole) {
    return `${cleanRole} matched CV`;
  }

  if (cleanCompany) {
    return `${cleanCompany} matched CV`;
  }

  return `${baseTitle} - Matched CV`;
}

function generatePlaceholderReport(
  baseDraft: LocalResumeDraft,
  jobDescription: string,
  role: string,
): PlaceholderMatchReport {
  const resumeTerms = new Set(tokenize(baseResumeText(baseDraft.resumeJson)));
  const jobTerms = tokenize(jobDescription);
  const matchingTerms = jobTerms.filter((term) => resumeTerms.has(term));
  const keywordsToCheck = jobTerms.filter((term) => !resumeTerms.has(term)).slice(0, 8);
  const sectionsToReview = [
    !baseDraft.resumeJson.summary.trim() ? "Summary" : null,
    matchingTerms.length < 4 ? "Experience bullets" : null,
    keywordsToCheck.length > 0 ? "Skills and tools" : null,
    baseDraft.resumeJson.projects.length === 0 ? "Projects" : null,
  ].filter((section): section is string => Boolean(section));
  const score = Math.min(88, Math.max(42, 48 + matchingTerms.length * 6));

  return {
    score,
    roleFocus: role.trim() || baseDraft.resumeJson.basics.headline || "Target role",
    keywordsToCheck:
      keywordsToCheck.length > 0
        ? keywordsToCheck
        : ["impact", "scope", "metrics", "tools"],
    sectionsToReview:
      sectionsToReview.length > 0 ? sectionsToReview : ["Summary", "Experience bullets"],
    suggestedNextStep:
      "Create a matched CV copy, then review the highlighted sections manually before export.",
  };
}

function reportToResumeMatchResult(report: PlaceholderMatchReport): Resume["jobMatch"]["result"] {
  return {
    score: report.score,
    strengths: [report.roleFocus, ...report.keywordsToCheck.slice(0, 3)],
    gaps: report.sectionsToReview.map((section) => `Review ${section.toLowerCase()} for this role.`),
  };
}

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function MatchWorkspace() {
  const router = useRouter();
  const savedDrafts = useResumeStore((state) => state.savedDrafts);
  const hasHydrated = useResumeStore((state) => state.hasHydrated);
  const createBaseDraft = useResumeStore((state) => state.createBaseDraft);
  const createMatchedDraftFromBase = useResumeStore((state) => state.createMatchedDraftFromBase);
  const addTrackedJob = useJobTrackerStore((state) => state.addTrackedJob);
  const [selectedBaseId, setSelectedBaseId] = useState<string | null>(null);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [trackedJobId, setTrackedJobId] = useState<string | null>(null);
  const [report, setReport] = useState<PlaceholderMatchReport | null>(null);
  const [matchedDraftId, setMatchedDraftId] = useState<string | null>(null);
  const baseDrafts = useMemo(
    () => savedDrafts.filter((draft) => draft.kind === "base" && !draft.deletedAt),
    [savedDrafts],
  );
  const selectedBase =
    baseDrafts.find((draft) => draft.id === selectedBaseId) ?? baseDrafts[0] ?? null;

  function createNewCV() {
    createBaseDraft();
    router.push("/cv");
  }

  function resetGeneratedState() {
    setReport(null);
    setTrackedJobId(null);
    setMatchedDraftId(null);
  }

  function generateReport() {
    if (!selectedBase || jobDescription.trim().length === 0) {
      return;
    }

    const nextReport = generatePlaceholderReport(selectedBase, jobDescription, role);
    const nextJobId =
      trackedJobId ??
      addTrackedJob({
        company,
        role,
        jobDescription,
        matchScore: nextReport.score,
        status: "Matched",
      });

    setTrackedJobId(nextJobId);
    setReport(nextReport);
    setMatchedDraftId(null);
  }

  function createMatchedCV() {
    if (!selectedBase || !report) {
      return;
    }

    const nextJobId =
      trackedJobId ??
      addTrackedJob({
        company,
        role,
        jobDescription,
        matchScore: report.score,
        status: "Matched",
      });
    const nextMatchedDraftId = createMatchedDraftFromBase(selectedBase.id, {
      activeTargetJobId: nextJobId,
      title: makeMatchedTitle(selectedBase.title, role, company),
      jobDescription,
      matchResult: reportToResumeMatchResult(report),
    });

    if (nextMatchedDraftId) {
      setTrackedJobId(nextJobId);
      setMatchedDraftId(nextMatchedDraftId);
      router.push("/cv");
    }
  }

  if (!hasHydrated) {
    return (
      <div className="rounded-[16px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-6 text-sm text-[var(--alouma-muted)]">
        Loading match workspace...
      </div>
    );
  }

  if (baseDrafts.length === 0) {
    return (
      <>
        <PageHeader
          description="Match to Job starts from a reusable base CV. No backend or AI calls are used in this local flow."
          title="Match to Job"
        />
        <Card className="max-w-2xl rounded-[12px] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--alouma-muted-soft)]">
            Base CV required
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.01em] text-[var(--alouma-jet)]">
            Create a base CV before matching to a job.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--alouma-muted)]">
            A matched CV is a job-specific copy. Creating a base CV first keeps your reusable
            master CV separate and unchanged.
          </p>
          <Button className="mt-5" onClick={createNewCV} variant="dark">
            Create New CV
          </Button>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        description="Choose a base CV, paste a job description, generate a deterministic placeholder report, then create a local matched copy."
        title="Match to Job"
      />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="grid gap-4">
          <Card variant="jet">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/55">
              Local placeholder flow
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.01em]">
              Match without changing your base CV.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
              This report is deterministic placeholder logic until AI gateway integration. It does
              not call an LLM provider or backend service.
            </p>
          </Card>

          <Card className="rounded-[12px] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--alouma-muted-soft)]">
              1. Choose base CV
            </p>
            <div className="mt-4 grid gap-2">
              {baseDrafts.map((draft) => {
                const selected = selectedBase?.id === draft.id;

                return (
                  <button
                    aria-pressed={selected}
                    className={cn(
                      "rounded-[8px] border p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alouma-focus)]",
                      selected
                        ? "border-[var(--alouma-jet)] bg-white"
                        : "border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)] hover:border-[var(--alouma-hairline-strong)] hover:bg-white",
                    )}
                    key={draft.id}
                    onClick={() => {
                      setSelectedBaseId(draft.id);
                      resetGeneratedState();
                    }}
                    type="button"
                  >
                    <span className="block text-sm font-semibold text-[var(--alouma-jet)]">
                      {draft.title}
                    </span>
                    <span className="mt-1 block text-xs text-[var(--alouma-muted)]">
                      {draft.resumeJson.basics.fullName || "Untitled candidate"} · Updated{" "}
                      {formatUpdatedAt(draft.updatedAt)}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="rounded-[12px] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--alouma-muted-soft)]">
              2. Add target role
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Company (optional)">
                <TextInput
                  onChange={(event) => {
                    setCompany(event.target.value);
                    resetGeneratedState();
                  }}
                  placeholder="Company name"
                  value={company}
                />
              </Field>
              <Field label="Role (optional)">
                <TextInput
                  onChange={(event) => {
                    setRole(event.target.value);
                    resetGeneratedState();
                  }}
                  placeholder="Target role"
                  value={role}
                />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Job description">
                <TextArea
                  className="min-h-64"
                  onChange={(event) => {
                    setJobDescription(event.target.value);
                    resetGeneratedState();
                  }}
                  placeholder="Paste a role description here..."
                  value={jobDescription}
                />
              </Field>
            </div>
            <Button
              className="mt-4"
              disabled={!selectedBase || jobDescription.trim().length === 0}
              onClick={generateReport}
            >
              Generate Placeholder Report
            </Button>
            <p className="mt-2 text-xs leading-5 text-[var(--alouma-muted-soft)]">
              Placeholder only. No AI analysis, backend call, analytics event, or base CV mutation
              happens here.
            </p>
          </Card>
        </section>

        <aside className="grid content-start gap-4">
          <Card className="rounded-[12px] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--alouma-muted-soft)]">
              Placeholder match report
            </p>
            {report ? (
              <div className="mt-4 grid gap-4 text-sm">
                <p className="rounded-[12px] border border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)] p-4">
                  <span className="font-semibold">Placeholder score:</span> {report.score}%
                </p>
                <div>
                  <h3 className="font-semibold text-[var(--alouma-jet)]">Role focus</h3>
                  <p className="mt-1 text-[var(--alouma-muted)]">{report.roleFocus}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--alouma-jet)]">Keywords to check</h3>
                  <p className="mt-1 text-[var(--alouma-muted)]">
                    {report.keywordsToCheck.join(", ")}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--alouma-jet)]">Sections to review</h3>
                  <ul className="mt-2 list-disc pl-5 text-[var(--alouma-muted)]">
                    {report.sectionsToReview.map((section) => (
                      <li key={section}>{section}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--alouma-jet)]">Suggested next step</h3>
                  <p className="mt-1 text-[var(--alouma-muted)]">{report.suggestedNextStep}</p>
                </div>
                <Button onClick={createMatchedCV} variant="dark">
                  Create Matched CV Copy
                </Button>
                {matchedDraftId ? (
                  <p className="text-xs text-[var(--alouma-muted-soft)]">
                    Matched CV created locally.
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="mt-4 rounded-[12px] border border-dashed border-[var(--alouma-hairline-strong)] bg-[var(--alouma-canvas)] p-4 text-sm leading-6 text-[var(--alouma-muted)]">
                Choose a base CV and paste a job description to generate the local placeholder
                report.
              </p>
            )}
          </Card>
          <JobTrackerPanel />
        </aside>
      </div>
    </>
  );
}
