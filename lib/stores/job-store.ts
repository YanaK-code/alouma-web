"use client";

/**
 * Prototype-only local job tracker state.
 * Production must move tracked jobs behind authenticated server ownership, RLS,
 * and sanitized DTOs before any sync or private job data is introduced.
 */

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type JobStatus =
  | "Saved"
  | "Matched"
  | "Applied"
  | "Interview"
  | "Offer"
  | "Rejected"
  | "Archived";

export type TrackedJob = {
  id: string;
  company: string;
  role: string;
  status: JobStatus;
  matchScore?: number;
  updatedAt: string;
};

const jobStatuses: JobStatus[] = [
  "Saved",
  "Matched",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
  "Archived",
];

const initialJobs: TrackedJob[] = [
  {
    id: "job_mock_1",
    company: "Northstar Studio",
    role: "Operations Manager",
    status: "Matched",
    matchScore: 82,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "job_mock_2",
    company: "Brightline Services",
    role: "Customer Operations Lead",
    status: "Saved",
    matchScore: 74,
    updatedAt: new Date().toISOString(),
  },
];

type JobTrackerState = {
  trackedJobs: TrackedJob[];
  hasHydrated: boolean;
  addPlaceholderJob: () => void;
  cycleJobStatus: (id: string) => void;
  setHasHydrated: (value: boolean) => void;
};

function makeJobId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `job_${crypto.randomUUID()}`;
  }

  return `job_${Date.now()}`;
}

function nextStatus(status: JobStatus) {
  const index = jobStatuses.indexOf(status);
  return jobStatuses[(index + 1) % jobStatuses.length] ?? "Saved";
}

export const useJobTrackerStore = create<JobTrackerState>()(
  persist(
    (set) => ({
      trackedJobs: initialJobs,
      hasHydrated: false,
      addPlaceholderJob: () =>
        set((state) => ({
          trackedJobs: [
            {
              id: makeJobId(),
              company: "Target company",
              role: "New tracked role",
              status: "Saved",
              updatedAt: new Date().toISOString(),
            },
            ...state.trackedJobs,
          ],
        })),
      cycleJobStatus: (id) =>
        set((state) => ({
          trackedJobs: state.trackedJobs.map((job) =>
            job.id === id
              ? {
                  ...job,
                  status: nextStatus(job.status),
                  updatedAt: new Date().toISOString(),
                }
              : job,
          ),
        })),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "alouma-local-job-tracker-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        trackedJobs: state.trackedJobs,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
