import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { routeRenderers } from "../src/routes.mjs";

const curriculumScript = readFileSync(new URL("../assets/curriculum.mjs", import.meta.url), "utf8");

function curriculumPage(language = "en") {
  return routeRenderers[siteData.routes.masterKeySystem](siteData, language).body;
}

test("Master Key page provides the calm 24-chapter Study Room around the preserved curriculum", () => {
  const html = curriculumPage();
  assert.match(html, /<h1>Chapter 1 - One Consciousness – One Power<\/h1>/);
  assert.equal((html.match(/class="mksStudyRoom__chapter"/g) ?? []).length, 24);
  assert.equal((html.match(/data-week="\d+"/g) ?? []).length, 24);
  assert.equal((html.match(/class="mksStudyRoom__qa"/g) ?? []).length, 240);
  assert.equal((html.match(/class="mksStudyRoom__complete"/g) ?? []).length, 24);
  assert.match(html, /Study → Practise → Reflect → Apply/);
  assert.doesNotMatch(html, /READY TO GO DEEPER\?|EXPLORE THE 24-WEEK PROGRAMME|Full teaching is only available to enrolled members/);
  assert.doesNotMatch(html, /START YOUR 7 DAYS|EXPLORE THE METHOD|GET THE MKS BOOK/);
  for (const [stage, range] of [["Foundation", "Chapters 1–4"], ["Visualisation", "Chapters 5–11"], ["Concentration", "Chapters 12–18"], ["Integration & Mastery", "Chapters 19–24"]]) {
    assert.match(html, new RegExp(stage));
    assert.match(html, new RegExp(range));
  }
});

test("MKS lesson and answer material is collapsed with keyboard-accessible controls", () => {
  const html = curriculumPage();
  assert.doesNotMatch(html, /<details[^>]+open/);
  assert.equal((html.match(/<h3>About the exercise<\/h3>/g) ?? []).length, 24);
  assert.equal((html.match(/class="mksStudyRoom__qa"/g) ?? []).length, 240);
});

test("MKS source content and client controls remain available", () => {
  const source = readFileSync(new URL("../content/master-key-curriculum.html", import.meta.url), "utf8");
  const client = readFileSync(new URL("../assets/curriculum.mjs", import.meta.url), "utf8");
  assert.match(source, /One Consciousness - One Power/);
  assert.match(source, /The Truth shall set you free/);
  assert.match(client, /mksStudyRoom__select/);
  assert.match(client, /data-complete-week/);
  assert.match(client, /uyp-mks-study-progress/);
  assert.match(client, /scrollIntoView/);
});

test("MKS Study Room uses the four approved visual stage banners without promotional overlays", () => {
  const html = curriculumPage();
  for (const image of ["foundation-chapters-1-4.png", "visualisation-chapters-5-11.png", "concentration-chapters-12-18.png", "contemplation-mastery-chapters-19-24.png"]) {
    assert.match(html, new RegExp(image));
  }
  assert.equal((html.match(/class="mksStudyRoom__visualNavLink"/g) ?? []).length, 4);
  assert.equal((html.match(/class="mksStudyRoom__stageBanner"/g) ?? []).length, 4);
  assert.doesNotMatch(html, /pricing|coaching CTA|start your free 7 days/i);
});

test("MKS Study Room synchronizes the active sidebar stage and chapter while scrolling", () => {
  assert.match(curriculumScript, /IntersectionObserver/);
  assert.match(curriculumScript, /aria-current/);
  assert.match(curriculumScript, /mksStudyRoom__currentTitle/);
});

test("MKS Study Room stays structurally aligned in English and Spanish", () => {
  const english = curriculumPage("en");
  const spanish = curriculumPage("es");
  for (const marker of ["mksStudyRoom", "mksStudyRoom__select", "mksStudyRoom__chapter", "mksStudyRoom__qa", "Foundation", "Visualisation", "Concentration", "Integration &amp; Mastery"]) {
    assert.equal((english.match(new RegExp(marker, "g")) ?? []).length, (spanish.match(new RegExp(marker, "g")) ?? []).length, marker);
  }
});

test("Study Room responsive styles keep the content bounded and keyboard focus visible", () => {
  const css = readFileSync(new URL("../assets/platform.css", import.meta.url), "utf8");
  const sidebarRule = css.match(/\.mksStudyRoom__sidebar\s*\{[^}]*\}/s)?.[0] ?? "";
  assert.doesNotMatch(sidebarRule, /position:\s*sticky/);
  assert.match(css, /\.mksStudyRoom\s*\{[^}]*overflow-x:\s*clip/s);
  assert.match(css, /\.mksStudyRoom__lesson\s*\{[^}]*max-width:\s*760px/s);
  assert.match(css, /\.mksStudyRoom__stageBanner img\s*\{[^}]*width:\s*100%[^}]*height:\s*auto/s);
  assert.match(css, /\.mksStudyRoom__stageBanner:focus-visible/);
  assert.match(css, /@media \(max-width:\s*768px\)[\s\S]*\.mksStudyRoom__layout[\s\S]*grid-template-columns:\s*minmax\(0, 1fr\)/s);
});
