"use client";

import { Button } from "@/components/ui/button";

export function PrintExportButton() {
  async function printPreviewFrame() {
    const frame = document.querySelector<HTMLIFrameElement>(
      "iframe[data-cv-preview-frame='true']",
    );

    if (frame?.contentWindow) {
      const previewWindow = frame.contentWindow as Window & {
        __paginateCV?: () => void;
      };

      previewWindow.__paginateCV?.();
      await new Promise((resolve) => previewWindow.setTimeout(resolve, 100));
      frame.contentWindow.focus();
      frame.contentWindow.print();
      return;
    }

    window.print();
  }

  return (
    <Button onClick={printPreviewFrame} variant="secondary">
      Export / Print
    </Button>
  );
}
