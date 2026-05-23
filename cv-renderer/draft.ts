import { CVColorDefaults } from "@/cv-renderer/color-defaults";
import type { Resume } from "@/schemas/resume";

export type CVExperience = {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
};

export type CVEducation = {
  id: string;
  school: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
};

export type CVDraft = {
  template: string;
  accentColorHex: string;
  structuredPrimaryAccentColorHex: string;
  structuredSecondaryAccentColorHex: string;
  basics: {
    fullName: string;
    headline: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
  };
  summary: string;
  experience: CVExperience[];
  education: CVEducation[];
  skills: string[];
  programsTools: string[];
  sectionNotes: Record<string, string>;
};

function withHash(hex: string | undefined, fallback: string) {
  const value = hex?.trim();

  if (!value) {
    return fallback;
  }

  return value.startsWith("#") ? value : `#${value}`;
}

function compactLine(parts: string[]) {
  return parts.map((part) => part.trim()).filter(Boolean).join(" - ");
}

function compactParagraph(title: string, description: string) {
  const name = title.trim();
  const body = description.trim();

  if (name && body) {
    return `${name}\n${body}`;
  }

  return name || body;
}

function listOrFallback(items: string[], fallback: string | undefined) {
  const lines = items.map((item) => item.trim()).filter(Boolean);

  if (lines.length) {
    return lines.join("\n");
  }

  return fallback ?? "";
}

function resolveSectionNotes(resume: Resume) {
  const notes = { ...resume.meta.sectionNotes };
  const courseLines = resume.courses.map((course) =>
    compactLine([course.name, course.provider, course.date]),
  );
  const licenseLines = resume.licenses.map((license) =>
    compactLine([license.name, license.issuer, license.date]),
  );

  notes.languages = listOrFallback(
    resume.languages.map((language) => compactLine([language.name, language.proficiency])),
    notes.languages,
  );
  notes.projects = listOrFallback(
    resume.projects.map((project) => compactParagraph(project.name, project.description)),
    notes.projects,
  );
  notes.courses = listOrFallback(
    resume.template === "structured"
      ? [...courseLines, ...licenseLines.map((line) => (line ? `License - ${line}` : ""))]
      : courseLines,
    notes.courses,
  );
  notes.licenses = listOrFallback(licenseLines, notes.licenses);
  notes.awards = listOrFallback(
    resume.awards.map((award) =>
      compactLine([award.name, award.issuer, award.date, award.description]),
    ),
    notes.awards,
  );
  notes.volunteer = listOrFallback(
    resume.volunteer.map((item) =>
      [
        compactLine([item.role, item.organization, item.location]),
        compactLine([item.startDate, item.endDate]),
        ...item.bullets.map((bullet) => bullet.trim()).filter(Boolean),
      ]
        .filter(Boolean)
        .join("\n"),
    ),
    notes.volunteer,
  );
  notes.interests = listOrFallback(resume.interests, notes.interests);

  return notes;
}

export function toCVDraft(resume: Resume): CVDraft {
  return {
    template: resume.template,
    accentColorHex: withHash(resume.accentColor, CVColorDefaults.essentialAccentHex),
    structuredPrimaryAccentColorHex: withHash(
      resume.structuredPrimaryAccentColor,
      CVColorDefaults.structuredPrimaryAccentHex,
    ),
    structuredSecondaryAccentColorHex: withHash(
      resume.structuredSecondaryAccentColor,
      CVColorDefaults.structuredSecondaryAccentHex,
    ),
    basics: {
      fullName: resume.basics.fullName,
      headline: resume.basics.headline,
      email: resume.basics.email,
      phone: resume.basics.phone,
      location: resume.basics.location,
      website: resume.basics.website,
      linkedin: resume.basics.linkedin ?? "",
    },
    summary: resume.summary,
    experience: resume.experience,
    education: resume.education,
    skills: resume.skills,
    programsTools: resume.programsTools,
    sectionNotes: resolveSectionNotes(resume),
  };
}
