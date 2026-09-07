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

const money = (value) => `£${new Intl.NumberFormat("en-GB").format(value)}`;
const copy = (key, language, tag = "span") => `<${tag} data-i18n="${key}">${localized(key, language)}</${tag}>`;

export function renderWhatHappensNext({
  language = "en",
  data = canonicalSiteData,
  startHref = data.routes.startFree,
} = {}) {
  const steps = [1, 2, 3].map((step) => `<li><strong>${String(step).padStart(2, "0")}</strong><div><h3>${copy(`conversion.next.step${step}Title`, language)}</h3><p>${copy(`conversion.next.step${step}Body`, language)}</p></div></li>`).join("");
  return `<section class="conversionJourney"><div class="conversionJourney__intro"><h2>${copy("conversion.next.heading", language)}</h2></div><ol class="conversionJourney__steps">${steps}</ol><a class="button--primary" href="${escapeHtml(startHref)}">${copy("conversion.next.cta", language)}</a></section>`;
}

export function renderFoundationNextStep({
  language = "en",
  data = canonicalSiteData,
} = {}) {
  const foundation = data.stages?.find((stage) => stage.id === "foundation");
  if (!foundation) throw new Error("Foundation stage is required");
  return `<section class="foundationNextStep"><h2>${copy("conversion.foundation.heading", language)}</h2><p class="foundationNextStep__price"><span data-i18n="conversion.foundation.price">${localized("conversion.foundation.price", language)}</span> <strong>${money(foundation.price)}</strong></p><div class="foundationNextStep__actions"><a class="button--primary" href="${escapeHtml(foundation.paymentUrl)}" target="_blank" rel="noopener noreferrer">${copy("conversion.foundation.payment", language)}</a><a class="button--secondary" href="${escapeHtml(data.routes.coaching)}">${copy("conversion.foundation.coaching", language)}</a></div></section>`;
}
