"use client";

/**
 * Prototype-only: full resume/CV and job-match text in localStorage is sensitive.
 * Production must use server-owned resume_json, RLS, and minimal per-route DTOs — not
 * client-authoritative persistence of complete CV payloads.
 */

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mockResume } from "@/lib/fixtures/mock-resume";
import type { Resume } from "@/schemas/resume";

type ResumeUpdater = Partial<Resume> | ((resume: Resume) => Resume);

type ResumeState = {
  activeResume: Resume;
  savedDrafts: Resume[];
  hasHydrated: boolean;
  loadDraft: () => void;
  updateResume: (update: ResumeUpdater) => void;
  saveDraft: () => void;
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

function normalizeResume(resume: Resume | undefined): Resume {
  return {
    ...mockResume,
    ...resume,
    meta: {
      ...mockResume.meta,
      ...resume?.meta,
      sectionNotes: {
        ...mockResume.meta.sectionNotes,
        ...resume?.meta?.sectionNotes,
      },
    },
    basics: {
      ...mockResume.basics,
      ...resume?.basics,
    },
    experience: resume?.experience ?? mockResume.experience,
    education: resume?.education ?? mockResume.education,
    skills: resume?.skills ?? mockResume.skills,
    programsTools: resume?.programsTools ?? mockResume.programsTools,
    languages: resume?.languages ?? mockResume.languages,
    projects: resume?.projects ?? mockResume.projects,
    courses: resume?.courses ?? mockResume.courses,
    licenses: resume?.licenses ?? mockResume.licenses,
    awards: resume?.awards ?? mockResume.awards,
    volunteer: resume?.volunteer ?? mockResume.volunteer,
    interests: resume?.interests ?? mockResume.interests,
    jobMatch: {
      ...mockResume.jobMatch,
      ...resume?.jobMatch,
    },
  };
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
      updateResume: (update) =>
        set((state) => {
          const nextResume =
            typeof update === "function"
              ? update(state.activeResume)
              : { ...state.activeResume, ...update };

          return {
            activeResume: stamp(nextResume),
          };
        }),
      saveDraft: () =>
        set((state) => ({
          activeResume: stamp(state.activeResume),
          savedDrafts: upsertDraft(state.savedDrafts, state.activeResume),
        })),
      resetDraft: () =>
        set({
          activeResume: stamp(mockResume),
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
          activeResume: normalizeResume(persistedState?.activeResume),
          savedDrafts: persistedState?.savedDrafts?.map(normalizeResume) ?? [],
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
