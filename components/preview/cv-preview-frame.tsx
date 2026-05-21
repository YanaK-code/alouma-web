"use client";

import { useEffect, useRef, useState } from "react";
import { CVPageGeometry } from "@/cv-renderer/geometry";

export function CVPreviewFrame({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    function updateScale() {
      const width = container?.clientWidth ?? CVPageGeometry.webViewportWidthPt;
      const availableHeight = Math.max(window.innerHeight - 220, 420);
      setScale(
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

  return (
    <div ref={containerRef} className="w-full overflow-auto rounded-md border border-neutral-300 bg-neutral-100 p-4">
      <div
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
