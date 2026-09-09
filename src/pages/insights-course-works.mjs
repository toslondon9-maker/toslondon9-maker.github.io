import { siteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function copy(key, language, tag = "p", className = "") {
  const classAttr = className ? ` class="${className}"` : "";
  return `<${tag}${classAttr} data-i18n="${key}">${escapeHtml(t(key, language))}</${tag}>`;
}

export function insightsCoursePage(data = siteData, language = "en") {
  const key = "insights.courseWorks";
  const stage = (name) => `<section class="insightArticle__stage"><h3>${copy(`${key}.${name}Heading`, language, "span")}</h3>${copy(`${key}.${name}Body`, language)}</section>`;
  const body = `<main id="main-content"><article class="insightArticle"><header class="insightArticle__header"><p class="eyebrow" data-i18n="${key}.eyebrow">${escapeHtml(t(`${key}.eyebrow`, language))}</p><h1 data-i18n="${key}.heading">${escapeHtml(t(`${key}.heading`, language))}</h1>${copy(`${key}.intro`, language, "p", "insightArticle__intro")}</header><div class="insightArticle__body"><h2>${copy(`${key}.journeyHeading`, language, "span")}</h2>${stage("foundation")}${stage("visualisation")}${stage("concentration")}${stage("mastery")}<h2>${copy(`${key}.supportHeading`, language, "span")}</h2>${copy(`${key}.supportBody1`, language)}${copy(`${key}.supportBody2`, language)}<h2>${copy(`${key}.weeklyHeading`, language, "span")}</h2>${copy(`${key}.weeklyBody`, language)}<h2>${copy(`${key}.fitHeading`, language, "span")}</h2>${copy(`${key}.fitBody`, language)}<h2>${copy(`${key}.progressiveHeading`, language, "span")}</h2>${copy(`${key}.progressiveBody`, language)}<section class="insightArticle__start"><h2>${copy(`${key}.startHeading`, language, "span")}</h2>${copy(`${key}.startBody`, language)}<p class="insightArticle__links"><a href="${data.routes.masterKeySystem}" data-i18n="insights.cta.viewJourney">${escapeHtml(t("insights.cta.viewJourney", language))}</a><span aria-hidden="true"> · </span><a href="${data.routes.coaching}" data-i18n="home.coaching.cta">${escapeHtml(t("home.coaching.cta", language))}</a></p><a class="button--primary" href="${data.routes.startFree}" data-i18n="insights.cta.start">${escapeHtml(t("insights.cta.start", language))}</a></section></div></article></main>`;
  const canonical = `https://unleashyourpowerwithtariq.com${data.routes.insightsCourse}`;
  return { route: data.routes.insightsCourse, language, title: t(`${key}.metaTitle`, language), description: t(`${key}.metaDescription`, language), titleKey: `${key}.metaTitle`, descriptionKey: `${key}.metaDescription`, body, structuredData: [
    { "@type": "Article", headline: t(`${key}.heading`, language), description: t(`${key}.metaDescription`, language), mainEntityOfPage: canonical, author: { "@type": "Organization", name: "Unleash Your Power" }, publisher: { "@id": "https://unleashyourpowerwithtariq.com/#organization" } },
  ], scripts: [] };
}
