CV rendering system audit (read-only) — iOS → web migration

This audit reflects the current codebase (not docs/cv/pdf-export.md, which still describes the older print-formatter-primary path). Authoritative behavior is in Swift under Alouma/DocumentEngine/ and Alouma/Features/Preview/.

Note on “active template”: Default persisted template is Essential (novo_classic). Structured is the second implemented, user-selectable template. Section 3 audits Structured in depth as requested.

1. Current iOS rendering pipeline

End-to-end data flow

flowchart LR
  Resume["Resume in ResumeStore"]
  CVDraft["CVDraft via toCVDraft()"]
  Builder["ResumeHTMLBuilder.generate()"]
  Registry["ResumeTemplateRegistry.resolvedDescriptor()"]
  Preview["PreviewView → WebView"]
  Export["PreviewView → PDFExporter"]
  Resume --> CVDraft --> Builder
  Registry --> Builder
  Builder --> Preview
  Builder --> Export

Stage

File / symbol

Role

State

ResumeStore.draft → Resume.toCVDraft()

Single draft DTO for rendering

Dispatch

ResumeHTMLBuilder.generateThrowing → renderWithResolvedTemplate

Template routing

Registry

ResumeTemplateRegistry.resolvedDescriptor(for:)

Implemented vs fallback

HTML

generateNovoClassicThrowing / generateStructuredThrowing

Inline full documents

Preview

PreviewView + WebView

WKWebView + optional JS bridge

PDF

PDFExporter.exportToPDF(html:)

Headless WKWebView + createPDF

There are no standalone cv_web/ HTML/CSS files in this repo; all template markup lives in ResumeHTMLBuilder.swift (≈2100 lines).

ResumeHTMLBuilder — single public entry

    /// Single source of truth: generates HTML for both Preview and PDF export.
    static func generate(draft: CVDraft, accentColorHex: String = CVColorDefaults.essentialAccentHex) -> String {
        do {
            return try generateThrowing(draft: draft, accentColorHex: accentColorHex)
        } catch {
            print("[ResumeHTMLBuilder] Generate failed: \(error)")
            return minimalFallbackHTML(draft: draft)
        }
    }
    // ...
    private static func generateThrowing(draft: CVDraft, accentColorHex: String) throws -> String {
        let descriptor = ResumeTemplateRegistry.resolvedDescriptor(for: draft.template)
        return try renderWithResolvedTemplate(
            draft: draft,
            accentColorHex: accentColorHex,
            rendererKey: descriptor.rendererKey
        )
    }

Dispatch rules:

essentialNovoClassic → generateNovoClassicThrowing(draft:accentColorHex:)

structured → generateStructuredThrowing(draft:) — accentColorHex parameter is ignored; colors come from CVDraft.resolvedStructured*

expressive → DEBUG log + fallback to Essential

Section safety: safeSection swallows per-section throws; top-level failure → minimalFallbackHTML.

Escaping (must port verbatim):

esc — HTML entities + \n → <br/>

escSummary — entities only; newlines preserved for white-space: pre-wrap

escHref, normalizeURLForHref for links

HTML generation flow (both templates)

Resolve template via ResumeTemplateRegistry.

Build header + section HTML from CVDraft fields (template-specific builders).

Wrap output in a complete <!doctype html> with inline <style> + inline <script>.

Initial DOM: #pages → one .page → .page-content → blocks.

Inject sharedPaginationJS (runs on DOMContentLoaded) to split overflow into more .page elements.

Inject cvBridgeJS for native theme/accent updates without reload.

DOM contract (pagination):

    private static func cvBlock(dataBlock: String, inner: String) -> String {
        guard !inner.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return "" }
        return "<section class=\"cv-block\" data-block=\"\(dataBlock)\">\(inner)</section>"
    }

Structured uses the same cv-block + data-block pattern but adds placement classes (structured-full-block, structured-main-block, structured-side-block).

CSS / template architecture

Layer

Location

Purpose

Shared pagination

sharedPaginationCSS, sharedPaginationJS

A4 page boxes, break rules, overflow packing

Template skin

Inside generate*Throwing <style> blocks

Typography, columns, colors

Bridge

cvBridgeJS

CSS variable / data-theme updates

Geometry constants

CVPageGeometry

Width/height in pt and CSS px

Fonts: CSS stacks only — Inter, system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif. No bundled CV fonts.

Essential (novo_classic): Single-column, larger base type (18px), mm-based spacing, dark-mode tokens, draft.sectionOrder drives block order via novoContentBlocksInOrder.

Structured: Two-column float layout, px-based type scale, light-only (color-scheme: light), fixed main/side block lists (does not use sectionOrder).

Preview rendering path

    private var webViewDraft: CVDraft {
        guard draft.template == .structured else { return draft }
        var previewDraft = draft
        previewDraft.structuredPrimaryAccentColorHex = CVColorDefaults.previewPlaceholderAccentHex
        previewDraft.structuredSecondaryAccentColorHex = CVColorDefaults.previewPlaceholderAccentHex
        return previewDraft
    }
    private var webViewHtml: String {
        ResumeHTMLBuilder.generate(draft: webViewDraft, accentColorHex: CVColorDefaults.previewPlaceholderAccentHex)
    }
    private var html: String {
        ResumeHTMLBuilder.generate(draft: draft, accentColorHex: exportAccentColorHex)
    }

WebView (Alouma/Core/WebView.swift):

loadHTMLString(html, baseURL: Bundle.main.bundleURL) — local/bundled base only

Reload only when HTML string changes; accent/theme via window.CVBridge.onNativeEvent

Fixed logical page frame in parent: CVPageGeometry.webViewportWidthPt × webViewportHeightPt (794×1123 CSS-px-equivalent points), scaled with scaleEffect to fit (PreviewView lines 162–212)

contentInsetAdjustmentBehavior = .never (no double safe-area inset)

Page metrics: injected JS posts pageCount / currentPage to Swift handlers

Preview accent strategy:

Essential: HTML generated with placeholder #AEB6BA; real appState.accentColorHex applied via setAccentColor after load.

Structured: HTML generated with placeholder accents; real primary/secondary via setStructuredAccentColors.

Export uses html (full draft, real colors) — not webViewHtml.

PDF export rendering path

Primary path (current code): PDFExporter.exportUsingCreatePDF

loadHTMLInWebView — WKWebView frame = CVPageGeometry.webViewportWidthPt × webViewportHeightPt

ensureRenderIsStable — waits for document.fonts.ready, checks #pages .page count > 0

collectPageFrames — getBoundingClientRect() per .page

validatePageFrames — all pages same width/height/x (±0.5pt tolerance)

Per page: webView.createPDF(configuration:) with config.rect = frame.rect

composeA4PDF — draws each fragment into 595×842 pt CVPageGeometry.paperRect with fixed transform (top-left anchor, scale sx/sy, flip Y)

Fallback: exportUsingPrintFormatter + A4PrintPageRenderer (printableRect == paperRect, zero insets; margins from CSS only).

Output file: Documents/AloumaCV.pdf (PDFExporter.fileName).

PDFExporter does not use WebView bridge or page-metrics handlers — same HTML producer, separate WebView instance.

Shared geometry system

enum CVPageGeometry {
    static let pageWidthPt: CGFloat = 595
    static let pageHeightPt: CGFloat = 842
    static let cssPixelsPerPoint: CGFloat = 96.0 / 72.0
    static var pageWidthCSSPx: CGFloat { ceil(pageWidthPt * cssPixelsPerPoint) }   // 794
    static var pageHeightCSSPx: CGFloat { ceil(pageHeightPt * cssPixelsPerPoint) } // 1123
    static var webViewportWidthPt: CGFloat { pageWidthCSSPx }
    static var webViewportHeightPt: CGFloat { pageHeightCSSPx }
    static var paperRect: CGRect { CGRect(x: 0, y: 0, width: pageWidthPt, height: pageHeightPt) }
}

Assumption: HTML layout is authored in CSS px at 96dpi mapping (595pt → 794px). Preview and export WebViews use viewports sized in those units to avoid WK fit/zoom drift.

Pagination rules (sharedPaginationCSS + sharedPaginationJS)

CSS (sharedPaginationCSS):

Screen: .page fixed height/max-height = CVPageGeometry.pageHeightCSSPx, overflow: hidden, shadow/border

Print: @page { size: A4; margin: 0; }, non-last .page gets page-break-after: always

.cv-block: break-inside: avoid / page-break-inside: avoid

JS algorithm (summary):

Walk pages index 0…n; while page.scrollHeight > page.clientHeight, move content to next page

Prefer moving last .novo-entry inside a block if ≥2 entries exist

Do not split blocks with data-block in courses, education, awards (whole block moves)

Header orphan heuristic: if section header starts in bottom 25% of page, move whole block instead of last entry

experience / volunteer continuation: cloned .novo-section-header on dest page; block inserted at top of destination .page-content

MAX_MOVES 200 per page, MAX_TOTAL_PASSES 1000 global

Single block taller than one page: allowed to overflow (no infinite loop)

Structured reuses .novo-section-header and .novo-entry on section headers/entries specifically so this JS works unchanged.

A4 sizing assumptions

Context

Width

Height

Margins

CSS layout page

794px

min 1123px (screen box)

Template padding inside .page

Structured padding

—

—

42px 48px 36px 48px

Essential padding

—

—

screen: 28/48/36/48 px; print: mm vars

PDF paper

595pt

842pt

0 native; @page { margin: 0 }

Accent color system

Template

Source

CSS variables

Essential

accentColorHex arg + AppState

--accent, --accent-weak (25% rgba)

Structured

draft.resolvedStructuredPrimaryAccentColorHex / Secondary

--structured-primary-accent, --structured-secondary-accent; primary also sets --accent / --accent-weak

Defaults (CVColorDefaults in AccentColor.swift):

Essential default accent: F2D04E (Mustard)

Structured primary: 24221B (Jet), secondary: F2D04E

Preview placeholder (both): AEB6BA

Bridge (cvBridgeJS):

        window.CVBridge.onNativeEvent = function(ev) {
          // setAccentColor → --accent, --accent-weak
          // setStructuredAccentColors → --structured-* (+ setAccent primary)
          // setThemeOverride → data-theme light|dark|remove
        };

Structured template is light-only in generated CSS (color-scheme: light; print forces white).

Template selection system

enum ResumeTemplateRegistry {
    static let essentialTemplate: ResumeTemplate = .novo_classic
    // orderedDescriptors: Essential (implemented), Structured (implemented), Expressive (not)
    static func resolvedDescriptor(for requestedTemplate: ResumeTemplate) -> ResumeTemplateDescriptor {
        // unimplemented → fallbackTemplate (novo_classic)
    }
}

Persistence: Resume.template / CVDraft.template (ResumeTemplate enum: novo_classic, structured, expressive)

Legacy decode: modern, essential, etc. → novo_classic

UI: PreviewView horizontal picker when selectableDescriptors.count > 1; ResumeStore.setTemplate

Structured colors: setStructuredPrimaryAccentColor / setStructuredSecondaryAccentColor on ResumeStore

2. Source-of-truth rendering rules

What guarantees preview/export parity

Same producer: ResumeHTMLBuilder.generate for both paths (ADR 0001, docs/cv/engine-contract.md).

Same DOM + pagination JS/CSS after load.

Same viewport geometry: 794×1123 CSS-px layout box; PDF scales captured rects → 595×842 pt.

Export uses final draft + real accents (PreviewView.html); preview may use placeholders + bridge — layout structure identical, colors applied before export without bridge.

Print CSS drives breaks (@page, .cv-block avoid, .page breaks) — no separate “PDF layout” HTML.

What must never diverge

Invariant

Authority

#pages → .page → .page-content → .cv-block

layout-do-not-touch.md, sharedPagination*

Single HTML producer

ADR 0001, .cursor/rules/10-cv-engine.mdc

esc / escSummary semantics

engine-contract.md

CVPageGeometry numbers

CVPageGeometry.swift

Pagination JS behavior (movable entries, grid blocks, experience continuation)

sharedPaginationJS

No network fonts/assets for CV

10-cv-webview-determinism.mdc

Template fallback to Essential when unimplemented

ResumeTemplateRegistry

Authoritative files (ordered)

Alouma/DocumentEngine/ResumeHTMLBuilder.swift — all HTML/CSS/JS

Alouma/DocumentEngine/CVPageGeometry.swift

Alouma/DocumentEngine/ResumeTemplateRegistry.swift

Alouma/DocumentEngine/CVTemplateRenderer.swift

Alouma/DocumentEngine/PDFExporter.swift

Alouma/Models/CVDraft.swift + Resume.toCVDraft()

Alouma/Models/AccentColor.swift (CVColorDefaults)

Alouma/Features/Preview/PreviewView.swift

Alouma/Core/WebView.swift

Docs: docs/cv/engine-contract.md, docs/cv/layout-do-not-touch.md, docs/adr/0001-cv-rendering-approach.md, docs/cv/webview-bridge.md

Documented vs code drift (for migration team)

docs/cv/pdf-export.md: describes print-formatter-primary; code is createPDF-primary.

docs/cv/layout-do-not-touch.md: says “runtime output is novo_classic” — outdated; Structured is implemented and selectable.

docs/cv/pdf-export.md: filename Foxy_CV.pdf vs code AloumaCV.pdf.

3. Structured template audit (deep)

Renderer: generateStructuredThrowing (from line 498). Active when draft.template == .structured.

Typography hierarchy

CSS variables in :root (lines 529–542):

Token

Value

Usage

--st-name-size

35px

h1.structured-name

--st-role-size

13.2px

.structured-headline

--st-contact-size

10.4px

contact row

--st-section-size

12px

uppercase section titles

--st-entry-title-size

12.6px

role/degree titles

--st-entry-subtitle-size

10.8px

company/school

--st-body-size

10.7px

body default

--st-bullet-size

9.6px

lists / side descriptions

--st-meta-size

9.1px

dates/location

--st-line-tight

1.22

headers, meta

--st-line-body

1.25

body, bullets

Experience overrides (recruiter scan density): title 12.2px, subtitle/meta 8.7px, bullets 9.1px / padding-left 12px / li margin 1px.

Color roles:

Primary accent (--structured-primary-accent): name, entry titles, skills, side titles

Secondary accent: headline, subtitles, course titles

--structured-text #3F4146, --structured-muted #70747A, rules #B9BBBE / soft #DADBDD

Section titles: uppercase, muted, font-weight: 520, 1.4px bottom border — editorial “label” rhythm.

Spacing system

Token

px

Applied

--st-section-gap

15

between stacked main/side blocks

--st-entry-gap

12

between entries (11px in experience)

Header margin-bottom

28px

below header block

Section header

margin 0 0 13px, padding-bottom 5px

under title rule

Bullets

margin-top 4px, padding-left 15px (12px experience)



Side entries

margin-bottom 14px

awards/courses/etc.

Page padding: 42px 48px 36px 48px on .page (reduces usable column width to ~698px inside 794px page).

Section rhythm & column behavior

Placement enum (StructuredBlockPlacement): .full, .main, .side.

Main column (58.7% float left): Summary → Experience → Education → Projects → Volunteering (fixed order in structuredMainBlocks).

Side column (38.3% float right): Skills → Key Achievements → Training/Courses → Interests → Programs & Tools → Languages (structuredSupportBlocks).

Interleaving algorithm (structuredContentBlocksHTML): seeds first main, first side, second main, then alternates by structuredEstimatedBlockHeight heuristic (string-length-based, not real layout). This controls DOM order of floated blocks on page 1 — critical for web port.

        // append first main, first side, second main, then while either remains:
        // pick side if mainHeight > supportHeight else main

Clearfix: .structured-template .page-content::after { clear: both }.

Responsive: @media screen and (max-width: 480px) stacks columns to 100% width.

Alignment rules

Entry details: flex row, justify-content: space-between; meta right-aligned (text-align: right, max-width 48%)

Contact: flex wrap, middot separators via ::before on adjacent .structured-contact-item

Skills: flex-wrap “chips” with bottom border (not bullets)

orphans: 2; widows: 2 on body

Header / contact layout

structuredHeaderBlockHTML → cv-block data-block="structured-header", placement .full:

h1.structured-name, div.structured-headline

Contact order: email (mailto) → phone → LinkedIn (label) → Portfolio → location

Links: target="_blank" rel="noopener noreferrer"; display labels “LinkedIn” / “Portfolio” (not raw URLs)

Bullet spacing & narrative rules

Bullets: <ul class="structured-bullets">, marker color muted, li { margin: 2px 0 }

structuredNarrativeHTML: summary paragraph OR bullets; if summary looks bullet-formatted (isBulletFormatted), split into list via stripBulletPrefix

Simple lists (interests, languages): .structured-list with slightly larger li gap (4px)

Recruiter readability decisions (encoded in design)

Two-column scan path: narrative left, credentials right — classic recruiter F-pattern.

Tighter experience typography than other sections — prioritizes employers/dates/bullets on skim.

Break avoidance on sections, entries, header (break-inside: avoid everywhere meaningful).

Muted uppercase section labels + strong primary role titles — hierarchy without heavy boxes.

Dual accent: structure (primary) vs emphasis (secondary) — Mustard/Jet brand default.

No dark mode in Structured — print-stable, always light PDF.

Pagination honors .novo-entry splits for long experience — continuation headers on new pages.

Grid-like blocks (education, courses, awards) move atomically — avoids duplicated section headers mid-grid.

Structured data-block values (for pagination)

structured-header, summary, experience, education, projects, volunteer, skills, awards, courses, interests, programsTools, languages

4. Exact web translation recommendation

Goal: preserve Alouma output, not redesign. Treat iOS as golden; port mechanics faithfully.

Architecture (mirror iOS layers)

packages/cv-engine/
  geometry.ts          // CVPageGeometry constants
  escape.ts            // esc, escSummary, escHref, normalizeURLForHref
  colorDefaults.ts     // CVColorDefaults
  templateRegistry.ts  // ResumeTemplateRegistry logic
  resumeHtmlBuilder.ts // generate(draft, accentColorHex)
  pagination.css.ts    // sharedPaginationCSS (string)
  pagination.js.ts     // sharedPaginationJS (string)
  cvBridge.js.ts       // cvBridgeJS
  templates/
    structured.ts      // port generateStructuredThrowing output
    essential.ts       // port generateNovoClassicThrowing

Do not split preview vs export HTML builders on web.

HTML/CSS renderer for web

Port ResumeHTMLBuilder to TypeScript (or generate strings from Swift via codegen). Inline CSS/JS strings should stay byte-stable where possible for golden tests.

Keep identical DOM: #pages > .page > .page-content > section.cv-block[data-block].

Inject the same two scripts at end of <body>: pagination IIFE + CVBridge.

Viewport meta: width=794, initial-scale=1, maximum-scale=1, user-scalable=no (from Structured/Essential generators).

Font stack: same system stack; if you need Inter parity, bundle Inter woff2 (iOS uses system Inter when available) — document any metric delta.

Browser preview

Mirror PreviewView + WebView:

iOS behavior

Web equivalent

webViewHtml + placeholder accents

generate(draftWithPlaceholderColors)

CVBridge after load

postMessage or direct window.CVBridge.onNativeEvent

794×1123 layout box

iframe or div with width: 794px; height: 1123px per page (or container for #pages)

scaleEffect(min(horizontal, vertical, 1))

CSS transform: scale(...) on wrapper

Page indicator

scroll listener on same logic as WebView injected metrics (200ms timeout after pagination)

Reload on draft change only

Regenerate HTML when CVDraft hash changes; patch colors via bridge only

Critical: Run sharedPaginationJS in preview before measuring pages for UI indicators — same as iOS (pagination on DOMContentLoaded).

Print CSS

Copy verbatim:

@page { size: A4; margin: 0; }

.cv-block { break-inside: avoid }

.page:not(:last-child) { page-break-after: always } (in @media print section of sharedPaginationCSS)

-webkit-print-color-adjust: exact; print-color-adjust: exact

Structured: force white backgrounds in @media print

Browser print dialog: User can “Save as PDF” with background graphics on; should match if pagination JS ran first.

Export flow (web)

Mirror PDFExporter primary path:

Load full HTML (export variant: real accents, same as PreviewView.html) in hidden iframe/WebView at 794×1123 (or 595×842pt at 96dpi — pick one convention and stick to iOS’s CSS-px model).

Wait for fonts + pagination (#pages .page.length > 0).

For each .page, measure getBoundingClientRect(); validate uniform width/height.

Rasterize or print each page rect to 595×842 pt PDF page with fixed scale (no adaptive fit/center) — same math as composeA4PDF (sx = 595/width, sy = 842/height, top-left anchor).

Implementation options (fidelity order):

Headless Chromium (Puppeteer/Playwright): page.pdf() per clipped region or print with CSS — closest to WK createPDF.

html2canvas + jsPDF per .page element — higher drift risk on fonts/subpixel.

Browser print API — acceptable for MVP if pagination + @page tested against iOS golden PDFs.

Do not maintain a second export-only layout CSS file unless ADR explicitly allows it.

Parity testing (web)

Golden set from iOS QA matrix:

Short CV (1 page), long experience (multi-page + entry split), full side column, max skills wrap

Structured Jet/Mustard + alternate presets from StructuredColorPreset.all

Essential accent presets

Compare page count, header positions, and column breaks — pixel diff optional; structural DOM diff required

Preview vs export on web (match

You're right to flag that. The first pass covered the four requested areas, but several important details were compressed or omitted. Below is the continuation — not a repeat of the full audit.

What the first report under-covered

