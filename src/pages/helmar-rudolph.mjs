import { siteData as canonicalSiteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function text(key, language, tag = "p", className = "") {
  const classAttribute = className ? ` class="${className}"` : "";
  return `<${tag}${classAttribute} data-i18n="${key}">${escapeHtml(t(key, language))}</${tag}>`;
}

function internalLink(href, key, language, className = "button--text") {
  return `<a class="${className}" href="${href}" data-i18n="${key}">${escapeHtml(t(key, language))}</a>`;
}

const variants = Object.freeze({
  overview: {
    titleKey: "route.helmarRudolph.metaTitle",
    descriptionKey: "route.helmarRudolph.metaDescription",
    headingKey: "route.helmarRudolph.heading",
    sectionHeadingKey: "route.helmarRudolph.who.heading",
    sectionBodyKey: "route.helmarRudolph.who.body",
  },
  approach: {
    titleKey: "route.helmarRudolph.approach.metaTitle",
    descriptionKey: "route.helmarRudolph.approach.metaDescription",
    headingKey: "route.helmarRudolph.approach.heading",
    sectionHeadingKey: "route.helmarRudolph.approach.heading",
    sectionBodyKey: "route.helmarRudolph.approach.body",
  },
  videos: {
    titleKey: "route.helmarRudolph.videos.metaTitle",
    descriptionKey: "route.helmarRudolph.videos.metaDescription",
    headingKey: "route.helmarRudolph.videos.heading",
    sectionHeadingKey: "route.helmarRudolph.videos.heading",
    sectionBodyKey: "route.helmarRudolph.videos.body",
  },
});

export function helmarRudolphPage(data = canonicalSiteData, language = "en", variant = "overview") {
  const pageVariant = variants[variant] ?? variants.overview;
  const links = `<nav class="helmarRudolphPage__links" aria-label="Helmar Rudolph pages">
    ${internalLink(data.routes.helmarRudolph, "route.helmarRudolph.links.who", language)}
    ${internalLink(data.routes.helmarRudolphMasterKeySystem, "route.helmarRudolph.links.approach", language)}
    ${internalLink(data.routes.helmarRudolphStudyVideos, "route.helmarRudolph.links.videos", language)}
    ${internalLink(data.routes.masterKeySystem, "route.helmarRudolph.links.return", language)}
  </nav>`;
  const externalResource = `<aside class="mksLineageResource helmarRudolphPage__resource" aria-label="${escapeHtml(t("route.helmarRudolph.external.label", language))}">
    <p data-i18n="route.helmarRudolph.external.label">${escapeHtml(t("route.helmarRudolph.external.label", language))}</p>
    <a href="https://en.mrmasterkey.com/" target="_blank" rel="noopener noreferrer" data-i18n="route.helmarRudolph.external.cta">${escapeHtml(t("route.helmarRudolph.external.cta", language))}</a>
  </aside>`;
  const extra = variant === "videos" ? externalResource : "";
  const supplemental = [variant === "overview" ? text("route.helmarRudolph.relationship", language) : "", extra].filter(Boolean).join("");
  const body = `<main class="mksLineagePage helmarRudolphPage" id="main-content">
    <header class="mksLineageHero helmarRudolphPage__hero">
      <div class="mksLineageHero__inner">
        ${text("route.helmarRudolph.eyebrow", language, "p", "eyebrow")}
        ${text(pageVariant.headingKey, language, "h1")}
        ${text("route.helmarRudolph.intro", language, "p", "mksLineageHero__lead")}
      </div>
    </header>
    <div class="mksLineage__content helmarRudolphPage__content">
      ${links}
      <section class="mksLineage__section helmarRudolphPage__section">
        <div class="mksLineage__sectionText">
          ${text("route.helmarRudolph.eyebrow", language, "p", "eyebrow")}
          ${text(pageVariant.sectionHeadingKey, language, "h2")}
          <div class="mksLineage__copy">
            ${text(pageVariant.sectionBodyKey, language)}
            ${supplemental}
          </div>
        </div>
      </section>
      <p class="helmarRudolphPage__disclaimer" data-i18n="route.helmarRudolph.disclaimer">${escapeHtml(t("route.helmarRudolph.disclaimer", language))}</p>
      <div class="mksLineage__actions helmarRudolphPage__actions">
        ${internalLink(data.routes.masterKeySystem, "route.helmarRudolph.links.return", language, "button--primary")}
      </div>
    </div>
  </main>`;

  const route = variant === "approach"
    ? data.routes.helmarRudolphMasterKeySystem
    : variant === "videos" ? data.routes.helmarRudolphStudyVideos : data.routes.helmarRudolph;
  return {
    route,
    language,
    title: t(pageVariant.titleKey, language),
    description: t(pageVariant.descriptionKey, language),
    titleKey: pageVariant.titleKey,
    descriptionKey: pageVariant.descriptionKey,
    body,
    styles: [],
    scripts: [],
  };
}

export function helmarRudolphOverviewPage(data, language = "en") { return helmarRudolphPage(data, language, "overview"); }
export function helmarRudolphApproachPage(data, language = "en") { return helmarRudolphPage(data, language, "approach"); }
export function helmarRudolphVideosPage(data, language = "en") { return helmarRudolphPage(data, language, "videos"); }
