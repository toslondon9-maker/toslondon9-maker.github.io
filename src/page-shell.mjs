import { renderFooter, renderHeader } from "./shared-chrome.mjs";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderPage({ route, language, title, description, body, scripts = [] }) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeLanguage = escapeHtml(language);
  const pageScripts = [...new Set(["/assets/site-navigation.mjs", ...scripts])];
  const scriptTags = pageScripts.map((script) => (
    `<script type="module" src="${escapeHtml(script)}" defer></script>`
  )).join("");

  return `<!doctype html><html lang="${safeLanguage}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${safeTitle}</title><meta name="description" content="${safeDescription}"><script>document.documentElement.classList.add("has-js")</script><link rel="preload" href="/images/the-secret-logo.png" as="image"><link rel="stylesheet" href="/assets/platform.css"></head><body>${renderHeader({ route, language })}${body}${renderFooter({ language })}${scriptTags}</body></html>`;
}
