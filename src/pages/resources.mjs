import { siteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";
import { aiMentorChapters } from "./ai-mentors.mjs";

const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const allLessonNumbers = Object.freeze(Array.from({ length: 24 }, (_, index) => index + 1));
const affirmationsFile = "The Master Key System Affirmations For Success And Prosperity.mp3";

function audioCard(number, language) {
  const chapter = aiMentorChapters[number - 1];
  const file = `Lesson_${number}.mp3`;
  const label = t("resources.audio.lessonLabel", language).replace("{number}", String(number));
  const description = t("resources.audio.lessonDescription", language).replace("{number}", String(number));
  return `<figure class="resourcesPage__audioCard"><figcaption><span class="resourcesPage__audioNumber">${String(number).padStart(2, "0")}</span><h3>${esc(chapter.title)}</h3><p>${esc(description)}</p></figcaption><audio controls preload="none" aria-label="${esc(`${label}: ${chapter.title}`)}"><source src="/audio/mks/${encodeURIComponent(file)}" type="audio/mpeg">${esc(t("resources.audio.playerFallback", language))}</audio></figure>`;
}

export function audioSection(language, { includeHeading = true } = {}) {
  const lessons = allLessonNumbers.map((number) => audioCard(number, language)).join("");
  const affirmationsLabel = t("resources.audio.affirmationsTitle", language);
  const heading = includeHeading ? `<p class="eyebrow" data-i18n="resources.audio.eyebrow">${esc(t("resources.audio.eyebrow", language))}</p><h2 id="resources-audio-title" data-i18n="resources.audio.title">${esc(t("resources.audio.title", language))}</h2><p class="resourcesPage__audioIntro" data-i18n="resources.audio.intro">${esc(t("resources.audio.intro", language))}</p>` : "";
  return `<section class="resourcesPage__audio" aria-labelledby="resources-audio-title">${heading}<div class="resourcesPage__audioGrid">${lessons}</div><section class="resourcesPage__affirmations" aria-labelledby="resources-affirmations-title"><p class="eyebrow">MKS</p><h2 id="resources-affirmations-title">${esc(affirmationsLabel)}</h2><p>${esc(t("resources.audio.affirmationsDescription", language))}</p><audio controls preload="none" aria-label="${esc(affirmationsLabel)}"><source src="/audio/mks/${encodeURIComponent(affirmationsFile)}" type="audio/mpeg">${esc(t("resources.audio.playerFallback", language))}</audio></section></section>`;
}

export function resourcesPage(data = siteData, language = "en") {
  const groups = [
    ["STUDY", "Master Key supporting material.", `<a href="${data.routes.masterKeySystem}">Explore the 24-week Master Key curriculum</a><a href="${data.routes.masterKeySystemOnlineCourse}">Read about the Master Key System online course</a><a href="${data.routes.mksLineage}">Explore the MKS Lineage</a><a href="${data.routes.getTheBook}">Get your Master Key System book</a>`],
    ["PRACTISE", "Exercises and workbooks.", `<a href="${data.routes.startFree}">Start the free 7-day experience</a><a href="/downloads/seven-day-experience-workbook-en.pdf" download>Download the English workbook</a>`],
    ["LISTEN", "Audio, meditation and focus material.", `<a href="${data.routes.resourcesAudio}">Use the guided daily practice</a>`, "resourcesPage__group--listen"],
    ["REFLECT", "Reflection tools.", `<a href="${data.routes.masterKeySystem}">Reflect with the weekly questions</a><a href="/downloads/mks-end-result.pdf" download>Download the 24-Week End Result</a><p class="resourcesPage__quote">“All life and all power is from within.” <span>— Charles F. Haanel, <em>The Master Key System</em>, Part Five</span></p>`],
    ["EXPLORE", "Supporting external resources.", `<a href="${data.routes.aiMentors}">Open the free AI Mentor prompt builder</a>`],
  ];
  const cards = groups.map(([title, intro, links, className = ""]) => `<section class="resourcesPage__group${className ? ` ${className}` : ""}"><h2>${title}</h2><p>${intro}</p><div class="resourcesPage__links">${links}</div></section>`).join("");
  return { route: data.routes.resources, language, title: t("route.resources.metaTitle", language), description: t("route.resources.metaDescription", language), titleKey: "route.resources.metaTitle", descriptionKey: "route.resources.metaDescription", body: `<main><article class="resourcesPage"><p class="eyebrow">UNLEASH YOUR POWER</p><h1>${esc(t("route.resources.heading", language))}</h1><p class="routeShell__purpose">${esc(t("route.resources.purpose", language))}</p><div class="resourcesPage__grid">${cards}</div><details class="resourcesPage__optional"><summary>Optional: 3-Day Word Audit</summary><p>This optional resource is currently being prepared. The free 7-day experience remains available above.</p></details></article></main>`, scripts: [] };
}
