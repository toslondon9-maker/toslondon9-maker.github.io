import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { t } from "../../content/translations.mjs";
import { siteData } from "../../content/site-data.mjs";
import { bookingCallHref } from "../whatsapp.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sources = {
  energyAttention: "insights-article-energy-attention.md",
  howToStudy: "insights-article-how-to-study-master-key-system.md",
  journey: "insights-article-journey.md",
  lawAttraction: "insights-article-law-of-attraction.md",
  people: "insights-article-people.md",
  foundationDevelopment: "insights-article-foundation-development.md",
  foundationFirstStep: "insights-article-foundation-first-step.md",
  foundationQA: "insights-article-foundation-qa.md",
  personalCoaching: "insights-article-personal-coaching.md",
  imagineMeditation: "insights-article-imagine-meditation.md",
  haanelBiography: "insights-article-haanel-biography.md",
  powerWithin: "insights-article-power-within.md",
};

function escapeHtml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;"); }
function inline(value) { return escapeHtml(value).replace(/\[([^\]]+)\]\((https:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>').replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>"); }
function markdownToHtml(markdown, { skipCtas = false, richMarkdown = false } = {}) {
  const lines = markdown.trim().split(/\r?\n/);
  const out = [];
  let paragraph = [];
  let list = [];
  let table = [];
  const flushList = () => { if (list.length) { out.push(`<ul>${list.map((item) => `<li>${inline(item)}</li>`).join("")}</ul>`); list = []; } };
  const flushTable = () => { if (table.length) { const [header, ...rows] = table; out.push(`<div class="insightArticle__tableWrap"><table><thead><tr>${header.map((cell) => `<th scope="col">${inline(cell)}</th>`).join("")}</tr></thead><tbody>${rows.filter((row) => row.some((cell) => cell.trim() !== "---")).map((row) => `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`); table = []; } };
  const flush = () => { if (paragraph.length) { out.push(`<p>${inline(paragraph.join(" "))}</p>`); paragraph = []; } };
  const flushBlocks = () => { flush(); flushList(); flushTable(); };
  let firstHeading = true;
  for (const line of lines) {
    if (line.trim() === "---") { flushBlocks(); break; }
    if (!line.trim()) { flushBlocks(); continue; }
    if (line.trim().replaceAll("*", "") === "[BOOK YOUR CALL]") { flushBlocks(); continue; }
    if (/^!\[.*\]\([^\)]+\)$/.test(line.trim())) { flushBlocks(); const match = line.trim().match(/^!\[([^\]]+)\]\(([^\)]+)\)$/); out.push(`<figure class="insightArticle__heroImage"><img src="${escapeHtml(match[2])}" alt="${escapeHtml(match[1])}" width="1280" height="1280" loading="eager" decoding="async"></figure>`); continue; }
    if (skipCtas && /^\**\[(START THE FREE SEVEN-DAY EXPERIENCE|EXPLORE THE MASTER KEY SYSTEM|BOOK A FREE 15-MINUTE CALL)\]\**$/.test(line.trim())) { flushBlocks(); continue; }
    if (richMarkdown && /^\|.*\|$/.test(line.trim())) { flushBlocks(); table.push(line.trim().slice(1, -1).split("|").map((cell) => cell.trim())); continue; }
    if (richMarkdown && /^- /.test(line)) { flush(); flushTable(); list.push(line.slice(2).trim()); continue; }
    if (line.startsWith("# ")) { flushBlocks(); if (firstHeading) { firstHeading = false; continue; } out.push(`<h2>${inline(line.slice(2))}</h2>`); continue; }
    if (line.startsWith("## ")) { flushBlocks(); out.push(`<h2>${inline(line.slice(3))}</h2>`); continue; }
    if (line.startsWith("### ")) { flushBlocks(); out.push(`<h3>${inline(line.slice(4))}</h3>`); continue; }
    if (line.startsWith("> ")) { flushBlocks(); out.push(`<blockquote>${inline(line.slice(2))}</blockquote>`); continue; }
    paragraph.push(line.trim());
  }
  flushBlocks();
  return out.join("");
}

export function sourceArticlePage({ data, language = "en", id, metaKey, pdf }) {
  const markdown = readFileSync(path.join(root, "content", sources[id]), "utf8");
  const heading = markdown.match(/^# (.+)$/m)?.[1] ?? t(`${metaKey}.heading`, language);
  const publicationDate = metaKey === "insights.energyAttention" ? "2026-09-26" : metaKey === "insights.howToStudy" ? "2026-09-25" : ["insights.haanelBiography", "insights.powerWithin"].includes(metaKey) ? "2026-09-19" : ["insights.people", "insights.foundationDevelopment", "insights.foundationFirstStep", "insights.foundationQA"].includes(metaKey) ? "2026-09-11" : ["insights.personalCoaching", "insights.imagineMeditation"].includes(metaKey) ? "2026-09-13" : "2026-09-10";
  const publicationKey = publicationDate === "2026-09-26" ? "insights.publicationDateEnergyAttention" : publicationDate === "2026-09-25" ? "insights.publicationDateHowToStudy" : publicationDate === "2026-09-19" ? "insights.publicationDateHaanel" : publicationDate === "2026-09-13" ? "insights.publicationDatePersonal" : publicationDate === "2026-09-11" ? "insights.publicationDatePeople" : "insights.publicationDate";
  const extraExplore = ["haanelBiography", "powerWithin"].includes(id) ? ` <a class="button--text" href="${data.routes.masterKeySystem}" data-i18n="insights.${id}.explore">${escapeHtml(t(`insights.${id}.explore`, language))}</a>` : "";
  const disclaimerKey = metaKey === "insights.energyAttention" ? "insights.energyAttention.disclaimer" : metaKey === "insights.powerWithin" ? "insights.powerWithin.disclaimer" : "insights.source.disclaimer";
  const body = `<main id="main-content"><article class="insightArticle sourceInsightArticle"><header class="insightArticle__header"><p class="eyebrow" data-i18n="insights.source.eyebrow">${escapeHtml(t("insights.source.eyebrow", language))}</p><h1 data-i18n="${metaKey}.heading">${escapeHtml(heading)}</h1><time class="insightArticle__date" datetime="${publicationDate}" data-i18n="${publicationKey}">${escapeHtml(t(publicationKey, language))}</time><p class="insightArticle__intro" data-i18n="insights.source.intro">${escapeHtml(t("insights.source.intro", language))}</p></header><div class="insightArticle__body">${markdownToHtml(markdown, { skipCtas: ["haanelBiography", "powerWithin"].includes(id), richMarkdown: id === "howToStudy" })}<section class="insightArticle__start"><h2 data-i18n="insights.source.ctaHeading">${escapeHtml(t("insights.source.ctaHeading", language))}</h2><p data-i18n="insights.source.ctaBody">${escapeHtml(t("insights.source.ctaBody", language))}</p><p class="insightArticle__links"><a class="button--primary" href="${data.routes.startFree}" data-i18n="insights.cta.start">${escapeHtml(t("insights.cta.start", language))}</a>${extraExplore} <a class="button--secondary" href="${bookingCallHref(data.contact.whatsapp)}" target="_blank" rel="noopener noreferrer" data-i18n="insights.source.bookCall">${escapeHtml(t("insights.source.bookCall", language))}</a> <a class="button--text" href="/downloads/${pdf}" download data-i18n="insights.source.download">${escapeHtml(t("insights.source.download", language))}</a></p><p class="insightArticle__disclaimer" data-i18n="${disclaimerKey}">${escapeHtml(t(disclaimerKey, language))}</p></section></div></article></main>`;
  const routeKey = { "insights.energyAttention": "insightsEnergyAttention", "insights.howToStudy": "insightsHowToStudy", "insights.journey": "insightsJourney", "insights.lawAttraction": "insightsLawAttraction", "insights.people": "insightsPeople", "insights.foundationDevelopment": "insightsFoundationDevelopment", "insights.foundationFirstStep": "insightsFoundationFirstStep", "insights.foundationQA": "insightsFoundationQA", "insights.personalCoaching": "insightsPersonalCoaching", "insights.imagineMeditation": "insightsImagineMeditation", "insights.haanelBiography": "insightsHaanelBiography", "insights.powerWithin": "insightsPowerWithin" }[metaKey];
  const canonical = `https://unleashyourpowerwithtariq.com${data.routes[routeKey]}`;
  const pageTitleKey = ["insights.howToStudy", "insights.energyAttention"].includes(metaKey) ? `${metaKey}.metaTitle` : `${metaKey}.heading`;
  return { route: data.routes[routeKey], language, title: t(pageTitleKey, language), description: t(`${metaKey}.metaDescription`, language), titleKey: pageTitleKey, descriptionKey: `${metaKey}.metaDescription`, body, structuredData: [{ "@type": "Article", headline: heading, description: t(`${metaKey}.metaDescription`, language), datePublished: publicationDate, author: { "@type": "Person", name: "Tariq Saddique" }, publisher: { "@type": "Organization", name: "Unleash Your Power" }, mainEntityOfPage: canonical }], scripts: [] };
}

export function insightsJourneyPage(data = siteData, language = "en") { return sourceArticlePage({ data, language, id: "journey", metaKey: "insights.journey", pdf: "master-key-system-24-week-journey.pdf" }); }
export function insightsLawAttractionPage(data = siteData, language = "en") { return sourceArticlePage({ data, language, id: "lawAttraction", metaKey: "insights.lawAttraction", pdf: "law-of-attraction-week-18.pdf" }); }
export function insightsPeoplePage(data = siteData, language = "en") { return sourceArticlePage({ data, language, id: "people", metaKey: "insights.people", pdf: "10-people-connected-to-the-master-key-system.pdf" }); }
export function insightsFoundationDevelopmentPage(data = siteData, language = "en") { return sourceArticlePage({ data, language, id: "foundationDevelopment", metaKey: "insights.foundationDevelopment", pdf: "foundation-stage-development.pdf" }); }
export function insightsFoundationFirstStepPage(data = siteData, language = "en") { return sourceArticlePage({ data, language, id: "foundationFirstStep", metaKey: "insights.foundationFirstStep", pdf: "foundation-first-step.pdf" }); }
export function insightsFoundationQAPage(data = siteData, language = "en") { return sourceArticlePage({ data, language, id: "foundationQA", metaKey: "insights.foundationQA", pdf: "foundation-stage-questions-and-answers.pdf" }); }
export function insightsPersonalCoachingPage(data = siteData, language = "en") { return sourceArticlePage({ data, language, id: "personalCoaching", metaKey: "insights.personalCoaching", pdf: "advantages-personal-master-key-system-coaching.pdf" }); }
export function insightsImagineMeditationPage(data = siteData, language = "en") { return sourceArticlePage({ data, language, id: "imagineMeditation", metaKey: "insights.imagineMeditation", pdf: "imagine-combining-deep-meditation-personal-development.pdf" }); }
export function insightsHaanelBiographyPage(data = siteData, language = "en") { return sourceArticlePage({ data, language, id: "haanelBiography", metaKey: "insights.haanelBiography", pdf: "who-was-charles-f-haanel-life-and-legacy.pdf" }); }
export function insightsHowToStudyPage(data = siteData, language = "en") { return sourceArticlePage({ data, language, id: "howToStudy", metaKey: "insights.howToStudy", pdf: "how-to-study-the-master-key-system.pdf" }); }
export function insightsEnergyAttentionPage(data = siteData, language = "en") { return sourceArticlePage({ data, language, id: "energyAttention", metaKey: "insights.energyAttention", pdf: "energy-goes-where-attention-flows.pdf" }); }
export function insightsPowerWithinPage(data = siteData, language = "en") { return sourceArticlePage({ data, language, id: "powerWithin", metaKey: "insights.powerWithin", pdf: "the-power-within-charles-haanel-foreword.pdf" }); }
