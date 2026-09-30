import { siteData as canonicalSiteData } from "../content/site-data.mjs";
import { t } from "../content/translations.mjs";
import { priceCopy, pricingNoteCopy } from "./pricing.mjs";

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

function localized(key, language) {
  try {
    return escapeHtml(t(key, language));
  } catch (error) {
    // Task 2 supplies these copy entries. Keep server-side renderers usable in
    // the interim, while preserving the translation hook in the markup.
    if (error instanceof Error && error.message.startsWith("Missing translation:")) return escapeHtml(key);
    throw error;
  }
}

const copy = (key, language, tag = "span") => `<${tag} data-i18n="${key}">${localized(key, language)}</${tag}>`;

export function renderCompactFoundationOffer({ language = "en", data = canonicalSiteData, ctaKey = "foundation.compact.cta", ctaVariant = "secondary", includeCta = true } = {}) {
  const foundation = data.stages?.find((stage) => stage.id === "foundation");
  if (!foundation) throw new Error("Foundation stage is required");
  const visible = ["weeks", "lessons", "calls", "support"].map((key) => `<li>${copy(`foundation.compact.${key}`, language)}</li>`).join("");
  const included = ["totalCalls", "zoomHours", "chapterDay", "meditationDay", "chapterTotal", "meditationTotal", "commitment"].map((key) => `<li>${copy(`foundation.compact.${key}`, language)}</li>`).join("");
  return `<div class="compactFoundationOffer"><h3>${copy("foundation.compact.title", language)}</h3><strong class="compactFoundationOffer__price">${priceCopy("foundation", language)}</strong><ul class="compactFoundationOffer__summary">${visible}</ul><details class="compactFoundationOffer__details"><summary>${copy("foundation.compact.seeIncluded", language)}</summary><ul>${included}</ul></details>${includeCta ? `<a class="button--${ctaVariant}" href="${escapeHtml(data.routes.foundation)}" data-i18n="${ctaKey}">${localized(ctaKey, language)}</a>` : ""}</div>`;
}

export function renderWhatHappensNext({
  language = "en",
  data = canonicalSiteData,
  startHref = data.routes.startFree,
} = {}) {
  const steps = [1, 2, 3].map((step) => `<li><span aria-hidden="true">0${step}</span><div>${copy(`conversion.next.step${step}Title`, language, "h3")}${copy(`conversion.next.step${step}Body`, language, "p")}${step === 2 ? `<a class="button--text" href="${escapeHtml(data.routes.foundation)}" data-i18n="conversion.next.step2Link">${localized("conversion.next.step2Link", language)}</a><div class="conversionJourney__foundationOffer">${renderCompactFoundationOffer({ language, data, includeCta: false })}</div>` : ""}</div></li>`).join("");
  return `<section class="conversionJourney" aria-labelledby="conversion-next-heading"><div class="conversionJourney__inner"><h2 id="conversion-next-heading" data-i18n="conversion.next.heading">${localized("conversion.next.heading", language)}</h2><ol class="conversionJourney__steps">${steps}</ol><a class="button--primary" href="${escapeHtml(startHref)}" data-i18n="conversion.next.cta">${localized("conversion.next.cta", language)}</a></div></section>`;
}

export function renderFoundationNextStep({
  language = "en",
  data = canonicalSiteData,
} = {}) {
  const foundation = data.stages?.find((stage) => stage.id === "foundation");
  if (!foundation) throw new Error("Foundation stage is required");
  return `<section class="foundationNextStep" data-day7-foundation hidden aria-labelledby="foundation-next-heading"><div class="foundationNextStep__copy"><p class="eyebrow" data-i18n="conversion.foundation.eyebrow">${localized("conversion.foundation.eyebrow", language)}</p><h2 id="foundation-next-heading" data-i18n="conversion.foundation.heading">${localized("conversion.foundation.heading", language)}</h2>${copy("conversion.foundation.body", language, "p")}<p class="foundationNextStep__qualification" data-i18n="conversion.foundation.qualification">${localized("conversion.foundation.qualification", language)}</p><p class="foundationNextStep__note">${pricingNoteCopy(language)}</p></div><div class="foundationNextStep__offer">${renderCompactFoundationOffer({ language, data, ctaKey: "conversion.foundation.cta", ctaVariant: "primary" })}<a class="button--text" href="${escapeHtml(data.routes.startFree)}" data-i18n="conversion.foundation.secondary">${localized("conversion.foundation.secondary", language)}</a></div></section>`;
}
