"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useResumeStore } from "@/lib/stores/resume-store";

export default function SavedPage() {
  const router = useRouter();
  const activeResume = useResumeStore((state) => state.activeResume);
  const savedDrafts = useResumeStore((state) => state.savedDrafts);
  const hasHydrated = useResumeStore((state) => state.hasHydrated);
  const saveDraft = useResumeStore((state) => state.saveDraft);
  const loadDraftById = useResumeStore((state) => state.loadDraftById);
  const deleteDraft = useResumeStore((state) => state.deleteDraft);

  if (!hasHydrated) {
    return (
      <div className="rounded-2xl border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-6 text-sm text-[var(--alouma-muted)] shadow-[var(--alouma-shadow-soft)]">
        Loading saved CVs...
      </div>
    );
  }

  function openDraft(id: string, route: "/cv" | "/cv/preview") {
    if (loadDraftById(id)) {
      router.push(route);
    }
  }

  return (
    <>
      <PageHeader
        description="Local saved drafts. Backend persistence will replace this later."
        title="Saved CVs"
      />
      <div className="grid gap-4">
        {savedDrafts.length === 0 ? (
          <Card className="max-w-2xl">
            <h2 className="text-lg font-semibold text-[var(--alouma-jet)]">
              No saved drafts yet
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--alouma-muted)]">
              Your active local draft is available in the builder. Save it here to create a
              restorable browser draft.
            </p>
            <p className="mt-3 rounded-2xl border border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)] p-4 text-sm leading-6 text-[var(--alouma-muted)]">
              Active draft: {activeResume.basics.fullName || "Untitled candidate"} · Updated{" "}
              {new Date(activeResume.meta.updatedAt).toLocaleString()}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={saveDraft} variant="secondary">
                Save Active Draft
              </Button>
              <ButtonLink href="/cv" variant="secondary">
                Continue CV
              </ButtonLink>
              <ButtonLink href="/cv/preview" variant="secondary">
                Preview
              </ButtonLink>
            </div>
          </Card>
        ) : null}
        {savedDrafts.map((draft) => (
          <Card className="max-w-2xl" key={draft.meta.id}>
            <h2 className="text-lg font-semibold text-[var(--alouma-jet)]">
              {draft.meta.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--alouma-muted)]">
              {draft.basics.fullName || "Untitled candidate"} · Updated{" "}
              {new Date(draft.meta.updatedAt).toLocaleString()}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--alouma-muted)]">
              Saved in local browser storage. Loading a draft replaces the active builder draft.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={() => openDraft(draft.meta.id, "/cv")} variant="secondary">
                Continue CV
              </Button>
              <Button onClick={() => openDraft(draft.meta.id, "/cv/preview")} variant="secondary">
                Preview
              </Button>
              <Button onClick={() => deleteDraft(draft.meta.id)} variant="ghost">
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
