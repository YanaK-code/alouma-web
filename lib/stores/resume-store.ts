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
export type LocalResumeDraftKind = "base" | "matched";

export type LocalResumeDraft = {
  id: string;
  kind: LocalResumeDraftKind;
  title: string;
  resumeJson: Resume;
  sourceResumeId: string | null;
  activeTargetJobId: string | null;
  templateId: string;
  accentId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type ActiveDraftMeta = Omit<LocalResumeDraft, "resumeJson">;

type ResumeState = {
  activeResume: Resume;
  activeDraftMeta: ActiveDraftMeta;
  savedDrafts: LocalResumeDraft[];
  hasActiveDraft: boolean;
  hasHydrated: boolean;
  loadDraft: () => void;
  loadDraftById: (id: string) => boolean;
  createBaseDraft: (options?: { title?: string }) => string;
  updateResume: (update: ResumeUpdater) => void;
  updateMatchedResume: (
    update: ResumeUpdater,
    options?: { activeTargetJobId?: string | null; title?: string },
  ) => void;
  createMatchedDraftFromActive: (options?: {
    activeTargetJobId?: string | null;
    title?: string;
  }) => string;
  createMatchedDraftFromBase: (
    baseDraftId: string,
    options?: {
      activeTargetJobId?: string | null;
      title?: string;
      jobDescription?: string;
      matchResult?: Resume["jobMatch"]["result"];
    },
  ) => string | null;
  duplicateDraft: (id: string) => string | null;
  renameDraft: (id: string, title: string) => boolean;
  saveDraft: () => void;
  deleteDraft: (id: string) => void;
  resetDraft: () => void;
  setHasHydrated: (value: boolean) => void;
};

function makeResumeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}`;
}

function cloneResume(resume: Resume): Resume {
  return JSON.parse(JSON.stringify(resume)) as Resume;
}

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

function createEmptyBaseResume(title = "Untitled Base CV"): Resume {
  const now = new Date().toISOString();
  const resume = normalizeResume(undefined, false);

  return {
    ...resume,
    meta: {
      ...resume.meta,
      id: makeResumeId("resume_base"),
      title,
      updatedAt: now,
      sectionNotes: {},
    },
    jobMatch: {
      jobDescription: "",
      result: null,
    },
  };
}

function accentIdForResume(resume: Resume) {
  if (resume.template === "structured") {
    return resume.structuredSecondaryAccentColor || resume.accentColor;
  }

  return resume.accentColor;
}

function activeDraftMetaFromResume(
  resume: Resume,
  overrides: Partial<ActiveDraftMeta> = {},
): ActiveDraftMeta {
  const now = new Date().toISOString();
  const kind = overrides.kind ?? "base";

  return {
    id: overrides.id ?? resume.meta.id,
    kind,
    title: overrides.title ?? resume.meta.title,
    sourceResumeId: kind === "base" ? null : (overrides.sourceResumeId ?? null),
    activeTargetJobId: overrides.activeTargetJobId ?? null,
    templateId: overrides.templateId ?? resume.template,
    accentId: overrides.accentId ?? accentIdForResume(resume),
    createdAt: overrides.createdAt ?? resume.meta.updatedAt ?? now,
    updatedAt: overrides.updatedAt ?? resume.meta.updatedAt ?? now,
    deletedAt: overrides.deletedAt ?? null,
  };
}

function syncActiveDraftMeta(meta: ActiveDraftMeta, resume: Resume): ActiveDraftMeta {
  return {
    ...meta,
    title: resume.meta.title,
    templateId: resume.template,
    accentId: accentIdForResume(resume),
    updatedAt: resume.meta.updatedAt,
  };
}

function localDraftFromActive(meta: ActiveDraftMeta, resume: Resume): LocalResumeDraft {
  const syncedMeta = syncActiveDraftMeta(meta, resume);

  return {
    ...syncedMeta,
    resumeJson: resume,
  };
}

function isDraftKind(value: unknown): value is LocalResumeDraftKind {
  return value === "base" || value === "matched";
}

function readNullableString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function normalizeLocalDraft(value: unknown): LocalResumeDraft {
  const source = isRecord(value) ? value : {};
  const resumeSource = readRecord(source, "resumeJson") ?? value;
  const resume = normalizeResume(resumeSource);
  const kindValue = readRecord(source, "kind");
  const kind = isDraftKind(kindValue) ? kindValue : "base";
  const id = readString(readRecord(source, "id"), resume.meta.id);
  const createdAt = readString(
    readRecord(source, "createdAt"),
    readString(readRecord(readRecord(source, "meta"), "updatedAt"), resume.meta.updatedAt),
  );
  const updatedAt = readString(readRecord(source, "updatedAt"), resume.meta.updatedAt);
  const title = readString(readRecord(source, "title"), resume.meta.title);
  const resumeJson = {
    ...resume,
    meta: {
      ...resume.meta,
      id,
      title,
      updatedAt,
    },
  };

  return {
    id,
    kind,
    title,
    resumeJson,
    sourceResumeId: kind === "base" ? null : readNullableString(readRecord(source, "sourceResumeId")),
    activeTargetJobId: readNullableString(readRecord(source, "activeTargetJobId")),
    templateId: readString(readRecord(source, "templateId"), resumeJson.template),
    accentId: readString(readRecord(source, "accentId"), accentIdForResume(resumeJson)),
    createdAt,
    updatedAt,
    deletedAt: readNullableString(readRecord(source, "deletedAt")),
  };
}

function upsertDraft(drafts: LocalResumeDraft[], draft: LocalResumeDraft) {
  const existingIndex = drafts.findIndex((item) => item.id === draft.id);

  if (existingIndex === -1) {
    return [draft, ...drafts];
  }

  return drafts.map((item, index) => (index === existingIndex ? draft : item));
}

function ensureActiveMatchedDraft(
  state: ResumeState,
  options?: { activeTargetJobId?: string | null; title?: string },
): Pick<ResumeState, "activeDraftMeta" | "activeResume" | "savedDrafts"> {
  const fallbackBaseResume = state.hasActiveDraft ? null : createEmptyBaseResume();
  const sourceState = fallbackBaseResume
    ? {
        ...state,
        activeResume: fallbackBaseResume,
        activeDraftMeta: activeDraftMetaFromResume(fallbackBaseResume),
        hasActiveDraft: true,
      }
    : state;

  if (sourceState.activeDraftMeta.kind === "matched") {
    return {
      activeResume: sourceState.activeResume,
      activeDraftMeta: {
        ...sourceState.activeDraftMeta,
        activeTargetJobId: options?.activeTargetJobId ?? sourceState.activeDraftMeta.activeTargetJobId,
      },
      savedDrafts: sourceState.savedDrafts,
    };
  }

  const now = new Date().toISOString();
  const baseResume = stamp(sourceState.activeResume);
  const baseMeta = syncActiveDraftMeta(
    {
      ...sourceState.activeDraftMeta,
      kind: "base",
      sourceResumeId: null,
      updatedAt: now,
    },
    baseResume,
  );
  const matchedId = makeResumeId("resume_matched");
  const matchedTitle = options?.title ?? `${baseResume.meta.title} - Matched CV`;
  const matchedResume = stamp({
    ...cloneResume(baseResume),
    meta: {
      ...baseResume.meta,
      id: matchedId,
      title: matchedTitle,
      updatedAt: now,
    },
  });
  const matchedMeta = activeDraftMetaFromResume(matchedResume, {
    id: matchedId,
    kind: "matched",
    title: matchedTitle,
    sourceResumeId: baseMeta.id,
    activeTargetJobId: options?.activeTargetJobId ?? null,
    createdAt: now,
    updatedAt: matchedResume.meta.updatedAt,
  });

  return {
    activeResume: matchedResume,
    activeDraftMeta: matchedMeta,
    savedDrafts: upsertDraft(
      upsertDraft(sourceState.savedDrafts, localDraftFromActive(baseMeta, baseResume)),
      localDraftFromActive(matchedMeta, matchedResume),
    ),
  };
}

const initialActiveDraftMeta = activeDraftMetaFromResume(mockResume);

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      activeResume: mockResume,
      activeDraftMeta: initialActiveDraftMeta,
      savedDrafts: [],
      hasActiveDraft: false,
      hasHydrated: false,
      loadDraft: () =>
        set((state) => ({
          activeResume: normalizeResume(state.activeResume),
          activeDraftMeta: syncActiveDraftMeta(state.activeDraftMeta, normalizeResume(state.activeResume)),
        })),
      loadDraftById: (id) => {
        let didLoad = false;

        set((state) => {
          const draft = state.savedDrafts.find((item) => item.id === id && !item.deletedAt);

          if (!draft) {
            return state;
          }

          didLoad = true;

          return {
            activeResume: normalizeResume(draft.resumeJson),
            activeDraftMeta: activeDraftMetaFromResume(draft.resumeJson, draft),
            hasActiveDraft: true,
          };
        });

        return didLoad;
      },
      createBaseDraft: (options) => {
        let draftId = "";

        set((state) => {
          const activeResume = createEmptyBaseResume(options?.title);
          const activeDraftMeta = activeDraftMetaFromResume(activeResume);
          draftId = activeDraftMeta.id;

          return {
            activeResume,
            activeDraftMeta,
            hasActiveDraft: true,
            savedDrafts: upsertDraft(
              state.savedDrafts,
              localDraftFromActive(activeDraftMeta, activeResume),
            ),
          };
        });

        return draftId;
      },
      updateResume: (update) =>
        set((state) => {
          if (!state.hasActiveDraft) {
            return state;
          }

          const nextResume =
            typeof update === "function"
              ? update(state.activeResume)
              : { ...state.activeResume, ...update };
          const activeResume = safeCommitResume(state.activeResume, nextResume);
          const activeDraftMeta = syncActiveDraftMeta(state.activeDraftMeta, activeResume);

          return {
            activeResume,
            activeDraftMeta,
            savedDrafts: upsertDraft(
              state.savedDrafts,
              localDraftFromActive(activeDraftMeta, activeResume),
            ),
          };
        }),
      updateMatchedResume: (update, options) =>
        set((state) => {
          const matchedState = ensureActiveMatchedDraft(state, options);
          const nextResume =
            typeof update === "function"
              ? update(matchedState.activeResume)
              : { ...matchedState.activeResume, ...update };
          const activeResume = safeCommitResume(matchedState.activeResume, nextResume);
          const activeDraftMeta = syncActiveDraftMeta(
            {
              ...matchedState.activeDraftMeta,
              activeTargetJobId:
                options?.activeTargetJobId ?? matchedState.activeDraftMeta.activeTargetJobId,
            },
            activeResume,
          );

          return {
            activeResume,
            activeDraftMeta,
            hasActiveDraft: true,
            savedDrafts: upsertDraft(
              matchedState.savedDrafts,
              localDraftFromActive(activeDraftMeta, activeResume),
            ),
          };
        }),
      createMatchedDraftFromActive: (options) => {
        let matchedDraftId = "";

        set((state) => {
          const matchedState = ensureActiveMatchedDraft(state, options);
          matchedDraftId = matchedState.activeDraftMeta.id;
          return {
            ...matchedState,
            hasActiveDraft: true,
          };
        });

        return matchedDraftId;
      },
      createMatchedDraftFromBase: (baseDraftId, options) => {
        let matchedDraftId: string | null = null;

        set((state) => {
          const baseDraft = state.savedDrafts.find(
            (draft) => draft.id === baseDraftId && draft.kind === "base" && !draft.deletedAt,
          );

          if (!baseDraft) {
            return state;
          }

          const now = new Date().toISOString();
          const matchedId = makeResumeId("resume_matched");
          const matchedTitle = options?.title?.trim() || `${baseDraft.title} - Matched CV`;
          const activeResume = stamp({
            ...cloneResume(baseDraft.resumeJson),
            meta: {
              ...baseDraft.resumeJson.meta,
              id: matchedId,
              title: matchedTitle,
              updatedAt: now,
            },
            jobMatch: {
              jobDescription: options?.jobDescription ?? "",
              result: options?.matchResult ?? null,
            },
          });
          const activeDraftMeta = activeDraftMetaFromResume(activeResume, {
            id: matchedId,
            kind: "matched",
            title: matchedTitle,
            sourceResumeId: baseDraft.id,
            activeTargetJobId: options?.activeTargetJobId ?? null,
            createdAt: now,
            updatedAt: activeResume.meta.updatedAt,
          });

          matchedDraftId = matchedId;

          return {
            activeResume,
            activeDraftMeta,
            hasActiveDraft: true,
            savedDrafts: upsertDraft(
              state.savedDrafts,
              localDraftFromActive(activeDraftMeta, activeResume),
            ),
          };
        });

        return matchedDraftId;
      },
      duplicateDraft: (id) => {
        let duplicateId: string | null = null;

        set((state) => {
          const draft = state.savedDrafts.find((item) => item.id === id && !item.deletedAt);

          if (!draft) {
            return state;
          }

          const now = new Date().toISOString();
          const nextId = makeResumeId(draft.kind === "base" ? "resume_base" : "resume_matched");
          const nextTitle = `Copy of ${draft.title}`;
          const resumeJson = stamp({
            ...cloneResume(draft.resumeJson),
            meta: {
              ...draft.resumeJson.meta,
              id: nextId,
              title: nextTitle,
              updatedAt: now,
            },
          });
          const draftMeta = activeDraftMetaFromResume(resumeJson, {
            id: nextId,
            kind: draft.kind,
            title: nextTitle,
            sourceResumeId: draft.kind === "base" ? null : draft.sourceResumeId,
            activeTargetJobId: draft.activeTargetJobId,
            createdAt: now,
            updatedAt: resumeJson.meta.updatedAt,
          });

          duplicateId = nextId;

          return {
            savedDrafts: upsertDraft(state.savedDrafts, localDraftFromActive(draftMeta, resumeJson)),
          };
        });

        return duplicateId;
      },
      renameDraft: (id, title) => {
        const nextTitle = title.trim();
        let didRename = false;

        if (!nextTitle) {
          return false;
        }

        set((state) => {
          const draft = state.savedDrafts.find((item) => item.id === id && !item.deletedAt);

          if (!draft) {
            return state;
          }

          const resumeJson = stamp({
            ...draft.resumeJson,
            meta: {
              ...draft.resumeJson.meta,
              title: nextTitle,
            },
          });
          const draftMeta = activeDraftMetaFromResume(resumeJson, {
            ...draft,
            title: nextTitle,
            updatedAt: resumeJson.meta.updatedAt,
          });
          const isActiveDraft = state.hasActiveDraft && state.activeDraftMeta.id === id;

          didRename = true;

          return {
            activeResume: isActiveDraft ? resumeJson : state.activeResume,
            activeDraftMeta: isActiveDraft
              ? syncActiveDraftMeta(state.activeDraftMeta, resumeJson)
              : state.activeDraftMeta,
            savedDrafts: upsertDraft(state.savedDrafts, localDraftFromActive(draftMeta, resumeJson)),
          };
        });

        return didRename;
      },
      saveDraft: () =>
        set((state) => {
          if (!state.hasActiveDraft) {
            return state;
          }

          const activeResume = stamp(state.activeResume);
          const activeDraftMeta = syncActiveDraftMeta(state.activeDraftMeta, activeResume);

          return {
            activeResume,
            activeDraftMeta,
            savedDrafts: upsertDraft(
              state.savedDrafts,
              localDraftFromActive(activeDraftMeta, activeResume),
            ),
          };
        }),
      deleteDraft: (id) =>
        set((state) => ({
          savedDrafts: state.savedDrafts.filter((draft) => draft.id !== id),
        })),
      resetDraft: () =>
        set(() => {
          const activeResume = stamp(normalizeResume(mockResume, false));

          return {
            activeResume,
            activeDraftMeta: activeDraftMetaFromResume(activeResume),
            hasActiveDraft: false,
            savedDrafts: [],
          };
        }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "alouma-resume-draft",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeResume: state.activeResume,
        activeDraftMeta: state.activeDraftMeta,
        savedDrafts: state.savedDrafts,
        hasActiveDraft: state.hasActiveDraft,
      }),
      merge: (persisted, current) => {
        const persistedState = persisted as Partial<ResumeState> | undefined;
        const savedDrafts = persistedState?.savedDrafts?.map((draft) => normalizeLocalDraft(draft)) ?? [];
        const hasActiveDraft =
          typeof persistedState?.hasActiveDraft === "boolean"
            ? persistedState.hasActiveDraft
            : Boolean(savedDrafts.length);
        const activeResume = persistedState?.activeResume
          ? normalizeResume(persistedState.activeResume)
          : normalizeResume(mockResume, true);
        const activeDraftMeta = persistedState?.activeDraftMeta
          ? activeDraftMetaFromResume(activeResume, persistedState.activeDraftMeta)
          : activeDraftMetaFromResume(activeResume);

        return {
          ...current,
          ...persistedState,
          activeResume,
          activeDraftMeta,
          savedDrafts,
          hasActiveDraft,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
