import { siteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function copy(key, language, tag = "p", className = "") {
  const classAttr = className ? ` class="${className}"` : "";
  return `<${tag}${classAttr} data-i18n="${key}">${escapeHtml(t(key, language))}</${tag}>`;
}

export function insightsPrinciplesPage(data = siteData, language = "en") {
  const key = "insights.principles";
  const principles = ["truth", "tact", "loyalty", "individuality", "courage", "accumulation", "constructiveness", "sagacity"];
  const sections = principles.map((name) => `<section class="insightArticle__stage"><h2>${copy(`${key}.${name}Heading`, language, "span")}</h2>${copy(`${key}.${name}Body`, language)}</section>`).join("");
  const body = `<main id="main-content"><article class="insightArticle"><header class="insightArticle__header"><p class="eyebrow" data-i18n="${key}.eyebrow">${escapeHtml(t(`${key}.eyebrow`, language))}</p><h1 data-i18n="${key}.heading">${escapeHtml(t(`${key}.heading`, language))}</h1>${copy(`${key}.intro`, language, "p", "insightArticle__intro")}</header><div class="insightArticle__body">${sections}<h2>${copy(`${key}.reflectionHeading`, language, "span")}</h2>${copy(`${key}.reflectionBody`, language)}<aside class="insightArticle__exercise"><h2>${copy(`${key}.exerciseHeading`, language, "span")}</h2>${copy(`${key}.exerciseBody`, language)}</aside><section class="insightArticle__start"><h2>${copy(`${key}.startHeading`, language, "span")}</h2>${copy(`${key}.startBody`, language)}<p class="insightArticle__links"><a href="${data.routes.masterKeySystem}" data-i18n="insights.cta.viewJourney">${escapeHtml(t("insights.cta.viewJourney", language))}</a><span aria-hidden="true"> · </span><a href="${data.routes.mksLineage}" data-i18n="${key}.lineageLink">${escapeHtml(t(`${key}.lineageLink`, language))}</a><span aria-hidden="true"> · </span><a href="${data.routes.coaching}" data-i18n="${key}.coachingLink">${escapeHtml(t(`${key}.coachingLink`, language))}</a><span aria-hidden="true"> · </span><a href="${data.routes.resources}" data-i18n="${key}.resourcesLink">${escapeHtml(t(`${key}.resourcesLink`, language))}</a></p><p><a class="button--primary" href="${data.routes.startFree}" data-i18n="insights.cta.start">${escapeHtml(t("insights.cta.start", language))}</a> <a class="button--text" href="/downloads/eight-principles-master-key-system.pdf" download data-i18n="${key}.pdfCta">${escapeHtml(t(`${key}.pdfCta`, language))}</a></p><p class="insightArticle__disclaimer" data-i18n="${key}.disclaimer">${escapeHtml(t(`${key}.disclaimer`, language))}</p></section></div></article></main>`;
  const canonical = `https://unleashyourpowerwithtariq.com${data.routes.insightsPrinciples}`;
  return { route: data.routes.insightsPrinciples, language, title: t(`${key}.metaTitle`, language), description: t(`${key}.metaDescription`, language), titleKey: `${key}.metaTitle`, descriptionKey: `${key}.metaDescription`, body, structuredData: [{ "@type": "Article", headline: t(`${key}.heading`, language), description: t(`${key}.metaDescription`, language), mainEntityOfPage: canonical, author: { "@type": "Organization", name: "Unleash Your Power" }, publisher: { "@id": "https://unleashyourpowerwithtariq.com/#organization" } }], scripts: [] };
}
