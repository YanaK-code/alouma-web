import { cvBlock, entry, sectionHeader } from "@/cv-renderer/blocks";
import type { CVDraft } from "@/cv-renderer/draft";
import { esc, escHref, escSummary } from "@/cv-renderer/escape";
import { sharedPaginationCSS } from "@/cv-renderer/pagination.css";

function list(items: string[], className = "novo-list") {
  if (!items.length) {
    return "";
  }

  return `<ul class="${className}">${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
}

function contactLink(value: string, label = value) {
  if (!value.trim()) {
    return "";
  }

  return `<a href="${escHref(value)}">${esc(label)}</a>`;
}

function contactItems(resume: CVDraft) {
  return [
    contactLink(resume.basics.email),
    resume.basics.phone ? `<span>${esc(resume.basics.phone)}</span>` : "",
    resume.basics.website
      ? `<a href="${escHref(resume.basics.website)}">${esc(resume.basics.website.replace(/^https?:\/\//, ""))}</a>`
      : "",
    resume.basics.location ? `<span>${esc(resume.basics.location)}</span>` : "",
  ]
    .filter(Boolean)
    .map((item) => `<span class="novo-contact-item">${item}</span>`)
    .join("");
}

function headerBlock(resume: CVDraft) {
  return cvBlock(
    "header",
    `
      <header class="novo-header">
        <h1 class="novo-name">${esc(resume.basics.fullName)}</h1>
        <div class="novo-headline">${esc(resume.basics.headline)}</div>
        <div class="novo-contact">${contactItems(resume)}</div>
      </header>
    `,
  );
}

function summaryBlock(resume: CVDraft) {
  return cvBlock(
    "summary",
    `${sectionHeader("Summary")}<p class="novo-summary">${escSummary(resume.summary)}</p>`,
  );
}

function experienceBlock(resume: CVDraft) {
  return cvBlock(
    "experience",
    `${sectionHeader("Experience")}${resume.experience
      .map((item) =>
        entry(`
          <div class="novo-entry-topline">
            <h3>${esc(item.role)}</h3>
            <span>${esc(item.startDate)} - ${esc(item.endDate)}</span>
          </div>
          <div class="novo-entry-subtitle">${esc(item.company)} · ${esc(item.location)}</div>
          ${list(item.bullets)}
        `),
      )
      .join("")}`,
  );
}

function educationBlock(resume: CVDraft) {
  return cvBlock(
    "education",
    `${sectionHeader("Education")}${resume.education
      .map((item) =>
        entry(`
          <div class="novo-entry-topline">
            <h3>${esc(item.degree)}</h3>
            <span>${esc(item.startDate)} - ${esc(item.endDate)}</span>
          </div>
          <div class="novo-entry-subtitle">${esc(item.school)} · ${esc(item.location)}</div>
        `),
      )
      .join("")}`,
  );
}

function chipBlock(dataBlock: string, title: string, items: string[]) {
  return cvBlock(
    dataBlock,
    `${sectionHeader(title)}<div class="novo-chip-list">${items
      .map((item) => `<span class="novo-chip">${esc(item)}</span>`)
      .join("")}</div>`,
  );
}

function noteBlock(resume: CVDraft, dataBlock: string, title: string) {
  const note = resume.sectionNotes[dataBlock] ?? "";
  return cvBlock(
    dataBlock,
    `${sectionHeader(title)}<p class="novo-summary">${escSummary(note)}</p>`,
  );
}

export function renderEssential(resume: CVDraft, accentColorHex: string) {
  const blocks = [
    headerBlock(resume),
    summaryBlock(resume),
    experienceBlock(resume),
    educationBlock(resume),
    chipBlock("skills", "Skills", resume.skills),
    chipBlock("programsTools", "Programs & Tools", resume.programsTools),
    noteBlock(resume, "languages", "Languages"),
    noteBlock(resume, "projects", "Projects"),
    noteBlock(resume, "courses", "Courses"),
    noteBlock(resume, "licenses", "Licenses"),
    noteBlock(resume, "awards", "Awards"),
    noteBlock(resume, "volunteer", "Volunteer"),
    noteBlock(resume, "interests", "Interests"),
  ].join("");

  return `
    <style>
      ${sharedPaginationCSS}
      :root {
        color-scheme: light dark;
        --accent: ${accentColorHex};
        --accent-weak: color-mix(in srgb, var(--accent) 25%, transparent);
        --novo-text: #202124;
        --novo-muted: #62666d;
        --novo-rule: #d8dadd;
      }

      html[data-theme="dark"] {
        --novo-text: #f4f4f5;
        --novo-muted: #c4c7cc;
        --novo-rule: #3f434a;
      }

      .essential-template .page-content {
        padding: 28px 48px 36px 48px;
        color: var(--novo-text);
        font-family: Inter, system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif;
        font-size: 18px;
        line-height: 1.38;
      }

      .novo-header {
        margin-bottom: 28px;
      }

      .novo-name {
        margin: 0;
        color: var(--novo-text);
        font-size: 40px;
        line-height: 1.04;
        font-weight: 760;
        letter-spacing: 0;
      }

      .novo-headline {
        margin-top: 8px;
        color: var(--accent);
        font-size: 18px;
        font-weight: 650;
      }

      .novo-contact {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 14px;
        margin-top: 12px;
        color: var(--novo-muted);
        font-size: 12.5px;
      }

      .novo-contact a {
        color: inherit;
        text-decoration: none;
      }

      .novo-contact-item + .novo-contact-item::before {
        content: "·";
        margin-right: 14px;
      }

      .cv-block {
        margin: 0 0 22px 0;
      }

      .novo-section-header {
        margin: 0 0 10px 0;
        padding-bottom: 5px;
        border-bottom: 2px solid var(--accent);
        color: var(--novo-text);
        font-size: 14px;
        font-weight: 760;
        letter-spacing: 0;
        text-transform: uppercase;
      }

      .novo-summary {
        margin: 0;
        white-space: pre-wrap;
      }

      .novo-entry {
        margin: 0 0 14px 0;
      }

      .novo-entry-topline {
        display: flex;
        justify-content: space-between;
        gap: 18px;
        align-items: baseline;
      }

      .novo-entry h3 {
        margin: 0;
        color: var(--novo-text);
        font-size: 15px;
        line-height: 1.24;
      }

      .novo-entry-topline span,
      .novo-entry-subtitle {
        color: var(--novo-muted);
        font-size: 12px;
      }

      .novo-list {
        margin: 7px 0 0 18px;
        padding: 0;
        font-size: 13px;
      }

      .novo-list li {
        margin: 3px 0;
      }

      .novo-chip-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .novo-chip {
        border-bottom: 2px solid var(--accent);
        padding: 2px 0;
        font-size: 13px;
        font-weight: 620;
      }

      @media print {
        .essential-template .page-content {
          padding: 28px 48px 36px 48px;
        }
      }
    </style>
    <div id="pages" class="essential-template">
      <div class="page">
        <div class="page-content">${blocks}</div>
      </div>
    </div>
  `;
}
