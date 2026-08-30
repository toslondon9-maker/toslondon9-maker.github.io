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

function renderLineage(language) {
  const people = homeContent.lineageIds.map((person) => (
    `<li class="homeLineage__card">${copy(`home.lineage.${person}.name`, language, "h3")}${copy(`home.lineage.${person}.role`, language, "p", "homeLineage__role")}${copy(`home.lineage.${person}.body`, language)}</li>`
  )).join("");

  return `<section class="homeSection homeLineage" data-home-section="lineage"><div class="homeSection__inner">${copy("home.lineage.eyebrow", language, "p", "eyebrow")}${copy("home.lineage.title", language, "h2")}${copy("home.lineage.intro", language, "p", "homeSection__intro")}<div class="homeLineage__portrait"><img src="${homeContent.originsImage}" width="1080" height="806" loading="eager" alt="${escapeHtml(t("home.origins.alt", language))}" data-i18n-alt="home.origins.alt"></div><ol class="homeLineage__grid">${people}</ol>${copy("home.lineage.disclaimer", language, "p", "homeLineage__disclaimer")}</div></section>`;
}

function renderWhy(language) {
  return `<section class="homeSection homeWhy" data-home-section="why"><div class="homeSection__inner homeWhy__inner">${copy("home.why.eyebrow", language, "p", "eyebrow")}${copy("home.why.title", language, "h2")}${copy("home.why.body", language, "p", "homeSection__intro")}${cta(siteData.routes.masterKeySystem, "home.why.cta", language, "text")}</div></section>`;
}

function renderTaster(language) {
  const days = homeContent.tasterDays.map((day) => (
    `<li><span>${String(day).padStart(2, "0")}</span><span data-i18n="home.taster.day${day}">${escapeHtml(t(`home.taster.day${day}`, language))}</span></li>`
  )).join("");

  return `<section class="homeSection homeTaster section--night" data-home-section="start-free"><div class="homeSection__inner homeTaster__layout"><div class="homeTaster__intro">${copy("home.taster.eyebrow", language, "p", "eyebrow")}${copy("home.taster.title", language, "h2")}${copy("home.taster.intro", language, "p", "homeSection__intro")}<div class="homeTaster__promise"><strong data-i18n="home.taster.promiseTitle">${escapeHtml(t("home.taster.promiseTitle", language))}</strong><span data-i18n="home.taster.promiseBody">${escapeHtml(t("home.taster.promiseBody", language))}</span></div>${cta(siteData.routes.startFree, "home.taster.cta", language)}</div><ol class="homeTaster__days">${days}</ol></div></section>`;
}

function renderOrigins(language) {
  const image = homeContent.originsImage;
  const statementTitle = escapeHtml(t("home.origins.statementTitle", language));
  return `<section class="homeOrigins" data-home-section="origins"><div class="homeOrigins__prelude">${copy("home.origins.eyebrow", language, "p", "eyebrow")}${copy("home.origins.preludeTitle", language, "h2")}${copy("home.origins.preludeBody", language, "p")}</div><div class="homeOrigins__portrait"><img src="${image}" srcset="${image} 1080w" sizes="(max-width: 1200px) 100vw, 1080px" width="1080" height="806" loading="lazy" alt="${escapeHtml(t("home.origins.alt", language))}" data-i18n-alt="home.origins.alt"></div><div class="homeOrigins__statement"><div class="homeOrigins__ornament" aria-hidden="true"><span></span><svg class="homeOrigins__key" viewBox="0 0 64 32" role="presentation"><circle cx="17" cy="16" r="8"></circle><path d="M25 16h28m-8 0v7m-8-7v5"></path></svg><span></span></div><h2 class="homeOrigins__statementTitle" aria-label="${statementTitle}" data-i18n-aria-label="home.origins.statementTitle"><span class="homeOrigins__statementLead" data-i18n="home.origins.statementLead">${escapeHtml(t("home.origins.statementLead", language))}</span><span class="homeOrigins__statementEmphasis" data-i18n="home.origins.statementEmphasis">${escapeHtml(t("home.origins.statementEmphasis", language))}</span></h2>${copy("home.origins.statementBody", language, "p", "homeOrigins__statementBody")}<span class="homeOrigins__statementDivider" aria-hidden="true"></span>${copy("home.origins.disclaimer", language, "p", "homeOrigins__disclaimer")}</div></section>`;
}

function renderCoaching(language) {
  return `<section class="homeSection homeCoaching" data-home-section="coaching"><div class="homeSection__inner homeCoaching__layout"><div class="homeCoaching__visual"><img src="/images/unleash-your-power-programme.jpeg" width="1055" height="1491" loading="lazy" decoding="async" alt="${escapeHtml(t("home.coaching.alt", language))}" data-i18n-alt="home.coaching.alt"></div><div class="homeCoaching__teaser">${copy("home.coaching.eyebrow", language, "p", "eyebrow")}${copy("home.coaching.title", language, "h2")}${copy("home.coaching.intro", language, "p", "homeSection__intro")}<ul class="homeCoaching__benefits"><li data-i18n="home.coaching.benefit1">${escapeHtml(t("home.coaching.benefit1", language))}</li><li data-i18n="home.coaching.benefit2">${escapeHtml(t("home.coaching.benefit2", language))}</li><li data-i18n="home.coaching.benefit3">${escapeHtml(t("home.coaching.benefit3", language))}</li></ul>${cta(siteData.routes.coaching, "home.coaching.cta", language, "secondary")}</div></div></section>`;
}

function renderTestimonials() {
  const cards = homeContent.testimonials.map((testimonial) => (
    `<figure class="homeTestimonials__card"><blockquote>“${escapeHtml(testimonial.quote)}”</blockquote><figcaption><strong>${escapeHtml(testimonial.name)}</strong><span>${escapeHtml(testimonial.location)}</span></figcaption></figure>`
  )).join("");

  return `<section class="homeSection homeTestimonials" data-home-section="testimonials"><div class="homeSection__inner"><p class="eyebrow">GENUINE STUDENT EXPERIENCES</p><h2>What students say about the journey</h2><div class="homeTestimonials__grid">${cards}</div></div></section>`;
}

function renderEducationPhases(language) {
  return homeContent.educationPhases.map((phase) => (
    `<li><strong><span data-i18n="home.masterKey.weeks">${escapeHtml(t("home.masterKey.weeks", language))}</span> ${phase.weeks}</strong>${copy(`home.masterKey.phase.${phase.id}`, language, "span", "homeMasterKey__phaseName")}${copy(`coaching.stage.${phase.outcome}.outcome`, language, "p", "homeMasterKey__phaseDescription")}</li>`
  )).join("");
}

function renderMentors(language) {
  const mentors = homeContent.mentorIds.map((mentor) => (
    `<li class="card">${copy(`home.mentors.${mentor}.name`, language, "h3")}${copy(`home.mentors.${mentor}.role`, language)}</li>`
  )).join("");

  return `<section class="homeSection homeMentors" data-home-section="mentors"><div class="homeSection__inner">${copy("home.mentors.eyebrow", language, "p", "eyebrow")}${copy("home.mentors.title", language, "h2")}${copy("home.mentors.intro", language, "p", "homeSection__intro")}<ul class="homeMentors__grid">${mentors}</ul>${copy("home.mentors.disclosure", language, "p", "homeMentors__disclosure")}${cta(siteData.routes.aiMentors, "home.mentors.cta", language, "text")}</div></section>`;
}

export function renderHome({ language = "en" } = {}) {
  const heroImage = homeContent.heroImage;
  return `<main class="home"><section class="homeHero" data-home-section="hero"><div class="homeHero__copy">${copy("home.hero.eyebrow", language, "p", "eyebrow")}${copy("route.home.heading", language, "h1")}${copy("route.home.purpose", language, "h2", "homeHero__subheading")}${copy("home.hero.change", language, "p", "homeHero__change")}<ul class="homeHero__proof" aria-label="${escapeHtml(t("home.hero.proofLabel", language))}" data-i18n-aria-label="home.hero.proofLabel"><li><strong>7</strong>${copy("home.hero.proofFree", language, "span")}</li><li><strong>24</strong>${copy("home.hero.proofWeeks", language, "span")}</li><li><strong>3</strong>${copy("home.hero.proofPerspectives", language, "span")}</li></ul><div class="homeActions">${cta(siteData.routes.startFree, "route.home.action", language, "primary", "routeShell__action")}${cta(siteData.routes.masterKeySystem, "home.cta.exploreJourney", language, "secondary")}</div>${copy("home.hero.microcopy", language, "p", "homeHero__microcopy")}</div><div class="homeHero__visual"><picture><source srcset="/images/tariq-happiness-harmony-720.webp" type="image/webp"><img src="${heroImage}" width="1088" height="1445" fetchpriority="high" decoding="async" alt="${escapeHtml(t("home.hero.alt", language))}" data-i18n-alt="home.hero.alt"></picture><div class="homeHero__caption"><span data-i18n="home.hero.guideLabel">${escapeHtml(t("home.hero.guideLabel", language))}</span><strong>Tariq Saddique</strong><small data-i18n="home.hero.guideLine">${escapeHtml(t("home.hero.guideLine", language))}</small></div></div></section>${renderLineage(language)}${renderTaster(language)}<section class="homeSection homeMasterKey" data-home-section="master-key"><div class="homeSection__inner homeMasterKey__inner">${copy("home.masterKey.eyebrow", language, "p", "eyebrow")}${copy("home.masterKey.title", language, "h2")}${copy("home.masterKey.body", language, "p", "homeSection__intro")}<ol class="homeMasterKey__phases">${renderEducationPhases(language)}</ol>${copy("home.masterKey.progressive", language, "p", "homeMasterKey__progressive")}${cta(siteData.routes.masterKeySystem, "home.masterKey.cta", language, "text")}</div></section>${renderTestimonials()}${renderCoaching(language)}<section class="homeSection homeNext section--night" data-home-section="next-step"><div class="homeSection__inner homeNext__inner"><div>${copy("home.next.eyebrow", language, "p", "eyebrow")}${copy("home.next.title", language, "h2")}${copy("home.next.body", language, "p", "homeSection__intro")}</div><div class="homeNext__actionPanel"><strong data-i18n="home.next.actionTitle">${escapeHtml(t("home.next.actionTitle", language))}</strong><span data-i18n="home.next.actionBody">${escapeHtml(t("home.next.actionBody", language))}</span><div class="homeActions">${cta(siteData.routes.startFree, "home.cta.startFree", language)}${cta(siteData.routes.contact, "home.cta.book", language, "secondary")}</div></div></div></section></main>`;
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
