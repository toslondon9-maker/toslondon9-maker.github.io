import { readFileSync } from "node:fs";
import { siteData as canonicalSiteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";

const curriculum = readFileSync(new URL("../../content/master-key-curriculum.html", import.meta.url), "utf8").trim();
const chapterGridOpening = '<div class="chapterGrid">';
const chapterGridStart = curriculum.indexOf(chapterGridOpening);
const chapterGridEnd = curriculum.indexOf('</div><p class="sourceNote">', chapterGridStart);
const phases = Object.freeze([
  { title: "FOUNDATION", range: "Chapters 1–4", start: 0, end: 4, image: "/images/master-key-visuals/foundation-chapters-1-4.webp", alt: "Foundation — Master Key System Chapters 1 to 4" },
  { title: "VISUALISATION", range: "Chapters 5–11", start: 4, end: 11, image: "/images/master-key-visuals/visualisation-chapters-5-11.webp", alt: "Visualisation — Master Key System Chapters 5 to 11" },
  { title: "CONCENTRATION", range: "Chapters 12–18", start: 11, end: 18, image: "/images/master-key-visuals/concentration-chapters-12-18.webp", alt: "Concentration — Master Key System Chapters 12 to 18" },
  { title: "CONTEMPLATION & MASTERY", range: "Chapters 19–24", start: 18, end: 24, image: "/images/master-key-visuals/contemplation-mastery-chapters-19-24.webp", alt: "Contemplation and Mastery — Master Key System Chapters 19 to 24" },
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

function enhanceAiPrompt(chapter, number) {
  return chapter
    .replace(/<details class="promptPreview"><summary>Preview the engineered prompt <b>＋<\/b><\/summary><pre>([\s\S]*?)<\/pre><\/details>/, `<details class="aiMasteryPrompt" aria-label="Week ${number} guided prompt"><summary>View guided prompt <b aria-hidden="true">＋</b></summary><div class="aiMasteryPrompt__content"><p class="aiMasteryPrompt__label">WEEK ${number} GUIDED PROMPT</p><pre>$1</pre></div></details>`)
    .replace(/(<button type="button" aria-label="Copy the Week \d+ AI mastery prompt">Copy prompt<\/button>)(<\/div>)/, `$1<span class="aiCopyFeedback" data-ai-copy-feedback role="status" aria-live="polite"></span>$2`);
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
    return enhanceAiPrompt(wrapPractice(chapter), number).replace("</div></details>", `</div>${chapterNavigation(index)}</article></details>`);
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
  return `<button class="curriculumStudyNav__toggle" type="button" data-curriculum-navigator-toggle aria-expanded="false" aria-controls="curriculum-study-navigator">Show all 24 chapters <span aria-hidden="true">⌄</span></button><nav class="curriculumStudyNav" id="curriculum-study-navigator" data-curriculum-navigator aria-label="24 chapter navigator">${groups}</nav>`;
}

function renderCurriculum() {
  const chapters = renderChapters();
  const groupedChapters = phases.map((phase) => (
    `<section class="curriculumPhase" aria-labelledby="${phase.title.toLowerCase().replaceAll(/[^a-z]+/g, "-")}"><figure class="curriculumPhase__visual"><img src="${phase.image}" alt="${phase.alt}" width="1440" height="810" loading="lazy" decoding="async"></figure><header><p>${phase.range}</p><h2 id="${phase.title.toLowerCase().replaceAll(/[^a-z]+/g, "-")}">${phase.title}</h2></header><div class="chapterGrid">${chapters.slice(phase.start, phase.end).join("")}</div></section>`
  )).join("");
  const notes = curriculum.slice(chapterGridEnd + "</div>".length, -"</section>".length);
  return `<section class="curriculum section" id="curriculum"><header class="curriculumPage__intro"><figure class="curriculumPage__heroVisual"><img src="/images/master-key-visuals/master-key-24-week-hero.webp" alt="The Master Key System — 24 Weeks to Master the Way You Use Your Mind" width="1440" height="810" fetchpriority="high" decoding="async"></figure><p class="eyebrow">THE MASTER KEY SYSTEM</p><h1>24 Weeks to Master the Way You Use Your Mind</h1><p class="curriculumPage__status" data-curriculum-status aria-live="polite">Chapter 1 of 24 · FOUNDATION</p><p>Explore Charles F. Haanel's Master Key System week by week. Each chapter builds on the previous one through study, practical exercises, reflection and application.</p><div class="curriculumPage__introActions"><a class="button--secondary" href="${canonicalSiteData.routes.getTheBook}">GET THE MKS BOOK</a><a class="button--text" href="${canonicalSiteData.routes.aiMentors}">USE THE FREE AI MENTOR</a></div></header>${renderStudyNavigator()}${groupedChapters}${notes}</section>`;
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
    scripts: ["/assets/curriculum.mjs?v=20260830-prompt-nav-3"],
    socialImage: "/images/master-key-visuals/master-key-24-week-hero.png",
    socialImageAlt: "The Master Key System — 24 Weeks to Master the Way You Use Your Mind",
  };
}
