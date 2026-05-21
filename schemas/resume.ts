import { z } from "zod";

export const resumeSchema = z.object({
  meta: z.object({
    id: z.string(),
    title: z.string(),
    updatedAt: z.string(),
    sectionNotes: z.record(z.string(), z.string()).default({}),
  }),
  basics: z.object({
    fullName: z.string(),
    headline: z.string(),
    email: z.string(),
    phone: z.string(),
    location: z.string(),
    website: z.string(),
  }),
  summary: z.string(),
  experience: z.array(
    z.object({
      id: z.string(),
      role: z.string(),
      company: z.string(),
      location: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      bullets: z.array(z.string()),
    }),
  ),
  education: z.array(
    z.object({
      id: z.string(),
      school: z.string(),
      degree: z.string(),
      location: z.string(),
      startDate: z.string(),
      endDate: z.string(),
    }),
  ),
  skills: z.array(z.string()),
  programsTools: z.array(z.string()).default([]),
  jobMatch: z
    .object({
      jobDescription: z.string(),
      result: z
        .object({
          score: z.number(),
          strengths: z.array(z.string()),
          gaps: z.array(z.string()),
        })
        .nullable(),
    })
    .default({
      jobDescription: "",
      result: null,
    }),
  template: z.string(),
  accentColor: z.string(),
});

export type Resume = z.infer<typeof resumeSchema>;
