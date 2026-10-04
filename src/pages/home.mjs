import { homeContent } from "../../content/pages/home.mjs";
import { siteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";
import { bookingCallHref } from "../whatsapp.mjs";
import { renderInsightsPreview } from "../insights.mjs";
import { renderCompactFoundationOffer } from "../conversion-components.mjs";
import { priceCopy, pricingNoteCopy } from "../pricing.mjs";

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function copy(key, language, tag = "p", className = "") {
  const classAttribute = className ? ` class="${className}"` : "";
  return `<${tag}${classAttribute} data-i18n="${key}">${escapeHtml(t(key, language))}</${tag}>`;
}

function cta(route, key, language, variant = "primary", extraClass = "") {
  const className = [`button--${variant}`, extraClass].filter(Boolean).join(" ");
  return `<a class="${className}" href="${escapeHtml(route)}" data-i18n="${key}">${escapeHtml(t(key, language))}</a>`;
}

function bookingCta(language) {
  return `<a class="button--secondary" href="${bookingCallHref(siteData.contact.whatsapp)}" target="_blank" rel="noopener noreferrer" data-i18n="home.cta.whatsappQuestion">${escapeHtml(t("home.cta.whatsappQuestion", language))}</a>`;
}

function renderHero(language) {
  return `<section class="homeHero" data-home-section="hero"><div class="homeHero__copy">${copy("home.hero.eyebrow", language, "p", "eyebrow")}${copy("route.home.heading", language, "h1")}${copy("route.home.purpose", language, "h2", "homeHero__subheading")}${copy("home.hero.change", language, "p", "homeHero__change")}<ul class="homeHero__proof" aria-label="${escapeHtml(t("home.hero.proofLabel", language))}" data-i18n-aria-label="home.hero.proofLabel"><li><strong>7</strong>${copy("home.hero.proofFree", language, "span")}</li><li><strong>24</strong>${copy("home.hero.proofWeeks", language, "span")}</li><li><strong>3</strong>${copy("home.hero.proofPerspectives", language, "span")}</li></ul><div class="homeActions">${cta(siteData.routes.startFree, "route.home.action", language, "primary", "routeShell__action")}${cta(siteData.routes.masterKeySystem, "home.cta.exploreJourney", language, "secondary")}</div>${copy("home.hero.microcopy", language, "p", "homeHero__microcopy")}</div><div class="homeHero__visual"><picture><source srcset="/images/tariq-happiness-harmony-720.webp" type="image/webp"><img src="${homeContent.heroImage}" width="1088" height="1445" fetchpriority="high" decoding="async" alt="${escapeHtml(t("home.hero.alt", language))}" data-i18n-alt="home.hero.alt"></picture><div class="homeHero__caption"><span data-i18n="home.hero.guideLabel">${escapeHtml(t("home.hero.guideLabel", language))}</span><strong>Tariq Saddique</strong><small data-i18n="home.hero.guideLine">${escapeHtml(t("home.hero.guideLine", language))}</small></div></div></section>`;
}

function renderWelcome(language) {
  return `<section class="homeVideo homeWelcome" data-home-section="welcome" aria-labelledby="home-video-title"><div class="homeVideo__copy">${copy("home.video.eyebrow", language, "p", "eyebrow")}${copy("home.video.title", language, "h2")}${copy("home.video.body", language, "p", "homeVideo__body")}</div><div class="homeWelcome__visual"><div class="homeWelcome__imagePair"><img class="homeWelcome__secretLogo" src="/images/secret-mark-transparent.png" width="122" height="139" loading="lazy" decoding="async" alt="The Secret logo"><div class="homeVideo__portrait homeWelcome__portrait"><img src="${homeContent.welcomeImage}" width="358" height="418" loading="lazy" decoding="async" alt="${escapeHtml(t("home.origins.alt", language))}" data-i18n-alt="home.origins.alt"></div></div><div class="homeWelcome__panel"><strong data-i18n="home.video.panelLabel">A welcome from Tariq</strong>${copy("home.video.panelBody", language, "p")}</div></div></section>`;
}

function renderFreeExperience(language) {
  const days = homeContent.tasterDays.map((day) => `<li><span aria-hidden="true">${String(day).padStart(2, "0")}</span><span data-i18n="home.taster.day${day}">${escapeHtml(t(`home.taster.day${day}`, language))}</span></li>`).join("");
  const facts = ["time", "workbook", "online", "ai", "noPurchase"].map((key) => `<li data-i18n="home.free.${key}">${escapeHtml(t(`home.free.${key}`, language))}</li>`).join("");
  return `<section class="homeSection homeFreeExperience section--night" data-home-section="free-experience"><div class="homeSection__inner homeFreeExperience__layout"><div class="homeFreeExperience__copy">${copy("home.free.eyebrow", language, "p", "eyebrow")}${copy("home.free.title", language, "h2")}${copy("home.free.intro", language, "p", "homeSection__intro")}<ul class="homeFreeExperience__facts">${facts}</ul>${cta(siteData.routes.startFree, "home.free.cta", language, "primary")}</div><div class="homeFreeExperience__progress"><h3 data-i18n="home.taster.title">${escapeHtml(t("home.taster.title", language))}</h3><ol class="homeFreeExperience__days">${days}</ol><p class="homeFreeExperience__note" data-i18n="home.taster.promiseTitle">${escapeHtml(t("home.taster.promiseTitle", language))}</p></div></div></section>`;
}

function renderTradition(language) {
  const haanelReferences = `<details class="homeLineage__links"><summary data-i18n="home.lineage.haanel.linksTrigger">${escapeHtml(t("home.lineage.haanel.linksTrigger", language))}</summary><ul><li><a href="${siteData.routes.insightsHaanelBiography}" data-i18n="home.lineage.haanel.linkArticle">${escapeHtml(t("home.lineage.haanel.linkArticle", language))}</a></li><li><a href="${siteData.routes.masterKeySystem}" data-i18n="home.lineage.haanel.linkSystem">${escapeHtml(t("home.lineage.haanel.linkSystem", language))}</a></li><li><a href="https://en.wikipedia.org/wiki/Charles_F._Haanel" target="_blank" rel="noopener noreferrer" data-i18n="home.lineage.haanel.linkWikipediaPerson">${escapeHtml(t("home.lineage.haanel.linkWikipediaPerson", language))}</a></li><li><a href="https://en.wikipedia.org/wiki/The_Master_Key_System" target="_blank" rel="noopener noreferrer" data-i18n="home.lineage.haanel.linkWikipediaSystem">${escapeHtml(t("home.lineage.haanel.linkWikipediaSystem", language))}</a></li></ul></details>`;
  const helmarReferences = `<details class="homeLineage__links"><summary data-i18n="home.lineage.helmar.linksTrigger">${escapeHtml(t("home.lineage.helmar.linksTrigger", language))}</summary><ul><li><a href="https://en.mrmasterkey.com/helmar-rudolph/" target="_blank" rel="noopener noreferrer" data-i18n="home.lineage.helmar.linkWho">${escapeHtml(t("home.lineage.helmar.linkWho", language))}</a></li><li><a href="https://en.mrmasterkey.com/master-key-system/" target="_blank" rel="noopener noreferrer" data-i18n="home.lineage.helmar.linkApproach">${escapeHtml(t("home.lineage.helmar.linkApproach", language))}</a></li><li><a href="https://www.amazon.es/Master-Key-System-Centenary-Higher/dp/1456336045" target="_blank" rel="noopener noreferrer" data-i18n="home.lineage.helmar.linkBook">${escapeHtml(t("home.lineage.helmar.linkBook", language))}</a></li><li><a href="${siteData.routes.masterKeySystem}" data-i18n="home.lineage.helmar.linkReturn">${escapeHtml(t("home.lineage.helmar.linkReturn", language))}</a></li></ul></details>`;
  const people = homeContent.lineageIds.map((person) => `<li class="homeLineage__card">${copy(`home.lineage.${person}.name`, language, "h3")}${person === "haanel" ? haanelReferences : ""}${person === "helmar" ? helmarReferences : ""}${copy(`home.lineage.${person}.role`, language, "p", "homeLineage__role")}${copy(`home.lineage.${person}.body`, language)}</li>`).join("");
  const books = homeContent.books.slice(0, 4).map((book) => `<li><h3 data-i18n="${book.titleKey}">${escapeHtml(t(book.titleKey, language))}</h3><p data-i18n="${book.authorKey}">${escapeHtml(t(book.authorKey, language))}</p></li>`).join("");
  const links = `<p class="homeTradition__links"><a href="${siteData.routes.mksLineage}" data-i18n="home.tradition.lineageLink">${escapeHtml(t("home.tradition.lineageLink", language))}</a> · <a href="${siteData.routes.getTheBook}" data-i18n="home.tradition.booksLink">${escapeHtml(t("home.tradition.booksLink", language))}</a> · <a href="${siteData.routes.resources}" data-i18n="home.tradition.resourcesLink">${escapeHtml(t("home.tradition.resourcesLink", language))}</a> · <a href="${siteData.routes.masterKeySystem}" data-i18n="home.tradition.methodLink">${escapeHtml(t("home.tradition.methodLink", language))}</a> · <a href="${siteData.routes.masterKeySystemOnlineCourse}" data-i18n="home.tradition.courseLink">${escapeHtml(t("home.tradition.courseLink", language))}</a></p>`;
  return `<section class="homeSection homeTradition" data-home-section="tradition"><div class="homeSection__inner">${copy("home.tradition.eyebrow", language, "p", "eyebrow")}${copy("home.tradition.title", language, "h2")}${copy("home.tradition.intro", language, "p", "homeSection__intro")}<ol class="homeLineage__grid">${people}</ol>${copy("home.lineage.disclaimer", language, "p", "homeLineage__disclaimer")}<div class="homeTradition__ideas">${copy("home.ideas.title", language, "h3")}${copy("home.ideas.body", language, "p")}</div><ul class="homeIdeas__books">${books}</ul>${copy("home.ideas.disclaimer", language, "p", "homeIdeas__disclaimer")}${links}</div></section>`;
}

function renderJourney(language) {
  const stages = homeContent.educationPhases.map((phase) => `<li><strong><span data-i18n="home.masterKey.weeks">${escapeHtml(t("home.masterKey.weeks", language))}</span> ${phase.weeks}</strong>${copy(`home.masterKey.phase.${phase.id}`, language, "h3")}${copy(`coaching.stage.${phase.outcome}.outcome`, language, "p")}</li>`).join("");
  return `<section class="homeSection homeJourney" data-home-section="journey"><div class="homeSection__inner">${copy("home.journey.newEyebrow", language, "p", "eyebrow")}${copy("home.journey.newTitle", language, "h2")}${copy("home.journey.newIntro", language, "p", "homeSection__intro")}<p class="homeJourney__model" data-i18n="home.journey.model">${escapeHtml(t("home.journey.model", language))}</p><ol class="homeJourney__stages">${stages}</ol>${cta(siteData.routes.masterKeySystem, "home.masterKey.cta", language, "secondary")}</div></section>`;
}

function renderReceive(language) {
  const items = [1, 2, 3, 4, 5, 6].map((index) => `<li><strong data-i18n="home.receive.item${index}Title">${escapeHtml(t(`home.receive.item${index}Title`, language))}</strong><span data-i18n="home.receive.item${index}Body">${escapeHtml(t(`home.receive.item${index}Body`, language))}</span></li>`).join("");
  return `<section class="homeSection homeReceive" data-home-section="receive"><div class="homeSection__inner">${copy("home.receive.eyebrow", language, "p", "eyebrow")}${copy("home.receive.title", language, "h2")}${copy("home.receive.intro", language, "p", "homeSection__intro")}<ul class="homeReceive__grid">${items}</ul></div></section>`;
}

function renderWhyTariq(language) {
  const paragraph = (key) => t(key, language) ? copy(key, language, "p", "homeWhyTariq__paragraph") : "";
  const visibleKeys = language === "en" ? ["home.whyTariq.body.intro", "home.whyTariq.body.context"] : ["home.whyTariq.body.intro"];
  const hiddenKeys = language === "en" ? ["home.whyTariq.body.framework", "home.whyTariq.body.application"] : ["home.whyTariq.body.framework"];
  const visible = visibleKeys.map(paragraph).join("");
  const hidden = hiddenKeys.map(paragraph).join("");
  return `<section class="homeSection homeWhyTariq" data-home-section="why-tariq"><div class="homeSection__inner homeWhyTariq__inner"><div>${copy("home.whyTariq.eyebrow", language, "p", "eyebrow")}${copy("home.whyTariq.title", language, "h2")}</div><div class="homeWhyTariq__copy">${visible}<details class="homeWhyTariq__details"><summary><span class="homeWhyTariq__readMore" data-i18n="home.whyTariq.readMore">${escapeHtml(t("home.whyTariq.readMore", language))}</span><span class="homeWhyTariq__readLess" data-i18n="home.whyTariq.readLess">${escapeHtml(t("home.whyTariq.readLess", language))}</span></summary>${hidden}</details><a class="button--text" href="${siteData.routes.aboutTariq}" data-i18n="home.whyTariq.cta">${escapeHtml(t("home.whyTariq.cta", language))}</a></div></div></section>`;
}

function renderTestimonials(language) {
  const cards = homeContent.testimonials.map((testimonial, index) => {
    const paragraphs = testimonial.quoteParagraphs ?? [testimonial.quote];
    const firstParagraph = `<p class="homeTestimonials__quoteParagraph">${escapeHtml(paragraphs[0])}</p>`;
    const remainingParagraphs = paragraphs.slice(1).map((paragraph) => `<p class="homeTestimonials__quoteParagraph">${escapeHtml(paragraph)}</p>`).join("");
    const detailsId = `home-testimonial-${index + 1}-more`;
    const contentId = `home-testimonial-${index + 1}-content`;
    const more = `<details class="homeTestimonials__more" id="${detailsId}"><summary aria-controls="${contentId}" aria-expanded="false"><span class="homeTestimonials__readMore" data-i18n="home.testimonials.readMore">${escapeHtml(t("home.testimonials.readMore", language))}</span><span class="homeTestimonials__readLess" data-i18n="home.testimonials.readLess">${escapeHtml(t("home.testimonials.readLess", language))}</span></summary><div id="${contentId}" class="homeTestimonials__moreContent">${remainingParagraphs}</div></details>`;
    const disclosure = testimonial.disclosure ? `<p class="homeTestimonials__disclosure">${escapeHtml(testimonial.disclosure)}</p>` : "";
    return `<figure class="homeTestimonials__card"><blockquote>${firstParagraph}${more}</blockquote>${disclosure}<figcaption><strong>${escapeHtml(testimonial.name)}</strong><span>${escapeHtml(testimonial.location)}</span></figcaption></figure>`;
  }).join("");
  return `<section class="homeSection homeTestimonials" data-home-section="testimonials"><div class="homeSection__inner"><p class="eyebrow">GENUINE STUDENT EXPERIENCES</p><h2>What students say about the journey</h2><div class="homeTestimonials__grid">${cards}</div></div></section>`;
}

function renderOffers(language) {
  const card = (className, titleKey, bodyKey, ctaKey, href, price = "") => `<article class="homeOffers__card ${className}"><h3 data-i18n="${titleKey}">${escapeHtml(t(titleKey, language))}</h3>${price ? `<strong class="homeOffers__price">${price}</strong>` : ""}<p data-i18n="${bodyKey}">${escapeHtml(t(bodyKey, language))}</p><a class="button--${className === "homeOffers__card--free" ? "primary" : "secondary"}" href="${href}" data-i18n="${ctaKey}">${escapeHtml(t(ctaKey, language))}</a></article>`;
  return `<section class="homeSection homeOffers" data-home-section="offers"><div class="homeSection__inner">${copy("home.offers.eyebrow", language, "p", "eyebrow")}${copy("home.offers.title", language, "h2")}${copy("home.offers.intro", language, "p", "homeSection__intro")}<div class="homeOffers__grid">${card("homeOffers__card--free", "home.offers.freeTitle", "home.offers.freeBody", "home.offers.freeCta", siteData.routes.startFree)}<article class="homeOffers__card homeOffers__card--foundation">${renderCompactFoundationOffer({ language, data: siteData, ctaKey: "home.offers.foundationCta" })}</article>${card("homeOffers__card--complete", "home.offers.completeTitle", "home.offers.completeBody", "home.offers.completeCta", siteData.routes.coaching, priceCopy("complete", language))}</div>${copy("home.offers.more", language, "p", "homeOffers__more")}${pricingNoteCopy(language)}</div></section>`;
}

function renderFinalCta(language) {
  return `<section class="homeSection homeFinalCta section--night" data-home-section="final-cta"><div class="homeSection__inner homeFinalCta__inner">${copy("home.final.eyebrow", language, "p", "eyebrow")}${copy("home.final.title", language, "h2")}${copy("home.final.body", language, "p", "homeSection__intro")}<div class="homeActions">${cta(siteData.routes.startFree, "home.final.start", language)}${bookingCta(language)}${cta(siteData.routes.masterKeySystem, "home.final.method", language, "secondary")}</div></div></section>`;
}

function renderHomeBody({ language = "en" } = {}) {
  return `<main class="home">${renderHero(language)}${renderWelcome(language)}${renderFreeExperience(language)}${renderTradition(language)}${renderJourney(language)}${renderOffers(language)}${renderReceive(language)}${renderWhyTariq(language)}${renderTestimonials(language)}${renderInsightsPreview({ language, data: siteData, compact: true })}${renderFinalCta(language)}</main>`;
}

export function renderHome({ language = "en" } = {}) {
  return renderHomeBody({ language });
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
    scripts: ["/assets/home-testimonials.mjs"],
  };
}
