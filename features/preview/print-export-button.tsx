"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { CVPageGeometry } from "@/cv-renderer/geometry";

const EXPORT_FILE_NAME = "AloumaCV.pdf";
const CAPTURE_SCALE = 2;

type PreviewWindow = Window & {
  __paginateCV?: () => void;
};

async function waitForPreviewRender(previewWindow: PreviewWindow) {
  if (previewWindow.document.fonts?.ready) {
    await previewWindow.document.fonts.ready.catch(() => undefined);
  }

  previewWindow.__paginateCV?.();
  await new Promise((resolve) => previewWindow.setTimeout(resolve, 150));
}

function getPreviewContext(frame: HTMLIFrameElement) {
  const previewWindow = frame.contentWindow as PreviewWindow | null;
  const previewDocument = frame.contentDocument;

  if (!previewWindow || !previewDocument) {
    throw new Error("CV preview is not ready yet.");
  }

  return {
    previewWindow,
    previewDocument,
  };
}

function triggerDownload(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = EXPORT_FILE_NAME;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function PrintExportButton() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function downloadPDF() {
    // TODO: Production PDF export must verify entitlement server-side at action time if export is premium-gated.
    const frame = document.querySelector<HTMLIFrameElement>(
      "iframe[data-cv-preview-frame='true']",
    );

    if (!frame) {
      setMessage("CV preview is still loading. Try again in a moment.");
      return;
    }

    setMessage(null);
    setIsDownloading(true);

    try {
      const { previewWindow, previewDocument } = getPreviewContext(frame);

      await waitForPreviewRender(previewWindow);
      previewWindow.scrollTo(0, 0);

      const pages = Array.from(previewDocument.querySelectorAll<HTMLElement>("#pages .page"));

      if (!pages.length) {
        throw new Error("No CV pages were found for export.");
      }

      const pdf = new jsPDF({
        unit: "pt",
        format: [CVPageGeometry.pageWidthPt, CVPageGeometry.pageHeightPt],
        orientation: "portrait",
        compress: true,
      });

      for (const [index, page] of pages.entries()) {
        if (index > 0) {
          pdf.addPage([CVPageGeometry.pageWidthPt, CVPageGeometry.pageHeightPt], "portrait");
        }

        const canvas = await html2canvas(page, {
          backgroundColor: "#ffffff",
          scale: CAPTURE_SCALE,
          useCORS: true,
          width: CVPageGeometry.pageWidthCSSPx,
          height: CVPageGeometry.pageHeightCSSPx,
          windowWidth: CVPageGeometry.pageWidthCSSPx,
          windowHeight: CVPageGeometry.pageHeightCSSPx,
        });
        const imageData = canvas.toDataURL("image/png");

        pdf.addImage(
          imageData,
          "PNG",
          0,
          0,
          CVPageGeometry.pageWidthPt,
          CVPageGeometry.pageHeightPt,
          undefined,
          "FAST",
        );
      }

      triggerDownload(pdf.output("blob"));
      setMessage("PDF download started.");
    } catch (error) {
      console.error("[PDFExport] Direct PDF download failed:", error);
      setMessage("PDF export failed. The preview is still available; try downloading again.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="grid gap-1">
      <Button disabled={isDownloading} onClick={() => void downloadPDF()} variant="secondary">
        {isDownloading ? "Generating PDF..." : "Download PDF"}
      </Button>
      {message ? (
        <p aria-live="polite" className="text-xs text-neutral-600">
          {message}
        </p>
      ) : null}
    </div>
  );
}
