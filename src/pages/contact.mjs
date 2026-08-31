import { siteData as canonicalSiteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");
const copy = (key, language) => `<span data-i18n="${key}">${escapeHtml(t(key, language))}</span>`;


function whatsappHref(number, message) {
  const digits = String(number).replaceAll(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function renderContact({ data = canonicalSiteData, language = "en" } = {}) {
  const spanish = language === "es";
  const coachingSubject = spanish ? "Consulta sobre coaching Unleash Your Power" : "Unleash Your Power coaching enquiry";
  const questionSubject = spanish ? "Pregunta para Tariq" : "Question for Tariq";
  const whatsappMessage = spanish ? "Hola Tariq. Me gustaría hablar sobre Unleash Your Power y el recorrido de 24 semanas." : "Hi Tariq. I would like to talk about Unleash Your Power and the 24-week journey.";

  return `<main class="contactPage" id="main-content"><header class="contactPage__hero"><div><p class="eyebrow">UNLEASH YOUR POWER</p><h1 data-i18n="route.contact.heading">${escapeHtml(t("route.contact.heading", language))}</h1><p class="routeShell__purpose" data-i18n="route.contact.purpose">${escapeHtml(t("route.contact.purpose", language))}</p></div><aside class="contactPage__promise"><strong>${copy("phase2.contact.promiseTitle", language)}</strong>${copy("phase2.contact.promiseBody", language)}</aside></header><section class="contactPage__options section" aria-labelledby="contact-options-title"><p class="eyebrow">${copy("phase2.contact.eyebrow", language)}</p><h2 id="contact-options-title">${copy("phase2.contact.title", language)}</h2><div class="contactPage__grid"><article class="contactPage__option contactPage__option--primary"><span>01</span><h3>${copy("phase2.contact.coachingTitle", language)}</h3><p>${copy("phase2.contact.coachingBody", language)}</p><a class="button--primary" href="mailto:${escapeHtml(data.contact.email)}?subject=${encodeURIComponent(coachingSubject)}">${copy("phase2.contact.coachingAction", language)}</a></article><article class="contactPage__option"><span>02</span><h3>WhatsApp</h3><p>${copy("phase2.contact.whatsappBody", language)}</p><a class="button--secondary" href="${whatsappHref(data.contact.whatsapp, whatsappMessage)}" target="_blank" rel="noopener noreferrer">${copy("phase2.contact.whatsappAction", language)}</a></article><article class="contactPage__option"><span>03</span><h3>${copy("phase2.contact.questionTitle", language)}</h3><p>${copy("phase2.contact.questionBody", language)}</p><a class="button--secondary" href="mailto:${escapeHtml(data.contact.email)}?subject=${encodeURIComponent(questionSubject)}">${copy("phase2.contact.questionAction", language)}</a></article></div></section><section class="contactPage__prepare section--night"><div class="contactPage__prepareInner"><div><p class="eyebrow">${copy("phase2.contact.prepareEyebrow", language)}</p><h2>${copy("phase2.contact.prepareTitle", language)}</h2></div><ol><li><strong>01</strong>${copy("phase2.contact.prepare1", language)}</li><li><strong>02</strong>${copy("phase2.contact.prepare2", language)}</li><li><strong>03</strong>${copy("phase2.contact.prepare3", language)}</li></ol></div></section><section class="contactPage__free section"><div><p class="eyebrow">${copy("phase2.contact.freeEyebrow", language)}</p><h2>${copy("phase2.contact.freeTitle", language)}</h2><p>${copy("phase2.contact.freeBody", language)}</p></div><a class="button--primary" href="${data.routes.startFree}">${copy("phase2.contact.freeAction", language)}</a></section></main>`;
}

export function contactPage(data = canonicalSiteData, language = "en") {
  return {
    route: data.routes.contact,
    language,
    title: t("route.contact.metaTitle", language),
    description: t("route.contact.metaDescription", language),
    titleKey: "route.contact.metaTitle",
    descriptionKey: "route.contact.metaDescription",
    body: renderContact({ data, language }),
    scripts: [],
  };
}
