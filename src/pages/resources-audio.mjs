import { siteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";
import { audioSection } from "./resources.mjs";

const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

export function resourcesAudioPage(data = siteData, language = "en") {
  return {
    route: data.routes.resourcesAudio,
    language,
    title: t("route.resourcesAudio.metaTitle", language),
    description: t("route.resourcesAudio.metaDescription", language),
    titleKey: "route.resourcesAudio.metaTitle",
    descriptionKey: "route.resourcesAudio.metaDescription",
    body: `<main><article class="resourcesPage resourcesAudioPage"><p class="eyebrow">UNLEASH YOUR POWER</p><h1 id="resources-audio-title" data-i18n="route.resourcesAudio.heading">${esc(t("route.resourcesAudio.heading", language))}</h1><p class="routeShell__purpose" data-i18n="route.resourcesAudio.purpose">${esc(t("route.resourcesAudio.purpose", language))}</p>${audioSection(language, { includeHeading: false })}</article></main>`,
    scripts: [],
  };
}
