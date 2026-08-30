import { sevenDayExperience } from "../../content/seven-day-experience.mjs";
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

export function renderStartFree({ language = "en" } = {}) {
  const { dashboard, progress, privacy, reset, independence } = sevenDayExperience.sharedKeys;
  const dayOne = sevenDayExperience.lessons[0];

  return `<main class="sevenDayDashboard" id="main-content"><section class="sevenDayDashboard__hero"><div class="sevenDayDashboard__inner sevenDayDashboard__heroGrid"><div class="sevenDayDashboard__heroCopy"><p class="eyebrow" data-i18n="${dashboard.eyebrow}">${escapeHtml(t(dashboard.eyebrow, language))}</p>${copy(dashboard.title, language, "h1")}<p class="routeShell__purpose" data-i18n="${dashboard.intro}">${escapeHtml(t(dashboard.intro, language))}</p><ul class="sevenDayDashboard__heroFacts"><li data-i18n="sevenDay.dashboard.fact1">${escapeHtml(t("sevenDay.dashboard.fact1", language))}</li><li data-i18n="sevenDay.dashboard.fact2">${escapeHtml(t("sevenDay.dashboard.fact2", language))}</li><li data-i18n="sevenDay.dashboard.fact3">${escapeHtml(t("sevenDay.dashboard.fact3", language))}</li></ul><a class="button--primary routeShell__action" href="${escapeHtml(dayOne.route)}" data-i18n="${dashboard.start}">${escapeHtml(t(dashboard.start, language))}</a></div><div class="sevenDayDashboard__heroVisual"><img src="/images/free-7-day-taster.jpeg" width="1122" height="1402" loading="eager" decoding="async" alt="${escapeHtml(t("sevenDay.dashboard.imageAlt", language))}" data-i18n-alt="sevenDay.dashboard.imageAlt"></div></div></section><section class="sevenDayDashboard__body"><div class="sevenDayDashboard__inner"><div class="sevenDayDashboard__how"><p class="eyebrow" data-i18n="sevenDay.dashboard.howEyebrow">${escapeHtml(t("sevenDay.dashboard.howEyebrow", language))}</p><h2 data-i18n="sevenDay.dashboard.howTitle">${escapeHtml(t("sevenDay.dashboard.howTitle", language))}</h2><ol><li><strong>01</strong><span data-i18n="sevenDay.dashboard.how1">${escapeHtml(t("sevenDay.dashboard.how1", language))}</span></li><li><strong>02</strong><span data-i18n="sevenDay.dashboard.how2">${escapeHtml(t("sevenDay.dashboard.how2", language))}</span></li><li><strong>03</strong><span data-i18n="sevenDay.dashboard.how3">${escapeHtml(t("sevenDay.dashboard.how3", language))}</span></li></ol></div><p class="sevenDayDashboard__progressive" data-i18n="${dashboard.progressive}">${escapeHtml(t(dashboard.progressive, language))}</p><section class="sevenDayDashboard__progress" aria-labelledby="seven-day-progress-heading">${heading(progress.heading, "seven-day-progress-heading", language)}<p id="seven-day-progress-status" class="sevenDayDashboard__progressStatus" role="status" aria-live="polite" tabindex="-1" data-progress-status data-i18n="${progress.empty}">${escapeHtml(t(progress.empty, language))}</p><button class="button--text sevenDayDashboard__reset" type="button" data-progress-reset disabled data-i18n="${reset.label}">${escapeHtml(t(reset.label, language))}</button></section><section class="sevenDayDashboard__lessons" aria-labelledby="seven-day-lessons-heading">${heading(dashboard.lessonsHeading, "seven-day-lessons-heading", language)}<ol class="sevenDayDashboard__lessonList">${renderLessonCards(language)}</ol></section>${renderWorkbookDownload(language)}<aside class="sevenDayDashboard__privacy" aria-labelledby="seven-day-privacy-heading">${heading(privacy.heading, "seven-day-privacy-heading", language)}<p data-i18n="${privacy.body}">${escapeHtml(t(privacy.body, language))}</p><p class="sevenDayDashboard__independence" data-i18n="${independence}">${escapeHtml(t(independence, language))}</p></aside></div></section></main>`;
}

export function startFreePage(data = siteData, language = "en") {
  return {
    route: data.routes.startFree,
    language,
    title: t("route.startFree.metaTitle", language),
    description: t("route.startFree.metaDescription", language),
    titleKey: "route.startFree.metaTitle",
    descriptionKey: "route.startFree.metaDescription",
    body: renderStartFree({ language }),
    scripts: ["/assets/seven-day-progress.mjs"],
  };
}
