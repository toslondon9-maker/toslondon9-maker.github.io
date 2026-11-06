import { siteData } from "../content/site-data.mjs";
import { t } from "../content/translations.mjs";

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

export const insightsArticles = [
  ["nextLevel", "2026-11-06"],
  ["familiar", "2026-11-04"],
  ["foundationRestart", "2026-10-02"],
  ["lifeRebuilt", "2026-09-30"],
  ["energyAttention", "2026-09-26"],
  ["howToStudy", "2026-09-25"], ["haanelBiography", "2026-09-19"], ["powerWithin", "2026-09-19"],
  ["personalCoaching", "2026-09-13"], ["imagineMeditation", "2026-09-13"],
  ["foundationDevelopment", "2026-09-11"], ["foundationFirstStep", "2026-09-11"], ["foundationQA", "2026-09-11"], ["people", "2026-09-11"],
  ["journey", "2026-09-10"], ["lawAttraction", "2026-09-10"], ["introduction", "2026-09-10"], ["principles", "2026-09-10"], ["worldWithin", "2026-09-10"],
].sort((a, b) => a[1].localeCompare(b[1]) || a[0].localeCompare(b[0]));
// Estimated from article body length at approximately 220 words per minute.
export const articleReadingMinutes = Object.freeze({ nextLevel: 8, familiar: 6, foundationRestart: 5, lifeRebuilt: 8, energyAttention: 6, howToStudy: 6, haanelBiography: 7, powerWithin: 7, personalCoaching: 6, imagineMeditation: 10, foundationDevelopment: 7, foundationFirstStep: 9, foundationQA: 4, people: 7, journey: 5, lawAttraction: 6, introduction: 4, principles: 5, worldWithin: 4 });
export function articleReadingLabel(id, language = "en") {
  const minutes = articleReadingMinutes[id];
  return t(`insights.preview.${id}.readingTime`, language);
}
const articleNumber = new Map(insightsArticles.map(([id], index) => [id, String(index + 1).padStart(2, "0")]));
const articleDates = Object.fromEntries(insightsArticles);

export function renderInsightCard({ id, href, language = "en", compact = false }) {
  const key = `insights.preview.${id}`;
  const number = articleNumber.get(id);
  const pdfs = { nextLevel: "your-next-level-starts-with-a-decision.pdf", familiar: "does-any-of-this-feel-familiar.pdf", foundationRestart: "when-life-feels-like-it-has-fallen-apart.pdf", lifeRebuilt: "how-i-rebuilt-my-life-from-the-inside-out.pdf", howToStudy: "how-to-study-the-master-key-system.pdf", personalCoaching: "advantages-personal-master-key-system-coaching.pdf", imagineMeditation: "imagine-combining-deep-meditation-personal-development.pdf", haanelBiography: "who-was-charles-f-haanel-life-and-legacy.pdf", powerWithin: "the-power-within-charles-haanel-foreword.pdf", foundationDevelopment: "foundation-stage-development.pdf", foundationFirstStep: "foundation-first-step.pdf", foundationQA: "foundation-stage-questions-and-answers.pdf", people: "10-people-connected-to-the-master-key-system.pdf", introduction: "charles-haanel-master-key-system-introduction.pdf", principles: "eight-principles-master-key-system.pdf", worldWithin: "world-within-and-world-without.pdf", journey: "master-key-system-24-week-journey.pdf", lawAttraction: "law-of-attraction-week-18.pdf" };
  const pdf = id === "energyAttention" ? "energy-goes-where-attention-flows.pdf" : pdfs[id];
  const date = articleDates[id];
  const dateKey = date === "2026-11-06" ? "insights.publicationDateNextLevel" : date === "2026-11-04" ? "insights.publicationDateFamiliar" : date === "2026-10-02" ? "insights.publicationDateFoundationRestart" : date === "2026-09-30" ? "insights.publicationDateLifeRebuilt" : date === "2026-09-26" ? "insights.publicationDateEnergyAttention" : date === "2026-09-25" ? "insights.publicationDateHowToStudy" : date === "2026-09-19" ? "insights.publicationDateHaanel" : date === "2026-09-13" ? "insights.publicationDatePersonal" : date === "2026-09-11" ? "insights.publicationDatePeople" : "insights.publicationDate";
  if (compact) return `<article class="insightsPreview__card insightsPreview__card--compact"><span class="insightsPreview__number" aria-hidden="true">${number}</span><p class="insightsPreview__category" data-i18n="${key}.category">${escapeHtml(t(`${key}.category`, language))}</p><h3 data-i18n="${key}.title">${escapeHtml(t(`${key}.title`, language))}</h3><time class="insightsPreview__date" datetime="${date}" data-i18n="${dateKey}">${escapeHtml(t(dateKey, language))}</time><p data-i18n="${key}.body">${escapeHtml(t(`${key}.body`, language))}</p><p class="insightsPreview__meta" data-i18n="${key}.readingTime">${escapeHtml(articleReadingLabel(id, language))}</p><p><a class="button--text" href="${escapeHtml(href)}" data-i18n="${key}.action">${escapeHtml(t(`${key}.action`, language))}</a>${pdf ? ` <a class="button--text" href="/downloads/${pdf}" download data-i18n="${key}.pdfAction">${escapeHtml(t(`${key}.pdfAction`, language))}</a>` : ""}</p></article>`;
  return `<article class="insightsPreview__card"><span class="insightsPreview__number" aria-hidden="true">${number}</span><p class="insightsPreview__category" data-i18n="${key}.category">${escapeHtml(t(`${key}.category`, language))}</p><h3 data-i18n="${key}.title">${escapeHtml(t(`${key}.title`, language))}</h3><time class="insightsPreview__date" datetime="${date}" data-i18n="${dateKey}">${escapeHtml(t(dateKey, language))}</time><p data-i18n="${key}.body">${escapeHtml(t(`${key}.body`, language))}</p><p class="insightsPreview__meta" data-i18n="${key}.readingTime">${escapeHtml(articleReadingLabel(id, language))}</p><p><a class="button--text" href="${escapeHtml(href)}" data-i18n="${key}.action">${escapeHtml(t(`${key}.action`, language))}</a>${pdf ? ` <a class="button--text" href="/downloads/${pdf}" download data-i18n="${key}.pdfAction">${escapeHtml(t(`${key}.pdfAction`, language))}</a>` : ""}</p></article>`;
}

export function renderInsightsPreview({ language = "en", data = siteData, compact = false } = {}) {
  const routeKeys = { nextLevel: "insightsNextLevel", familiar: "insightsFamiliar", foundationRestart: "insightsFoundationRestart", lifeRebuilt: "insightsLifeRebuilt", howToStudy: "insightsHowToStudy", haanelBiography: "insightsHaanelBiography", powerWithin: "insightsPowerWithin", personalCoaching: "insightsPersonalCoaching", imagineMeditation: "insightsImagineMeditation", foundationDevelopment: "insightsFoundationDevelopment", foundationFirstStep: "insightsFoundationFirstStep", foundationQA: "insightsFoundationQA", people: "insightsPeople", journey: "insightsJourney", lawAttraction: "insightsLawAttraction", introduction: "insightsIntroduction", principles: "insightsPrinciples", worldWithin: "insightsWorldWithin" };
  routeKeys.energyAttention = "insightsEnergyAttention";
  const cards = (compact ? insightsArticles.slice(-3) : insightsArticles.slice(-4)).map(([id]) => {
    const routeKey = routeKeys[id];
    const href = data.routes[routeKey] ?? siteData.routes[routeKey];
    if (!href) throw new Error(`Missing Insights route for ${id}`);
    return renderInsightCard({ id, href, language, compact });
  }).join("");
  return `<section class="homeSection insightsPreview" data-home-section="insights" aria-labelledby="insights-preview-title"><div class="homeSection__inner"><p class="eyebrow" data-i18n="insights.preview.eyebrow">${escapeHtml(t("insights.preview.eyebrow", language))}</p><h2 id="insights-preview-title" data-i18n="insights.preview.title">${escapeHtml(t("insights.preview.title", language))}</h2><p class="homeSection__intro" data-i18n="insights.preview.intro">${escapeHtml(t("insights.preview.intro", language))}</p><div class="insightsPreview__grid">${cards}</div><p class="insightsPreview__all"><a class="button--secondary" href="${data.routes.insights}" data-i18n="insights.preview.viewAll">${escapeHtml(t("insights.preview.viewAll", language))}</a></p></div></section>`;
}
