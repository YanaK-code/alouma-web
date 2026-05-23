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
      <div className="rounded-md border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
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
              className="rounded-md border border-neutral-200 bg-white p-4 hover:bg-neutral-50"
              href={`/cv/${section}`}
              key={section}
            >
              <h2 className="font-semibold">{cvSectionLabels[section]}</h2>
              <p className="mt-2 text-sm text-neutral-600">
                {sectionDescriptions[section]}
              </p>
            </Link>
          ))}
        </div>
        <Card>
          <h2 className="text-lg font-semibold">Draft Status</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div>
              <dt className="font-medium">Template</dt>
              <dd className="mt-1">
                <select
                  className="h-9 w-full rounded-md border border-neutral-300 bg-white px-2 text-sm"
                  onChange={(event) => updateResume({ template: event.target.value })}
                  value={resume.template === "structured" ? "structured" : "novo_classic"}
                >
                  <option value="novo_classic">Essential</option>
                  <option value="structured">Structured</option>
                </select>
              </dd>
            </div>
            <div>
              <dt className="font-medium">Accent</dt>
              <dd className="text-neutral-600">{resume.accentColor}</dd>
            </div>
            <div>
              <dt className="font-medium">Updated</dt>
              <dd className="text-neutral-600">{new Date(resume.meta.updatedAt).toLocaleString()}</dd>
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
