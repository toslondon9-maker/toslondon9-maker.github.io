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

function flagshipCoaching(language, route) {
  return `<section class="coachingFlagship section" data-coaching-section="flagship"><div class="coachingFlagship__intro"><p class="eyebrow">${copy("phase2.coaching.flagshipEyebrow", language)}</p><h2>${copy("phase2.coaching.flagshipTitle", language)}</h2><p class="coachingFlagship__lead">${copy("phase2.coaching.flagshipLead", language)}</p><p><strong>${copy("phase2.coaching.howWorksLabel", language)}</strong> ${copy("phase2.coaching.howWorksBody", language)}</p><div class="coachingFlagship__fit"><span>${copy("phase2.coaching.fit1", language)}</span><span>${copy("phase2.coaching.fit2", language)}</span><span>${copy("phase2.coaching.fit3", language)}</span></div></div><ul class="coachingFlagship__benefits"><li><strong>${copy("phase2.coaching.benefit1Title", language)}</strong><span>${copy("phase2.coaching.benefit1Body", language)}</span></li><li><strong>${copy("phase2.coaching.benefit2Title", language)}</strong><span>${copy("phase2.coaching.benefit2Body", language)}</span></li><li><strong>${copy("phase2.coaching.benefit3Title", language)}</strong><span>${copy("phase2.coaching.benefit3Body", language)}</span></li></ul><a class="button--primary" href="${route}">${copy("phase2.coaching.enquire", language)}</a></section>`;
}

function professionalServices(language, route) {
  const services = [
    ["phase2.coaching.salesTitle", "phase2.coaching.salesBody"],
    ["phase2.coaching.leadershipTitle", "phase2.coaching.leadershipBody"],
    ["phase2.coaching.aiPerformanceTitle", "phase2.coaching.aiPerformanceBody"],
  ];
  const cards = services.map(([titleKey, bodyKey]) => `<article class="coachingProfessionalService card"><h3>${copy(titleKey, language)}</h3><p>${copy(bodyKey, language)}</p><a class="button--text" href="${route}">${copy("phase2.coaching.discussService", language)}</a></article>`).join("");
  return `<section class="coachingProfessionalServices section" data-coaching-section="professional-services"><div class="coachingProfessionalServices__intro"><p class="eyebrow">${copy("phase2.coaching.secondaryEyebrow", language)}</p><h2>${copy("phase2.coaching.secondaryTitle", language)}</h2><p>${copy("phase2.coaching.secondaryBody", language)}</p></div><div class="coachingProfessionalServices__grid">${cards}</div></section>`;
}

function coachingDecision(language) {
  return `<section class="coachingDecision section"><div class="coachingDecision__intro"><p class="eyebrow">${copy("phase2.coaching.decisionEyebrow", language)}</p><h2>${copy("phase2.coaching.decisionTitle", language)}</h2><p>${copy("phase2.coaching.decisionBody", language)}</p></div><div class="coachingDecision__grid"><article><span>01</span><h3>${copy("phase2.coaching.readyTitle", language)}</h3><ul><li>${copy("phase2.coaching.ready1", language)}</li><li>${copy("phase2.coaching.ready2", language)}</li><li>${copy("phase2.coaching.ready3", language)}</li></ul></article><article><span>02</span><h3>${copy("phase2.coaching.receiveTitle", language)}</h3><ul><li>${copy("phase2.coaching.receive1", language)}</li><li>${copy("phase2.coaching.receive2", language)}</li><li>${copy("phase2.coaching.receive3", language)}</li></ul></article><article><span>03</span><h3>${copy("phase2.coaching.notTitle", language)}</h3><ul><li>${copy("phase2.coaching.not1", language)}</li><li>${copy("phase2.coaching.not2", language)}</li><li>${copy("phase2.coaching.not3", language)}</li></ul></article></div></section>`;
}

function coachingNextSteps(language, route, startFreeRoute) {
  return `<section class="coachingNextSteps section" aria-labelledby="coaching-next-step-title"><div class="coachingNextSteps__intro"><p class="eyebrow">${copy("phase2.coaching.nextEyebrow", language)}</p><h2 id="coaching-next-step-title">${copy("phase2.coaching.nextTitle", language)}</h2><p>${copy("phase2.coaching.nextBody", language)}</p></div><ol class="coachingNextSteps__steps"><li><strong>01</strong><div><h3>${copy("phase2.coaching.next1Title", language)}</h3><p>${copy("phase2.coaching.next1Body", language)}</p></div></li><li><strong>02</strong><div><h3>${copy("phase2.coaching.next2Title", language)}</h3><p>${copy("phase2.coaching.next2Body", language)}</p></div></li><li><strong>03</strong><div><h3>${copy("phase2.coaching.next3Title", language)}</h3><p>${copy("phase2.coaching.next3Body", language)}</p></div></li></ol><div class="coachingNextSteps__actions"><a class="button--primary" href="${route}">${copy("phase2.coaching.enquire", language)}</a><a class="button--secondary" href="${startFreeRoute}">${copy("phase2.coaching.startFree", language)}</a></div></section>`;
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
  return `<main class="coachingPage" id="main-content"><header class="coachingHero section"><div class="coachingHero__copy"><p class="eyebrow">${copy("coaching.eyebrow", language)}</p><h1 data-i18n="route.coaching.heading">${escapeHtml(t("route.coaching.heading", language))}</h1><p class="routeShell__purpose" data-i18n="route.coaching.purpose">${escapeHtml(t("route.coaching.purpose", language))}</p><div class="coachingHero__actions"><a class="button--primary routeShell__action" href="${siteData.routes.contact}" data-i18n="route.coaching.action">${escapeHtml(t("route.coaching.action", language))}</a><a class="button--secondary" href="${siteData.routes.startFree}">${language === "es" ? "Empieza gratis durante 7 días" : "START FREE FOR 7 DAYS"}</a></div><p class="coachingHero__preparation">${copy("coaching.hero.preparation", language)} <a href="${siteData.routes.getTheBook}">${copy("nav.getTheBook", language)}</a></p></div><aside class="coachingHero__offer"><span>${copy("coaching.completeJourney", language)}</span><strong>24</strong><em>${copy("coaching.weeks", language)}</em><div><b>4</b><small>${copy("coaching.progressiveStages", language)}</small></div><div><b>£997</b><small>${copy("coaching.completeProgramme", language)}</small></div></aside></header>${flagshipCoaching(language, siteData.routes.contact)}${coachingDecision(language)}<section class="coachingExperience section--night"><div class="coachingExperience__inner" data-tabs><header class="coachingExperience__header"><p class="eyebrow">${copy("phase2.coaching.investmentEyebrow", language)}</p><h2>${copy("phase2.coaching.investmentTitle", language)}</h2><p>${copy("phase2.coaching.investmentBody", language)}</p></header><div class="tabs coachingTabs" role="tablist" aria-label="${escapeHtml(t("coaching.tabsLabel", language))}" data-i18n-aria-label="coaching.tabsLabel">${tabs}</div><div class="coachingPanels">${tabPanels}</div></div></section>${coachingNextSteps(language, siteData.routes.contact, siteData.routes.startFree)}${professionalServices(language, siteData.routes.contact)}<section class="coachingTrust section"><div><p class="eyebrow">${copy("phase2.coaching.nextStepEyebrow", language)}</p><h2>${copy("phase2.coaching.trustTitle", language)}</h2><p>${copy("coaching.trust.body", language)}</p></div><a class="button--primary" href="${siteData.routes.contact}">${copy("phase2.coaching.enquire", language)}</a></section></main>`;
}

export function coachingPage(data = canonicalSiteData, language = "en") {
  return { route: data.routes.coaching, language, title: t("route.coaching.metaTitle", language), description: t("route.coaching.metaDescription", language), titleKey: "route.coaching.metaTitle", descriptionKey: "route.coaching.metaDescription", body: renderCoaching({ language, siteData: data }), scripts: ["/assets/tabs.mjs"], socialImage: "/images/unleash-your-power-programme.jpeg", socialImageAlt: "Unleash Your Power 24-week Master Key System coaching journey" };
}
