import { cvBlock, entry, sectionHeader } from "@/cv-renderer/blocks";
import type { CVDraft } from "@/cv-renderer/draft";
import { esc, escHref, escSummary } from "@/cv-renderer/escape";
import { sharedPaginationCSS } from "@/cv-renderer/pagination.css";

type Placement = "full" | "main" | "side";

function placementClass(placement: Placement) {
  return `structured-${placement}-block`;
}

function structuredBlock(dataBlock: string, placement: Placement, inner: string) {
  return cvBlock(dataBlock, inner, placementClass(placement));
}

function contactItem(inner: string) {
  if (!inner.trim()) {
    return "";
  }

  return `<span class="structured-contact-item">${inner}</span>`;
}

function hexToRgba(hex: string, alpha: number) {
  let normalized = hex.replace("#", "").trim();

  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((value) => value + value)
      .join("");
  }

  const value = Number.parseInt(normalized, 16);

  if (Number.isNaN(value)) {
    return `rgba(36, 34, 27, ${alpha})`;
  }

  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function headerBlock(draft: CVDraft) {
  const linkedin = draft.basics.linkedin.trim()
    ? `<a href="${escHref(draft.basics.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`
    : "";
  const portfolio = draft.basics.website.trim()
    ? `<a href="${escHref(draft.basics.website)}" target="_blank" rel="noopener noreferrer">Portfolio</a>`
    : "";

  const contacts = [
    draft.basics.email
      ? `<a href="${escHref(draft.basics.email)}" target="_blank" rel="noopener noreferrer">${esc(draft.basics.email)}</a>`
      : "",
    draft.basics.phone ? `<span>${esc(draft.basics.phone)}</span>` : "",
    linkedin,
    portfolio,
    draft.basics.location ? `<span>${esc(draft.basics.location)}</span>` : "",
  ]
    .map(contactItem)
    .join("");

  return structuredBlock(
    "structured-header",
    "full",
    `
      <header class="structured-header">
        <h1 class="structured-name">${esc(draft.basics.fullName)}</h1>
        <div class="structured-headline">${esc(draft.basics.headline)}</div>
        <div class="structured-contact">${contacts}</div>
      </header>
    `,
  );
}

function splitContentLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function isBulletFormatted(value: string) {
  const lines = splitContentLines(value);

  return lines.length > 0 && lines.every((line) => /^\s*(?:[-*•–—]|\d+[.)])\s+/.test(line));
}

function stripBulletPrefix(value: string) {
  return value.replace(/^\s*(?:[-*•–—]|\d+[.)])\s+/, "");
}

function bulletList(items: string[], className = "structured-bullets") {
  if (!items.length) {
    return "";
  }

  return `<ul class="${className}">${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
}

function narrativeHTML(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (isBulletFormatted(trimmed)) {
    return bulletList(splitContentLines(trimmed).map(stripBulletPrefix));
  }

  return `<p class="structured-narrative">${escSummary(trimmed)}</p>`;
}

function noteHTML(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (isBulletFormatted(trimmed)) {
    return bulletList(splitContentLines(trimmed).map(stripBulletPrefix), "structured-list");
  }

  const lines = splitContentLines(trimmed);

  if (lines.length > 1) {
    return `<ul class="structured-list">${lines.map((line) => `<li>${esc(line)}</li>`).join("")}</ul>`;
  }

  return `<p class="structured-side-text">${escSummary(trimmed)}</p>`;
}

function narrativeBlock(dataBlock: string, title: string, value: string, placement: Placement) {
  const body = narrativeHTML(value);

  if (!body) {
    return "";
  }

  return structuredBlock(dataBlock, placement, `${sectionHeader(title)}${body}`);
}

function sideNoteBlock(draft: CVDraft, dataBlock: string, title: string) {
  const body = noteHTML(draft.sectionNotes[dataBlock] ?? "");

  if (!body) {
    return "";
  }

  return structuredBlock(dataBlock, "side", `${sectionHeader(title)}${body}`);
}

function mainNoteBlock(draft: CVDraft, dataBlock: string, title: string) {
  return narrativeBlock(dataBlock, title, draft.sectionNotes[dataBlock] ?? "", "main");
}

function dateRange(startDate: string, endDate: string) {
  const start = startDate.trim();
  const end = endDate.trim();

  if (start && end) {
    return `${start} - ${end}`;
  }

  return start || end;
}

function detailLine(parts: string[]) {
  return parts.filter((part) => part.trim()).map(esc).join(" · ");
}

function experienceBlock(draft: CVDraft) {
  if (!draft.experience.length) {
    return "";
  }

  return structuredBlock(
    "experience",
    "main",
    `${sectionHeader("Experience")}${draft.experience
      .map((item) =>
        entry(
          `
            <div class="structured-entry-topline">
              <h3>${esc(item.role)}</h3>
              <span>${esc(dateRange(item.startDate, item.endDate))}</span>
            </div>
            <div class="structured-entry-subtitle">${detailLine([item.company, item.location])}</div>
            ${bulletList(item.bullets)}
          `,
          "structured-experience-entry",
        ),
      )
      .join("")}`,
  );
}

function educationBlock(draft: CVDraft) {
  if (!draft.education.length) {
    return "";
  }

  return structuredBlock(
    "education",
    "main",
    `${sectionHeader("Education")}${draft.education
      .map((item) =>
        entry(`
          <div class="structured-entry-topline">
            <h3>${esc(item.degree)}</h3>
            <span>${esc(dateRange(item.startDate, item.endDate))}</span>
          </div>
          <div class="structured-entry-subtitle">${detailLine([item.school, item.location])}</div>
        `),
      )
      .join("")}`,
  );
}

function skillsBlock(draft: CVDraft) {
  if (!draft.skills.length) {
    return "";
  }

  return structuredBlock(
    "skills",
    "side",
    `${sectionHeader("Skills")}<div class="structured-skills">${draft.skills
      .map((skill) => `<span>${esc(skill)}</span>`)
      .join("")}</div>`,
  );
}

function toolsBlock(draft: CVDraft) {
  if (!draft.programsTools.length) {
    return "";
  }

  return structuredBlock(
    "programsTools",
    "side",
    `${sectionHeader("Programs & Tools")}<ul class="structured-list">${draft.programsTools
      .map((tool) => `<li>${esc(tool)}</li>`)
      .join("")}</ul>`,
  );
}

function estimatedHeight(html: string) {
  return Math.ceil(html.replace(/<[^>]*>/g, "").length / 36);
}

function interleaveStructuredBlocks(mainBlocks: string[], sideBlocks: string[]) {
  const output: string[] = [];
  let mainIndex = 0;
  let sideIndex = 0;
  let mainHeight = 0;
  let sideHeight = 0;

  if (mainBlocks[mainIndex]) {
    output.push(mainBlocks[mainIndex]);
    mainHeight += estimatedHeight(mainBlocks[mainIndex]);
    mainIndex += 1;
  }

  if (sideBlocks[sideIndex]) {
    output.push(sideBlocks[sideIndex]);
    sideHeight += estimatedHeight(sideBlocks[sideIndex]);
    sideIndex += 1;
  }

  if (mainBlocks[mainIndex]) {
    output.push(mainBlocks[mainIndex]);
    mainHeight += estimatedHeight(mainBlocks[mainIndex]);
    mainIndex += 1;
  }

  while (mainIndex < mainBlocks.length || sideIndex < sideBlocks.length) {
    if (sideIndex < sideBlocks.length && (mainHeight > sideHeight || mainIndex >= mainBlocks.length)) {
      output.push(sideBlocks[sideIndex]);
      sideHeight += estimatedHeight(sideBlocks[sideIndex]);
      sideIndex += 1;
    } else if (mainIndex < mainBlocks.length) {
      output.push(mainBlocks[mainIndex]);
      mainHeight += estimatedHeight(mainBlocks[mainIndex]);
      mainIndex += 1;
    }
  }

  return output.join("");
}

export function renderStructured(draft: CVDraft) {
  const mainBlocks = [
    narrativeBlock("summary", "Summary", draft.summary, "main"),
    experienceBlock(draft),
    educationBlock(draft),
    mainNoteBlock(draft, "projects", "Projects"),
    mainNoteBlock(draft, "volunteer", "Volunteering"),
  ].filter(Boolean);
  const sideBlocks = [
    skillsBlock(draft),
    sideNoteBlock(draft, "awards", "Key Achievements"),
    sideNoteBlock(draft, "courses", "Training & Courses"),
    sideNoteBlock(draft, "interests", "Interests"),
    toolsBlock(draft),
    sideNoteBlock(draft, "languages", "Languages"),
  ].filter(Boolean);
  const content = `${headerBlock(draft)}${interleaveStructuredBlocks(mainBlocks, sideBlocks)}`;

  return `
    <style>
      ${sharedPaginationCSS}
      :root {
        color-scheme: light;
        --structured-primary-accent: ${draft.structuredPrimaryAccentColorHex};
        --structured-secondary-accent: ${draft.structuredSecondaryAccentColorHex};
        --accent: var(--structured-primary-accent);
        --accent-weak: ${hexToRgba(draft.structuredPrimaryAccentColorHex, 0.25)};
        --structured-text: #3F4146;
        --structured-muted: #70747A;
        --structured-rule: #B9BBBE;
        --structured-rule-soft: #DADBDD;
        --st-name-size: 35px;
        --st-role-size: 13.2px;
        --st-contact-size: 10.4px;
        --st-section-size: 12px;
        --st-entry-title-size: 12.6px;
        --st-entry-subtitle-size: 10.8px;
        --st-body-size: 10.7px;
        --st-bullet-size: 9.6px;
        --st-meta-size: 9.1px;
        --st-line-tight: 1.22;
        --st-line-body: 1.25;
        --st-section-gap: 15px;
        --st-entry-gap: 12px;
      }

      .structured-template .page,
      .structured-template .page-content {
        background: #ffffff;
      }

      .structured-template .page-content {
        padding: 42px 48px 36px 48px;
        color: var(--structured-text);
        font-family: Inter, system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif;
        font-size: var(--st-body-size);
        line-height: var(--st-line-body);
        orphans: 2;
        widows: 2;
      }

      .structured-template .page-content::after {
        content: "";
        display: block;
        clear: both;
      }

      .structured-full-block {
        clear: both;
        width: 100%;
      }

      .structured-main-block {
        float: left;
        clear: left;
        width: 58.7%;
        margin: 0 0 var(--st-section-gap) 0;
      }

      .structured-side-block {
        float: right;
        clear: right;
        width: 38.3%;
        margin: 0 0 var(--st-section-gap) 0;
      }

      .structured-header {
        margin-bottom: 28px;
      }

      .structured-name {
        margin: 0;
        color: var(--structured-primary-accent);
        font-size: var(--st-name-size);
        line-height: var(--st-line-tight);
        font-weight: 760;
        letter-spacing: 0;
      }

      .structured-headline {
        margin-top: 4px;
        color: var(--structured-secondary-accent);
        font-size: var(--st-role-size);
        font-weight: 660;
        line-height: var(--st-line-tight);
      }

      .structured-contact {
        display: flex;
        flex-wrap: wrap;
        gap: 2px 10px;
        margin-top: 10px;
        color: var(--structured-muted);
        font-size: var(--st-contact-size);
      }

      .structured-contact a {
        color: inherit;
        text-decoration: none;
      }

      .structured-contact-item + .structured-contact-item::before {
        content: "·";
        margin-right: 10px;
      }

      .novo-section-header {
        margin: 0 0 13px 0;
        padding-bottom: 5px;
        border-bottom: 1.4px solid var(--structured-rule);
        color: var(--structured-muted);
        font-size: var(--st-section-size);
        font-weight: 520;
        letter-spacing: 0;
        line-height: var(--st-line-tight);
        text-transform: uppercase;
      }

      .structured-narrative,
      .structured-side-text {
        margin: 0;
        white-space: pre-wrap;
      }

      .novo-entry {
        margin: 0 0 var(--st-entry-gap) 0;
      }

      .structured-entry-topline {
        display: flex;
        justify-content: space-between;
        gap: 14px;
        align-items: baseline;
      }

      .structured-entry-topline h3 {
        margin: 0;
        color: var(--structured-primary-accent);
        font-size: var(--st-entry-title-size);
        line-height: var(--st-line-tight);
      }

      .structured-entry-topline span {
        max-width: 48%;
        color: var(--structured-muted);
        font-size: var(--st-meta-size);
        line-height: var(--st-line-tight);
        text-align: right;
      }

      .structured-entry-subtitle {
        margin-top: 1px;
        color: var(--structured-secondary-accent);
        font-size: var(--st-entry-subtitle-size);
        line-height: var(--st-line-tight);
      }

      .structured-experience-entry {
        margin-bottom: 11px;
      }

      .structured-experience-entry .structured-entry-topline h3 {
        font-size: 12.2px;
      }

      .structured-experience-entry .structured-entry-subtitle,
      .structured-experience-entry .structured-entry-topline span {
        font-size: 8.7px;
      }

      .structured-bullets {
        margin: 4px 0 0 0;
        padding-left: 15px;
        color: var(--structured-text);
        font-size: var(--st-bullet-size);
        line-height: var(--st-line-body);
      }

      .structured-experience-entry .structured-bullets {
        padding-left: 12px;
        font-size: 9.1px;
      }

      .structured-bullets li {
        margin: 2px 0;
      }

      .structured-experience-entry .structured-bullets li {
        margin: 1px 0;
      }

      .structured-bullets li::marker {
        color: var(--structured-muted);
      }

      .structured-skills {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 10px;
      }

      .structured-skills span {
        border-bottom: 1.5px solid var(--structured-primary-accent);
        color: var(--structured-primary-accent);
        font-size: 10.4px;
        font-weight: 620;
        line-height: var(--st-line-tight);
        padding-bottom: 2px;
      }

      .structured-list {
        margin: 0;
        padding-left: 14px;
        font-size: var(--st-bullet-size);
      }

      .structured-list li {
        margin: 4px 0;
      }

      @media screen and (max-width: 480px) {
        .structured-main-block,
        .structured-side-block {
          float: none;
          clear: both;
          width: 100%;
        }
      }

      @media print {
        .structured-template,
        .structured-template .page,
        .structured-template .page-content {
          background: #ffffff !important;
        }
      }
    </style>
    <div id="pages" class="structured-template">
      <div class="page">
        <div class="page-content">${content}</div>
      </div>
    </div>
  `;
}
