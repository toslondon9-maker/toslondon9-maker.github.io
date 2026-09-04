import { sevenDayExperience } from "../../content/seven-day-experience.mjs";
import { siteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";`nimport { leadCaptureConfig } from "../../content/lead-capture-config.mjs";

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

function heading(key, id, language) {
  return `<h2 id="${id}" class="sevenDayDashboard__sectionTitle" data-i18n="${key}">${escapeHtml(t(key, language))}</h2>`;
}

function renderLessonCards(language) {
  return sevenDayExperience.lessons.map((lesson) => {
    const { contentKeys } = lesson;
    const completionKey = sevenDayExperience.sharedKeys.progress.lessonComplete;
    return `<li class="sevenDayDashboard__lesson" data-progress-lesson="${lesson.id}"><a href="${escapeHtml(lesson.route)}"><span class="sevenDayDashboard__number" aria-hidden="true">${String(lesson.sequence).padStart(2, "0")}</span><span class="sevenDayDashboard__lessonCopy"><span class="sevenDayDashboard__status" data-i18n="${contentKeys.status}">${escapeHtml(t(contentKeys.status, language))}</span><strong data-i18n="${contentKeys.title}">${escapeHtml(t(contentKeys.title, language))}</strong><span class="sevenDayDashboard__status" data-progress-marker hidden data-i18n="${completionKey}">${escapeHtml(t(completionKey, language))}</span></span><span class="sevenDayDashboard__arrow" aria-hidden="true">→</span></a></li>`;
  }).join("");
}

function renderWorkbookDownload(language) {
  const workbook = sevenDayExperience.sharedKeys.workbook;
  return `<section class="sevenDayDashboard__workbook" aria-labelledby="seven-day-workbook-heading">${heading(workbook.heading, "seven-day-workbook-heading", language)}<div class="sevenDayDashboard__workbookCopy">${copy(workbook.intro, language)}</div><div class="sevenDayDashboard__workbookActions"><a href="/downloads/seven-day-experience-workbook-en.pdf" download class="button--secondary" data-i18n="${workbook.english}">${escapeHtml(t(workbook.english, language))}</a></div></section>`;
}

function renderAfterSevenDays(data, language) {
  return `<section class="sevenDayDashboard__after" id="after-seven-days" aria-labelledby="after-seven-days-title"><div class="sevenDayDashboard__afterIntro"><p class="eyebrow">${copy("phase2.after.eyebrow", language, "span")}</p><h2 id="after-seven-days-title">${copy("phase2.after.title", language, "span")}</h2>${copy("phase2.after.body", language)}</div><div class="sevenDayDashboard__afterGrid"><article><strong>01</strong><h3>${copy("phase2.after.studyTitle", language, "span")}</h3>${copy("phase2.after.studyBody", language)}<a class="button--text" href="${data.routes.masterKeySystem}">${copy("phase2.after.studyAction", language, "span")}</a></article><article><strong>02</strong><h3>${copy("phase2.after.aiTitle", language, "span")}</h3>${copy("phase2.after.aiBody", language)}<a class="button--text" href="${data.routes.aiMentors}">${copy("phase2.after.aiAction", language, "span")}</a></article><article><strong>03</strong><h3>${copy("phase2.after.coachingTitle", language, "span")}</h3>${copy("phase2.after.coachingBody", language)}<a class="button--primary" href="${data.routes.coaching}">${copy("phase2.after.coachingAction", language, "span")}</a></article></div></section>`;
}

function renderFlyer(language) {
  const desktopLabel = language === "es" ? "Haz clic para ampliar" : "Click to enlarge";
  const mobileLabel = language === "es" ? "Toca para ampliar" : "Tap to enlarge";
  const alt = t("sevenDay.dashboard.imageAlt", language);
  return `<div class="sevenDayDashboard__flyer"><button type="button" class="sevenDayDashboard__flyerTrigger" data-flyer-trigger aria-haspopup="dialog" aria-controls="seven-day-flyer-dialog"><span class="sevenDayDashboard__flyerIcon" aria-hidden="true">↗</span><img src="/images/free-7-day-taster.jpeg" width="1122" height="1402" loading="eager" fetchpriority="high" decoding="async" alt="${escapeHtml(alt)}" data-i18n-alt="sevenDay.dashboard.imageAlt"><span class="sevenDayDashboard__flyerHint sevenDayDashboard__flyerHint--desktop">${desktopLabel}</span><span class="sevenDayDashboard__flyerHint sevenDayDashboard__flyerHint--mobile">${mobileLabel}</span></button><p class="sevenDayDashboard__flyerNote">${desktopLabel} · ${mobileLabel}</p></div><div class="sevenDayDashboard__flyerDialog" id="seven-day-flyer-dialog" data-flyer-dialog hidden role="dialog" aria-modal="true" aria-labelledby="seven-day-flyer-title"><div class="sevenDayDashboard__flyerBackdrop" data-flyer-close></div><div class="sevenDayDashboard__flyerPanel" role="document"><div class="sevenDayDashboard__flyerToolbar"><h2 id="seven-day-flyer-title">${language === "es" ? "Experiencia gratuita de 7 días" : "Free 7-Day Experience"}</h2><button type="button" class="sevenDayDashboard__flyerClose" data-flyer-close aria-label="${language === "es" ? "Cerrar" : "Close"}">×</button></div><div class="sevenDayDashboard__flyerViewport"><img src="/images/free-7-day-taster.jpeg" width="1122" height="1402" loading="eager" decoding="async" alt="${escapeHtml(alt)}" data-flyer-image></div></div></div>`;
}

function withFlyerLightbox(html, language) {
  const image = /<div class="sevenDayDashboard__heroVisual"><img src="\/images\/free-7-day-taster\.jpeg"[^>]*><\/div>/;
  return html.replace(image, `<div class="sevenDayDashboard__heroVisual">${renderFlyer(language)}</div>`);
}

function renderRegistration(language) {
  const es = language === "es";
  const copy = es ? ["Comienza tu experiencia gratuita de 7 días", "Nombre", "Apellido", "Correo electrónico", "Número de WhatsApp con código de país", "¿Qué te gustaría cambiar o mejorar ahora mismo?", "¿Qué te está frenando más?", "Acepto que Tariq me contacte por WhatsApp sobre la experiencia gratuita de 7 días.", "Me gustaría recibir novedades ocasionales por correo electrónico.", "COMENZAR MIS 7 DÍAS GRATIS"] : ["Begin Your Free 7-Day Experience", "First name", "Surname", "Email", "WhatsApp number including country code", "What would you most like to change or improve right now?", "What is currently holding you back most?", "I agree that Tariq may contact me on WhatsApp about the Free 7-Day Experience.", "I would like occasional email updates.", "START MY FREE 7 DAYS"];
  return `<section class="sevenDayRegistration"><div class="sevenDayDashboard__inner"><h2>${copy[0]}</h2><form data-lead-capture-form data-lead-endpoint="${leadCaptureConfig.endpoint ?? ""}"><label for="lead-first-name">${copy[1]}</label><input id="lead-first-name" name="firstName" autocomplete="given-name" maxlength="80" required><label>${copy[2]}<input name="surname" autocomplete="family-name" maxlength="80" required></label><label>${copy[3]}<input name="email" type="email" autocomplete="email" maxlength="254" required></label><label>${copy[4]}<input name="whatsapp" type="tel" autocomplete="tel" maxlength="32" required></label><label>${copy[5]}<textarea name="goal" maxlength="1000" required></textarea></label><label>${copy[6]}<textarea name="difficulty" maxlength="1000" required></textarea></label><label><input type="checkbox" name="consent" required> ${copy[7]}</label><label><input type="checkbox" name="emailMarketing"> ${copy[8]}</label><input name="website" class="visually-hidden" tabindex="-1" autocomplete="off"><p><a href="/privacy/">Privacy Policy</a></p><p data-lead-capture-status role="status" aria-live="polite" tabindex="-1">WhatsApp</p><button type="submit" class="button--primary">${copy[9]}</button></form><div data-lead-capture-success hidden><p>You’re registered. Welcome to Unleash Your Power.</p><a class="button--primary" href="/start-free/day-1-see-whats-running-your-life/">START DAY 1</a></div></div></section>`;
}

export function renderStartFree({ language = "en" } = {}) {
  const { dashboard, progress, privacy, reset, independence } = sevenDayExperience.sharedKeys;
  const dayOne = sevenDayExperience.lessons[0];

  return `<main class="sevenDayDashboard" id="main-content">${renderRegistration(language)}<div data-lead-capture-dashboard hidden><section class="sevenDayDashboard__hero"><div class="sevenDayDashboard__inner sevenDayDashboard__heroGrid"><div class="sevenDayDashboard__heroCopy"><p class="eyebrow" data-i18n="${dashboard.eyebrow}">${escapeHtml(t(dashboard.eyebrow, language))}</p>${copy(dashboard.title, language, "h1")}<p class="routeShell__purpose" data-i18n="${dashboard.intro}">${escapeHtml(t(dashboard.intro, language))}</p><ul class="sevenDayDashboard__heroFacts"><li data-i18n="sevenDay.dashboard.fact1">${escapeHtml(t("sevenDay.dashboard.fact1", language))}</li><li data-i18n="sevenDay.dashboard.fact2">${escapeHtml(t("sevenDay.dashboard.fact2", language))}</li><li data-i18n="sevenDay.dashboard.fact3">${escapeHtml(t("sevenDay.dashboard.fact3", language))}</li></ul><div class="sevenDayDashboard__heroActions"><a class="button--primary routeShell__action" href="${escapeHtml(dayOne.route)}" data-i18n="${dashboard.start}">${escapeHtml(t(dashboard.start, language))}</a><a class="button--secondary" href="#seven-day-lessons-heading">${language === "es" ? "VER LOS 7 DIAS" : "SEE ALL 7 DAYS"}</a></div></div><div class="sevenDayDashboard__heroVisual"><img src="/images/free-7-day-taster.jpeg" width="1122" height="1402" loading="eager" fetchpriority="high" decoding="async" alt="${escapeHtml(t("sevenDay.dashboard.imageAlt", language))}" data-i18n-alt="sevenDay.dashboard.imageAlt"></div></div></section><section class="sevenDayDashboard__body"><div class="sevenDayDashboard__inner"><div class="sevenDayDashboard__how"><p class="eyebrow" data-i18n="sevenDay.dashboard.howEyebrow">${escapeHtml(t("sevenDay.dashboard.howEyebrow", language))}</p><h2 data-i18n="sevenDay.dashboard.howTitle">${escapeHtml(t("sevenDay.dashboard.howTitle", language))}</h2><ol><li><strong>01</strong><span data-i18n="sevenDay.dashboard.how1">${escapeHtml(t("sevenDay.dashboard.how1", language))}</span></li><li><strong>02</strong><span data-i18n="sevenDay.dashboard.how2">${escapeHtml(t("sevenDay.dashboard.how2", language))}</span></li><li><strong>03</strong><span data-i18n="sevenDay.dashboard.how3">${escapeHtml(t("sevenDay.dashboard.how3", language))}</span></li></ol></div><p class="sevenDayDashboard__progressive" data-i18n="${dashboard.progressive}">${escapeHtml(t(dashboard.progressive, language))}</p><section class="sevenDayDashboard__progress" aria-labelledby="seven-day-progress-heading">${heading(progress.heading, "seven-day-progress-heading", language)}<p id="seven-day-progress-status" class="sevenDayDashboard__progressStatus" role="status" aria-live="polite" tabindex="-1" data-progress-status data-i18n="${progress.empty}">${escapeHtml(t(progress.empty, language))}</p><button class="button--text sevenDayDashboard__reset" type="button" data-progress-reset disabled data-i18n="${reset.label}">${escapeHtml(t(reset.label, language))}</button></section><section class="sevenDayDashboard__lessons" aria-labelledby="seven-day-lessons-heading">${heading(dashboard.lessonsHeading, "seven-day-lessons-heading", language)}<ol class="sevenDayDashboard__lessonList">${renderLessonCards(language)}</ol></section>${renderWorkbookDownload(language)}${renderAfterSevenDays(siteData, language)}<aside class="sevenDayDashboard__privacy" aria-labelledby="seven-day-privacy-heading">${heading(privacy.heading, "seven-day-privacy-heading", language)}<p data-i18n="${privacy.body}">${escapeHtml(t(privacy.body, language))}</p><p class="sevenDayDashboard__independence" data-i18n="${independence}">${escapeHtml(t(independence, language))}</p></aside></div></section></div></main>`;
}

export function startFreePage(data = siteData, language = "en") {
  return {
    route: data.routes.startFree,
    language,
    title: t("route.startFree.metaTitle", language),
    description: t("route.startFree.metaDescription", language),
    titleKey: "route.startFree.metaTitle",
    descriptionKey: "route.startFree.metaDescription",
    body: withFlyerLightbox(renderStartFree({ language }), language),
    scripts: ["/assets/lead-capture-form.mjs", "/assets/seven-day-progress.mjs", "/assets/flyer-lightbox.mjs"],
    socialImage: "/images/free-7-day-taster.jpeg",
    socialImageAlt: "Unleash Your Power free 7-day Master Your Mind experience",
  };
}
