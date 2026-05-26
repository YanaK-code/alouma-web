"use client";

import { type FormEvent, type ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TextInput } from "@/components/ui/field";
import { type TrackedJob, useJobTrackerStore } from "@/lib/stores/job-store";
import { type LocalResumeDraft, useResumeStore } from "@/lib/stores/resume-store";

function formatKind(kind: LocalResumeDraft["kind"]) {
  return kind === "base" ? "Base CV" : "Matched CV";
}

function formatUpdatedAt(value: string) {
  return new Date(value).toLocaleString();
}

function jobLabel(job?: TrackedJob, hasLinkedJob?: boolean) {
  if (!job) {
    return hasLinkedJob ? "Linked job: Local tracked job" : null;
  }

  if (job.company && job.role) {
    return `Linked job: ${job.role} at ${job.company}`;
  }

  return `Linked job: ${job.role || job.company || "Local tracked job"}`;
}

function EmptySectionCard({
  action,
  children,
  title,
}: {
  action: ReactNode;
  children: ReactNode;
  title: string;
}) {
  return (
    <Card className="max-w-2xl">
      <h3 className="text-lg font-semibold text-[var(--alouma-jet)]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--alouma-muted)]">{children}</p>
      <div className="mt-5 flex flex-wrap gap-2">{action}</div>
    </Card>
  );
}

function DraftCard({
  draft,
  linkedJobLabel,
  onDuplicate,
  onOpen,
  onRename,
  sourceTitle,
}: {
  draft: LocalResumeDraft;
  linkedJobLabel?: string | null;
  onDuplicate: (id: string) => void;
  onOpen: (id: string, route: "/cv" | "/cv/preview") => void;
  onRename: (id: string, title: string) => void;
  sourceTitle?: string;
}) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [title, setTitle] = useState(draft.title);

  function startRename() {
    setTitle(draft.title);
    setIsRenaming(true);
  }

  function submitRename(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onRename(draft.id, title);
    setIsRenaming(false);
  }

  return (
    <Card className="max-w-2xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--alouma-muted-soft)]">
            {formatKind(draft.kind)}
          </p>
          {isRenaming ? (
            <form className="mt-2 flex max-w-xl flex-wrap gap-2" onSubmit={submitRename}>
              <TextInput
                aria-label="CV title"
                className="min-w-[220px] flex-1"
                onChange={(event) => setTitle(event.target.value)}
                value={title}
              />
              <Button disabled={!title.trim()} type="submit" variant="dark">
                Save
              </Button>
              <Button onClick={() => setIsRenaming(false)} variant="ghost">
                Cancel
              </Button>
            </form>
          ) : (
            <h3 className="mt-1 text-lg font-semibold text-[var(--alouma-jet)]">
              {draft.title}
            </h3>
          )}
        </div>
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--alouma-muted)]">
        {draft.resumeJson.basics.fullName || "Untitled candidate"} · Updated{" "}
        {formatUpdatedAt(draft.updatedAt)}
      </p>
      <div className="mt-3 grid gap-1 text-sm leading-6 text-[var(--alouma-muted)]">
        {draft.kind === "base" ? (
          <p>Reusable master CV saved locally.</p>
        ) : (
          <>
            <p>Job-specific local copy.</p>
            <p>Source: {sourceTitle || "Base CV unavailable"}</p>
            {linkedJobLabel ? <p>{linkedJobLabel}</p> : null}
          </>
        )}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button onClick={() => onOpen(draft.id, "/cv")} variant="secondary">
          Continue editing
        </Button>
        <Button onClick={() => onOpen(draft.id, "/cv/preview")} variant="secondary">
          Preview
        </Button>
        <Button onClick={() => onDuplicate(draft.id)} variant="ghost">
          Duplicate
        </Button>
        {!isRenaming ? (
          <Button onClick={startRename} variant="ghost">
            Rename
          </Button>
        ) : null}
      </div>
    </Card>
  );
}

export default function SavedPage() {
  const router = useRouter();
  const savedDrafts = useResumeStore((state) => state.savedDrafts);
  const hasHydrated = useResumeStore((state) => state.hasHydrated);
  const createBaseDraft = useResumeStore((state) => state.createBaseDraft);
  const loadDraftById = useResumeStore((state) => state.loadDraftById);
  const duplicateDraft = useResumeStore((state) => state.duplicateDraft);
  const renameDraft = useResumeStore((state) => state.renameDraft);
  const trackedJobs = useJobTrackerStore((state) => state.trackedJobs);

  if (!hasHydrated) {
    return (
      <div className="rounded-[16px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-6 text-sm text-[var(--alouma-muted)]">
        Loading saved CVs...
      </div>
    );
  }

  function openDraft(id: string, route: "/cv" | "/cv/preview") {
    if (loadDraftById(id)) {
      router.push(route);
    }
  }

  function createNewCV() {
    createBaseDraft();
    router.push("/cv");
  }

  const visibleDrafts = savedDrafts.filter((draft) => !draft.deletedAt);
  const baseDrafts = visibleDrafts.filter((draft) => draft.kind === "base");
  const matchedDrafts = visibleDrafts.filter((draft) => draft.kind === "matched");

  return (
    <>
      <PageHeader
        description="Local saved drafts grouped by reusable base CVs and job-specific matched copies."
        title="Saved CVs"
      />
      <div className="grid gap-8">
        <section className="grid gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--alouma-muted-soft)]">
              Base CVs
            </h2>
            <p className="mt-1 text-sm text-[var(--alouma-muted)]">
              Clean reusable master CVs for future job matches.
            </p>
          </div>
          {baseDrafts.length ? (
            baseDrafts.map((draft) => (
              <DraftCard
                draft={draft}
                key={draft.id}
                onDuplicate={(id) => duplicateDraft(id)}
                onOpen={openDraft}
                onRename={renameDraft}
              />
            ))
          ) : (
            <EmptySectionCard
              action={
                <Button onClick={createNewCV} variant="dark">
                  Create base CV
                </Button>
              }
              title="No base CVs yet"
            >
              Start with a reusable master CV. Match to Job will create separate copies from
              it later, leaving the base unchanged.
            </EmptySectionCard>
          )}
        </section>

        <section className="grid gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--alouma-muted-soft)]">
              Matched CVs
            </h2>
            <p className="mt-1 text-sm text-[var(--alouma-muted)]">
              Job-specific copies linked back to their source base CV.
            </p>
          </div>
          {matchedDrafts.length ? (
            matchedDrafts.map((draft) => {
              const sourceTitle = baseDrafts.find((base) => base.id === draft.sourceResumeId)?.title;
              const linkedJob = trackedJobs.find((job) => job.id === draft.activeTargetJobId);

              return (
                <DraftCard
                  draft={draft}
                  key={draft.id}
                  linkedJobLabel={jobLabel(linkedJob, Boolean(draft.activeTargetJobId))}
                  onDuplicate={(id) => duplicateDraft(id)}
                  onOpen={openDraft}
                  onRename={renameDraft}
                  sourceTitle={sourceTitle}
                />
              );
            })
          ) : (
            <EmptySectionCard
              action={
                baseDrafts.length ? (
                  <ButtonLink href="/match" variant="dark">
                    Match to Job
                  </ButtonLink>
                ) : (
                  <Button onClick={createNewCV} variant="dark">
                    Create base CV
                  </Button>
                )
              }
              title="No matched CVs yet"
            >
              {baseDrafts.length
                ? "Choose a base CV and paste a job description to create a local matched copy."
                : "Create a base CV first, then return to Match to Job to make job-specific copies."}
            </EmptySectionCard>
          )}
        </section>
      </div>
    </>
  );
}
