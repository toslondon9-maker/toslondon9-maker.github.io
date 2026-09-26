import { siteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";

const esc = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const copy = (key, language, tag = "p") => `<${tag} data-i18n="${key}">${esc(t(key, language))}</${tag}>`;

export function foundationPage(data = siteData, language = "en") {
  const foundation = data.stages.find((stage) => stage.id === "foundation");
  const inclusions = [1, 2, 3, 4].map((index) => `<li data-i18n="foundation.inclusion${index}">${esc(t(`foundation.inclusion${index}`, language))}</li>`).join("");
  const body = `<main class="foundationPage" id="main-content"><article class="foundationPage__card"><p class="eyebrow" data-i18n="foundation.eyebrow">${esc(t("foundation.eyebrow", language))}</p><h1 data-i18n="foundation.heading">${esc(t("foundation.heading", language))}</h1>${copy("foundation.intro", language)}<p class="foundationPage__weeks" data-i18n="foundation.weeks">${esc(t("foundation.weeks", language))}</p><div class="foundationPage__price"><span data-i18n="foundation.priceLabel">${esc(t("foundation.priceLabel", language))}</span><strong>£${foundation.price}</strong></div><section aria-labelledby="foundation-includes"><h2 id="foundation-includes" data-i18n="foundation.includesHeading">${esc(t("foundation.includesHeading", language))}</h2><ul>${inclusions}</ul></section><section aria-labelledby="foundation-fit"><h2 id="foundation-fit" data-i18n="foundation.fitHeading">${esc(t("foundation.fitHeading", language))}</h2>${copy("foundation.fitBody", language)}</section><div class="foundationPage__actions"><a class="button--primary" href="${esc(foundation.paymentUrl)}" target="_blank" rel="noopener noreferrer" data-i18n="foundation.cta">${esc(t("foundation.cta", language))}</a><a class="button--secondary" href="${data.routes.startFree}" data-i18n="foundation.secondary">${esc(t("foundation.secondary", language))}</a></div><p class="foundationPage__note" data-i18n="foundation.note">${esc(t("foundation.note", language))}</p></article></main>`;
  return { route: data.routes.foundation, language, title: t("foundation.metaTitle", language), description: t("foundation.metaDescription", language), titleKey: "foundation.metaTitle", descriptionKey: "foundation.metaDescription", body, structuredData: [{ "@context": "https://schema.org", "@type": "Product", name: t("foundation.heading", language), description: t("foundation.metaDescription", language), offers: { "@type": "Offer", price: foundation.price, priceCurrency: "GBP", url: foundation.paymentUrl } }] };
}
