import type { Resume } from "@/schemas/resume";
import { cvBlock, entry, sectionHeader } from "@/cv-renderer/blocks";
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

function headerBlock(resume: Resume) {
  const portfolio = resume.basics.website.trim()
    ? `<a href="${escHref(resume.basics.website)}" target="_blank" rel="noopener noreferrer">Portfolio</a>`
    : "";

  const contacts = [
    resume.basics.email
      ? `<a href="${escHref(resume.basics.email)}" target="_blank" rel="noopener noreferrer">${esc(resume.basics.email)}</a>`
      : "",
    resume.basics.phone ? `<span>${esc(resume.basics.phone)}</span>` : "",
    portfolio,
    resume.basics.location ? `<span>${esc(resume.basics.location)}</span>` : "",
  ]
    .map(contactItem)
    .join("");

  return structuredBlock(
    "structured-header",
    "full",
    `
      <header class="structured-header">
        <h1 class="structured-name">${esc(resume.basics.fullName)}</h1>
        <div class="structured-headline">${esc(resume.basics.headline)}</div>
        <div class="structured-contact">${contacts}</div>
      </header>
    `,
  );
}

function narrativeBlock(dataBlock: string, title: string, value: string, placement: Placement) {
  return structuredBlock(
    dataBlock,
    placement,
    `${sectionHeader(title)}<p class="structured-narrative">${escSummary(value)}</p>`,
  );
}

function experienceBlock(resume: Resume) {
  return structuredBlock(
    "experience",
    "main",
    `${sectionHeader("Experience")}${resume.experience
      .map((item) =>
        entry(
          `
            <div class="structured-entry-topline">
              <h3>${esc(item.role)}</h3>
              <span>${esc(item.startDate)} - ${esc(item.endDate)}</span>
            </div>
            <div class="structured-entry-subtitle">${esc(item.company)} · ${esc(item.location)}</div>
            <ul class="structured-bullets">${item.bullets
              .map((bullet) => `<li>${esc(bullet)}</li>`)
              .join("")}</ul>
          `,
          "structured-experience-entry",
        ),
      )
      .join("")}`,
  );
}

function educationBlock(resume: Resume) {
  return structuredBlock(
    "education",
    "main",
    `${sectionHeader("Education")}${resume.education
      .map((item) =>
        entry(`
          <div class="structured-entry-topline">
            <h3>${esc(item.degree)}</h3>
            <span>${esc(item.startDate)} - ${esc(item.endDate)}</span>
          </div>
          <div class="structured-entry-subtitle">${esc(item.school)} · ${esc(item.location)}</div>
        `),
      )
      .join("")}`,
  );
}

function skillsBlock(resume: Resume) {
  return structuredBlock(
    "skills",
    "side",
    `${sectionHeader("Skills")}<div class="structured-skills">${resume.skills
      .map((skill) => `<span>${esc(skill)}</span>`)
      .join("")}</div>`,
  );
}

function toolsBlock(resume: Resume) {
  return structuredBlock(
    "programsTools",
    "side",
    `${sectionHeader("Programs & Tools")}<ul class="structured-list">${resume.programsTools
      .map((tool) => `<li>${esc(tool)}</li>`)
      .join("")}</ul>`,
  );
}

function sideNoteBlock(resume: Resume, dataBlock: string, title: string) {
  const note = resume.meta.sectionNotes[dataBlock] ?? "";
  return structuredBlock(
    dataBlock,
    "side",
    `${sectionHeader(title)}<p class="structured-side-text">${escSummary(note)}</p>`,
  );
}

function mainNoteBlock(resume: Resume, dataBlock: string, title: string) {
  const note = resume.meta.sectionNotes[dataBlock] ?? "";
  return narrativeBlock(dataBlock, title, note, "main");
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

export function renderStructured(resume: Resume) {
  const mainBlocks = [
    narrativeBlock("summary", "Summary", resume.summary, "main"),
    experienceBlock(resume),
    educationBlock(resume),
    mainNoteBlock(resume, "projects", "Projects"),
    mainNoteBlock(resume, "volunteer", "Volunteering"),
  ];
  const sideBlocks = [
    skillsBlock(resume),
    sideNoteBlock(resume, "awards", "Key Achievements"),
    sideNoteBlock(resume, "courses", "Training & Courses"),
    sideNoteBlock(resume, "interests", "Interests"),
    toolsBlock(resume),
    sideNoteBlock(resume, "languages", "Languages"),
  ];
  const content = `${headerBlock(resume)}${interleaveStructuredBlocks(mainBlocks, sideBlocks)}`;

  return `
    <style>
      ${sharedPaginationCSS}
      :root {
        color-scheme: light;
        --structured-primary-accent: #24221B;
        --structured-secondary-accent: #F2D04E;
        --accent: var(--structured-primary-accent);
        --accent-weak: rgba(36, 34, 27, 0.25);
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
