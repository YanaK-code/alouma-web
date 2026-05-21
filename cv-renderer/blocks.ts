export function cvBlock(dataBlock: string, inner: string, className = "") {
  if (!inner.trim()) {
    return "";
  }

  const classes = ["cv-block", className].filter(Boolean).join(" ");
  return `<section class="${classes}" data-block="${dataBlock}">${inner}</section>`;
}

export function sectionHeader(title: string) {
  return `<div class="novo-section-header">${title}</div>`;
}

export function entry(inner: string, className = "") {
  const classes = ["novo-entry", className].filter(Boolean).join(" ");
  return `<article class="${classes}">${inner}</article>`;
}
