"use client";

import { Button } from "@/components/ui/button";

export function PrintExportButton() {
  function printPreviewFrame() {
    const frame = document.querySelector<HTMLIFrameElement>(
      "iframe[data-cv-preview-frame='true']",
    );

    if (frame?.contentWindow) {
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
