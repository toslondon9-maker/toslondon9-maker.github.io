import { sevenDayExperience } from "../../content/seven-day-experience.mjs";
import { t } from "../../content/translations.mjs";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function localized(key, language) {
  return escapeHtml(t(key, language));
}

function renderPracticeSection(lesson, section, headingKey, language) {
  const id = `${lesson.id}-${section}`;
  const contentKey = lesson.contentKeys[section];
  return `<section class="sevenDayLesson__practice" aria-labelledby="${id}"><h2 id="${id}" data-i18n="${headingKey}">${localized(headingKey, language)}</h2><p data-i18n="${contentKey}">${localized(contentKey, language)}</p></section>`;
}

function renderNavigation(lesson, lessonIndex, data, language) {
  const previous = sevenDayExperience.lessons[lessonIndex - 1];
  const next = sevenDayExperience.lessons[lessonIndex + 1];
  const { navigation } = sevenDayExperience.sharedKeys;
  const previousLink = previous
    ? `<a class="button--secondary" href="${escapeHtml(previous.route)}" data-i18n="${navigation.previous}">${localized(navigation.previous, language)}</a>`
    : "";
  const nextLink = next
    ? `<a class="button--primary" href="${escapeHtml(next.route)}" data-i18n="${lesson.contentKeys.navigation}">${localized(lesson.contentKeys.navigation, language)}</a>`
    : `<a class="button--primary" href="${escapeHtml(data.routes.startFree)}" data-i18n="${lesson.contentKeys.navigation}">${localized(lesson.contentKeys.navigation, language)}</a>`;
  const coachingLink = lesson.sequence === 7
    ? `<a class="sevenDayLesson__coaching" href="${escapeHtml(data.routes.coaching)}" data-i18n="cta.exploreJourney">${localized("cta.exploreJourney", language)}</a>`
    : "";

  return `<nav class="sevenDayLesson__navigation" aria-label="${localized("sevenDay.navigation.dashboard", language)}" data-i18n-aria-label="sevenDay.navigation.dashboard"><a class="sevenDayLesson__dashboard" href="${escapeHtml(data.routes.startFree)}" data-i18n="${navigation.dashboard}">${localized(navigation.dashboard, language)}</a><div class="sevenDayLesson__navigationActions">${previousLink}${nextLink}</div>${coachingLink}</nav>`;
}

function renderDaySevenBridge(lesson, data, language) {
  if (lesson.sequence !== 7) return "";
  const spanish = language === "es";
  return `<section class="sevenDayLesson__bridge" aria-labelledby="day-seven-next-step"><p class="eyebrow">${spanish ? "HAS COMPLETADO LA EXPERIENCIA GRATUITA" : "YOU HAVE COMPLETED THE FREE EXPERIENCE"}</p><h2 id="day-seven-next-step">${spanish ? "Ahora elige como quieres continuar" : "Now choose how you want to continue"}</h2><p>${spanish ? "No necesitas tomar una decision inmediata. Usa lo que has observado durante estos siete dias para elegir el siguiente paso que tenga sentido para ti." : "You do not need to make an immediate decision. Use what you noticed during these seven days to choose the next step that makes sense for you."}</p><div class="sevenDayLesson__bridgeGrid"><a href="${escapeHtml(data.routes.masterKeySystem)}"><strong>${spanish ? "ESTUDIAR" : "STUDY"}</strong><span>${spanish ? "Continua con las 24 lecciones" : "Continue through all 24 chapters"}</span></a><a href="${escapeHtml(data.routes.aiMentors)}"><strong>${spanish ? "REFLEXIONAR" : "REFLECT"}</strong><span>${spanish ? "Usa el Mentor de IA" : "Use the AI Mentor"}</span></a><a class="sevenDayLesson__bridgePrimary" href="${escapeHtml(data.routes.coaching)}"><strong>${spanish ? "PROFUNDIZAR" : "GO DEEPER"}</strong><span>${spanish ? "Explora el programa de 24 semanas" : "Explore the 24-week programme"}</span></a></div></section>`;
}

export function renderSevenDayLesson({ lesson, data, language = "en" }) {
  const lessonIndex = sevenDayExperience.lessons.indexOf(lesson);
  if (lessonIndex < 0) throw new RangeError(`Unknown seven-day lesson: ${lesson?.id ?? ""}`);

  const { lesson: headings, progress } = sevenDayExperience.sharedKeys;
  const progressStatusId = `${lesson.id}-progress-status`;

  return `<main class="sevenDayLesson" id="main-content"><article class="sevenDayLesson__article"><header class="sevenDayLesson__header"><p class="eyebrow" data-i18n="sevenDay.dashboard.eyebrow">${localized("sevenDay.dashboard.eyebrow", language)}</p><p class="sevenDayLesson__day" data-i18n="${lesson.contentKeys.status}">${localized(lesson.contentKeys.status, language)}</p><h1 data-i18n="${lesson.contentKeys.title}">${localized(lesson.contentKeys.title, language)}</h1></header><div class="sevenDayLesson__practiceList">${renderPracticeSection(lesson, "teaching", headings.teachingHeading, language)}${renderPracticeSection(lesson, "observation", headings.observationHeading, language)}${renderPracticeSection(lesson, "reflection", headings.reflectionHeading, language)}${renderPracticeSection(lesson, "action", headings.actionHeading, language)}</div><section class="sevenDayLesson__completion" aria-labelledby="${lesson.id}-progress-heading"><h2 id="${lesson.id}-progress-heading" data-i18n="${progress.heading}">${localized(progress.heading, language)}</h2><p id="${progressStatusId}" role="status" aria-live="polite" tabindex="-1" data-progress-status data-i18n="${progress.empty}">${localized(progress.empty, language)}</p><button class="button--primary" type="button" data-progress-complete="${lesson.id}" data-progress-complete-key="${lesson.contentKeys.completion}" disabled aria-describedby="${progressStatusId}" aria-pressed="false" data-i18n="${lesson.contentKeys.completion}">${localized(lesson.contentKeys.completion, language)}</button></section><aside class="sevenDayLesson__contact" data-contact-action></aside>${renderDaySevenBridge(lesson, data, language)}${renderNavigation(lesson, lessonIndex, data, language)}</article></main>`;
}

export function sevenDayLessonPage(lesson, data, language = "en") {
  return {
    route: lesson.route,
    language,
    title: t(lesson.contentKeys.title, language),
    description: t(lesson.contentKeys.teaching, language),
    titleKey: lesson.contentKeys.title,
    descriptionKey: lesson.contentKeys.teaching,
    body: renderSevenDayLesson({ lesson, data, language }),
    scripts: ["/assets/seven-day-progress.mjs"],
  };
}
