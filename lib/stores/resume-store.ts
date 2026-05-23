"use client";

/**
 * Prototype-only: full resume/CV and job-match text in localStorage is sensitive.
 * Production must use server-owned resume_json, RLS, and minimal per-route DTOs — not
 * client-authoritative persistence of complete CV payloads.
 */

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mockResume } from "@/lib/fixtures/mock-resume";
import { resumeSchema, type Resume } from "@/schemas/resume";

type ResumeUpdater = Partial<Resume> | ((resume: Resume) => Resume);

type ResumeState = {
  activeResume: Resume;
  savedDrafts: Resume[];
  hasHydrated: boolean;
  loadDraft: () => void;
  loadDraftById: (id: string) => boolean;
  updateResume: (update: ResumeUpdater) => void;
  saveDraft: () => void;
  deleteDraft: (id: string) => void;
  resetDraft: () => void;
  setHasHydrated: (value: boolean) => void;
};

function stamp(resume: Resume): Resume {
  return {
    ...resume,
    meta: {
      ...resume.meta,
      updatedAt: new Date().toISOString(),
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readRecord(value: unknown, key: string) {
  return isRecord(value) ? value[key] : undefined;
}

function readString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function readArray<T>(value: unknown, fallback: T[]) {
  return Array.isArray(value) ? value : fallback;
}

function readSectionNotes(value: unknown) {
  if (!isRecord(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
  );
}

function candidateResume(resume: unknown, useMockContent: boolean): Resume {
  const source = isRecord(resume) ? resume : {};
  const meta = readRecord(source, "meta");
  const basics = readRecord(source, "basics");
  const jobMatch = readRecord(source, "jobMatch");

  return {
    ...mockResume,
    ...source,
    meta: {
      ...mockResume.meta,
      ...(isRecord(meta) ? meta : {}),
      sectionNotes: readSectionNotes(readRecord(meta, "sectionNotes")),
    },
    basics: {
      ...mockResume.basics,
      ...(isRecord(basics) ? basics : {}),
      fullName: readString(readRecord(basics, "fullName"), useMockContent ? mockResume.basics.fullName : ""),
      headline: readString(readRecord(basics, "headline"), useMockContent ? mockResume.basics.headline : ""),
      email: readString(readRecord(basics, "email"), useMockContent ? mockResume.basics.email : ""),
      phone: readString(readRecord(basics, "phone"), useMockContent ? mockResume.basics.phone : ""),
      location: readString(readRecord(basics, "location"), useMockContent ? mockResume.basics.location : ""),
      website: readString(readRecord(basics, "website"), useMockContent ? mockResume.basics.website : ""),
      linkedin: readString(readRecord(basics, "linkedin"), useMockContent ? (mockResume.basics.linkedin ?? "") : ""),
    },
    summary: readString(readRecord(source, "summary"), useMockContent ? mockResume.summary : ""),
    experience: readArray(readRecord(source, "experience"), useMockContent ? mockResume.experience : []),
    education: readArray(readRecord(source, "education"), useMockContent ? mockResume.education : []),
    skills: readArray(readRecord(source, "skills"), useMockContent ? mockResume.skills : []),
    programsTools: readArray(readRecord(source, "programsTools"), useMockContent ? mockResume.programsTools : []),
    languages: readArray(readRecord(source, "languages"), useMockContent ? mockResume.languages : []),
    projects: readArray(readRecord(source, "projects"), useMockContent ? mockResume.projects : []),
    courses: readArray(readRecord(source, "courses"), useMockContent ? mockResume.courses : []),
    licenses: readArray(readRecord(source, "licenses"), useMockContent ? mockResume.licenses : []),
    awards: readArray(readRecord(source, "awards"), useMockContent ? mockResume.awards : []),
    volunteer: readArray(readRecord(source, "volunteer"), useMockContent ? mockResume.volunteer : []),
    interests: readArray(readRecord(source, "interests"), useMockContent ? mockResume.interests : []),
    jobMatch: {
      ...mockResume.jobMatch,
      ...(isRecord(jobMatch) ? jobMatch : {}),
    },
    template: readString(readRecord(source, "template"), mockResume.template),
    accentColor: readString(readRecord(source, "accentColor"), mockResume.accentColor),
    structuredPrimaryAccentColor: readString(
      readRecord(source, "structuredPrimaryAccentColor"),
      mockResume.structuredPrimaryAccentColor ?? "",
    ),
    structuredSecondaryAccentColor: readString(
      readRecord(source, "structuredSecondaryAccentColor"),
      mockResume.structuredSecondaryAccentColor ?? "",
    ),
  };
}

function normalizeResume(resume: unknown, useMockContent = false): Resume {
  const parsed = resumeSchema.safeParse(candidateResume(resume, useMockContent));

  if (parsed.success) {
    return parsed.data;
  }

  console.error("[ResumeStore] Invalid resume data; using safe defaults.", parsed.error);
  return resumeSchema.parse(candidateResume(undefined, useMockContent));
}

function safeCommitResume(current: Resume, nextResume: Resume) {
  const parsed = resumeSchema.safeParse(nextResume);

  if (!parsed.success) {
    console.error("[ResumeStore] Ignored invalid resume update.", parsed.error);
    return current;
  }

  return stamp(parsed.data);
}

function upsertDraft(drafts: Resume[], resume: Resume) {
  const stampedResume = stamp(resume);
  const existingIndex = drafts.findIndex((draft) => draft.meta.id === stampedResume.meta.id);

  if (existingIndex === -1) {
    return [stampedResume, ...drafts];
  }

  return drafts.map((draft, index) => (index === existingIndex ? stampedResume : draft));
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      activeResume: mockResume,
      savedDrafts: [],
      hasHydrated: false,
      loadDraft: () =>
        set((state) => ({
          activeResume: normalizeResume(state.activeResume),
        })),
      loadDraftById: (id) => {
        let didLoad = false;

        set((state) => {
          const draft = state.savedDrafts.find((item) => item.meta.id === id);

          if (!draft) {
            return state;
          }

          didLoad = true;

          return {
            activeResume: normalizeResume(draft),
          };
        });

        return didLoad;
      },
      updateResume: (update) =>
        set((state) => {
          const nextResume =
            typeof update === "function"
              ? update(state.activeResume)
              : { ...state.activeResume, ...update };

          return {
            activeResume: safeCommitResume(state.activeResume, nextResume),
          };
        }),
      saveDraft: () =>
        set((state) => ({
          activeResume: stamp(state.activeResume),
          savedDrafts: upsertDraft(state.savedDrafts, state.activeResume),
        })),
      deleteDraft: (id) =>
        set((state) => ({
          savedDrafts: state.savedDrafts.filter((draft) => draft.meta.id !== id),
        })),
      resetDraft: () =>
        set({
          activeResume: stamp(normalizeResume(mockResume, true)),
          savedDrafts: [],
        }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "alouma-resume-draft",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeResume: state.activeResume,
        savedDrafts: state.savedDrafts,
      }),
      merge: (persisted, current) => {
        const persistedState = persisted as Partial<ResumeState> | undefined;

        return {
          ...current,
          ...persistedState,
          activeResume: persistedState?.activeResume
            ? normalizeResume(persistedState.activeResume)
            : normalizeResume(mockResume, true),
          savedDrafts: persistedState?.savedDrafts?.map((draft) => normalizeResume(draft)) ?? [],
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
