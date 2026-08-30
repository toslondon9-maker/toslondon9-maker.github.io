import { siteData as canonicalSiteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

function whatsappHref(number, message) {
  const digits = String(number).replaceAll(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function renderContact({ data = canonicalSiteData, language = "en" } = {}) {
  const spanish = language === "es";
  const coachingSubject = spanish ? "Consulta sobre coaching Unleash Your Power" : "Unleash Your Power coaching enquiry";
  const questionSubject = spanish ? "Pregunta para Tariq" : "Question for Tariq";
  const whatsappMessage = spanish ? "Hola Tariq. Me gustaria hablar sobre Unleash Your Power y el recorrido de 24 semanas." : "Hi Tariq. I would like to talk about Unleash Your Power and the 24-week journey.";

  return `<main class="contactPage" id="main-content"><header class="contactPage__hero"><div><p class="eyebrow">UNLEASH YOUR POWER</p><h1 data-i18n="route.contact.heading">${escapeHtml(t("route.contact.heading", language))}</h1><p class="routeShell__purpose" data-i18n="route.contact.purpose">${escapeHtml(t("route.contact.purpose", language))}</p></div><aside class="contactPage__promise"><strong>${spanish ? "Sin presion." : "No pressure."}</strong><span>${spanish ? "Una conversacion clara para decidir si el siguiente paso tiene sentido para ti." : "A clear conversation to decide whether the next step makes sense for you."}</span></aside></header><section class="contactPage__options section" aria-labelledby="contact-options-title"><p class="eyebrow">${spanish ? "ELIGE COMO CONTACTAR" : "CHOOSE HOW TO CONNECT"}</p><h2 id="contact-options-title">${spanish ? "Coaching, una pregunta o simplemente claridad" : "Coaching, a question, or simply some clarity"}</h2><div class="contactPage__grid"><article class="contactPage__option contactPage__option--primary"><span>01</span><h3>${spanish ? "Hablar sobre el programa de 24 semanas" : "Discuss the 24-week programme"}</h3><p>${spanish ? "Cuenta brevemente donde estas, que quieres mejorar y que te gustaria entender antes de decidir." : "Share where you are now, what you want to improve and what you would like to understand before deciding."}</p><a class="button--primary" href="mailto:${escapeHtml(data.contact.email)}?subject=${encodeURIComponent(coachingSubject)}">${spanish ? "ENVIAR CONSULTA" : "ENQUIRE ABOUT COACHING"}</a></article><article class="contactPage__option"><span>02</span><h3>WhatsApp</h3><p>${spanish ? "Ideal para un mensaje corto y directo. Puedes explicar en una o dos frases que te ha traido hasta aqui." : "Ideal for a short, direct message. In one or two sentences, tell Tariq what brought you here."}</p><a class="button--secondary" href="${whatsappHref(data.contact.whatsapp, whatsappMessage)}" target="_blank" rel="noreferrer">${spanish ? "ABRIR WHATSAPP" : "OPEN WHATSAPP"}</a></article><article class="contactPage__option"><span>03</span><h3>${spanish ? "Hacer una pregunta" : "Ask a question"}</h3><p>${spanish ? "Si aun no estas pensando en coaching, pregunta lo que necesites sobre el Master Key System, la experiencia gratuita o como funciona el recorrido." : "If you are not ready to discuss coaching, ask what you need to know about the Master Key System, the free experience or how the journey works."}</p><a class="button--secondary" href="mailto:${escapeHtml(data.contact.email)}?subject=${encodeURIComponent(questionSubject)}">${spanish ? "HACER UNA PREGUNTA" : "ASK A QUESTION"}</a></article></div></section><section class="contactPage__prepare section--night"><div class="contactPage__prepareInner"><div><p class="eyebrow">${spanish ? "PARA APROVECHAR LA CONVERSACION" : "MAKE THE CONVERSATION USEFUL"}</p><h2>${spanish ? "Tres cosas que puedes incluir" : "Three things you can include"}</h2></div><ol><li><strong>01</strong><span>${spanish ? "Que quieres cambiar, fortalecer o comprender." : "What you want to change, strengthen or understand."}</span></li><li><strong>02</strong><span>${spanish ? "Que has probado ya y donde te cuesta mantener la constancia." : "What you have tried already and where consistency becomes difficult."}</span></li><li><strong>03</strong><span>${spanish ? "Que te gustaria conseguir de una conversacion con Tariq." : "What you would like to get from a conversation with Tariq."}</span></li></ol></div></section><section class="contactPage__free section"><div><p class="eyebrow">${spanish ? "TODAVIA NO ESTAS LISTO?" : "NOT READY TO TALK YET?"}</p><h2>${spanish ? "Empieza gratis y decide despues" : "Start free and decide later"}</h2><p>${spanish ? "Prueba primero la experiencia gratuita de siete dias. Conoce el metodo, observa como respondes a las practicas y despues decide si quieres ir mas alla." : "Try the free seven-day experience first. Get a feel for the method, notice how you respond to the practices and then decide whether you want to go deeper."}</p></div><a class="button--primary" href="${data.routes.startFree}">${spanish ? "EMPEZAR GRATIS" : "START FREE FOR 7 DAYS"}</a></section></main>`;
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
