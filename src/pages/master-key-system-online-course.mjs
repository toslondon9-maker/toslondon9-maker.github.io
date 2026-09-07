import { siteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";

const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

export function masterKeySystemOnlineCoursePage(data = siteData, language = "en") {
  const key = "route.masterKeySystemOnlineCourse";
  const section = (name) => `<section><h2 data-i18n="${key}.${name}Heading">${esc(t(`${key}.${name}Heading`, language))}</h2><p data-i18n="${key}.${name}Body">${esc(t(`${key}.${name}Body`, language))}</p></section>`;
  const body = `<main id="main-content"><article class="routeShell card onlineCoursePage"><p class="eyebrow">UNLEASH YOUR POWER</p><h1 data-i18n="${key}.heading">${esc(t(`${key}.heading`, language))}</h1><p class="routeShell__purpose" data-i18n="${key}.purpose">${esc(t(`${key}.purpose`, language))}</p>${section("journey")}${section("practice")}${section("support")}${section("fit")}<nav class="onlineCoursePage__links" aria-label="Next steps"><a class="button--primary routeShell__action" href="${data.routes.startFree}" data-i18n="${key}.action">${esc(t(`${key}.action`, language))}</a><a class="button--secondary" href="${data.routes.coaching}" data-i18n="${key}.coaching">${esc(t(`${key}.coaching`, language))}</a><a class="button--text" href="${data.routes.resources}" data-i18n="${key}.resources">${esc(t(`${key}.resources`, language))}</a><a class="button--text" href="${data.routes.faq}" data-i18n="${key}.faq">${esc(t(`${key}.faq`, language))}</a></nav></article></main>`;
  return { route: data.routes.masterKeySystemOnlineCourse, language, title: t(`${key}.metaTitle`, language), description: t(`${key}.metaDescription`, language), titleKey: `${key}.metaTitle`, descriptionKey: `${key}.metaDescription`, body, structuredData: [{ "@type": "Course", name: t(`${key}.heading`, language), description: t(`${key}.purpose`, language), provider: { "@id": "https://toslondon9-maker.github.io/#organization" } }], scripts: [] };
}
