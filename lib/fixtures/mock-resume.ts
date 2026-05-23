import type { Resume } from "@/schemas/resume";

export const mockResume: Resume = {
  meta: {
    id: "resume_mock_active",
    title: "Alouma Draft CV",
    updatedAt: new Date().toISOString(),
    sectionNotes: {
      languages: "English - Native\nSpanish - Professional working proficiency\nFrench - Conversational",
      projects:
        "Mapped the customer handoff journey across sales, onboarding, and support, then built a shared intake tracker that reduced duplicate requests and gave leaders a weekly view of blocked accounts.\n\nCreated a lightweight launch checklist for new service packages, aligning owners, dependencies, and follow-up rituals before rollout.",
      courses:
        "Google Project Management Certificate\nAdvanced Airtable Automation Workshop\nData Storytelling for Operations Teams",
      awards:
        "2024 Operations Excellence Award for cross-functional planning\nRecognized by customer success leadership for improving renewal readiness",
      volunteer:
        "Volunteer operations lead for a local career-readiness nonprofit, coordinating mentor matching, workshop calendars, and post-event feedback loops for early-career job seekers.",
      interests: "Urban planning\nCareer mobility programs\nCommunity mentoring",
    },
  },
  basics: {
    fullName: "Alex Morgan",
    headline: "Operations Specialist focused on scalable team systems",
    email: "alex@example.com",
    phone: "+1 555 0100",
    location: "New York, NY",
    website: "alouma.example",
    linkedin: "linkedin.com/in/alex-morgan-ops",
  },
  summary:
    "Organized operations specialist with experience improving workflows, coordinating teams, and turning ambiguous work into clear execution plans. Known for building practical systems that help fast-moving teams see priorities, reduce repeated questions, and move customer work forward with less friction.",
  experience: [
    {
      id: "exp_1",
      role: "Senior Operations Coordinator",
      company: "Northstar Studio",
      location: "Remote",
      startDate: "2022",
      endDate: "Present",
      bullets: [
        "Coordinate weekly operating rhythms across product, support, and customer success for a portfolio of 42 active accounts.",
        "Built lightweight reporting rituals that improved visibility into open work and reduced recurring status requests from team leads.",
        "Designed Airtable dashboards for onboarding risk, customer blockers, and renewal preparation, giving managers a shared source of truth.",
        "Partner with support leadership to identify process gaps from ticket trends and convert them into playbooks, macros, or escalation rules.",
        "Facilitated quarterly workflow reviews, documenting owner changes, outdated handoffs, and opportunities for automation.",
        "Prepared executive-ready summaries of operational blockers, helping leadership prioritize staffing and tooling decisions.",
      ],
    },
    {
      id: "exp_2",
      role: "Operations Associate",
      company: "Brightline Services",
      location: "New York, NY",
      startDate: "2020",
      endDate: "2022",
      bullets: [
        "Maintained daily intake queues for enterprise client requests while coordinating resolution paths across implementation and billing teams.",
        "Standardized onboarding checklists and internal notes, improving handoff quality for newly signed accounts.",
        "Created weekly KPI snapshots in Google Sheets covering cycle time, open risks, and overdue follow-ups.",
        "Supported hiring operations by coordinating interview loops, candidate communications, and onboarding documentation.",
        "Audited team knowledge-base articles and retired duplicate or stale process guidance.",
      ],
    },
    {
      id: "exp_3",
      role: "Customer Operations Intern",
      company: "LedgerWorks",
      location: "Brooklyn, NY",
      startDate: "2019",
      endDate: "2020",
      bullets: [
        "Triaged customer setup questions and routed complex cases to implementation specialists with concise context.",
        "Compiled recurring issue themes from support notes and helped translate them into onboarding improvements.",
        "Assisted with data cleanup projects that improved account ownership records and reporting accuracy.",
      ],
    },
    {
      id: "exp_4",
      role: "Administrative Coordinator",
      company: "Harbor Community Clinic",
      location: "Queens, NY",
      startDate: "2018",
      endDate: "2019",
      bullets: [
        "Coordinated appointment calendars, intake paperwork, and follow-up calls for a high-volume community services team.",
        "Introduced a shared tracker for pending documentation, helping staff identify incomplete cases before weekly review meetings.",
        "Prepared recurring operations notes for department leads, including staffing gaps, supply needs, and unresolved client questions.",
        "Organized vendor invoices and internal approvals so finance could process monthly expenses with fewer clarification requests.",
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
  skills: [
    "Operations",
    "Project coordination",
    "Process improvement",
    "Cross-functional planning",
    "Reporting",
    "Customer onboarding",
    "Workflow documentation",
    "Stakeholder communication",
    "KPI tracking",
    "Knowledge management",
  ],
  programsTools: ["Notion", "Airtable", "Google Sheets", "Slack", "Asana", "Zendesk", "Looker Studio"],
  jobMatch: {
    jobDescription: "",
    result: null,
  },
  template: "structured",
  accentColor: "#F2D04E",
  structuredPrimaryAccentColor: "#24221B",
  structuredSecondaryAccentColor: "#F2D04E",
};
