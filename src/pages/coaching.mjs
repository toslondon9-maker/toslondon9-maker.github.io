import { coachingContent } from "../../content/pages/coaching.mjs";
import { siteData as canonicalSiteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";

const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const money = (value) => `£${new Intl.NumberFormat("en-GB").format(value)}`;
const copy = (key, language) => `<span data-i18n="${key}">${escapeHtml(t(key, language))}</span>`;

function stageSummary(stage, language) {
  return `<article class="coachingStage card"><p class="coachingStage__weeks" aria-label="${escapeHtml(t(`coaching.stage.${stage.id}.weeks`, language))}" data-i18n-aria-label="coaching.stage.${stage.id}.weeks">${copy("coaching.weeks", language)} ${stage.weeks}</p><h3>${copy(`coaching.stage.${stage.id}.name`, language)}</h3><p>${copy(`coaching.stage.${stage.id}.outcome`, language)}</p><p class="coachingStage__price"><span>${copy("coaching.foundingPrice", language)}</span><strong>${money(stage.price)}</strong></p><a class="button--text" href="${canonicalSiteData.routes.contact}">${copy("coaching.exploreStage", language)}</a></article>`;
}

function stagePanel(stage, language) {
  const items = Array.from({ length: coachingContent.inclusionCount }, (_, index) => `<li>${copy(`coaching.stage.${stage.id}.inclusion${index + 1}`, language)}</li>`).join("");
  return `<p class="eyebrow" aria-label="${escapeHtml(t(`coaching.stage.${stage.id}.weeks`, language))}" data-i18n-aria-label="coaching.stage.${stage.id}.weeks">${copy("coaching.stageLabel", language)} · ${copy("coaching.weeks", language)} ${stage.weeks}</p><h2>${copy(`coaching.stage.${stage.id}.name`, language)}</h2><p class="coachingPanel__lead">${copy(`coaching.stage.${stage.id}.outcome`, language)}</p><ul class="coachingInclusions">${items}</ul><p class="coachingPanel__price">${copy("coaching.foundingPrice", language)} <strong>${money(stage.price)}</strong> <span>(${copy("coaching.msrp", language)} ${money(stage.msrp)})</span></p><a class="button--primary" href="${canonicalSiteData.routes.contact}">${copy("route.coaching.action", language)}</a>`;
}

function fullJourney(language, data) {
  return `<p class="eyebrow">${copy("coaching.bestValue", language)}</p><h2>${copy("coaching.full.title", language)}</h2><p class="coachingPanel__lead">${copy("coaching.full.body", language)}</p><div class="coachingValue"><p>${copy("coaching.full.separate", language)} <strong>${money(data.offer.separateTotal)}</strong></p><p class="coachingValue__price">${copy("coaching.full.complete", language)} <strong>${money(data.offer.completePrice)}</strong></p><p aria-label="${escapeHtml(t("coaching.full.saveFoundingValue", language))}" data-i18n-aria-label="coaching.full.saveFoundingValue">${copy("coaching.full.saveFounding", language)} <strong>${money(data.offer.foundingSaving)}</strong></p><hr><p>${copy("coaching.full.msrp", language)} <strong>${money(data.offer.msrpTotal)}</strong></p><p aria-label="${escapeHtml(t("coaching.full.saveMsrpValue", language))}" data-i18n-aria-label="coaching.full.saveMsrpValue">${copy("coaching.full.saveMsrp", language)} <strong>${money(data.offer.msrpSaving)}</strong></p><p class="coachingValue__discount" aria-label="${escapeHtml(t("coaching.full.discountValue", language))}" data-i18n-aria-label="coaching.full.discountValue"><strong>${data.offer.msrpDiscount}%</strong> ${copy("coaching.full.discount", language)}</p></div><a class="button--primary" href="${data.routes.contact}">${copy("route.coaching.action", language)}</a>`;
}

function faqPanel(language) {
  const faqs = coachingContent.faqIds.map((id) => `<details><summary>${copy(`coaching.faq.${id}.question`, language)}</summary><p>${copy(`coaching.faq.${id}.answer`, language)}</p></details>`).join("");
  return `<h2>${copy("coaching.faq.title", language)}</h2><div class="accordion coachingFaq">${faqs}</div><a class="button--primary" href="${canonicalSiteData.routes.contact}">${copy("route.coaching.action", language)}</a>`;
}

export function renderCoaching({ language = "en", siteData = canonicalSiteData } = {}) {
  const summaries = siteData.stages.map((stage) => stageSummary(stage, language)).join("");
  const labels = coachingContent.tabs.map((id) => t(`coaching.tab.${id}`, language));
  const panels = [
    `<h2>${copy("coaching.overview.title", language)}</h2><p class="coachingPanel__lead">${copy("coaching.overview.body", language)}</p><div class="coachingStageGrid">${summaries}</div>`,
    ...siteData.stages.map((stage) => stagePanel(stage, language)),
    fullJourney(language, siteData),
    faqPanel(language),
  ];
  const tabs = labels.map((label, index) => `<button type="button" id="tab-${coachingContent.tabs[index]}" role="tab" aria-selected="${index === 0}" aria-controls="panel-${coachingContent.tabs[index]}" tabindex="${index === 0 ? 0 : -1}" data-i18n="coaching.tab.${coachingContent.tabs[index]}">${escapeHtml(label)}</button>`).join("");
  const tabPanels = panels.map((panel, index) => `<section id="panel-${coachingContent.tabs[index]}" class="coachingPanel" role="tabpanel" aria-labelledby="tab-${coachingContent.tabs[index]}">${panel}</section>`).join("");
  return `<main class="coachingPage" id="main-content"><header class="coachingHero section"><p class="eyebrow">${copy("coaching.eyebrow", language)}</p><h1 data-i18n="route.coaching.heading">${escapeHtml(t("route.coaching.heading", language))}</h1><p class="routeShell__purpose" data-i18n="route.coaching.purpose">${escapeHtml(t("route.coaching.purpose", language))}</p><a class="button--primary routeShell__action" href="${siteData.routes.contact}" data-i18n="route.coaching.action">${escapeHtml(t("route.coaching.action", language))}</a></header><section class="coachingExperience section--night"><div class="coachingExperience__inner" data-tabs><div class="tabs coachingTabs" role="tablist" aria-label="${escapeHtml(t("coaching.tabsLabel", language))}" data-i18n-aria-label="coaching.tabsLabel">${tabs}</div><div class="coachingPanels">${tabPanels}</div></div></section><section class="coachingTrust section"><h2>${copy("coaching.trust.title", language)}</h2><p>${copy("coaching.trust.body", language)}</p></section></main>`;
}

export function coachingPage(data = canonicalSiteData, language = "en") {
  return { route: data.routes.coaching, language, title: t("route.coaching.metaTitle", language), description: t("route.coaching.metaDescription", language), titleKey: "route.coaching.metaTitle", descriptionKey: "route.coaching.metaDescription", body: renderCoaching({ language, siteData: data }), scripts: ["/assets/tabs.mjs"] };
}
