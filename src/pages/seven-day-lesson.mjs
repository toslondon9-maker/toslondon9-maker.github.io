import { sevenDayExperience } from "../../content/seven-day-experience.mjs";
import { t } from "../../content/translations.mjs";
import { renderFoundationNextStep } from "../conversion-components.mjs";
import { bookingCallHref } from "../whatsapp.mjs";

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

function renderWorkbook(lesson, language) {
  const workbook = sevenDayExperience.sharedKeys.workbook;
  const textareaId = `${lesson.id}-workbook-answer`;
  const hintId = `${lesson.id}-workbook-hint`;
  const statusId = `${lesson.id}-workbook-status`;
  return `<section class="sevenDayLesson__workbook" aria-labelledby="${lesson.id}-workbook-heading"><h2 id="${lesson.id}-workbook-heading" data-i18n="${workbook.answerLabel}">${localized(workbook.answerLabel, language)}</h2><p id="${hintId}" class="sevenDayLesson__workbookHint" data-i18n="${workbook.answerHint}">${localized(workbook.answerHint, language)}</p><p class="sevenDayLesson__workbookPrivacy" data-i18n="${workbook.privacy}">${localized(workbook.privacy, language)}</p><label for="${textareaId}" data-i18n="${workbook.answerLabel}">${localized(workbook.answerLabel, language)}</label><textarea id="${textareaId}" data-workbook-answer data-workbook-lesson="${lesson.id}" maxlength="4000" aria-describedby="${hintId} ${statusId}"></textarea><p id="${statusId}" class="sevenDayLesson__workbookStatus" role="status" aria-live="polite" tabindex="-1" data-workbook-status></p><button class="button--text" type="button" data-workbook-clear data-workbook-lesson="${lesson.id}" data-i18n="${workbook.clear}">${localized(workbook.clear, language)}</button></section>`;
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
  const whatsappHref = bookingCallHref(data.contact.whatsapp);
  return `<section class="sevenDayLesson__bridge" aria-labelledby="day-seven-next-step" data-day-seven-choices><p class="eyebrow" data-i18n="sevenDay.day7.choices.eyebrow">${localized("sevenDay.day7.choices.eyebrow", language)}</p><h2 id="day-seven-next-step" data-i18n="sevenDay.day7.choices.heading">${localized("sevenDay.day7.choices.heading", language)}</h2><p data-i18n="sevenDay.day7.choices.body">${localized("sevenDay.day7.choices.body", language)}</p><div class="sevenDayLesson__bridgeGrid"><a href="${escapeHtml(data.routes.resources)}"><strong data-i18n="sevenDay.day7.choices.resourcesTitle">${localized("sevenDay.day7.choices.resourcesTitle", language)}</strong><span data-i18n="sevenDay.day7.choices.resourcesBody">${localized("sevenDay.day7.choices.resourcesBody", language)}</span></a><a href="${escapeHtml(whatsappHref)}" target="_blank" rel="noopener noreferrer"><strong data-i18n="sevenDay.day7.choices.whatsappTitle">${localized("sevenDay.day7.choices.whatsappTitle", language)}</strong><span data-i18n="sevenDay.day7.choices.whatsappBody">${localized("sevenDay.day7.choices.whatsappBody", language)}</span></a><a class="sevenDayLesson__bridgePrimary" href="${escapeHtml(data.routes.masterKeySystem)}"><strong data-i18n="sevenDay.day7.choices.journeyTitle">${localized("sevenDay.day7.choices.journeyTitle", language)}</strong><span data-i18n="sevenDay.day7.choices.journeyBody">${localized("sevenDay.day7.choices.journeyBody", language)}</span></a></div></section>`;
}

export function renderSevenDayLesson({ lesson, data, language = "en" }) {
  const lessonIndex = sevenDayExperience.lessons.indexOf(lesson);
  if (lessonIndex < 0) throw new RangeError(`Unknown seven-day lesson: ${lesson?.id ?? ""}`);

  const { lesson: headings, progress } = sevenDayExperience.sharedKeys;
  const progressStatusId = `${lesson.id}-progress-status`;
  const foundationNextStep = lesson.sequence === 7
    ? renderFoundationNextStep({ language, data })
    : "";

  return `<main class="sevenDayLesson" id="main-content"><article class="sevenDayLesson__article"><header class="sevenDayLesson__header"><p class="eyebrow" data-i18n="sevenDay.dashboard.eyebrow">${localized("sevenDay.dashboard.eyebrow", language)}</p><p class="sevenDayLesson__day" data-i18n="${lesson.contentKeys.status}">${localized(lesson.contentKeys.status, language)}</p><h1 data-i18n="${lesson.contentKeys.title}">${localized(lesson.contentKeys.title, language)}</h1></header><div class="sevenDayLesson__practiceList">${renderPracticeSection(lesson, "teaching", headings.teachingHeading, language)}${renderPracticeSection(lesson, "observation", headings.observationHeading, language)}${renderPracticeSection(lesson, "reflection", headings.reflectionHeading, language)}${renderPracticeSection(lesson, "action", headings.actionHeading, language)}${renderWorkbook(lesson, language)}</div><section class="sevenDayLesson__completion" aria-labelledby="${lesson.id}-progress-heading"><h2 id="${lesson.id}-progress-heading" data-i18n="${progress.heading}">${localized(progress.heading, language)}</h2><p id="${progressStatusId}" role="status" aria-live="polite" tabindex="-1" data-progress-status data-i18n="${progress.empty}">${localized(progress.empty, language)}</p><button class="button--primary" type="button" data-progress-complete="${lesson.id}" data-progress-complete-key="${lesson.contentKeys.completion}" disabled aria-describedby="${progressStatusId}" aria-pressed="false" data-i18n="${lesson.contentKeys.completion}">${localized(lesson.contentKeys.completion, language)}</button></section>${foundationNextStep}<aside class="sevenDayLesson__contact" data-contact-action></aside>${renderDaySevenBridge(lesson, data, language)}${renderNavigation(lesson, lessonIndex, data, language)}</article></main>`;
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
    scripts: ["/assets/seven-day-progress.mjs", "/assets/seven-day-workbook.mjs"],
  };
}
