import { t } from "../content/translations.mjs";
import { sevenDayExperience } from "../content/seven-day-experience.mjs";
import { siteData } from "../content/site-data.mjs";
import { homePage } from "./pages/home.mjs";
import { coachingPage } from "./pages/coaching.mjs";
import { masterKeyCurriculumPage } from "./pages/master-key-curriculum.mjs";
import { startFreePage } from "./pages/start-free.mjs";
import { foundationPage } from "./pages/foundation.mjs";
import { completeJourneyPage } from "./pages/complete-journey.mjs";
import { sevenDayLessonPage } from "./pages/seven-day-lesson.mjs";
import { resourcesPage } from "./pages/resources.mjs";
import { resourcesStudyQuestionsPage } from "./pages/resources-study-questions.mjs";
import { resourcesAudioPage } from "./pages/resources-audio.mjs";
import { getTheBookPage } from "./pages/get-the-book.mjs";
import { aboutTariqPage } from "./pages/about-tariq.mjs";
import { aiMentorsPage } from "./pages/ai-mentors.mjs";
import { contactPage } from "./pages/contact.mjs";
import { sessionHubPage } from "./pages/session-hub.mjs";
import { legalPage } from "./pages/legal.mjs";
import { mksLineagePage } from "./pages/mks-lineage.mjs";
import { helmarRudolphOverviewPage, helmarRudolphApproachPage, helmarRudolphVideosPage } from "./pages/helmar-rudolph.mjs";
import { referralPage } from "./pages/referral.mjs";
import { faqPage } from "./pages/faq.mjs";
import { insightsCoursePage } from "./pages/insights-course-works.mjs";
import { insightsIndexPage } from "./pages/insights-index.mjs";
import { insightsPrinciplesPage } from "./pages/insights-principles.mjs";
import { insightsIntroductionPage } from "./pages/insights-introduction.mjs";
import { insightsWorldWithinPage } from "./pages/insights-world-within.mjs";
import { insightsJourneyPage, insightsLawAttractionPage, insightsPeoplePage, insightsFoundationDevelopmentPage, insightsFoundationFirstStepPage, insightsFoundationQAPage, insightsPersonalCoachingPage, insightsImagineMeditationPage, insightsHaanelBiographyPage, insightsPowerWithinPage, insightsHowToStudyPage, insightsEnergyAttentionPage, insightsLifeRebuiltPage, insightsFoundationRestartPage, insightsFamiliarPage, insightsNextLevelPage } from "./pages/insights-source-article.mjs";

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
  refundPolicy: { actionRoute: "contact" },
  liveCoaching: { actionRoute: "contact" },
});

function renderDetail(routeId, detail, data, language = "en") {
  if (detail !== "price") return "";
  const key = `route.${routeId}.priceLead`;
  return `<p class="routeShell__detail"><span data-i18n="${key}">${t(key, language)}</span> <strong>£${data.offer.completePrice}</strong>.</p>`;
}

function renderRouteShell(routeId, definition, data, language = "en") {
  const key = `route.${routeId}`;
  const actionHref = definition.actionEmail
    ? `mailto:${data.contact.email}`
    : definition.actionHref ?? `${data.routes[definition.actionRoute]}${definition.actionHash ?? ""}`;

  const contactActions = routeId === "contact"
    ? `<div class="routeShell__actions"><a class="button--primary routeShell__action" href="mailto:${data.contact.email}?subject=Coaching%20enquiry" data-i18n="route.contact.action">${t("route.contact.action", language)}</a><a class="button--secondary" href="mailto:${data.contact.email}?subject=Question%20for%20Tariq" data-i18n="route.contact.question">${t("route.contact.question", language)}</a></div>`
    : `<a class="button--primary routeShell__action" href="${actionHref}" data-i18n="${key}.action">${t(`${key}.action`, language)}</a>`;

  return {
    route: data.routes[routeId],
    language,
    title: t(`${key}.metaTitle`, language),
    description: t(`${key}.metaDescription`, language),
    titleKey: `${key}.metaTitle`,
    descriptionKey: `${key}.metaDescription`,
    body: `<main><article class="routeShell"><p class="eyebrow">UNLEASH YOUR POWER</p><h1 data-i18n="${key}.heading">${t(`${key}.heading`, language)}</h1><p class="routeShell__purpose" data-i18n="${key}.purpose">${t(`${key}.purpose`, language)}</p>${renderDetail(routeId, definition.detail, data, language)}${contactActions}</article></main>`, 
    scripts: [],
  };
}

function masterKeySystemOnlineCourseRedirect(data, language = "en") {
  const route = data.routes.masterKeySystemOnlineCourse;
  const destination = data.routes.completeJourney;
  const key = "route.masterKeySystemOnlineCourse.redirect";
  return {
    route, language: "en",
    title: t(`${key}.metaTitle`, language),
    description: t(`${key}.metaDescription`, language),
    titleKey: `${key}.metaTitle`, descriptionKey: `${key}.metaDescription`,
    language,
    canonicalUrl: destination, redirectUrl: destination,
    body: `<main id="main-content"><article class="routeShell"><p class="eyebrow">UNLEASH YOUR POWER</p><h1 data-i18n="${key}.heading">${t(`${key}.heading`, language)}</h1><p class="routeShell__purpose" data-i18n="${key}.body">${t(`${key}.body`, language)}</p><a class="button--primary routeShell__action" href="${destination}" data-i18n="${key}.action">${t(`${key}.action`, language)}</a></article></main>`,
    scripts: [],
  };
}

export const routeRenderers = Object.freeze({
  ...Object.fromEntries(
    Object.entries(routeShells).map(([routeId, definition]) => [
      siteData.routes[routeId],
      (data, language = "en") => renderRouteShell(routeId, definition, data, language),
    ]),
  ),
  [siteData.routes.home]: (data, language = "en") => homePage(data, language),
  [siteData.routes.startFree]: (data, language = "en") => startFreePage(data, language),
  [siteData.routes.foundation]: (data, language = "en") => foundationPage(data, language),
  [siteData.routes.completeJourney]: (data, language = "en") => completeJourneyPage(data, language),
  [siteData.routes.coaching]: (data, language = "en") => coachingPage(data, language),
  [siteData.routes.masterKeySystem]: (data, language = "en") => masterKeyCurriculumPage(data, language),
  [siteData.routes.mksLineage]: (data, language = "en") => mksLineagePage(data, language),
  [siteData.routes.helmarRudolph]: (data, language = "en") => helmarRudolphOverviewPage(data, language),
  [siteData.routes.helmarRudolphMasterKeySystem]: (data, language = "en") => helmarRudolphApproachPage(data, language),
  [siteData.routes.helmarRudolphStudyVideos]: (data, language = "en") => helmarRudolphVideosPage(data, language),
  [siteData.routes.resources]: (data, language = "en") => resourcesPage(data, language),
  [siteData.routes.resourcesStudyQuestions]: (data, language = "en") => resourcesStudyQuestionsPage(data, language),
  [siteData.routes.resourcesAudio]: (data, language = "en") => resourcesAudioPage(data, language),
  [siteData.routes.insightsCourse]: (data, language = "en") => insightsCoursePage(data, language),
  [siteData.routes.insights]: (data, language = "en") => insightsIndexPage(data, language),
  [siteData.routes.insightsPrinciples]: (data, language = "en") => insightsPrinciplesPage(data, language),
  [siteData.routes.insightsIntroduction]: (data, language = "en") => insightsIntroductionPage(data, language),
  [siteData.routes.insightsWorldWithin]: (data, language = "en") => insightsWorldWithinPage(data, language),
  [siteData.routes.insightsJourney]: (data, language = "en") => insightsJourneyPage(data, language),
  [siteData.routes.insightsLawAttraction]: (data, language = "en") => insightsLawAttractionPage(data, language),
  [siteData.routes.insightsPeople]: (data, language = "en") => insightsPeoplePage(data, language),
  [siteData.routes.insightsFoundationDevelopment]: (data, language = "en") => insightsFoundationDevelopmentPage(data, language),
  [siteData.routes.insightsFoundationFirstStep]: (data, language = "en") => insightsFoundationFirstStepPage(data, language),
  [siteData.routes.insightsFoundationQA]: (data, language = "en") => insightsFoundationQAPage(data, language),
  [siteData.routes.insightsPersonalCoaching]: (data, language = "en") => insightsPersonalCoachingPage(data, language),
  [siteData.routes.insightsImagineMeditation]: (data, language = "en") => insightsImagineMeditationPage(data, language),
  [siteData.routes.insightsHaanelBiography]: (data, language = "en") => insightsHaanelBiographyPage(data, language),
  [siteData.routes.insightsPowerWithin]: (data, language = "en") => insightsPowerWithinPage(data, language),
  [siteData.routes.insightsHowToStudy]: (data, language = "en") => insightsHowToStudyPage(data, language),
  [siteData.routes.insightsEnergyAttention]: (data, language = "en") => insightsEnergyAttentionPage(data, language),
  [siteData.routes.insightsLifeRebuilt]: (data, language = "en") => insightsLifeRebuiltPage(data, language),
  [siteData.routes.insightsFoundationRestart]: (data, language = "en") => insightsFoundationRestartPage(data, language),
  [siteData.routes.insightsFamiliar]: (data, language = "en") => insightsFamiliarPage(data, language),
  [siteData.routes.insightsNextLevel]: (data, language = "en") => insightsNextLevelPage(data, language),
  [siteData.routes.aiMentors]: (data, language = "en") => aiMentorsPage(data, language),
  [siteData.routes.getTheBook]: (data, language = "en") => getTheBookPage(data, language),
  [siteData.routes.aboutTariq]: (data, language = "en") => aboutTariqPage(data, language),
  [siteData.routes.contact]: (data, language = "en") => contactPage(data, language),
  [siteData.routes.liveCoaching]: (data, language = "en") => sessionHubPage(data, language),
  [siteData.routes.referral]: (data) => referralPage(data),
  [siteData.routes.faq]: (data, language = "en") => faqPage(data, language),
  [siteData.routes.masterKeySystemOnlineCourse]: (data, language = "en") => masterKeySystemOnlineCourseRedirect(data, language),
  [siteData.routes.privacy]: (data, language = "en") => legalPage("privacy", data, language),
  [siteData.routes.terms]: (data, language = "en") => legalPage("terms", data, language),
  [siteData.routes.refundPolicy]: (data, language = "en") => legalPage("refundPolicy", data, language),
  ...Object.fromEntries(
    sevenDayExperience.lessons.map((lesson) => [
      lesson.route,
      (data, language = "en") => sevenDayLessonPage(lesson, data, language),
    ]),
  ),
});
