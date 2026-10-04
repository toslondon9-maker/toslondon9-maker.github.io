import { renderFooter, renderHeader } from "./shared-chrome.mjs";
import { renderStructuredData } from "./structured-data.mjs";
import { renderCalendlyCta } from "./conversion-components.mjs";

const releaseAssetVersion = "20260909-day7-choices";
const platformStyleVersion = "20261004-helmar-rudolph-page-1";
const navigationScript = "/assets/site-navigation.mjs";
const languageScript = "/assets/site-language.mjs";
const analyticsScript = "/assets/site-analytics.mjs";
const siteUrl = "https://unleashyourpowerwithtariq.com";
const defaultSocialImage = `${siteUrl}/images/haanel-tariq-portraits.jpeg`;
const defaultSocialImageAlt = "Tariq Saddique and the Master Key System learning journey";
const privateRoutes = new Set(["/live-coaching/", "/members-study-room-7f3k/"]);
const aiMentorRoute = "/ai-mentors/";
const aiMentorScript = "/assets/ai-mentors.mjs";
const aiMentorEndpoint = "https://unleash-your-power-ai-mentor.toslondon9.workers.dev/mentor";

function versionReleaseScript(script) {
  if (script === navigationScript) return `${script}?v=20260930-nav-mks-sync-1`;
  if (script === languageScript) return `${script}?v=${releaseAssetVersion}`;
  if (script === analyticsScript) return `${script}?v=20260908-analytics`;
  if (script === aiMentorScript) return `${script}?v=20261002-chapter-select-1`;
  if (script === "/assets/resources-quotes.mjs") return `${script}?v=20261003-commercial-improvements-1`;
  if (script === "/assets/home-testimonials.mjs") return `${script}?v=20261003-testimonial-read-more-1`;
  return script;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function addCalendlyCta(route, language, body) {
  if (typeof route !== "string") return body;
  const cta = `<div class="calendlyCtaSection" data-calendly-cta>${renderCalendlyCta({ language })}</div>`;
  const insertBefore = (marker) => body.includes(marker) ? body.replace(marker, `${cta}${marker}`) : body;
  if (route === "/") return insertBefore('<section class="homeSection homeOffers"');
  if (route === "/foundation/") return insertBefore('<div class="foundationPage__footerCta"');
  if (route === "/coaching/") return insertBefore('<article class="coachingPricing__complete');
  if (route === "/about-tariq/") return insertBefore('<section class="certificateSection"');
  if (route === "/ai-mentors/") return insertBefore('<section class="aiMentorBuilder"');
  if (route === "/start-free/") return insertBefore('<div data-lead-capture-dashboard');
  if (route === "/insights/") return insertBefore('<p class="insightsHub__bridge"');
  if (route.startsWith("/insights/")) return insertBefore('<section class="insightArticle__start"');
  return body;
}

export function renderPage({ route, language, title, description, titleKey, descriptionKey, body, styles = [], scripts = [], socialImage, socialImageAlt, structuredData = [] }) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeLanguage = escapeHtml(language);
  const pageScripts = [...new Set([navigationScript, languageScript, analyticsScript, "/assets/affiliate-tracking.mjs", ...scripts].map(versionReleaseScript))];
  const stylesheetTags = [...new Set(styles)].map((stylesheet) => (
    `<link rel="stylesheet" href="${escapeHtml(stylesheet)}">`
  )).join("");
  const scriptTags = pageScripts.map((script) => (
    `<script type="module" src="${escapeHtml(script)}" defer></script>`
  )).join("");

  const titleHook = titleKey ? ` data-i18n="${escapeHtml(titleKey)}"` : "";
  const descriptionHook = descriptionKey ? ` data-i18n="${escapeHtml(descriptionKey)}"` : "";
  const absoluteUrl = `${siteUrl}${route}`;
  const publicMetadata = !privateRoutes.has(route);
  const pageSocialImage = socialImage ? `${siteUrl}${socialImage}` : defaultSocialImage;
  const pageSocialImageAlt = escapeHtml(socialImageAlt ?? defaultSocialImageAlt);
  const aiMentorEndpointTag = route === aiMentorRoute
    ? `<meta name="ai-mentor-endpoint" content="${aiMentorEndpoint}">`
    : "";
  const sharingTags = publicMetadata
    ? `<link rel="canonical" href="${absoluteUrl}"><meta property="og:type" content="website"><meta property="og:site_name" content="Unleash Your Power"><meta property="og:title" content="${safeTitle}"><meta property="og:description" content="${safeDescription}"><meta property="og:url" content="${absoluteUrl}"><meta property="og:image" content="${pageSocialImage}"><meta property="og:image:alt" content="${pageSocialImageAlt}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${safeTitle}"><meta name="twitter:description" content="${safeDescription}"><meta name="twitter:image" content="${pageSocialImage}"><meta name="twitter:image:alt" content="${pageSocialImageAlt}">`
    : `<meta name="robots" content="noindex, nofollow">`;

  const structuredDataTag = publicMetadata ? renderStructuredData({ route, title, structuredData }) : "";
  const pagePlatformStyleVersion = route === "/referral/"
    ? "20260928-referral-contrast-1"
    : route === "/resources/"
      ? "20261004-resources-source-file-1"
      : platformStyleVersion;
  const renderedBody = addCalendlyCta(route, language, body);
  return `<!doctype html><html lang="${safeLanguage}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title${titleHook}>${safeTitle}</title><meta name="description" content="${safeDescription}"${descriptionHook}>${sharingTags}${aiMentorEndpointTag}${structuredDataTag}<script>document.documentElement.classList.add("has-js")</script><link rel="preload" href="/images/power-key-mark.png" as="image" type="image/png">${stylesheetTags}<link rel="stylesheet" href="/assets/platform.css?v=${pagePlatformStyleVersion}"></head><body>${renderHeader({ route, language })}${renderedBody}${renderFooter({ route, language })}${scriptTags}</body></html>`;
}
