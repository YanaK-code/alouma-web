"use client";

import { CVPreviewFrame } from "@/components/preview/cv-preview-frame";
import { buildHtml } from "@/cv-renderer/buildHtml";
import { useResumeStore } from "@/lib/stores/resume-store";

export function PreviewPanel({ defaultZoom = "fit" }: { defaultZoom?: "fit" | "actual" }) {
  const resume = useResumeStore((state) => state.activeResume);
  const hasActiveDraft = useResumeStore((state) => state.hasActiveDraft);
  const hasHydrated = useResumeStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return (
      <div className="rounded-[12px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-6 text-sm text-[var(--alouma-muted)]">
        Loading CV preview...
      </div>
    );
  }

  if (!hasActiveDraft) {
    return (
      <div className="rounded-[12px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-6 text-sm leading-6 text-[var(--alouma-muted)]">
        No active CV draft to preview yet. Create or open a draft in CV Builder first.
      </div>
    );
  }

  // TODO: Preview is currently bound to the active local draft in the Zustand store.
  // Add a draft-id route/query contract before deep-linking previews for non-active drafts.
  return <CVPreviewFrame defaultZoom={defaultZoom} html={buildHtml(resume)} />;
}
