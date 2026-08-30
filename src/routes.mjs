import { t } from "../content/translations.mjs";
import { sevenDayExperience } from "../content/seven-day-experience.mjs";
import { siteData } from "../content/site-data.mjs";
import { homePage } from "./pages/home.mjs";
import { coachingPage } from "./pages/coaching.mjs";
import { masterKeyCurriculumPage } from "./pages/master-key-curriculum.mjs";
import { startFreePage } from "./pages/start-free.mjs";
import { sevenDayLessonPage } from "./pages/seven-day-lesson.mjs";
import { resourcesPage } from "./pages/resources.mjs";
import { getTheBookPage } from "./pages/get-the-book.mjs";
import { aboutTariqPage } from "./pages/about-tariq.mjs";
import { aiMentorsPage } from "./pages/ai-mentors.mjs";
import { contactPage } from "./pages/contact.mjs";
import { sessionHubPage } from "./pages/session-hub.mjs";

const routeShells = Object.freeze({
  home: { actionRoute: "startFree" },
  masterKeySystem: { actionRoute: "coaching" },
  coaching: { actionRoute: "contact", detail: "price" },
  aboutTariq: { actionRoute: "contact" },
  resources: { actionRoute: "startFree" },
  contact: { actionEmail: true },
  faq: { actionRoute: "contact" },
  referral: { actionRoute: "contact" },
  privacy: { actionRoute: "contact" },
  terms: { actionRoute: "contact" },
  liveCoaching: { actionRoute: "contact" },
});

function renderDetail(routeId, detail, data) {
  if (detail !== "price") return "";
  const key = `route.${routeId}.priceLead`;
  return `<p class="routeShell__detail"><span data-i18n="${key}">${t(key, "en")}</span> <strong>£${data.offer.completePrice}</strong>.</p>`;
}

function renderRouteShell(routeId, definition, data) {
  const key = `route.${routeId}`;
  const actionHref = definition.actionEmail
    ? `mailto:${data.contact.email}`
    : definition.actionHref ?? `${data.routes[definition.actionRoute]}${definition.actionHash ?? ""}`;

  const contactActions = routeId === "contact"
    ? `<div class="routeShell__actions"><a class="button--primary routeShell__action" href="mailto:${data.contact.email}?subject=Coaching%20enquiry" data-i18n="route.contact.action">${t("route.contact.action", "en")}</a><a class="button--secondary" href="mailto:${data.contact.email}?subject=Question%20for%20Tariq" data-i18n="route.contact.question">${t("route.contact.question", "en")}</a></div>`
    : `<a class="button--primary routeShell__action" href="${actionHref}" data-i18n="${key}.action">${t(`${key}.action`, "en")}</a>`;

  return {
    route: data.routes[routeId],
    language: "en",
    title: t(`${key}.metaTitle`, "en"),
    description: t(`${key}.metaDescription`, "en"),
    titleKey: `${key}.metaTitle`,
    descriptionKey: `${key}.metaDescription`,
    body: `<main><article class="routeShell"><p class="eyebrow">UNLEASH YOUR POWER</p><h1 data-i18n="${key}.heading">${t(`${key}.heading`, "en")}</h1><p class="routeShell__purpose" data-i18n="${key}.purpose">${t(`${key}.purpose`, "en")}</p>${renderDetail(routeId, definition.detail, data)}${contactActions}</article></main>`,
    scripts: [],
  };
}

export const routeRenderers = Object.freeze({
  ...Object.fromEntries(
    Object.entries(routeShells).map(([routeId, definition]) => [
      siteData.routes[routeId],
      (data) => renderRouteShell(routeId, definition, data),
    ]),
  ),
  [siteData.routes.home]: (data) => homePage(data),
  [siteData.routes.startFree]: (data) => startFreePage(data),
  [siteData.routes.coaching]: (data) => coachingPage(data),
  [siteData.routes.masterKeySystem]: (data) => masterKeyCurriculumPage(data),
  [siteData.routes.resources]: (data) => resourcesPage(data),
  [siteData.routes.aiMentors]: (data) => aiMentorsPage(data),
  [siteData.routes.getTheBook]: (data) => getTheBookPage(data),
  [siteData.routes.aboutTariq]: (data) => aboutTariqPage(data),
  [siteData.routes.contact]: (data) => contactPage(data),
  [siteData.routes.liveCoaching]: (data) => sessionHubPage(data),
  ...Object.fromEntries(
    sevenDayExperience.lessons.map((lesson) => [
      lesson.route,
      (data) => sevenDayLessonPage(lesson, data),
    ]),
  ),
});
