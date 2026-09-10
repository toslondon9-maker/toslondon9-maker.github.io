import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { t } from "../../content/translations.mjs";
import { siteData } from "../../content/site-data.mjs";
import { bookingCallHref } from "../whatsapp.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sources = {
  journey: "insights-article-journey.md",
  lawAttraction: "insights-article-law-of-attraction.md",
};

function escapeHtml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;"); }
function inline(value) { return escapeHtml(value).replace(/\*([^*]+)\*/g, "<em>$1</em>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>"); }
function markdownToHtml(markdown) {
  const lines = markdown.trim().split(/\r?\n/);
  const out = [];
  let paragraph = [];
  const flush = () => { if (paragraph.length) { out.push(`<p>${inline(paragraph.join(" "))}</p>`); paragraph = []; } };
  let firstHeading = true;
  for (const line of lines) {
    if (!line.trim()) { flush(); continue; }
    if (line.trim().replaceAll("*", "") === "[BOOK YOUR CALL]") { flush(); continue; }
    if (line.startsWith("# ")) { flush(); if (firstHeading) { firstHeading = false; continue; } out.push(`<h1>${inline(line.slice(2))}</h1>`); continue; }
    if (line.startsWith("## ")) { flush(); out.push(`<h2>${inline(line.slice(3))}</h2>`); continue; }
    if (line.startsWith("> ")) { flush(); out.push(`<blockquote>${inline(line.slice(2))}</blockquote>`); continue; }
    paragraph.push(line.trim());
  }
  flush();
  return out.join("");
}

export function sourceArticlePage({ data, language = "en", id, metaKey, pdf }) {
  const markdown = readFileSync(path.join(root, "content", sources[id]), "utf8");
  const heading = markdown.match(/^# (.+)$/m)?.[1] ?? t(`${metaKey}.heading`, language);
  const body = `<main id="main-content"><article class="insightArticle sourceInsightArticle"><header class="insightArticle__header"><p class="eyebrow" data-i18n="insights.source.eyebrow">${escapeHtml(t("insights.source.eyebrow", language))}</p><h1>${escapeHtml(heading)}</h1><time class="insightArticle__date" datetime="2026-09-10" data-i18n="insights.publicationDate">${escapeHtml(t("insights.publicationDate", language))}</time><p class="insightArticle__intro" data-i18n="insights.source.intro">${escapeHtml(t("insights.source.intro", language))}</p></header><div class="insightArticle__body">${markdownToHtml(markdown)}<section class="insightArticle__start"><h2 data-i18n="insights.source.ctaHeading">${escapeHtml(t("insights.source.ctaHeading", language))}</h2><p data-i18n="insights.source.ctaBody">${escapeHtml(t("insights.source.ctaBody", language))}</p><p class="insightArticle__links"><a class="button--primary" href="${bookingCallHref(data.contact.whatsapp)}" target="_blank" rel="noopener noreferrer" data-i18n="insights.source.bookCall">${escapeHtml(t("insights.source.bookCall", language))}</a> <a class="button--text" href="/downloads/${pdf}" download data-i18n="insights.source.download">${escapeHtml(t("insights.source.download", language))}</a></p><p class="insightArticle__disclaimer" data-i18n="insights.source.disclaimer">${escapeHtml(t("insights.source.disclaimer", language))}</p></section></div></article></main>`;
  const canonical = `https://unleashyourpowerwithtariq.com${data.routes[metaKey === "insights.journey" ? "insightsJourney" : "insightsLawAttraction"]}`;
  return { route: data.routes[metaKey === "insights.journey" ? "insightsJourney" : "insightsLawAttraction"], language, title: heading, description: t(`${metaKey}.metaDescription`, language), titleKey: `${metaKey}.heading`, descriptionKey: `${metaKey}.metaDescription`, body, structuredData: [{ "@type": "Article", headline: heading, description: t(`${metaKey}.metaDescription`, language), datePublished: "2026-09-10", mainEntityOfPage: canonical, author: { "@type": "Organization", name: "Unleash Your Power" }, publisher: { "@id": "https://unleashyourpowerwithtariq.com/#organization" } }], scripts: [] };
}

export function insightsJourneyPage(data = siteData, language = "en") { return sourceArticlePage({ data, language, id: "journey", metaKey: "insights.journey", pdf: "master-key-system-24-week-journey.pdf" }); }
export function insightsLawAttractionPage(data = siteData, language = "en") { return sourceArticlePage({ data, language, id: "lawAttraction", metaKey: "insights.lawAttraction", pdf: "law-of-attraction-week-18.pdf" }); }
