import { coachingContent } from "../../content/pages/coaching.mjs";
import { siteData as canonicalSiteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";
import { bookingCallHref } from "../whatsapp.mjs";
import { priceCopy, pricingNoteCopy } from "../pricing.mjs";

const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const copy = (key, language) => `<span data-i18n="${key}">${escapeHtml(t(key, language))}</span>`;
const paymentLink = (url, className, label) => `<a class="${className}" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
const contactLink = (data, language, className = "button--secondary") => `<a class="${className}" href="${escapeHtml(data.routes.contact)}" data-i18n="route.coaching.action">${escapeHtml(t("route.coaching.action", language))}</a>`;

function stageCard(stage, language) {
  return `<article class="coachingStage card"><p class="coachingStage__weeks">${copy(`coaching.stage.${stage.id}.weeks`, language)}</p><h3>${copy(`coaching.stage.${stage.id}.name`, language)}</h3><p>${copy(`coaching.stage.${stage.id}.outcome`, language)}</p><ul>${[1, 2, 3].map((index) => `<li>${copy(`coaching.stage.${stage.id}.inclusion${index}`, language)}</li>`).join("")}</ul></article>`;
}

function stageDetails(stage, language) {
  const firstLesson = stage.id === "foundation"
    ? copy("foundation.compact.lessons", language)
    : copy(`coaching.stage.${stage.id}.inclusion1`, language);
  const remainingSummaryKeys = stage.id === "foundation"
    ? ["foundation.compact.weeks", "foundation.compact.calls", "foundation.compact.totalCalls", "foundation.compact.access", "foundation.compact.support"]
    : [`coaching.stage.${stage.id}.inclusion2`, `coaching.stage.${stage.id}.inclusion3`];
  const detailKeys = stage.id === "foundation"
    ? ["format", "call", "whatsapp", "access", "time", "afterPayment", "for", "notFor", "week1", "transition"].map((key) => `coaching.foundation.${key}`)
    : [];
  const remainingSummary = remainingSummaryKeys.map((key) => `<li>${copy(key, language)}</li>`).join("");
  const detailCopy = detailKeys.map((key) => `<p>${copy(key, language)}</p>`).join("");
  return `<p class="coachingStage__lessonSummary">${firstLesson}</p><details class="coachingStage__details"><summary data-i18n="coaching.stage.${stage.id}.learnMore">${escapeHtml(t(`coaching.stage.${stage.id}.learnMore`, language))}</summary><div class="coachingStage__detailsBody">${remainingSummary ? `<ul class="coachingStage__remainingSummary">${remainingSummary}</ul>` : ""}${detailCopy}</div></details>`;
}

function programmeIntro(language, data) {
  const stages = data.stages.map((stage) => stageCard(stage, language)).join("");
  return `<section class="coachingProgramme section" data-coaching-section="programme"><div class="coachingProgramme__intro"><p class="eyebrow">${copy("phase2.coaching.decisionEyebrow", language)}</p><h2>${copy("phase2.coaching.decisionTitle", language)}</h2><p>${copy("phase2.coaching.decisionBody", language)}</p></div><div class="coachingProgramme__fit"><article><h3>${copy("phase2.coaching.benefit1Title", language)}</h3><p>${copy("phase2.coaching.benefit1Body", language)}</p></article><article><h3>${copy("phase2.coaching.benefit2Title", language)}</h3><p>${copy("phase2.coaching.benefit2Body", language)}</p></article><article><h3>${copy("phase2.coaching.benefit3Title", language)}</h3><p>${copy("phase2.coaching.benefit3Body", language)}</p></article></div><div class="coachingProgramme__boundaries"><h3>${copy("phase2.coaching.notTitle", language)}</h3><ul><li>${copy("phase2.coaching.not1", language)}</li><li>${copy("phase2.coaching.not2", language)}</li><li>${copy("phase2.coaching.not3", language)}</li></ul></div><div class="coachingProgramme__stages"><p class="eyebrow">${copy("coaching.overview.title", language)}</p><p class="coachingProgramme__sequence">${copy("coaching.overview.body", language)}</p><div class="coachingStageGrid">${stages}</div></div></section>`;
}

function coachingOutcome(language) {
  return `<section class="coachingBuild section" data-coaching-section="what-you-can-build"><div class="coachingBuild__inner"><p class="eyebrow">${copy("coaching.build.eyebrow", language)}</p><h2>${copy("coaching.build.title", language)}</h2><p>${copy("coaching.build.body", language)}</p><p>${copy("coaching.build.support", language)}</p><p class="coachingBuild__quote">${copy("coaching.build.quote", language)}</p><p class="coachingBuild__note">${copy("coaching.build.note", language)}</p></div></section>`;
}

function pricing(language, data) {
  const stageOffers = data.stages.map((stage) => {
    const action = stage.id === "foundation" ? `<a class="button--secondary" href="${data.routes.foundation}" data-i18n="coaching.pricing.foundationAction">${escapeHtml(t("coaching.pricing.foundationAction", language))}</a>` : paymentLink(stage.paymentUrl, "button--secondary", copy("coaching.payNow", language));
    return `<article class="coachingPricing__stage card"><p class="coachingStage__weeks">${copy(`coaching.stage.${stage.id}.weeks`, language)}</p><h3>${copy(`coaching.stage.${stage.id}.name`, language)}</h3><p class="coachingStage__outcome">${copy(`coaching.stage.${stage.id}.outcome`, language)}</p>${stageDetails(stage, language)}<p class="coachingPricing__price"><strong>${priceCopy(stage.id, language)}</strong></p>${action}</article>`;
  }).join("");
  const completeIncludes = `<div class="coachingPricing__completeIncludes"><h4>${copy("coaching.full.includesHeading", language)}</h4><ul>${[1, 2, 3, 4, 5].map((index) => `<li>${copy(`coaching.full.inclusion${index}`, language)}</li>`).join("")}</ul></div>`;
  return `<section class="coachingPricing section" data-coaching-section="pricing"><div class="coachingPricing__intro"><p class="eyebrow">${copy("coaching.pricing.eyebrow", language)}</p><h2>${copy("coaching.pricing.title", language)}</h2><p>${copy("coaching.pricing.body", language)}</p></div><div class="coachingPricing__grid">${stageOffers}<article class="coachingPricing__complete card"><p class="eyebrow">${copy("coaching.bestValue", language)}</p><h3>${copy("coaching.full.title", language)}</h3><p>${copy("coaching.full.body", language)}</p>${completeIncludes}<p class="coachingPricing__price"><strong>${priceCopy("complete", language)}</strong></p>${paymentLink(data.offer.paymentUrl, "button--primary", copy("coaching.pricing.completePurchase", language))}<div class="coachingPricing__balanceCallout"><p>${copy("coaching.pricing.balance", language)}</p><p>${pricingNoteCopy(language)}</p></div></article></div></section>`;
}

function professionalServices(language, data) {
  const premium = ["mastery", "alumni"].map((id) => `<article class="coachingProfessionalService card"><h3>${copy(`coaching.rate.${id}.title`, language)}</h3><p class="coachingRateCard__price">${copy(`coaching.rate.${id}.price`, language)}</p><p class="coachingRateCard__status">${copy(`coaching.rate.${id}.status`, language)}</p><p>${copy(`coaching.rate.${id}.description`, language)}</p><a class="button--text" href="${data.routes.contact}" data-i18n="coaching.rate.${id}.action">${escapeHtml(t(`coaching.rate.${id}.action`, language))}</a></article>`).join("");
  return `<section class="coachingProfessionalServices section" data-coaching-section="professional-services"><div class="coachingProfessionalServices__intro"><p class="eyebrow">${copy("phase2.coaching.secondaryEyebrow", language)}</p><h2>${copy("phase2.coaching.secondaryTitle", language)}</h2><p>${copy("phase2.coaching.secondaryBody", language)}</p></div><div class="coachingProfessionalServices__group"><h3>${copy("coaching.services.specialistTitle", language)}</h3><div class="coachingProfessionalServices__grid">${premium}</div></div></section>`;
}

function faq(language) {
  const faqs = coachingContent.faqIds.map((id) => `<details><summary>${copy(`coaching.faq.${id}.question`, language)}</summary><p>${copy(`coaching.faq.${id}.answer`, language)}</p></details>`).join("");
  return `<section class="coachingFaqSection section" data-coaching-section="faq"><p class="eyebrow">${copy("coaching.faq.eyebrow", language)}</p><h2>${copy("coaching.faq.title", language)}</h2><div class="accordion coachingFaq">${faqs}</div></section>`;
}

function finalStep(language, data) {
  const booking = bookingCallHref(data.contact.whatsapp);
  return `<section class="coachingFinalStep section" data-coaching-section="final-step"><div><p class="eyebrow">${copy("phase2.coaching.nextEyebrow", language)}</p><h2>${copy("phase2.coaching.nextTitle", language)}</h2><p>${copy("phase2.coaching.nextBody", language)}</p></div><div class="coachingFinalStep__actions"><a class="button--primary" href="${data.routes.startFree}" data-i18n="coaching.hero.startFree">${escapeHtml(t("coaching.hero.startFree", language))}</a><a class="button--secondary coaching-call-button--compact" href="${escapeHtml(booking)}" target="_blank" rel="noopener noreferrer" data-i18n="cta.bookCall">${escapeHtml(t("cta.bookCall", language))}</a>${contactLink(data, language)}</div></section>`;
}

function renderCoachingBody({ language = "en", siteData = canonicalSiteData } = {}) {
  return `<main class="coachingPage" id="main-content"><header class="coachingHero section"><div class="coachingHero__copy"><p class="eyebrow">${copy("coaching.eyebrow", language)}</p><h1 data-i18n="route.coaching.heading">${escapeHtml(t("route.coaching.heading", language))}</h1><p class="routeShell__purpose" data-i18n="route.coaching.purpose">${escapeHtml(t("route.coaching.purpose", language))}</p><div class="coachingHero__actions"><a class="button--primary routeShell__action" href="${siteData.routes.startFree}" data-i18n="coaching.hero.startFree">${escapeHtml(t("coaching.hero.startFree", language))}</a>${contactLink(siteData, language)}</div><p class="coachingHero__preparation">${copy("coaching.hero.preparation", language)} <a href="${siteData.routes.getTheBook}">${copy("nav.getTheBook", language)}</a></p></div><aside class="coachingHero__offer"><span>${copy("coaching.completeJourney", language)}</span><strong>24</strong><em>${copy("coaching.weeks", language)}</em><div><b>4</b><small>${copy("coaching.progressiveStages", language)}</small></div><div><b>${priceCopy("complete", language)}</b><small>${copy("coaching.completeProgramme", language)}</small></div></aside></header>${programmeIntro(language, siteData)}${coachingOutcome(language)}${pricing(language, siteData)}${professionalServices(language, siteData)}${faq(language)}${finalStep(language, siteData)}</main>`;
}

export function renderCoaching({ language = "en", siteData = canonicalSiteData } = {}) {
  return renderCoachingBody({ language, siteData });
}

export function coachingPage(data = canonicalSiteData, language = "en") {
  return { route: data.routes.coaching, language, title: t("route.coaching.metaTitle", language), description: t("route.coaching.metaDescription", language), titleKey: "route.coaching.metaTitle", descriptionKey: "route.coaching.metaDescription", body: renderCoaching({ language, siteData: data }), scripts: [], socialImage: "/images/unleash-your-power-programme.jpeg", socialImageAlt: "Unleash Your Power 24-week Master Key System coaching journey" };
}
