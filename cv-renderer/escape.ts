const BLOCKED_HREF_PROTOCOL = /^(javascript|data|vbscript|file|blob):/i;
const ALLOWED_HREF_PROTOCOL = /^(https?|mailto|tel):/i;

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
  const trimmed = stripUnsafeHrefInput(value);

  if (!trimmed) {
    return "";
  }

  if (BLOCKED_HREF_PROTOCOL.test(trimmed)) {
    return "#";
  }

  if (ALLOWED_HREF_PROTOCOL.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.includes("@") && !trimmed.includes("/")) {
    return `mailto:${trimmed}`;
  }

  return `https://${trimmed}`;
}

function stripUnsafeHrefInput(value: string) {
  return value
    .trim()
    .replace(/[\u0000-\u001F\u007F]/g, "");
}

function escapeEntities(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
