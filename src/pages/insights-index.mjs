import { siteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";
import { renderInsightCard } from "../insights.mjs";

function escapeHtml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;"); }

export function insightsIndexPage(data = siteData, language = "en") {
  const cards = [
    renderInsightCard({ id: "course", href: data.routes.insightsCourse, language }),
    renderInsightCard({ id: "principles", href: data.routes.insightsPrinciples, language }),
    renderInsightCard({ id: "resources", href: data.routes.resources, language }),
  ].join("");
  const body = `<main id="main-content"><section class="insightArticle insightsHub"><header class="insightArticle__header"><p class="eyebrow" data-i18n="insights.hub.eyebrow">${escapeHtml(t("insights.hub.eyebrow", language))}</p><h1 data-i18n="insights.hub.heading">${escapeHtml(t("insights.hub.heading", language))}</h1><p class="insightArticle__intro" data-i18n="insights.hub.intro">${escapeHtml(t("insights.hub.intro", language))}</p></header><div class="insightsPreview__grid">${cards}</div></section></main>`;
  return { route: data.routes.insights, language, title: t("insights.hub.metaTitle", language), description: t("insights.hub.metaDescription", language), titleKey: "insights.hub.metaTitle", descriptionKey: "insights.hub.metaDescription", body, structuredData: [], scripts: [] };
}
