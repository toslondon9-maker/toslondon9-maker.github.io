import { homeContent } from "../../content/pages/home.mjs";
import { siteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";
import { whatsappQuestionHref } from "../whatsapp.mjs";
import { renderInsightsPreview } from "../insights.mjs";
import { calendlyUrl, renderCompactFoundationOffer } from "../conversion-components.mjs";
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
  return `<a class="button--secondary" href="${whatsappQuestionHref(siteData.contact.whatsapp)}" target="_blank" rel="noopener noreferrer" data-i18n="home.cta.whatsappQuestion">${escapeHtml(t("home.cta.whatsappQuestion", language))}</a>`;
}

function renderLifePowerAccordion(language) {
  const paragraphs = [1, 2, 3, 4, 5].map((index) => `<p data-i18n="foundation.lifePower.paragraph${index}">${escapeHtml(t(`foundation.lifePower.paragraph${index}`, language))}</p>`).join("");
  return `<div class="homeTradition__lifePower" aria-labelledby="home-life-power-heading"><details class="homeTradition__lifePowerDetails"><summary id="home-life-power-heading" aria-controls="home-life-power-article" aria-expanded="false"><span class="homeTradition__lifePowerHeading" data-i18n="foundation.lifePower.heading">${escapeHtml(t("foundation.lifePower.heading", language))}</span><span class="homeTradition__lifePowerTeaser" data-i18n="foundation.lifePower.teaser">${escapeHtml(t("foundation.lifePower.teaser", language))}</span><span class="homeTradition__lifePowerToggle" data-i18n="foundation.lifePower.toggle">${escapeHtml(t("foundation.lifePower.toggle", language))}</span></summary><div id="home-life-power-article" class="homeTradition__lifePowerArticle"><h3 data-i18n="foundation.lifePower.articleTitle">${escapeHtml(t("foundation.lifePower.articleTitle", language))}</h3>${paragraphs}</div></details></div>`;
}

function renderHero(language) {
  return `<section class="homeHero" data-home-section="hero"><div class="homeHero__mobile"><div class="homeHero__mobileLanguage"><div class="languageSwitch languageSwitch--hero" role="group" aria-label="${escapeHtml(t("language.label", language))}" data-i18n-aria-label="language.label"><button type="button" data-language="en" aria-pressed="${language === "en"}">EN</button><span aria-hidden="true">|</span><button type="button" data-language="es" aria-pressed="${language === "es"}">ES</button></div></div></div><div class="homeHero__artwork"><img src="${homeContent.heroImage}" width="1536" height="1024" fetchpriority="high" decoding="async" alt="Tariq Saddique presenting the 24-week Unleash Your Power Master Key System coaching journey" data-i18n-alt="home.hero.artworkAlt"></div><div class="homeHero__mobileArtworkAction">${cta(siteData.routes.startFree, "route.home.action", language, "primary", "routeShell__action")}</div><div class="homeHero__copy">${copy("home.hero.eyebrow", language, "p", "eyebrow")}${copy("route.home.heading", language, "h1")}${copy("route.home.purpose", language, "h2", "homeHero__subheading")}${copy("home.hero.change", language, "p", "homeHero__change")}<div class="homeActions homeHero__actions">${cta(siteData.routes.startFree, "route.home.action", language, "primary", "routeShell__action")}${cta(siteData.routes.masterKeySystem, "home.cta.exploreJourney", language, "secondary")}</div><ul class="homeHero__proof" aria-label="${escapeHtml(t("home.hero.proofLabel", language))}" data-i18n-aria-label="home.hero.proofLabel"><li><strong>7</strong>${copy("home.hero.proofFree", language, "span")}</li><li><strong>24</strong>${copy("home.hero.proofWeeks", language, "span")}</li><li><strong>3</strong>${copy("home.hero.proofPerspectives", language, "span")}</li></ul>${copy("home.hero.microcopy", language, "p", "homeHero__microcopy")}</div></section>`;
}

function renderPainPoints(language) {
  const featuredPainPoints = [2, 11, 1, 4, 6];
  const cards = featuredPainPoints.map((number) => {
    const key = `home.pains.${number}`;
    const titleKey = `${key}.title`;
    const impactKey = `${key}.impact`;
    const practiceKey = `${key}.practice`;
    return `<article class="homePainPoints__card"><span class="homePainPoints__number" aria-hidden="true">${String(number).padStart(2, "0")}</span><h3 data-i18n="${titleKey}">${escapeHtml(t(titleKey, language))}</h3><p><strong data-i18n="home.pains.impactLabel">${escapeHtml(t("home.pains.impactLabel", language))}</strong><span data-i18n="${impactKey}">${escapeHtml(t(impactKey, language))}</span></p><p class="homePainPoints__practice"><strong data-i18n="home.pains.practiceLabel">${escapeHtml(t("home.pains.practiceLabel", language))}</strong><span data-i18n="${practiceKey}">${escapeHtml(t(practiceKey, language))}</span></p></article>`;
  }).join("");
  return `<section class="homePainPoints" data-home-section="pain-points"><div class="homeSection__inner"><p class="eyebrow" data-i18n="home.pains.eyebrow">${escapeHtml(t("home.pains.eyebrow", language))}</p><h2 data-i18n="home.pains.title">${escapeHtml(t("home.pains.title", language))}</h2><p class="homeSection__intro" data-i18n="home.pains.intro">${escapeHtml(t("home.pains.intro", language))}</p><div class="homePainPoints__grid">${cards}</div><div class="homePainPoints__cta"><p data-i18n="home.pains.close">${escapeHtml(t("home.pains.close", language))}</p><a class="button--primary" href="${escapeHtml(siteData.routes.startFree)}" data-i18n="home.pains.cta">${escapeHtml(t("home.pains.cta", language))}</a><small data-i18n="home.pains.note">${escapeHtml(t("home.pains.note", language))}</small></div></div></section>`;
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
  const links = `<p class="homeTradition__links"><a href="${siteData.routes.foundation}" data-i18n="home.tradition.foundationLink">${escapeHtml(t("home.tradition.foundationLink", language))}</a> · <a href="${siteData.routes.mksLineage}" data-i18n="home.tradition.lineageLink">${escapeHtml(t("home.tradition.lineageLink", language))}</a> · <a href="${siteData.routes.getTheBook}" data-i18n="home.tradition.booksLink">${escapeHtml(t("home.tradition.booksLink", language))}</a> · <a href="${siteData.routes.resources}" data-i18n="home.tradition.resourcesLink">${escapeHtml(t("home.tradition.resourcesLink", language))}</a> · <a href="${siteData.routes.masterKeySystem}" data-i18n="home.tradition.methodLink">${escapeHtml(t("home.tradition.methodLink", language))}</a> · <a href="${siteData.routes.masterKeySystemOnlineCourse}" data-i18n="home.tradition.courseLink">${escapeHtml(t("home.tradition.courseLink", language))}</a></p>`;
  return `<section class="homeSection homeTradition" data-home-section="tradition"><div class="homeSection__inner">${copy("home.tradition.eyebrow", language, "p", "eyebrow")}${copy("home.tradition.title", language, "h2")}${copy("home.tradition.intro", language, "p", "homeSection__intro")}<ol class="homeLineage__grid">${people}</ol>${copy("home.lineage.disclaimer", language, "p", "homeLineage__disclaimer")}<div class="homeTradition__ideas">${copy("home.ideas.title", language, "h3")}${copy("home.ideas.body", language, "p")}</div><ul class="homeIdeas__books">${books}</ul>${copy("home.ideas.disclaimer", language, "p", "homeIdeas__disclaimer")}${renderLifePowerAccordion(language)}${links}</div></section>`;
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
  return `<section class="homeSection homeTestimonials" data-home-section="testimonials"><div class="homeSection__inner">${copy("home.testimonials.eyebrow", language, "p", "eyebrow")}${copy("home.testimonials.title", language, "h2")}<div class="homeTestimonials__grid">${cards}</div></div></section>`;
}

function renderOffers(language) {
  const card = (className, titleKey, bodyKey, ctaKey, href, price = "") => `<article class="homeOffers__card ${className}"><h3 data-i18n="${titleKey}">${escapeHtml(t(titleKey, language))}</h3>${price ? `<strong class="homeOffers__price">${price}</strong>` : ""}<p data-i18n="${bodyKey}">${escapeHtml(t(bodyKey, language))}</p><a class="button--${className === "homeOffers__card--free" ? "primary" : "secondary"}" href="${href}" data-i18n="${ctaKey}">${escapeHtml(t(ctaKey, language))}</a></article>`;
  return `<section class="homeSection homeOffers" data-home-section="offers"><div class="homeSection__inner">${copy("home.offers.eyebrow", language, "p", "eyebrow")}${copy("home.offers.title", language, "h2")}${copy("home.offers.intro", language, "p", "homeSection__intro")}<div class="homeOffers__grid">${card("homeOffers__card--free", "home.offers.freeTitle", "home.offers.freeBody", "home.offers.freeCta", siteData.routes.startFree)}<article class="homeOffers__card homeOffers__card--foundation">${renderCompactFoundationOffer({ language, data: siteData, ctaKey: "home.offers.foundationCta" })}</article>${card("homeOffers__card--complete", "home.offers.completeTitle", "home.offers.completeBody", "home.offers.completeCta", siteData.routes.completeJourney, priceCopy("complete", language))}</div>${copy("home.offers.more", language, "p", "homeOffers__more")}${pricingNoteCopy(language)}</div></section>`;
}

function renderFinalCta(language) {
  return `<section class="homeSection homeFinalCta section--night" data-home-section="final-cta"><div class="homeSection__inner homeFinalCta__inner">${copy("home.final.eyebrow", language, "p", "eyebrow")}${copy("home.final.title", language, "h2")}${copy("home.final.body", language, "p", "homeSection__intro")}<div class="homeActions">${cta(siteData.routes.startFree, "home.final.start", language)}${bookingCta(language)}${cta(siteData.routes.masterKeySystem, "home.final.method", language, "secondary")}</div></div></section>`;
}

function renderNextStep(language) {
  const choices = [
    ["home.next.tryPrompt", "home.next.tryCta", siteData.routes.startFree, "primary"],
    ["home.next.guidancePrompt", "home.next.guidanceCta", calendlyUrl, "secondary"],
    ["home.next.structuredPrompt", "home.next.structuredCta", siteData.routes.foundation, "secondary"],
  ].map(([promptKey, ctaKey, href, variant]) => `<article class="homeNext__choice"><h3 data-i18n="${promptKey}">${escapeHtml(t(promptKey, language))}</h3><a class="button--${variant}" href="${escapeHtml(href)}"${href === calendlyUrl ? ' target="_blank" rel="noopener noreferrer"' : ""} data-i18n="${ctaKey}">${escapeHtml(t(ctaKey, language))}</a></article>`).join("");
  return `<section class="homeSection homeNext section--night" data-home-section="next-step"><div class="homeSection__inner"><div class="homeNext__intro">${copy("home.next.eyebrow", language, "p", "eyebrow")}${copy("home.next.title", language, "h2")}${copy("home.next.body", language, "p", "homeSection__intro")}</div><div class="homeNext__choices">${choices}</div><p class="homeNext__question">${bookingCta(language)}</p></div></section>`;
}


function renderTransformationReveal(language) {
  const spanish = language === "es";
  const buttonLabel = spanish ? "HAZ CLIC AQUÍ PARA DESCUBRIR TU PROCESO DE CREACIÓN DE 24 SEMANAS" : "CLICK HERE TO DISCOVER YOUR 24-WEEK CREATION PROCESS";
  const title = spanish ? "¿Y si el mayor poder que puedes desarrollar ya estuviera dentro de ti?" : "What if the greatest power you could develop was already within you?";

  const introduction = spanish
    ? [
        "Imagina dejar de permitir que tus pensamientos, hábitos, miedos y circunstancias decidan por ti, y empezar a dirigir conscientemente tu atención, tus pensamientos y tus acciones.",
        "El Master Key System, escrito por Charles F. Haanel (1866–1949), explora el poder creativo del pensamiento y la relación entre nuestro mundo interior y nuestra experiencia exterior.",
        "La obra comenzó a circular alrededor de 1912 como un curso por correspondencia de 24 lecciones semanales. Más tarde se publicó en forma de libro, con las primeras ediciones fechadas generalmente entre 1916 y 1917."
      ]
    : [
        "Imagine no longer allowing your thoughts, habits, fears and circumstances to make every decision for you — and beginning to direct your attention, your thinking and your actions consciously.",
        "The Master Key System, written by Charles F. Haanel (1866–1949), explores the creative power of thought and the relationship between our inner world and our outer experience.",
        "The work first circulated around 1912 as a correspondence course of 24 weekly lessons. It was later published in book form, with early editions generally dated 1916–1917."
      ];

  const principles = spanish
    ? [
        ["Concentración", "Entrenar tu capacidad para dirigir y mantener la atención."],
        ["Visualización", "Crear una imagen mental más clara de lo que quieres desarrollar."],
        ["Disciplina mental", "Reconocer patrones de pensamiento y hábitos que influyen en tus decisiones."],
        ["Quietud interior", "Practicar la calma y la reflexión deliberada."],
        ["Pensamiento creativo", "Explorar nuevas posibilidades y convertir las intenciones en acciones conscientes."]
      ]
    : [
        ["Concentration", "Train your ability to direct and sustain your attention."],
        ["Visualisation", "Create a clearer mental picture of what you want to develop."],
        ["Mental discipline", "Recognise thought patterns and habits that influence your decisions."],
        ["Inner stillness", "Practise calm and deliberate reflection."],
        ["Creative thinking", "Explore new possibilities and translate intentions into conscious action."]
      ];

  const legacy = spanish
    ? [
        ["Napoleon Hill", "Una carta de 1919 publicada bajo su nombre atribuye parte de su éxito a los principios del Master Key System. La autenticidad independiente de esa atribución no está confirmada."],
        ["Rhonda Byrne", "La creadora de The Secret incluyó una nota sobre el Master Key System y reconoció la importancia de sus ideas para la obra."],
        ["Terry Crews", "El actor ha hablado públicamente de cómo el libro le ayudó a trabajar la visualización, la contemplación y la concentración."]
      ]
    : [
        ["Napoleon Hill", "A 1919 letter published under his name credits principles from The Master Key System with contributing to his success. The attribution has not been independently authenticated."],
        ["Rhonda Byrne", "The creator of The Secret included a note about The Master Key System and acknowledged the importance of its ideas to the work."],
        ["Terry Crews", "The actor has spoken publicly about how the book helped him work on visualisation, contemplation and focus."]
      ];

  const coaching = spanish
    ? [
        "Mi enfoque de coaching es intencionadamente un poco poco convencional. No se trata simplemente de escuchar a alguien decirte cómo vivir, sino de descubrir lo que ya existe en ti, cuestionar formas habituales de pensar y aprender mediante la experiencia directa.",
        "Combino los principios del Master Key System con ejercicios guiados, meditación, visualización, reflexión y acompañamiento personal. No nos limitamos a hablar de ideas: las ponemos en práctica.",
        "Te invitaré a pensar de otra manera, explorar tu potencial y asumir una mayor responsabilidad sobre la dirección de tu vida. Tú aportas la voluntad de explorar y practicar; yo aporto estructura, orientación semanal y apoyo para aplicar las enseñanzas a tu vida cotidiana."
      ]
    : [
        "My coaching approach is intentionally a little unorthodox. It is not simply about listening to someone tell you how to live. It is about discovering what is already within you, questioning familiar ways of thinking and learning through direct experience.",
        "I combine the principles of the Master Key System with guided exercises, meditation, visualisation, reflection and personal mentoring. We don't just discuss ideas — we put them into practice.",
        "I'll invite you to think differently, explore your potential and take greater responsibility for the direction of your life. You bring the willingness to explore and practise; I bring the structure, weekly guidance and support to help you apply the teachings in everyday life."
      ];

  const journey = spanish
    ? "A lo largo de 24 semanas, cada lección prepara el terreno para la siguiente. Mediante estudio, ejercicios prácticos y aplicación constante, desarrollarás tu comprensión paso a paso. No es una promesa de resultados instantáneos: es una invitación a descubrir, practicar y reflexionar."
    : "Across 24 weeks, each lesson prepares the ground for the next. Through study, practical exercises and consistent application, you will build your understanding step by step. This is not a promise of instant results; it is an invitation to discover, practise and reflect.";

  const closing = spanish
    ? "24 semanas. 24 lecciones. Una oportunidad para vivir con mayor conciencia, dirección y propósito."
    : "24 weeks. 24 lessons. An opportunity to live with greater awareness, direction and purpose.";

  const sectionTitle = (en, es) => spanish ? es : en;
  const list = (items) => items.map(([heading, body]) => `<li><strong>${escapeHtml(heading)}</strong><span>${escapeHtml(body)}</span></li>`).join("");
  const introHtml = introduction.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");

  return `<section class="homeTransformationReveal" data-home-section="transformation-reveal" aria-label="${spanish ? "Descubre el viaje" : "Discover the journey"}"><button class="homeTransformationReveal__trigger" type="button" data-transformation-open aria-haspopup="dialog" aria-controls="home-transformation-dialog">${buttonLabel}</button><dialog class="homeTransformationReveal__dialog" id="home-transformation-dialog" aria-labelledby="home-transformation-title"><div class="homeTransformationReveal__aura" aria-hidden="true"></div><button class="homeTransformationReveal__close" type="button" data-transformation-close aria-label="${spanish ? "Cerrar" : "Close"}">×</button><div class="homeTransformationReveal__content"><p class="eyebrow">${sectionTitle("A JOURNEY INTO THE POWER WITHIN", "UN VIAJE HACIA TU INTERIOR")}</p><h2 id="home-transformation-title">${title}</h2>${introHtml}<h3>${sectionTitle("What the 24 lessons explore", "Qué exploran las 24 lecciones")}</h3><ul class="homeTransformationReveal__list">${list(principles)}</ul><h3>${sectionTitle("A legacy that continues to inspire", "Un legado que sigue inspirando")}</h3><p>${sectionTitle("The ideas have travelled beyond the original course and have been discussed by well-known figures in personal development and popular culture:", "Las ideas han trascendido el curso original y han sido comentadas por figuras conocidas del desarrollo personal y la cultura popular:")}</p><ul class="homeTransformationReveal__list homeTransformationReveal__legacy">${list(legacy)}</ul><p class="homeTransformationReveal__note">${sectionTitle("These connections are not all the same: the Hill letter is attributed but unverified, while Byrne and Crews have publicly discussed the book or its ideas.", "Estas conexiones no son idénticas: la carta de Hill se le atribuye, pero no está verificada; Byrne y Crews sí han hablado públicamente del libro o de sus ideas.")}</p><h3>${sectionTitle("A different kind of coaching", "Una forma diferente de acompañamiento")}</h3>${coaching.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}<h3>${sectionTitle("A 24-week journey. One step at a time.", "Un recorrido de 24 semanas. Paso a paso.")}</h3><p>${escapeHtml(journey)}</p><p class="homeTransformationReveal__closing">${escapeHtml(closing)}</p><p class="homeTransformationReveal__download"><a class="button--text" href="/downloads/a-journey-into-the-power-within.pdf" download>${spanish ? "Descargar el PDF" : "Download the PDF"}</a></p><a class="button--primary" href="${escapeHtml(siteData.routes.startFree)}">${spanish ? "Comienza con los 7 días gratuitos" : "Begin with the free 7 days"}</a></div></dialog></section>`;
}
function renderPartnerFooterLink(language) {
  const label = language === "es" ? "Información para socios, colaboradores y afiliados" : "Partner, Collaborator & Affiliate Details";
  return `<div class="homePartnerLink"><a href="${escapeHtml(siteData.routes.referral)}">${escapeHtml(label)}</a></div>`;
}

function renderHomeBody({ language = "en" } = {}) {
  return `<main class="home">${renderHero(language)}${renderPainPoints(language)}${renderFreeExperience(language)}${renderJourney(language)}${renderTransformationReveal(language)}${renderTestimonials(language)}${renderOffers(language)}${renderWhyTariq(language)}${renderInsightsPreview({ language, data: siteData, compact: true })}${renderFinalCta(language)}${renderPartnerFooterLink(language)}</main>`;
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
    scripts: ["/assets/home-testimonials.mjs", "/assets/life-power-accordion.mjs", "/assets/home-transformation-reveal.mjs"],
  };
}
