"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cvSections, cvSectionLabels } from "@/lib/router/routes";
import { useResumeStore } from "@/lib/stores/resume-store";

const sectionDescriptions: Record<(typeof cvSections)[number], string> = {
  basics: "Name, headline, contact links, and location.",
  summary: "A short professional summary for the top of the CV.",
  experience: "Work history with roles, companies, dates, and bullets.",
  education: "Schools, degrees, locations, and dates.",
  skills: "Skill chips shown in the CV side column.",
  "programs-tools": "Software, systems, and tools.",
  languages: "Languages and proficiency levels.",
  projects: "Selected project names and descriptions.",
  courses: "Courses, certificates, bootcamps, and dates.",
  licenses: "Professional licenses and issuing bodies.",
  awards: "Awards, honors, recognitions, and details.",
  volunteer: "Volunteer roles, organizations, dates, and bullets.",
  interests: "Personal interests that support the target role.",
};

export function CVBuilderHome() {
  const resume = useResumeStore((state) => state.activeResume);
  const hasHydrated = useResumeStore((state) => state.hasHydrated);
  const updateResume = useResumeStore((state) => state.updateResume);
  const saveDraft = useResumeStore((state) => state.saveDraft);
  const resetDraft = useResumeStore((state) => state.resetDraft);

  if (!hasHydrated) {
    return (
      <div className="rounded-[16px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-6 text-sm text-[var(--alouma-muted)]">
        Loading CV builder...
      </div>
    );
  }

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
        description={`Active resume: ${resume.meta.title}`}
        title="CV Builder"
      />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-3 md:grid-cols-2">
          {cvSections.map((section) => (
            <Link
              className="rounded-[16px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-5 transition-colors duration-150 hover:border-[var(--alouma-hairline-strong)] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alouma-focus)]"
              href={`/cv/${section}`}
              key={section}
            >
              <h2 className="font-semibold tracking-[-0.01em] text-[var(--alouma-jet)]">
                {cvSectionLabels[section]}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--alouma-muted)]">
                {sectionDescriptions[section]}
              </p>
            </Link>
          ))}
        </div>
        <Card>
          <h2 className="text-lg font-semibold">Draft Status</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div>
              <dt className="font-semibold text-[var(--alouma-ink)]">Template</dt>
              <dd className="mt-1">
                <select
                  className="min-h-11 w-full rounded-[12px] border border-[var(--alouma-hairline-strong)] bg-white px-3 text-sm text-[var(--alouma-jet)] outline-none transition focus:border-[var(--alouma-jet)] focus:ring-4 focus:ring-[var(--alouma-focus)]"
                  onChange={(event) => updateResume({ template: event.target.value })}
                  value={resume.template === "structured" ? "structured" : "novo_classic"}
                >
                  <option value="novo_classic">Essential</option>
                  <option value="structured">Structured</option>
                </select>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--alouma-ink)]">Accent</dt>
              <dd className="text-[var(--alouma-muted)]">{resume.accentColor}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--alouma-ink)]">Updated</dt>
              <dd className="text-[var(--alouma-muted)]">
                {new Date(resume.meta.updatedAt).toLocaleString()}
              </dd>
            </div>
          </dl>
          <ButtonLink className="mt-6 w-full" href="/cv/preview" variant="secondary">
            Preview CV
          </ButtonLink>
        </Card>
      </div>
    </>
  );
}
