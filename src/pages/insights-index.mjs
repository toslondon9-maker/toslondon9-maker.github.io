import { siteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";
import { renderInsightCard } from "../insights.mjs";
import { bookingCallHref } from "../whatsapp.mjs";

function escapeHtml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;"); }

export function insightsIndexPage(data = siteData, language = "en") {
  const cards = [
    renderInsightCard({ id: "introduction", href: data.routes.insightsIntroduction, language }),
    renderInsightCard({ id: "principles", href: data.routes.insightsPrinciples, language }),
    renderInsightCard({ id: "worldWithin", href: data.routes.insightsWorldWithin, language }),
    renderInsightCard({ id: "journey", href: data.routes.insightsJourney, language }),
    renderInsightCard({ id: "lawAttraction", href: data.routes.insightsLawAttraction, language }),
  ].join("");
  const body = `<main id="main-content"><section class="insightArticle insightsHub"><header class="insightArticle__header"><p class="eyebrow" data-i18n="insights.hub.eyebrow">${escapeHtml(t("insights.hub.eyebrow", language))}</p><h1 data-i18n="insights.hub.heading">${escapeHtml(t("insights.hub.heading", language))}</h1><p class="insightArticle__intro" data-i18n="insights.hub.intro">${escapeHtml(t("insights.hub.intro", language))}</p></header><div class="insightsPreview__grid">${cards}</div><p class="insightsHub__bridge" data-i18n="insights.cta.hubBridge">${escapeHtml(t("insights.cta.hubBridge", language))}</p><p class="insightArticle__links"><a class="button--primary" href="${data.routes.startFree}" data-i18n="insights.cta.start">${escapeHtml(t("insights.cta.start", language))}</a> <a class="button--text" href="${data.routes.masterKeySystem}" data-i18n="insights.cta.viewJourney">${escapeHtml(t("insights.cta.viewJourney", language))}</a> <a class="button--secondary" href="${bookingCallHref(data.contact.whatsapp)}" target="_blank" rel="noopener noreferrer" data-i18n="insights.cta.hubWhatsApp">${escapeHtml(t("insights.cta.hubWhatsApp", language))}</a></p></section></main>`;
  return { route: data.routes.insights, language, title: t("insights.hub.metaTitle", language), description: t("insights.hub.metaDescription", language), titleKey: "insights.hub.metaTitle", descriptionKey: "insights.hub.metaDescription", body, structuredData: [], scripts: [] };
}
