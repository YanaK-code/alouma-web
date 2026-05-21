import { CVColorDefaults } from "@/cv-renderer/color-defaults";
import { cvBridgeJS } from "@/cv-renderer/cv-bridge.js";
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
  const descriptor = resolvedDescriptor(resume.template);
  const body =
    descriptor.rendererKey === "structured"
      ? renderStructured(resume)
      : renderEssential(resume, resume.accentColor || CVColorDefaults.essentialAccentHex);

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
  return completeDocument(
    renderEssential(
      {
        ...resume,
        template: "novo_classic",
      },
      CVColorDefaults.essentialAccentHex,
    ),
  );
}
