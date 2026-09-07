import { siteData as canonicalSiteData } from "../content/site-data.mjs";
import { t } from "../content/translations.mjs";

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

export function renderWhatHappensNext({
  language = "en",
  data = canonicalSiteData,
  startHref = data.routes.startFree,
} = {}) {
  const steps = [1, 2, 3].map((step) => `<li><span aria-hidden="true">0${step}</span><div>${copy(`conversion.next.step${step}Title`, language, "h3")}${copy(`conversion.next.step${step}Body`, language, "p")}</div></li>`).join("");
  return `<section class="conversionJourney" aria-labelledby="conversion-next-heading"><div class="conversionJourney__inner"><h2 id="conversion-next-heading" data-i18n="conversion.next.heading">${localized("conversion.next.heading", language)}</h2><ol class="conversionJourney__steps">${steps}</ol><a class="button--primary" href="${escapeHtml(startHref)}" data-i18n="conversion.next.cta">${localized("conversion.next.cta", language)}</a></div></section>`;
}

export function renderFoundationNextStep({
  language = "en",
  data = canonicalSiteData,
} = {}) {
  const foundation = data.stages?.find((stage) => stage.id === "foundation");
  if (!foundation) throw new Error("Foundation stage is required");
  return `<section class="foundationNextStep" aria-labelledby="foundation-next-heading"><div class="foundationNextStep__copy"><p class="eyebrow" data-i18n="conversion.foundation.eyebrow">${localized("conversion.foundation.eyebrow", language)}</p><h2 id="foundation-next-heading" data-i18n="conversion.foundation.heading">${localized("conversion.foundation.heading", language)}</h2>${copy("conversion.foundation.body", language, "p")}<p class="foundationNextStep__qualification" data-i18n="conversion.foundation.qualification">${localized("conversion.foundation.qualification", language)}</p></div><div class="foundationNextStep__offer"><strong>£${foundation.price}</strong><a class="button--primary" href="${escapeHtml(foundation.paymentUrl)}" target="_blank" rel="noopener noreferrer" data-i18n="conversion.foundation.cta">${localized("conversion.foundation.cta", language)}</a><a class="button--text" href="${escapeHtml(data.routes.coaching)}" data-i18n="conversion.foundation.secondary">${localized("conversion.foundation.secondary", language)}</a></div></section>`;
}
