import { pricing, pricingNote } from "../content/pricing.mjs";

const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");

export function priceCopy(key, language, tag = "span", className = "") {
  const classAttribute = className ? ` class="${className}"` : "";
  return `<${tag}${classAttribute} data-i18n="pricing.${key}">${escapeHtml(pricing[key][language])}</${tag}>`;
}

export function pricingNoteCopy(language) {
  return `<span data-i18n="pricing.note">${escapeHtml(pricingNote[language])}</span>`;
}
