import { siteData } from "../content/site-data.mjs";
import { t } from "../content/translations.mjs";

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

export function renderInsightCard({ id, href, language = "en" }) {
  const key = `insights.preview.${id}`;
  const number = { introduction: "01", principles: "02", worldWithin: "03", course: "04", online: "04", resources: "04" }[id];
  const pdfs = { introduction: "charles-haanel-master-key-system-introduction.pdf", principles: "eight-principles-master-key-system.pdf", worldWithin: "world-within-and-world-without.pdf" };
  const pdf = pdfs[id];
  return `<article class="insightsPreview__card"><span class="insightsPreview__number" aria-hidden="true">${number}</span><p class="insightsPreview__category" data-i18n="${key}.category">${escapeHtml(t(`${key}.category`, language))}</p><h3 data-i18n="${key}.title">${escapeHtml(t(`${key}.title`, language))}</h3><p data-i18n="${key}.body">${escapeHtml(t(`${key}.body`, language))}</p><p class="insightsPreview__meta" data-i18n="${key}.readingTime">${escapeHtml(t(`${key}.readingTime`, language))}</p><p><a class="button--text" href="${escapeHtml(href)}" data-i18n="${key}.action">${escapeHtml(t(`${key}.action`, language))}</a>${pdf ? ` <a class="button--text" href="/downloads/${pdf}" download data-i18n="${key}.pdfAction">${escapeHtml(t(`${key}.pdfAction`, language))}</a>` : ""}</p></article>`;
}

export function renderInsightsPreview({ language = "en", data = siteData } = {}) {
  const cards = [
    renderInsightCard({ id: "introduction", href: data.routes.insightsIntroduction, language }),
    renderInsightCard({ id: "principles", href: data.routes.insightsPrinciples, language }),
    renderInsightCard({ id: "worldWithin", href: data.routes.insightsWorldWithin, language }),
  ].join("");
  return `<section class="homeSection insightsPreview" data-home-section="insights" aria-labelledby="insights-preview-title"><div class="homeSection__inner"><p class="eyebrow" data-i18n="insights.preview.eyebrow">${escapeHtml(t("insights.preview.eyebrow", language))}</p><h2 id="insights-preview-title" data-i18n="insights.preview.title">${escapeHtml(t("insights.preview.title", language))}</h2><p class="homeSection__intro" data-i18n="insights.preview.intro">${escapeHtml(t("insights.preview.intro", language))}</p><div class="insightsPreview__grid">${cards}</div></div></section>`;
}
