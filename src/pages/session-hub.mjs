import { siteData as canonicalSiteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

function actionCard({ eyebrow, title, body, href, action, primary = false }) {
  return `<article class="sessionHub__card"><p class="eyebrow">${escapeHtml(eyebrow)}</p><h2>${escapeHtml(title)}</h2><p>${escapeHtml(body)}</p><a class="${primary ? "button--primary" : "button--secondary"}" href="${escapeHtml(href)}">${escapeHtml(action)}</a></article>`;
}

export function renderSessionHub({ data = canonicalSiteData, language = "en" } = {}) {
  const spanish = language === "es";
  const cards = [
    actionCard({
      eyebrow: spanish ? "ESTUDIA" : "STUDY",
      title: spanish ? "Continua con tu capitulo" : "Continue your current chapter",
      body: spanish ? "Vuelve al recorrido de 24 capitulos, abre la leccion actual y completa la practica de esta semana." : "Return to the 24-chapter journey, open your current lesson and complete this week's practice.",
      href: `${data.routes.masterKeySystem}#week-1`,
      action: spanish ? "ABRIR EL RECORRIDO" : "OPEN THE CURRICULUM",
      primary: true,
    }),
    actionCard({
      eyebrow: spanish ? "REFLEXIONA" : "REFLECT",
      title: spanish ? "Usa el Mentor de IA" : "Use the AI Mentor",
      body: spanish ? "Lleva una pregunta real de tu semana y explora el principio con la perspectiva que elijas." : "Bring one real question from your week and explore the principle with the learning perspective you choose.",
      href: data.routes.aiMentors,
      action: spanish ? "ABRIR EL MENTOR DE IA" : "OPEN THE AI MENTOR",
    }),
    actionCard({
      eyebrow: spanish ? "APLICA" : "APPLY",
      title: spanish ? "Preparate para coaching" : "Prepare for coaching",
      body: spanish ? "Llega con una situacion real, una pregunta clara y una accion que quieras completar antes de la siguiente sesion." : "Arrive with one real situation, one clear question and one action you want to complete before the next session.",
      href: data.routes.coaching,
      action: spanish ? "VER COACHING" : "EXPLORE COACHING",
    }),
  ].join("");

  return `<main class="sessionHub" id="main-content"><header class="sessionHub__hero"><div class="sessionHub__heroInner"><p class="eyebrow">${spanish ? "TU CENTRO DE SESIONES" : "YOUR SESSION HUB"}</p><h1 data-i18n="route.liveCoaching.heading">${escapeHtml(t("route.liveCoaching.heading", language))}</h1><p class="routeShell__purpose" data-i18n="route.liveCoaching.purpose">${escapeHtml(t("route.liveCoaching.purpose", language))}</p><div class="sessionHub__heroActions"><a class="button--primary" href="${data.routes.masterKeySystem}#week-1">${spanish ? "CONTINUAR ESTUDIANDO" : "CONTINUE STUDYING"}</a><a class="button--secondary" href="${data.routes.aiMentors}">${spanish ? "ABRIR MENTOR DE IA" : "OPEN AI MENTOR"}</a></div></div></header><section class="sessionHub__quick section" aria-labelledby="session-hub-next"><p class="eyebrow">${spanish ? "TU PROXIMO PASO" : "YOUR NEXT STEP"}</p><h2 id="session-hub-next">${spanish ? "Estudia. Reflexiona. Aplica." : "Study. Reflect. Apply."}</h2><p class="sessionHub__lead">${spanish ? "Usa este centro como punto de regreso cada semana. No necesitas hacerlo todo a la vez; trabaja con la leccion que tienes delante." : "Use this hub as your weekly return point. You do not need to do everything at once; work with the lesson in front of you."}</p><div class="sessionHub__grid">${cards}</div></section><section class="sessionHub__rhythm section--night"><div class="sessionHub__rhythmInner"><div><p class="eyebrow">${spanish ? "RITMO SEMANAL" : "WEEKLY RHYTHM"}</p><h2>${spanish ? "Una estructura sencilla para mantener el rumbo" : "A simple structure to stay on track"}</h2><p>${spanish ? "La constancia importa mas que la intensidad. Usa el mismo ritmo basico cada semana y ajustalo a tu vida." : "Consistency matters more than intensity. Use the same basic rhythm each week and adjust it to real life."}</p></div><ol class="sessionHub__steps"><li><strong>01</strong><span>${spanish ? "Lee la leccion actual con calma." : "Read the current lesson carefully."}</span></li><li><strong>02</strong><span>${spanish ? "Practica el ejercicio de la semana." : "Practise the weekly exercise."}</span></li><li><strong>03</strong><span>${spanish ? "Relaciona el principio con una situacion real." : "Connect the principle to one real situation."}</span></li><li><strong>04</strong><span>${spanish ? "Escribe una pregunta y una accion clara." : "Write down one question and one clear action."}</span></li></ol></div></section><section class="sessionHub__prepare section"><div class="sessionHub__prepareGrid"><div><p class="eyebrow">${spanish ? "ANTES DE UNA SESION" : "BEFORE A COACHING SESSION"}</p><h2>${spanish ? "Llega preparado para trabajar en algo real" : "Arrive ready to work on something real"}</h2><p>${spanish ? "No necesitas preparar una historia perfecta. Trae una situacion concreta que quieras entender o manejar mejor." : "You do not need a perfect story. Bring a specific situation you want to understand or handle more deliberately."}</p></div><ul><li>${spanish ? "Que principio estas estudiando esta semana?" : "Which principle are you studying this week?"}</li><li>${spanish ? "Donde te esta poniendo a prueba la vida real?" : "Where is real life testing you?"}</li><li>${spanish ? "Que has observado en tu pensamiento o comportamiento?" : "What have you noticed in your thinking or behaviour?"}</li><li>${spanish ? "Que accion quieres completar despues de la sesion?" : "What action do you want to complete after the session?"}</li></ul></div><div class="sessionHub__prepareActions"><a class="button--primary" href="${data.routes.contact}">${spanish ? "HABLAR CON TARIQ" : "TALK TO TARIQ"}</a><a class="button--text" href="${data.routes.getTheBook}">${spanish ? "Preparar mi libro" : "Prepare with the MKS book"}</a></div></section><aside class="sessionHub__note"><strong>${spanish ? "Nota:" : "Study note:"}</strong> ${spanish ? "Este centro apoya el estudio y el coaching de desarrollo personal. No sustituye asesoramiento medico, psicologico, legal o financiero profesional." : "This hub supports personal-development study and coaching. It does not replace professional medical, psychological, legal or financial advice."}</aside></main>`;
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
