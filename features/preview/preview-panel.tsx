"use client";

import { CVPreviewFrame } from "@/components/preview/cv-preview-frame";
import { buildHtml } from "@/cv-renderer/buildHtml";
import { useResumeStore } from "@/lib/stores/resume-store";

export function PreviewPanel({ defaultZoom = "fit" }: { defaultZoom?: "fit" | "actual" }) {
  const resume = useResumeStore((state) => state.activeResume);
  const hasHydrated = useResumeStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return (
      <div className="rounded-[12px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-6 text-sm text-[var(--alouma-muted)]">
        Loading CV preview...
      </div>
    );
  }

  return <CVPreviewFrame defaultZoom={defaultZoom} html={buildHtml(resume)} />;
}
