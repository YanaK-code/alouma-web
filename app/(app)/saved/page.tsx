"use client";

import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useResumeStore } from "@/lib/stores/resume-store";

export default function SavedPage() {
  const activeResume = useResumeStore((state) => state.activeResume);
  const savedDrafts = useResumeStore((state) => state.savedDrafts);
  const drafts = savedDrafts.length > 0 ? savedDrafts : [activeResume];

  return (
    <>
      <PageHeader
        description="Local saved drafts. Backend persistence will replace this later."
        title="Saved CVs"
      />
      <div className="grid gap-4">
        {drafts.map((draft) => (
          <Card className="max-w-2xl" key={draft.meta.id}>
            <h2 className="text-lg font-semibold">{draft.meta.title}</h2>
            <p className="mt-2 text-sm text-neutral-600">
              {draft.basics.fullName || "Untitled candidate"} · Updated{" "}
              {new Date(draft.meta.updatedAt).toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-neutral-600">
              {savedDrafts.length > 0
                ? "Saved in local browser storage."
                : "Active draft placeholder. Click Save Draft in the builder to save it here."}
            </p>
            <div className="mt-5 flex gap-2">
              <ButtonLink href="/cv" variant="secondary">
                Continue CV
              </ButtonLink>
              <ButtonLink href="/cv/preview" variant="secondary">
                Preview
              </ButtonLink>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
