import { readFileSync } from "node:fs";
import { siteData as canonicalSiteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";

const curriculum = readFileSync(new URL("../../content/master-key-curriculum.html", import.meta.url), "utf8").trim();
const chapterGridOpening = '<div class="chapterGrid">';
const chapterGridStart = curriculum.indexOf(chapterGridOpening);
const chapterGridEnd = curriculum.indexOf('</div><p class="sourceNote">', chapterGridStart);

const phases = Object.freeze([
  { title: "FOUNDATION", weeks: "Weeks 1–4", start: 0, end: 4 },
  { title: "AWARENESS & CONTROL", weeks: "Weeks 5–11", start: 4, end: 11 },
  { title: "APPLICATION", weeks: "Weeks 12–18", start: 11, end: 18 },
  { title: "INTEGRATION & MASTERY", weeks: "Weeks 19–24", start: 18, end: 24 },
]);

function chapterNavigation(index) {
  const previous = index > 0 ? `<a href="#week-${index}" class="curriculumWeekNav__previous">Previous Week</a>` : "";
  const next = index < 23 ? `<a href="#week-${index + 2}" class="curriculumWeekNav__next">Next Week</a>` : "";
  return `<nav class="curriculumWeekNav" aria-label="Week ${index + 1} navigation">${previous}${next}</nav>`;
}

function renderChapters() {
  if (chapterGridStart < 0 || chapterGridEnd < 0) throw new Error("Master Key curriculum chapters could not be located.");
  const source = curriculum.slice(chapterGridStart + chapterGridOpening.length, chapterGridEnd);
  const fragments = source.split("</details><details>");
  if (fragments.length !== 24) throw new Error("Expected exactly 24 Master Key curriculum chapters.");

  return fragments.map((fragment, index) => {
    const opening = index === 0 ? fragment : `<details>${fragment}`;
    const chapter = `${opening}${index === fragments.length - 1 ? "" : "</details>"}`
      .replace("<details>", `<details id="week-${index + 1}">`)
      .replace("AI MASTERY COACH", "AI MASTERY PROMPT")
      .replace("Paste this into ChatGPT. Your AI coach will test, challenge and guide you one step at a time—without giving away the answers too early.", "Copy this guided prompt into ChatGPT to explore this week's Master Key lesson more deeply.");
    return chapter.replace("</div></details>", `${chapterNavigation(index)}</div></details>`);
  });
}

function renderCurriculum() {
  const chapters = renderChapters();
  const jumpLinks = chapters.map((_, index) => `<a href="#week-${index + 1}">Week ${index + 1}</a>`).join("");
  const groupedChapters = phases.map((phase) => (
    `<section class="curriculumPhase"><header><p>${phase.weeks}</p><h2>${phase.title}</h2></header><div class="chapterGrid">${chapters.slice(phase.start, phase.end).join("")}</div></section>`
  )).join("");

  const notes = curriculum.slice(chapterGridEnd + "</div>".length, -"</section>".length);
  return `<section class="curriculum section" id="curriculum"><header class="curriculumPage__intro"><p class="eyebrow">THE MASTER KEY SYSTEM</p><h1>24 Weeks. One Progressive Journey.</h1><p>Explore Charles F. Haanel's Master Key System week by week. Each chapter builds on the previous one through study, practical exercises, reflection and application.</p></header><nav class="curriculumJump" aria-label="Jump to a week"><span>Jump to a week</span><div>${jumpLinks}</div></nav>${groupedChapters}${notes}</section>`;
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
