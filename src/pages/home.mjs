import { homeContent } from "../../content/pages/home.mjs";
import { siteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function copy(key, language, tag = "p", className = "") {
  const classAttribute = className ? ` class="${className}"` : "";
  return `<${tag}${classAttribute} data-i18n="${key}">${escapeHtml(t(key, language))}</${tag}>`;
}

function cta(route, key, language, variant = "primary", extraClass = "") {
  const className = [`button--${variant}`, extraClass].filter(Boolean).join(" ");
  return `<a class="${className}" href="${escapeHtml(route)}" data-i18n="${key}">${escapeHtml(t(key, language))}</a>`;
}

function renderJourney(language) {
  const items = homeContent.journeySteps.map((step, index) => (
    `<li class="homeJourney__step"><span aria-hidden="true">0${index + 1}</span>${copy(`home.journey.${step}.title`, language, "h3")}${copy(`home.journey.${step}.body`, language)}</li>`
  )).join("");

  return `<section class="homeSection homeJourney" data-home-section="journey"><div class="homeSection__inner">${copy("home.journey.eyebrow", language, "p", "eyebrow")}${copy("home.journey.title", language, "h2")}${copy("home.journey.intro", language, "p", "homeSection__intro")}<ol class="homeJourney__list">${items}</ol></div></section>`;
}

function renderTaster(language) {
  const days = homeContent.tasterDays.map((day) => (
    `<li><span>${day}</span><span data-i18n="home.taster.day${day}">${escapeHtml(t(`home.taster.day${day}`, language))}</span></li>`
  )).join("");

  return `<section class="homeSection homeTaster section--night" data-home-section="start-free"><div class="homeSection__inner">${copy("home.taster.eyebrow", language, "p", "eyebrow")}${copy("home.taster.title", language, "h2")}${copy("home.taster.intro", language, "p", "homeSection__intro")}<ol class="homeTaster__days">${days}</ol>${cta(siteData.routes.startFree, "home.cta.startFree", language)}</div></section>`;
}

function renderOrigins(language) {
  const image = homeContent.originsImage;
  return `<section class="homeOrigins" data-home-section="origins"><div class="homeOrigins__prelude">${copy("home.origins.eyebrow", language, "p", "eyebrow")}${copy("home.origins.preludeTitle", language, "h2")}${copy("home.origins.preludeBody", language, "p")}</div><div class="homeOrigins__portrait"><img src="${image}" srcset="${image} 1080w" sizes="(max-width: 1200px) 100vw, 1080px" width="1080" height="806" loading="lazy" alt="${escapeHtml(t("home.origins.alt", language))}" data-i18n-alt="home.origins.alt"></div><div class="homeOrigins__statement">${copy("home.origins.statementTitle", language, "h2")}${copy("home.origins.statementBody", language, "p")}${copy("home.origins.disclaimer", language, "p", "homeOrigins__disclaimer")}</div></section>`;
}

function renderCoaching(language) {
  const stages = siteData.stages.map((stage) => (
    `<li><span data-i18n="home.coaching.${stage.id}">${escapeHtml(t(`home.coaching.${stage.id}`, language))}</span><strong><span data-i18n="home.coaching.weeks">${escapeHtml(t("home.coaching.weeks", language))}</span> ${stage.weeks}</strong></li>`
  )).join("");

  return `<section class="homeSection homeCoaching" data-home-section="coaching"><div class="homeSection__inner">${copy("home.coaching.eyebrow", language, "p", "eyebrow")}${copy("home.coaching.title", language, "h2")}<div class="homeCoaching__layout"><div>${copy("home.coaching.intro", language, "p", "homeSection__intro")}<p class="homeCoaching__price"><span data-i18n="home.coaching.complete">${escapeHtml(t("home.coaching.complete", language))}</span> <strong>£${siteData.offer.completePrice}</strong></p>${cta(siteData.routes.coaching, "home.coaching.cta", language, "secondary")}</div><ul>${stages}</ul></div></div></section>`;
}

function renderMentors(language) {
  const mentors = homeContent.mentorIds.map((mentor) => (
    `<li class="card">${copy(`home.mentors.${mentor}.name`, language, "h3")}${copy(`home.mentors.${mentor}.role`, language)}</li>`
  )).join("");

  return `<section class="homeSection homeMentors" data-home-section="mentors"><div class="homeSection__inner">${copy("home.mentors.eyebrow", language, "p", "eyebrow")}${copy("home.mentors.title", language, "h2")}${copy("home.mentors.intro", language, "p", "homeSection__intro")}<ul class="homeMentors__grid">${mentors}</ul>${copy("home.mentors.disclosure", language, "p", "homeMentors__disclosure")}${cta(siteData.routes.aiMentors, "home.mentors.cta", language, "text")}</div></section>`;
}

export function renderHome({ language = "en" } = {}) {
  const heroImage = homeContent.heroImage;
  return `<main class="home"><section class="homeHero" data-home-section="hero"><div class="homeHero__copy">${copy("home.hero.eyebrow", language, "p", "eyebrow")}${copy("route.home.heading", language, "h1")}${copy("route.home.purpose", language, "p", "routeShell__purpose")}${copy("home.hero.change", language, "p", "homeHero__change")}<div class="homeActions">${cta(siteData.routes.startFree, "route.home.action", language, "primary", "routeShell__action")}${cta(siteData.routes.masterKeySystem, "home.cta.exploreJourney", language, "secondary")}</div></div><div class="homeHero__visual"><img src="${heroImage}" width="1088" height="1445" alt="${escapeHtml(t("home.hero.alt", language))}" data-i18n-alt="home.hero.alt"></div></section>${renderJourney(language)}${renderTaster(language)}<section class="homeSection homeMasterKey" data-home-section="master-key"><div class="homeSection__inner homeMasterKey__inner">${copy("home.masterKey.eyebrow", language, "p", "eyebrow")}${copy("home.masterKey.title", language, "h2")}${copy("home.masterKey.body", language, "p", "homeSection__intro")}${copy("home.masterKey.progressive", language, "p", "homeMasterKey__progressive")}${cta(siteData.routes.masterKeySystem, "home.masterKey.cta", language, "text")}</div></section>${renderOrigins(language)}${renderCoaching(language)}${renderMentors(language)}<section class="homeSection homeNext section--night" data-home-section="next-step"><div class="homeSection__inner">${copy("home.next.eyebrow", language, "p", "eyebrow")}${copy("home.next.title", language, "h2")}${copy("home.next.body", language, "p", "homeSection__intro")}<div class="homeActions">${cta(siteData.routes.startFree, "home.cta.startFree", language)}${cta(siteData.routes.contact, "home.cta.book", language, "secondary")}</div></div></section></main>`;
}

export function homePage(data = siteData, language = "en") {
  return {
    route: data.routes.home,
    language,
    title: t("route.home.metaTitle", language),
    description: t("route.home.metaDescription", language),
    titleKey: "route.home.metaTitle",
    descriptionKey: "route.home.metaDescription",
    body: renderHome({ language }),
    scripts: [],
  };
}
