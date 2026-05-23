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
    sectionNotes: resume.meta.sectionNotes,
  };
}
