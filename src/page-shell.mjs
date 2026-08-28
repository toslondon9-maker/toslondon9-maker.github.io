import { renderFooter, renderHeader } from "./shared-chrome.mjs";

const releaseAssetVersion = "20260822-phase1";
const platformStyleVersion = "20260828-header";
const languageScript = "/assets/site-language.mjs";

function versionReleaseScript(script) {
  return script === languageScript ? `${script}?v=${releaseAssetVersion}` : script;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderPage({ route, language, title, description, titleKey, descriptionKey, body, styles = [], scripts = [] }) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeLanguage = escapeHtml(language);
  const pageScripts = [...new Set(["/assets/site-navigation.mjs", languageScript, ...scripts].map(versionReleaseScript))];
  const stylesheetTags = [...new Set(styles)].map((stylesheet) => (
    `<link rel="stylesheet" href="${escapeHtml(stylesheet)}">`
  )).join("");
  const scriptTags = pageScripts.map((script) => (
    `<script type="module" src="${escapeHtml(script)}" defer></script>`
  )).join("");

  const titleHook = titleKey ? ` data-i18n="${escapeHtml(titleKey)}"` : "";
  const descriptionHook = descriptionKey ? ` data-i18n="${escapeHtml(descriptionKey)}"` : "";

  return `<!doctype html><html lang="${safeLanguage}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title${titleHook}>${safeTitle}</title><meta name="description" content="${safeDescription}"${descriptionHook}><script>document.documentElement.classList.add("has-js")</script><link rel="preload" href="/images/the-secret-logo.png" as="image">${stylesheetTags}<link rel="stylesheet" href="/assets/platform.css?v=${platformStyleVersion}"></head><body>${renderHeader({ route, language })}${body}${renderFooter({ route, language })}${scriptTags}</body></html>`;
}
