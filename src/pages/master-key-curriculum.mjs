import { readFileSync } from "node:fs";
import { siteData as canonicalSiteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";

const curriculum = readFileSync(new URL("../../content/master-key-curriculum.html", import.meta.url), "utf8").trim();
const chapterGridOpening = '<div class="chapterGrid">';
const chapterGridStart = curriculum.indexOf(chapterGridOpening);
const chapterGridEnd = curriculum.indexOf('</div><p class="sourceNote">', chapterGridStart);
const phases = Object.freeze([
  { title: "FOUNDATION", range: "Chapters 1–4", start: 0, end: 4 },
  { title: "VISUALISATION", range: "Chapters 5–11", start: 4, end: 11 },
  { title: "CONCENTRATION", range: "Chapters 12–18", start: 11, end: 18 },
  { title: "CONTEMPLATION & MASTERY", range: "Chapters 19–24", start: 18, end: 24 },
]);

function phaseFor(index) {
  return phases.find((phase) => index >= phase.start && index < phase.end);
}

function chapterNavigation(index) {
  const previous = index > 0 ? `<a href="#week-${index}" class="curriculumWeekNav__previous" data-curriculum-chapter-link="${index}">← Previous Chapter</a>` : "";
  const next = index < 23 ? `<a href="#week-${index + 2}" class="curriculumWeekNav__next" data-curriculum-chapter-link="${index + 2}">Next Chapter →</a>` : "";
  return `<div class="curriculumChapterClosing"><aside class="curriculumCoachingCta"><p>Want Tariq to guide you through all 24 weeks?</p><a href="${canonicalSiteData.routes.coaching}">Explore the 24-Week Programme</a></aside><nav class="curriculumWeekNav" aria-label="Chapter ${index + 1} navigation">${previous}<button type="button" data-curriculum-complete aria-pressed="false">Complete Chapter <span aria-hidden="true">✓</span></button>${next}</nav></div>`;
}

function wrapPractice(chapter) {
  return chapter.replace(/<h3>Exercise<\/h3><p>([\s\S]*?)<\/p>(?=<div class="aiMastery">)/, `<section class="curriculumPractice" aria-label="This week's practice"><p class="curriculumPractice__eyebrow">🔑 THIS WEEK'S PRACTICE</p><div><h3>Exercise</h3><p>$1</p><p class="curriculumPractice__message">“The reading gives you the knowledge. The daily exercise creates the transformation.”</p></div></section>`);
}

function renderChapters() {
  if (chapterGridStart < 0 || chapterGridEnd < 0) throw new Error("Master Key curriculum chapters could not be located.");
  const source = curriculum.slice(chapterGridStart + chapterGridOpening.length, chapterGridEnd);
  const fragments = source.split("</details><details>");
  if (fragments.length !== 24) throw new Error("Expected exactly 24 Master Key curriculum chapters.");

  return fragments.map((fragment, index) => {
    const number = index + 1;
    const phase = phaseFor(index);
    const opening = index === 0 ? fragment : `<details>${fragment}`;
    const chapter = `${opening}${index === fragments.length - 1 ? "" : "</details>"}`
      .replace("<details>", `<details id="week-${number}" data-curriculum-chapter="${number}" data-curriculum-stage="${phase.title}"${index === 0 ? " open" : ""}>`)
      .replace("<summary>", `<summary><span class="curriculumChapterSummary__number">CHAPTER ${String(number).padStart(2, "0")}</span>`)
      .replace("</summary>", `<span class="curriculumChapterSummary__stage">${phase.title}</span></summary>`)
      .replace('<div class="chapterBody">', '<article class="curriculumReadingCard"><div class="chapterBody">')
      .replace("AI MASTERY COACH", "AI MASTERY PROMPT")
      .replace("Paste this into ChatGPT. Your AI coach will test, challenge and guide you one step at a time—without giving away the answers too early.", "Copy this guided prompt into ChatGPT to explore this week's Master Key lesson more deeply.");
    return wrapPractice(chapter).replace("</div></details>", `</div>${chapterNavigation(index)}</article></details>`);
  });
}

function renderStudyNavigator() {
  const groups = phases.map((phase) => {
    const links = Array.from({ length: phase.end - phase.start }, (_, offset) => {
      const chapter = phase.start + offset + 1;
      const current = chapter === 1 ? ' aria-current="true"' : "";
      return `<a href="#week-${chapter}" data-curriculum-chapter-link="${chapter}"${current}>${String(chapter).padStart(2, "0")}</a>`;
    }).join("");
    return `<section class="curriculumStudyNav__group"><header><strong>${phase.title}</strong><span>${phase.range}</span></header><div class="curriculumStudyNav__links">${links}</div></section>`;
  }).join("");
  return `<nav class="curriculumStudyNav" aria-label="24 chapter navigator">${groups}</nav>`;
}

function renderCurriculum() {
  const chapters = renderChapters();
  const groupedChapters = phases.map((phase) => (
    `<section class="curriculumPhase" aria-labelledby="${phase.title.toLowerCase().replaceAll(/[^a-z]+/g, "-")}"><header><p>${phase.range}</p><h2 id="${phase.title.toLowerCase().replaceAll(/[^a-z]+/g, "-")}">${phase.title}</h2></header><div class="chapterGrid">${chapters.slice(phase.start, phase.end).join("")}</div></section>`
  )).join("");
  const notes = curriculum.slice(chapterGridEnd + "</div>".length, -"</section>".length);
  return `<section class="curriculum section" id="curriculum"><header class="curriculumPage__intro"><p class="eyebrow">THE MASTER KEY SYSTEM</p><h1>24 Weeks to Master the Way You Use Your Mind</h1><p class="curriculumPage__status" data-curriculum-status aria-live="polite">Chapter 1 of 24 · FOUNDATION</p><p>Explore Charles F. Haanel's Master Key System week by week. Each chapter builds on the previous one through study, practical exercises, reflection and application.</p><a class="button--secondary" href="${canonicalSiteData.routes.getTheBook}">GET THE MKS BOOK</a></header>${renderStudyNavigator()}${groupedChapters}${notes}</section>`;
}

export function masterKeyCurriculumPage(data = canonicalSiteData, language = "en") {
  return {
    route: data.routes.masterKeySystem,
    language,
    title: t("route.masterKeySystem.metaTitle", language),
    description: t("route.masterKeySystem.metaDescription", language),
    titleKey: "route.masterKeySystem.metaTitle",
    descriptionKey: "route.masterKeySystem.metaDescription",
    body: `<main class="curriculumPage" id="main-content">${renderCurriculum()}</main>`,
    styles: ["/assets/index-Bgwsdhov.css"],
    scripts: ["/assets/curriculum.mjs"],
  };
}
