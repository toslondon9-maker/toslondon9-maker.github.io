import { renderFooter, renderHeader } from "./shared-chrome.mjs";

const releaseAssetVersion = "20260822-phase1";
const platformStyleVersion = "20260829-master-key-prompt";
const languageScript = "/assets/site-language.mjs";
const siteUrl = "https://toslondon9-maker.github.io";
const socialImage = `${siteUrl}/images/haanel-tariq-portraits.jpeg`;
const privateRoute = "/live-coaching/";

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
  const absoluteUrl = `${siteUrl}${route}`;
  const publicMetadata = route !== privateRoute;
  const sharingTags = publicMetadata
    ? `<link rel="canonical" href="${absoluteUrl}"><meta property="og:type" content="website"><meta property="og:site_name" content="Unleash Your Power"><meta property="og:title" content="${safeTitle}"><meta property="og:description" content="${safeDescription}"><meta property="og:url" content="${absoluteUrl}"><meta property="og:image" content="${socialImage}"><meta property="og:image:alt" content="Tariq Saddique and the Master Key System learning journey"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${safeTitle}"><meta name="twitter:description" content="${safeDescription}"><meta name="twitter:image" content="${socialImage}"><meta name="twitter:image:alt" content="Tariq Saddique and the Master Key System learning journey">`
    : `<meta name="robots" content="noindex, nofollow">`;

  return `<!doctype html><html lang="${safeLanguage}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title${titleHook}>${safeTitle}</title><meta name="description" content="${safeDescription}"${descriptionHook}>${sharingTags}<script>document.documentElement.classList.add("has-js")</script><link rel="preload" href="/images/the-secret-logo.png" as="image">${stylesheetTags}<link rel="stylesheet" href="/assets/platform.css?v=${platformStyleVersion}"></head><body>${renderHeader({ route, language })}${body}${renderFooter({ route, language })}${scriptTags}</body></html>`;
}
