export function esc(value: string) {
  return escapeEntities(value).replaceAll("\n", "<br/>");
}

export function escSummary(value: string) {
  return escapeEntities(value);
}

export function escHref(value: string) {
  return escapeEntities(normalizeURLForHref(value));
}

export function normalizeURLForHref(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.includes("@") && !trimmed.includes("/")) {
    return `mailto:${trimmed}`;
  }

  return `https://${trimmed}`;
}

function escapeEntities(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
