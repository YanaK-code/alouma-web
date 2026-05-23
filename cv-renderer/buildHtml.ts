import { CVColorDefaults } from "@/cv-renderer/color-defaults";
import { cvBridgeJS } from "@/cv-renderer/cv-bridge.js";
import { toCVDraft } from "@/cv-renderer/draft";
import { CVPageGeometry } from "@/cv-renderer/geometry";
import { sharedPaginationJS } from "@/cv-renderer/pagination.js";
import { resolvedDescriptor } from "@/cv-renderer/template-registry";
import { renderEssential } from "@/cv-renderer/templates/essential";
import { renderStructured } from "@/cv-renderer/templates/structured";
import type { Resume } from "@/schemas/resume";

export function buildHtml(resume: Resume) {
  try {
    return generateThrowing(resume);
  } catch (error) {
    console.error("[ResumeHTMLBuilder] Generate failed:", error);
    return minimalFallbackHTML(resume);
  }
}

function generateThrowing(resume: Resume) {
  const draft = toCVDraft(resume);
  const descriptor = resolvedDescriptor(draft.template);
  const body =
    descriptor.rendererKey === "structured"
      ? renderStructured(draft)
      : renderEssential(draft, draft.accentColorHex);

  return completeDocument(body);
}

function completeDocument(body: string) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=${CVPageGeometry.pageWidthCSSPx}, initial-scale=1, maximum-scale=1, user-scalable=no"
    />
  </head>
  <body>
    ${body}
    <script>${sharedPaginationJS}</script>
    <script>${cvBridgeJS}</script>
  </body>
</html>`;
}

function minimalFallbackHTML(resume: Resume) {
  const draft = toCVDraft({
    ...resume,
    template: "novo_classic",
  });

  return completeDocument(
    renderEssential(draft, CVColorDefaults.essentialAccentHex),
  );
}
