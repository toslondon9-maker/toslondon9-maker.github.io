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

export function renderSevenDayLesson({ lesson, data, language = "en" }) {
  const lessonIndex = sevenDayExperience.lessons.indexOf(lesson);
  if (lessonIndex < 0) throw new RangeError(`Unknown seven-day lesson: ${lesson?.id ?? ""}`);

  const { lesson: headings, progress } = sevenDayExperience.sharedKeys;
  const progressStatusId = `${lesson.id}-progress-status`;

  return `<main class="sevenDayLesson" id="main-content"><article class="sevenDayLesson__article"><header class="sevenDayLesson__header"><p class="eyebrow" data-i18n="sevenDay.dashboard.eyebrow">${localized("sevenDay.dashboard.eyebrow", language)}</p><p class="sevenDayLesson__day" data-i18n="${lesson.contentKeys.status}">${localized(lesson.contentKeys.status, language)}</p><h1 data-i18n="${lesson.contentKeys.title}">${localized(lesson.contentKeys.title, language)}</h1></header><div class="sevenDayLesson__practiceList">${renderPracticeSection(lesson, "teaching", headings.teachingHeading, language)}${renderPracticeSection(lesson, "observation", headings.observationHeading, language)}${renderPracticeSection(lesson, "reflection", headings.reflectionHeading, language)}${renderPracticeSection(lesson, "action", headings.actionHeading, language)}</div><section class="sevenDayLesson__completion" aria-labelledby="${lesson.id}-progress-heading"><h2 id="${lesson.id}-progress-heading" data-i18n="${progress.heading}">${localized(progress.heading, language)}</h2><p id="${progressStatusId}" role="status" aria-live="polite" data-progress-status data-i18n="${progress.empty}">${localized(progress.empty, language)}</p><button class="button--primary" type="button" data-progress-complete="${lesson.id}" disabled aria-describedby="${progressStatusId}" data-i18n="${lesson.contentKeys.completion}">${localized(lesson.contentKeys.completion, language)}</button></section><aside class="sevenDayLesson__contact" data-contact-action></aside>${renderNavigation(lesson, lessonIndex, data, language)}</article></main>`;
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
    scripts: [],
  };
}
