export const onboardingSteps = [
  "intro",
  "goal",
  "role",
  "experience-level",
  "work-history",
  "education",
  "skills",
  "job-target",
  "template",
  "review",
  "complete",
] as const;

export type OnboardingStep = (typeof onboardingSteps)[number];

export const cvSections = [
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
  "interests",
] as const;

export type CvSection = (typeof cvSections)[number];

export const cvSectionLabels: Record<CvSection, string> = {
  basics: "Basics",
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  "programs-tools": "Programs & Tools",
  languages: "Languages",
  projects: "Projects",
  courses: "Courses",
  licenses: "Licenses",
  awards: "Awards",
  volunteer: "Volunteer",
  interests: "Interests",
};

export function isCvSection(section: string): section is CvSection {
  return cvSections.includes(section as CvSection);
}
