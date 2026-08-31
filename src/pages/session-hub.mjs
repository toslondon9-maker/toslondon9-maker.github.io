import { siteData as canonicalSiteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const copy = (key, language) => `<span data-i18n="${key}">${escapeHtml(t(key, language))}</span>`;

function actionCard({ eyebrowKey, titleKey, bodyKey, href, actionKey, language, primary = false }) {
  return `<article class="sessionHub__card"><p class="eyebrow">${copy(eyebrowKey, language)}</p><h2>${copy(titleKey, language)}</h2><p>${copy(bodyKey, language)}</p><a class="${primary ? "button--primary" : "button--secondary"}" href="${escapeHtml(href)}">${copy(actionKey, language)}</a></article>`;
}

export function renderSessionHub({ data = canonicalSiteData, language = "en" } = {}) {
  const cards = [
    actionCard({ eyebrowKey: "phase2.hub.studyEyebrow", titleKey: "phase2.hub.studyTitle", bodyKey: "phase2.hub.studyBody", href: `${data.routes.masterKeySystem}#week-1`, actionKey: "phase2.hub.studyAction", language, primary: true }),
    actionCard({ eyebrowKey: "phase2.hub.reflectEyebrow", titleKey: "phase2.hub.reflectTitle", bodyKey: "phase2.hub.reflectBody", href: data.routes.aiMentors, actionKey: "phase2.hub.reflectAction", language }),
    actionCard({ eyebrowKey: "phase2.hub.applyEyebrow", titleKey: "phase2.hub.applyTitle", bodyKey: "phase2.hub.applyBody", href: data.routes.coaching, actionKey: "phase2.hub.applyAction", language }),
  ].join("");

  return `<main class="sessionHub" id="main-content"><header class="sessionHub__hero"><div class="sessionHub__heroInner"><p class="eyebrow">${copy("phase2.hub.eyebrow", language)}</p><h1 data-i18n="route.liveCoaching.heading">${escapeHtml(t("route.liveCoaching.heading", language))}</h1><p class="routeShell__purpose" data-i18n="route.liveCoaching.purpose">${escapeHtml(t("route.liveCoaching.purpose", language))}</p><div class="sessionHub__heroActions"><a class="button--primary" href="${data.routes.masterKeySystem}#week-1">${copy("phase2.hub.continueStudy", language)}</a><a class="button--secondary" href="${data.routes.aiMentors}">${copy("phase2.hub.openAi", language)}</a></div></div></header><section class="sessionHub__quick section" aria-labelledby="session-hub-next"><p class="eyebrow">${copy("phase2.hub.nextEyebrow", language)}</p><h2 id="session-hub-next">${copy("phase2.hub.nextTitle", language)}</h2><p class="sessionHub__lead">${copy("phase2.hub.nextBody", language)}</p><div class="sessionHub__grid">${cards}</div></section><section class="sessionHub__rhythm section--night"><div class="sessionHub__rhythmInner"><div><p class="eyebrow">${copy("phase2.hub.rhythmEyebrow", language)}</p><h2>${copy("phase2.hub.rhythmTitle", language)}</h2><p>${copy("phase2.hub.rhythmBody", language)}</p></div><ol class="sessionHub__steps"><li><strong>01</strong>${copy("phase2.hub.rhythm1", language)}</li><li><strong>02</strong>${copy("phase2.hub.rhythm2", language)}</li><li><strong>03</strong>${copy("phase2.hub.rhythm3", language)}</li><li><strong>04</strong>${copy("phase2.hub.rhythm4", language)}</li></ol></div></section><section class="sessionHub__prepare section"><div class="sessionHub__prepareGrid"><div><p class="eyebrow">${copy("phase2.hub.prepareEyebrow", language)}</p><h2>${copy("phase2.hub.prepareTitle", language)}</h2><p>${copy("phase2.hub.prepareBody", language)}</p></div><ul><li>${copy("phase2.hub.question1", language)}</li><li>${copy("phase2.hub.question2", language)}</li><li>${copy("phase2.hub.question3", language)}</li><li>${copy("phase2.hub.question4", language)}</li></ul></div><div class="sessionHub__prepareActions"><a class="button--primary" href="${data.routes.contact}">${copy("phase2.hub.talk", language)}</a><a class="button--text" href="${data.routes.getTheBook}">${copy("phase2.hub.book", language)}</a></div></section><aside class="sessionHub__note"><strong>${copy("phase2.hub.noteLabel", language)}</strong> ${copy("phase2.hub.noteBody", language)}</aside></main>`;
}

export function sessionHubPage(data = canonicalSiteData, language = "en") {
  return {
    route: data.routes.liveCoaching,
    language,
    title: t("route.liveCoaching.metaTitle", language),
    description: t("route.liveCoaching.metaDescription", language),
    titleKey: "route.liveCoaching.metaTitle",
    descriptionKey: "route.liveCoaching.metaDescription",
    body: renderSessionHub({ data, language }),
    scripts: [],
  };
}
