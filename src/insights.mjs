import { siteData } from "../content/site-data.mjs";
import { t } from "../content/translations.mjs";

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

export function renderInsightCard({ id, href, language = "en" }) {
  const key = `insights.preview.${id}`;
  const number = { course: "01", principles: "02", online: "02", resources: "03" }[id];
  return `<article class="insightsPreview__card"><span class="insightsPreview__number" aria-hidden="true">${number}</span><h3 data-i18n="${key}.title">${escapeHtml(t(`${key}.title`, language))}</h3><p data-i18n="${key}.body">${escapeHtml(t(`${key}.body`, language))}</p><a class="button--text" href="${escapeHtml(href)}" data-i18n="${key}.action">${escapeHtml(t(`${key}.action`, language))}</a></article>`;
}

export function renderInsightsPreview({ language = "en", data = siteData } = {}) {
  const cards = [
    renderInsightCard({ id: "course", href: data.routes.insightsCourse, language }),
    renderInsightCard({ id: "principles", href: data.routes.insightsPrinciples, language }),
    renderInsightCard({ id: "resources", href: data.routes.resources, language }),
  ].join("");
  return `<section class="homeSection insightsPreview" data-home-section="insights" aria-labelledby="insights-preview-title"><div class="homeSection__inner"><p class="eyebrow" data-i18n="insights.preview.eyebrow">${escapeHtml(t("insights.preview.eyebrow", language))}</p><h2 id="insights-preview-title" data-i18n="insights.preview.title">${escapeHtml(t("insights.preview.title", language))}</h2><p class="homeSection__intro" data-i18n="insights.preview.intro">${escapeHtml(t("insights.preview.intro", language))}</p><div class="insightsPreview__grid">${cards}</div></div></section>`;
}
