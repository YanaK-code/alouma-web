"use client";

import { CVPreviewFrame } from "@/components/preview/cv-preview-frame";
import { buildHtml } from "@/cv-renderer/buildHtml";
import { useResumeStore } from "@/lib/stores/resume-store";

export function PreviewPanel() {
  const resume = useResumeStore((state) => state.activeResume);
  const hasHydrated = useResumeStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return (
      <div className="rounded-md border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
        Loading CV preview...
      </div>
    );
  }

  return <CVPreviewFrame html={buildHtml(resume)} />;
}
