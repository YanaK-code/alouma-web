import type { Resume } from "@/schemas/resume";

export const mockResume: Resume = {
  meta: {
    id: "resume_mock_active",
    title: "Alouma Draft CV",
    updatedAt: new Date().toISOString(),
    sectionNotes: {
      "programs-tools": "Add ATS, CRM, analytics, and productivity tools here.",
      languages: "List spoken languages and proficiency levels.",
      projects: "Add selected projects when the full editor lands.",
      courses: "Add relevant certifications, short courses, or bootcamps.",
      licenses: "Add professional licenses and issuing bodies.",
      awards: "Add awards, honors, and recognitions.",
      volunteer: "Add volunteer roles and community experience.",
      interests: "Add interests if they support the target role.",
    },
  },
  basics: {
    fullName: "Alex Morgan",
    headline: "Operations Specialist",
    email: "alex@example.com",
    phone: "+1 555 0100",
    location: "New York, NY",
    website: "alouma.example",
  },
  summary:
    "Organized operations specialist with experience improving workflows, coordinating teams, and turning ambiguous work into clear execution plans.",
  experience: [
    {
      id: "exp_1",
      role: "Operations Coordinator",
      company: "Northstar Studio",
      location: "Remote",
      startDate: "2022",
      endDate: "Present",
      bullets: [
        "Coordinated weekly planning across product, support, and customer success teams.",
        "Built lightweight reporting rituals that improved visibility into open work.",
      ],
    },
  ],
  education: [
    {
      id: "edu_1",
      school: "City University",
      degree: "B.A. Business Administration",
      location: "New York, NY",
      startDate: "2017",
      endDate: "2021",
    },
  ],
  skills: ["Operations", "Project coordination", "Process improvement", "Reporting"],
  programsTools: ["Notion", "Airtable", "Google Sheets", "Slack"],
  jobMatch: {
    jobDescription: "",
    result: null,
  },
  template: "novo_classic",
  accentColor: "#2563eb",
};
