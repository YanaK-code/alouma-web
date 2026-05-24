import type { CvSection } from "@/lib/router/routes";
import type { Resume } from "@/schemas/resume";

export const builderSections = [
  "basics",
  "summary",
  "experience",
  "education",
  "skills",
  "programs-tools",
  "languages",
  "projects",
  "courses",
  "licenses",
  "awards",
  "volunteer",
] as const satisfies readonly CvSection[];

export type BuilderSection = (typeof builderSections)[number];

export const builderSectionDescriptions: Record<BuilderSection, string> = {
  basics: "Identity, headline, contact, and location.",
  summary: "A concise opening narrative for recruiters.",
  experience: "Roles, companies, dates, and proof bullets.",
  education: "Schools, degrees, and dates.",
  skills: "Core strengths and keywords.",
  "programs-tools": "Software, platforms, and systems.",
  languages: "Languages and proficiency levels.",
  projects: "Selected projects with useful context.",
  courses: "Training, certificates, and bootcamps.",
  licenses: "Professional licenses and issuing bodies.",
  awards: "Recognition, honors, and outcomes.",
  volunteer: "Relevant community or volunteer work.",
};

type ReadinessItem = {
  complete: boolean;
  label: string;
  section: BuilderSection;
};

function hasText(value: string | undefined) {
  return Boolean(value?.trim());
}

function hasUsefulExperience(resume: Resume) {
  return resume.experience.some(
    (item) => hasText(item.role) && hasText(item.company) && item.bullets.some(hasText),
  );
}

function hasUsefulEducation(resume: Resume) {
  return resume.education.some((item) => hasText(item.school) || hasText(item.degree));
}

export function getReadinessItems(resume: Resume): ReadinessItem[] {
  return [
    {
      complete:
        hasText(resume.basics.fullName) &&
        hasText(resume.basics.headline) &&
        hasText(resume.basics.email),
      label: "Add name, headline, and email",
      section: "basics",
    },
    {
      complete: resume.summary.trim().length >= 80,
      label: "Write a sharper summary",
      section: "summary",
    },
    {
      complete: hasUsefulExperience(resume),
      label: "Add experience proof",
      section: "experience",
    },
    {
      complete: hasUsefulEducation(resume),
      label: "Add education",
      section: "education",
    },
    {
      complete: resume.skills.filter(hasText).length >= 5,
      label: "Add at least five skills",
      section: "skills",
    },
    {
      complete: resume.programsTools.filter(hasText).length >= 3,
      label: "Add tools and systems",
      section: "programs-tools",
    },
    {
      complete: resume.languages.some((item) => hasText(item.name)),
      label: "Add language details",
      section: "languages",
    },
    {
      complete: resume.projects.some((item) => hasText(item.name) || hasText(item.description)),
      label: "Add a project",
      section: "projects",
    },
  ];
}

export function getReadinessScore(resume: Resume) {
  const items = getReadinessItems(resume);
  const completeCount = items.filter((item) => item.complete).length;

  return Math.round((completeCount / items.length) * 100);
}

export function getMissingReadinessItems(resume: Resume) {
  return getReadinessItems(resume).filter((item) => !item.complete);
}

export function getNextBestAction(resume: Resume) {
  return getMissingReadinessItems(resume)[0] ?? {
    complete: true,
    label: "Preview and match this CV to a role",
    section: "experience" as const,
  };
}

export function hasEnoughContentForMatch(resume: Resume) {
  return (
    hasText(resume.basics.headline) &&
    resume.summary.trim().length >= 80 &&
    hasUsefulExperience(resume) &&
    resume.skills.filter(hasText).length >= 5
  );
}
