"use client";

import { useEffect, useRef, useState } from "react";
import { CVPageGeometry } from "@/cv-renderer/geometry";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type ZoomMode = "fit" | "manual";

const zoomStep = 0.1;
const minZoom = 0.35;
const maxZoom = 1.5;

function clampZoom(value: number) {
  return Math.min(Math.max(value, minZoom), maxZoom);
}

function zoomLabel(scale: number) {
  return `${Math.round(scale * 100)}%`;
}

function PreviewControls({
  displayScale,
  onFit,
  onOpenLarge,
  onZoomIn,
  onZoomOut,
  onZoomToActual,
  zoomMode,
}: {
  displayScale: number;
  onFit: () => void;
  onOpenLarge?: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomToActual: () => void;
  zoomMode: ZoomMode;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-1.5">
        <Button
          aria-pressed={zoomMode === "fit"}
          className="min-h-8 px-2.5 text-xs"
          onClick={onFit}
          variant={zoomMode === "fit" ? "dark" : "secondary"}
        >
          Fit
        </Button>
        <Button
          aria-pressed={zoomMode === "manual" && Math.abs(displayScale - 1) < 0.01}
          className="min-h-8 px-2.5 text-xs"
          onClick={onZoomToActual}
          variant={
            zoomMode === "manual" && Math.abs(displayScale - 1) < 0.01
              ? "dark"
              : "secondary"
          }
        >
          100%
        </Button>
        <Button
          aria-label="Zoom out"
          className="min-h-8 w-8 px-0 text-sm"
          onClick={onZoomOut}
          variant="secondary"
        >
          -
        </Button>
        <Button
          aria-label="Zoom in"
          className="min-h-8 w-8 px-0 text-sm"
          onClick={onZoomIn}
          variant="secondary"
        >
          +
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <span className="min-w-12 text-right text-xs font-semibold text-[var(--alouma-muted)]">
          {zoomMode === "fit" ? `Fit ${zoomLabel(displayScale)}` : zoomLabel(displayScale)}
        </span>
        {onOpenLarge ? (
          <Button className="min-h-8 px-2.5 text-xs" onClick={onOpenLarge} variant="ghost">
            Large
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function PreviewViewport({
  className,
  html,
  manualScale,
  onScaleChange,
  zoomMode,
}: {
  className?: string;
  html: string;
  manualScale: number;
  onScaleChange: (scale: number) => void;
  zoomMode: ZoomMode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const scale = zoomMode === "fit" ? fitScale : manualScale;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    function updateScale() {
      const width = container?.clientWidth ?? CVPageGeometry.webViewportWidthPt;
      const availableHeight = container?.clientHeight || Math.max(window.innerHeight - 260, 420);
      setFitScale(
        Math.min(
          width / CVPageGeometry.webViewportWidthPt,
          availableHeight / CVPageGeometry.webViewportHeightPt,
          1,
        ),
      );
    }

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    window.addEventListener("resize", updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  useEffect(() => {
    onScaleChange(scale);
  }, [onScaleChange, scale]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full overflow-auto border-t border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)] py-4",
        className,
      )}
    >
      <div
        className="mx-auto shadow-[0_12px_32px_rgba(32,29,24,0.08)]"
        style={{
          width: CVPageGeometry.webViewportWidthPt * scale,
          height: CVPageGeometry.webViewportHeightPt * scale,
        }}
      >
        <iframe
          className="block border-0 bg-white"
          data-cv-preview-frame="true"
          sandbox="allow-scripts allow-same-origin allow-modals"
          srcDoc={html}
          style={{
            width: CVPageGeometry.webViewportWidthPt,
            height: CVPageGeometry.webViewportHeightPt,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
          title="CV preview"
        />
      </div>
    </div>
  );
}

export function CVPreviewFrame({
  defaultZoom = "fit",
  html,
}: {
  defaultZoom?: "fit" | "actual";
  html: string;
}) {
  const [zoomMode, setZoomMode] = useState<ZoomMode>(defaultZoom === "actual" ? "manual" : "fit");
  const [manualScale, setManualScale] = useState(defaultZoom === "actual" ? 1 : 0.85);
  const [isLargeOpen, setIsLargeOpen] = useState(false);
  const [displayScale, setDisplayScale] = useState(1);

  function setActualZoom() {
    setZoomMode("manual");
    setManualScale(1);
    setDisplayScale(1);
  }

  function adjustZoom(delta: number) {
    setZoomMode("manual");
    setManualScale((current) => {
      const next = clampZoom((zoomMode === "fit" ? displayScale : current) + delta);
      setDisplayScale(next);
      return next;
    });
  }

  function setFitZoom() {
    setZoomMode("fit");
  }

  return (
    <>
      {!isLargeOpen ? (
        <>
          <PreviewControls
            displayScale={displayScale}
            onFit={setFitZoom}
            onOpenLarge={() => {
              setActualZoom();
              setIsLargeOpen(true);
            }}
            onZoomIn={() => adjustZoom(zoomStep)}
            onZoomOut={() => adjustZoom(-zoomStep)}
            onZoomToActual={setActualZoom}
            zoomMode={zoomMode}
          />
          <PreviewViewport
            className="max-h-[min(72vh,760px)]"
            html={html}
            manualScale={manualScale}
            onScaleChange={setDisplayScale}
            zoomMode={zoomMode}
          />
        </>
      ) : null}

      {isLargeOpen ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 grid bg-[rgba(17,17,15,0.36)] p-4 backdrop-blur-sm sm:p-6"
          role="dialog"
        >
          <div className="grid h-full min-h-0 grid-rows-[auto_auto_minmax(0,1fr)] rounded-[10px] border border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)] p-4 shadow-[0_24px_80px_rgba(17,17,15,0.22)]">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3 border-b border-[var(--alouma-hairline)] pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--alouma-muted-soft)]">
                  Preview
                </p>
                <h2 className="mt-1 text-base font-semibold text-[var(--alouma-jet)]">
                  Live output
                </h2>
              </div>
              <Button
                className="min-h-8 px-3 text-xs"
                onClick={() => setIsLargeOpen(false)}
                variant="secondary"
              >
                Close
              </Button>
            </div>
            <PreviewControls
              displayScale={displayScale}
              onFit={setFitZoom}
              onZoomIn={() => adjustZoom(zoomStep)}
              onZoomOut={() => adjustZoom(-zoomStep)}
              onZoomToActual={setActualZoom}
              zoomMode={zoomMode}
            />
            <PreviewViewport
              className="min-h-0 max-h-[calc(100vh-12rem)]"
              html={html}
              manualScale={manualScale}
              onScaleChange={setDisplayScale}
              zoomMode={zoomMode}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
