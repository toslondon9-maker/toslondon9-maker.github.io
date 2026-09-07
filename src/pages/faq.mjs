import { siteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";

const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const faqItems = [1, 2, 3, 4, 5, 6];

export function faqPage(data = siteData, language = "en") {
  const items = faqItems.map((number) => `<details><summary data-i18n="coaching.faq.${number}.question">${esc(t(`coaching.faq.${number}.question`, language))}</summary><p data-i18n="coaching.faq.${number}.answer">${esc(t(`coaching.faq.${number}.answer`, language))}</p></details>`).join("");
  const key = "route.faq";
  return { route: data.routes.faq, language, title: t(`${key}.metaTitle`, language), description: t(`${key}.metaDescription`, language), titleKey: `${key}.metaTitle`, descriptionKey: `${key}.metaDescription`, body: `<main id="main-content"><article class="routeShell card faqPage"><p class="eyebrow">UNLEASH YOUR POWER</p><h1 data-i18n="${key}.heading">${esc(t(`${key}.heading`, language))}</h1><p class="routeShell__purpose" data-i18n="${key}.purpose">${esc(t(`${key}.purpose`, language))}</p><div class="faqPage__list">${items}</div><p><a href="${data.routes.masterKeySystem}" data-i18n="route.faq.courseLink">${esc(t("route.faq.courseLink", language))}</a> · <a href="${data.routes.masterKeySystemOnlineCourse}" data-i18n="route.faq.onlineCourseLink">${esc(t("route.faq.onlineCourseLink", language))}</a> · <a href="${data.routes.startFree}" data-i18n="route.faq.startFreeLink">${esc(t("route.faq.startFreeLink", language))}</a></p><a class="button--primary routeShell__action" href="${data.routes.contact}" data-i18n="${key}.action">${esc(t(`${key}.action`, language))}</a></article></main>`, scripts: [] };
}
