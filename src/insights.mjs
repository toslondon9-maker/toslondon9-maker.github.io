import { siteData } from "../content/site-data.mjs";
import { t } from "../content/translations.mjs";

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

export const insightsArticles = [
  ["howToStudy", "2026-09-25"], ["haanelBiography", "2026-09-19"], ["powerWithin", "2026-09-19"],
  ["personalCoaching", "2026-09-13"], ["imagineMeditation", "2026-09-13"],
  ["foundationDevelopment", "2026-09-11"], ["foundationFirstStep", "2026-09-11"], ["foundationQA", "2026-09-11"], ["people", "2026-09-11"],
  ["journey", "2026-09-10"], ["lawAttraction", "2026-09-10"], ["introduction", "2026-09-10"], ["principles", "2026-09-10"], ["worldWithin", "2026-09-10"],
].sort((a, b) => b[1].localeCompare(a[1]) || a[0].localeCompare(b[0]));
const articleNumber = new Map(insightsArticles.map(([id], index) => [id, String(index + 1).padStart(2, "0")]));
const articleDates = Object.fromEntries(insightsArticles);

export function renderInsightCard({ id, href, language = "en" }) {
  const key = `insights.preview.${id}`;
  const number = articleNumber.get(id);
  const pdfs = { howToStudy: "how-to-study-the-master-key-system.pdf", personalCoaching: "advantages-personal-master-key-system-coaching.pdf", imagineMeditation: "imagine-combining-deep-meditation-personal-development.pdf", haanelBiography: "who-was-charles-f-haanel-life-and-legacy.pdf", powerWithin: "the-power-within-charles-haanel-foreword.pdf", foundationDevelopment: "foundation-stage-development.pdf", foundationFirstStep: "foundation-first-step.pdf", foundationQA: "foundation-stage-questions-and-answers.pdf", people: "10-people-connected-to-the-master-key-system.pdf", introduction: "charles-haanel-master-key-system-introduction.pdf", principles: "eight-principles-master-key-system.pdf", worldWithin: "world-within-and-world-without.pdf", journey: "master-key-system-24-week-journey.pdf", lawAttraction: "law-of-attraction-week-18.pdf" };
  const pdf = pdfs[id];
  const date = articleDates[id];
  const dateKey = date === "2026-09-25" ? "insights.publicationDateHowToStudy" : date === "2026-09-19" ? "insights.publicationDateHaanel" : date === "2026-09-13" ? "insights.publicationDatePersonal" : date === "2026-09-11" ? "insights.publicationDatePeople" : "insights.publicationDate";
  return `<article class="insightsPreview__card"><span class="insightsPreview__number" aria-hidden="true">${number}</span><p class="insightsPreview__category" data-i18n="${key}.category">${escapeHtml(t(`${key}.category`, language))}</p><h3 data-i18n="${key}.title">${escapeHtml(t(`${key}.title`, language))}</h3><time class="insightsPreview__date" datetime="${date}" data-i18n="${dateKey}">${escapeHtml(t(dateKey, language))}</time><p data-i18n="${key}.body">${escapeHtml(t(`${key}.body`, language))}</p><p class="insightsPreview__meta" data-i18n="${key}.readingTime">${escapeHtml(t(`${key}.readingTime`, language))}</p><p><a class="button--text" href="${escapeHtml(href)}" data-i18n="${key}.action">${escapeHtml(t(`${key}.action`, language))}</a>${pdf ? ` <a class="button--text" href="/downloads/${pdf}" download data-i18n="${key}.pdfAction">${escapeHtml(t(`${key}.pdfAction`, language))}</a>` : ""}</p></article>`;
}

export function renderInsightsPreview({ language = "en", data = siteData } = {}) {
  const routeKeys = { howToStudy: "insightsHowToStudy", haanelBiography: "insightsHaanelBiography", powerWithin: "insightsPowerWithin", personalCoaching: "insightsPersonalCoaching", imagineMeditation: "insightsImagineMeditation", foundationDevelopment: "insightsFoundationDevelopment", foundationFirstStep: "insightsFoundationFirstStep", foundationQA: "insightsFoundationQA", people: "insightsPeople", journey: "insightsJourney", lawAttraction: "insightsLawAttraction", introduction: "insightsIntroduction", principles: "insightsPrinciples", worldWithin: "insightsWorldWithin" };
  const cards = insightsArticles.slice(0, 4).map(([id]) => renderInsightCard({ id, href: data.routes[routeKeys[id]], language })).join("");
  return `<section class="homeSection insightsPreview" data-home-section="insights" aria-labelledby="insights-preview-title"><div class="homeSection__inner"><p class="eyebrow" data-i18n="insights.preview.eyebrow">${escapeHtml(t("insights.preview.eyebrow", language))}</p><h2 id="insights-preview-title" data-i18n="insights.preview.title">${escapeHtml(t("insights.preview.title", language))}</h2><p class="homeSection__intro" data-i18n="insights.preview.intro">${escapeHtml(t("insights.preview.intro", language))}</p><div class="insightsPreview__grid">${cards}</div><p class="insightsPreview__all"><a class="button--secondary" href="${data.routes.insights}" data-i18n="insights.preview.viewAll">${escapeHtml(t("insights.preview.viewAll", language))}</a></p></div></section>`;
}
