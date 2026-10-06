import { readFileSync } from "node:fs";
import { t } from "../../content/translations.mjs";

const curriculum = readFileSync(new URL("../../content/master-key-curriculum.html", import.meta.url), "utf8").trim()
  .replaceAll("One Consciousness - One Power", "One Consciousness – One Power")
  .replaceAll("Thoughts become Things", "Thoughts Become Things")
  .replaceAll("The true “Self”", "The True “Self”");
const chapterGridOpening = '<div class="chapterGrid">';
const chapterGridStart = curriculum.indexOf(chapterGridOpening);
const chapterGridEnd = curriculum.indexOf('</div><p class="sourceNote">', chapterGridStart);

const stages = Object.freeze([
  { id: "foundation", title: "Foundation", weeks: "Chapters 1–4", start: 0, end: 4, image: "foundation-chapters-1-4.png" },
  { id: "visualisation", title: "Visualisation", weeks: "Chapters 5–11", start: 4, end: 11, image: "visualisation-chapters-5-11.png" },
  { id: "concentration", title: "Concentration", weeks: "Chapters 12–18", start: 11, end: 18, image: "concentration-chapters-12-18.png" },
  { id: "integration-mastery", title: "Integration & Mastery", weeks: "Chapters 19–24", start: 18, end: 24, image: "contemplation-mastery-chapters-19-24.png" },
]);

const chapterVideos = Object.freeze({
  2: "https://photos.google.com/search/CgZWaWRlb3MiCBIGCgQqAggBKN+0mvePNA%3D%3D/photo/AF1QipO7x3Zc8oNkYOlb3Ef0Lnnk_N7TQCWu2gsrwHFD",
  3: "https://photos.google.com/search/CgZWaWRlb3MiCBIGCgQqAggBKLbc%2FfWPNA%3D%3D/photo/AF1QipN0t6Aoci1rOGfEm1SPcRENKbtqiHzr1TXTVwOq",
  4: "https://photos.google.com/search/CgZWaWRlb3MiCBIGCgQqAggBKLbc%2FfWPNA%3D%3D/photo/AF1QipMEAHCw-7xIqNsdkLlaDCWNWW3CZZ1UFZLcMT_P",
});

const roomCopy = Object.freeze({
  en: {
    eyebrow: "MKS STUDY ROOM", intro: "A calm place to study one chapter, practise one exercise and carry one principle into the week.", choose: "Choose a week", navigation: "Course navigation", current: "Current week", purpose: "Weekly purpose", rhythm: "Weekly rhythm", rhythmText: "Study → Practise → Reflect → Apply", progress: "Week 1 of 24", previous: "Previous Week", complete: "Complete Week", completed: "Completed", next: "Next Week", week: "Week", start: "Start the free 7-Day Experience", foundation: "Explore Foundation",
  },
  es: {
    eyebrow: "SALA DE ESTUDIO MKS", intro: "Un espacio tranquilo para estudiar un capítulo, practicar un ejercicio y llevar un principio a tu semana.", choose: "Elige una semana", navigation: "Navegación del curso", current: "Semana actual", purpose: "Propósito de la semana", rhythm: "Ritmo semanal", rhythmText: "Estudia → Practica → Reflexiona → Aplica", progress: "Semana 1 de 24", previous: "Semana anterior", complete: "Completar semana", completed: "Completada", next: "Siguiente semana", week: "Semana", start: "Empieza la experiencia gratuita de 7 días", foundation: "Explora Foundation",
  },
});

function chapterNavigation(index, copy) {
  const previous = index > 0 ? `<a href="#week-${index}" class="curriculumWeekNav__previous">${copy.previous}</a>` : "";
  const next = index < 23 ? `<a href="#week-${index + 2}" class="curriculumWeekNav__next">${copy.next}</a>` : "";
  return `<nav class="curriculumWeekNav" aria-label="${copy.week} ${index + 1} navigation">${previous}<button type="button" class="mksStudyRoom__complete" data-complete-week="${index + 1}" aria-pressed="false" data-complete-label="${copy.complete}" data-completed-label="${copy.completed}">${copy.complete}</button>${next}</nav>`;
}
function transformQuestions(chapter) {
  const questionPair = /<div class="qaPair"><dt>([\s\S]*?)<\/dt><dd>([\s\S]*?)<\/dd><\/div>/g;
  return chapter
    .replace('<div class="weeklyQA">', '<div class="weeklyQA mksStudyRoom__questions">')
    .replace("<dl>", '<div class="mksStudyRoom__qaList">')
    .replace("</dl>", "</div>")
    .replace(questionPair, '<details class="mksStudyRoom__qa"><summary>$1</summary><div>$2</div></details>');
}

function chapterVideoCard(number, url) {
  return `<a class="weekVideo" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="Watch the Week ${number} Master Key lesson video in a new tab"><span class="weekVideoPlay" aria-hidden="true">▶</span><span><small>WEEK ${number} VIDEO</small><strong>Watch the guided lesson</strong><em>Opens the public video in Google Photos</em></span><b aria-hidden="true">↗</b></a>`;
}

function renderChapters(language) {
  if (chapterGridStart < 0 || chapterGridEnd < 0) throw new Error("Master Key curriculum chapters could not be located.");
  const source = curriculum.slice(chapterGridStart + chapterGridOpening.length, chapterGridEnd);
  const fragments = source.split("</details><details>");
  if (fragments.length !== 24) throw new Error("Expected exactly 24 Master Key curriculum chapters.");
  const copy = roomCopy[language] ?? roomCopy.en;

  return fragments.map((fragment, index) => {
    const opening = index === 0 ? fragment : `<details>${fragment}`;
    let chapter = `${opening}${index === fragments.length - 1 ? "" : "</details>"}`
      .replace("<details>", `<details id="week-${index + 1}" class="mksStudyRoom__chapter" data-week="${index + 1}">`)
      .replaceAll("AI MASTERY COACH", "AI MASTERY PROMPT")
      .replace("Paste this into ChatGPT. Your AI coach will test, challenge and guide you one step at a time—without giving away the answers too early.", "Copy this guided prompt into ChatGPT to explore this week's Master Key lesson more deeply.")
      .replaceAll("<h3>Exercise</h3>", "<h3>About the exercise</h3>");
    chapter = transformQuestions(chapter);
    if (chapterVideos[index + 1]) chapter = chapter.replace("<h3>Introduction</h3>", `<h3>Introduction</h3>${chapterVideoCard(index + 1, chapterVideos[index + 1])}`);
    chapter = chapter.replace("</div></details>", `${chapterNavigation(index, copy)}</div></details>`);
    return { index, title: chapter.match(/<summary>[\s\S]*?<strong>([\s\S]*?)<\/strong>/)?.[1] ?? `${copy.week} ${index + 1}`, html: chapter };
  });
}

function renderCourseNavigation(chapters, copy) {
  const stagesMarkup = stages.map((stage) => `<section class="mksStudyRoom__stage" data-stage="${stage.id}"><header><p>${stage.weeks}</p><h2>${stage.title}</h2></header><ol>${chapters.slice(stage.start, stage.end).map((chapter) => `<li><a href="#week-${chapter.index + 1}"><span>${copy.week} ${chapter.index + 1}</span><strong>${chapter.title}</strong></a></li>`).join("")}</ol></section>`).join("");
  return `<nav class="mksStudyRoom__courseNav" aria-label="${copy.navigation}">${stagesMarkup}<p class="mksStudyRoom__conversion"><a href="/start-free/">${copy.start}</a> · <a href="/foundation/">${copy.foundation}</a></p></nav>`;
}

function renderStageVisualNavigation(copy) {
  return `<nav class="mksStudyRoom__visualNav" aria-label="${copy.navigation}">${stages.map((stage) => `<a href="#stage-${stage.id}" class="mksStudyRoom__visualNavLink"><img src="/images/master-key-visuals/${stage.image}" alt="${stage.title} — ${stage.weeks}" loading="lazy"><span>${stage.title}</span></a>`).join("")}</nav>`;
}

function renderCurriculum(language) {
  const copy = roomCopy[language] ?? roomCopy.en;
  const chapters = renderChapters(language);
  const options = chapters.map((chapter) => `<option value="week-${chapter.index + 1}">${copy.week} ${chapter.index + 1} — ${chapter.title}</option>`).join("");
  const foundationCta = `<aside class="mksStudyRoom__foundationCta" aria-labelledby="mks-foundation-cta-heading"><p id="mks-foundation-cta-heading" data-i18n="mks.foundationCta.heading">${t("mks.foundationCta.heading", language)}</p><a class="button--secondary" href="/foundation/" data-i18n="mks.foundationCta.action">${t("mks.foundationCta.action", language)}</a></aside>`;
  const groupedChapters = stages.map((stage) => `<section class="mksStudyRoom__stageBlock" id="stage-${stage.id}" data-stage="${stage.id}"><a class="mksStudyRoom__stageBanner" href="#week-${stage.start + 1}" aria-label="${stage.title} — ${stage.weeks}"><img src="/images/master-key-visuals/${stage.image}" alt="${stage.title} — ${stage.weeks}" loading="lazy"></a><header class="mksStudyRoom__stageHeader"><p>${stage.weeks}</p><h2>${stage.title}</h2></header><div class="chapterGrid">${chapters.slice(stage.start, stage.end).map((chapter) => chapter.html).join("")}</div></section>${stage.id === "foundation" ? foundationCta : ""}`).join("");

  return `<section class="mksStudyRoom__shell" id="study-room"><header class="mksStudyRoom__intro"><p class="eyebrow">${copy.eyebrow}</p><h1>Chapter 1 - One Consciousness – One Power</h1><p>${copy.intro}</p></header><div class="mksStudyRoom__layout"><aside class="mksStudyRoom__sidebar"><label for="mks-week-select">${copy.choose}</label><select id="mks-week-select" class="mksStudyRoom__select" aria-label="${copy.choose}">${options}</select>${renderStageVisualNavigation(copy)}${renderCourseNavigation(chapters, copy)}</aside><div class="mksStudyRoom__lesson"><section class="mksStudyRoom__current" aria-labelledby="mks-current-title"><p class="eyebrow">${copy.current}</p><h2 id="mks-current-title">${copy.week} 1 · Foundation</h2><p class="mksStudyRoom__currentTitle">One Consciousness – One Power</p><p class="mksStudyRoom__purpose"><strong>${copy.purpose}</strong> Study the relationship between the world within and the world without, then practise stillness and conscious choice.</p><div class="mksStudyRoom__progress"><span>${copy.progress}</span><progress value="1" max="24">1/24</progress></div><aside class="mksStudyRoom__rhythm"><strong>${copy.rhythm}</strong><span>${copy.rhythmText}</span></aside></section><div class="mksStudyRoom__chapters">${groupedChapters}</div></div></div></section>`;
}

export function masterKeyCurriculumPage(data, language = "en") {
  return {
    route: data.routes.masterKeySystem,
    language,
    title: t("route.masterKeySystem.metaTitle", language),
    description: t("route.masterKeySystem.metaDescription", language),
    titleKey: "route.masterKeySystem.metaTitle",
    descriptionKey: "route.masterKeySystem.metaDescription",
    body: `<main class="curriculumPage mksStudyRoom" id="main-content">${renderCurriculum(language)}</main>`,
    styles: ["/assets/platform.css"],
    scripts: ["/assets/curriculum.mjs"],
  };
}
