"use client";

import { CVPreviewFrame } from "@/components/preview/cv-preview-frame";
import { buildHtml } from "@/cv-renderer/buildHtml";
import { useResumeStore } from "@/lib/stores/resume-store";

export function PreviewPanel() {
  const resume = useResumeStore((state) => state.activeResume);

  return <CVPreviewFrame html={buildHtml(resume)} />;
}
