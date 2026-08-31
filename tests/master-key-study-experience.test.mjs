import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { routeRenderers } from "../src/routes.mjs";

function curriculumPage() {
  return routeRenderers[siteData.routes.masterKeySystem](siteData).body;
}

test("Master Key page provides the premium 24-chapter study shell around the preserved curriculum", () => {
  const html = curriculumPage();
  const navigator = html.match(/<nav class="curriculumStudyNav"[\s\S]*?<\/nav>/)?.[0] ?? "";

  assert.match(html, /<h1>24 Weeks to Master the Way You Use Your Mind<\/h1>/);
  assert.match(html, /data-curriculum-status[^>]*>Chapter 1 of 24 · FOUNDATION</);
  assert.equal((navigator.match(/data-curriculum-chapter-link/g) ?? []).length, 24);
  assert.equal((html.match(/data-curriculum-chapter=/g) ?? []).length, 24);
  assert.equal((html.match(/class="curriculumPractice"/g) ?? []).length, 24);
  assert.equal((html.match(/THIS WEEK'S PRACTICE/g) ?? []).length, 24);
  assert.equal((html.match(/The reading gives you the knowledge\. The daily exercise creates the transformation\./g) ?? []).length, 24);
  assert.equal((html.match(/class="aiMasteryPrompt"/g) ?? []).length, 24);
  assert.equal((html.match(/WEEK \d+ GUIDED PROMPT/g) ?? []).length, 24);
  assert.doesNotMatch(html, /Preview the engineered prompt/);
  assert.match(html, /Act as my personal Master Key System tutor, Socratic coach and accountability partner for Week 1/);
  assert.match(html, /Act as my personal Master Key System tutor, Socratic coach and accountability partner for Week 24/);
  assert.equal((html.match(/data-ai-copy-feedback/g) ?? []).length, 24);
  assert.equal((html.match(/data-curriculum-complete/g) ?? []).length, 24);
  assert.equal((html.match(/data-curriculum-section-link/g) ?? []).length, 72);
  for (const week of [1, 12, 24]) {
    assert.match(html, new RegExp(`href="#week-${week}-introduction"[^>]*data-curriculum-section-link="introduction"`));
    assert.match(html, new RegExp(`href="#week-${week}-content"[^>]*data-curriculum-section-link="content"`));
    assert.match(html, new RegExp(`href="#week-${week}-exercise"[^>]*data-curriculum-section-link="exercise"`));
    assert.match(html, new RegExp(`id="week-${week}-introduction"`));
    assert.match(html, new RegExp(`id="week-${week}-content"`));
    assert.match(html, new RegExp(`id="week-${week}-exercise"`));
  }
  assert.equal((html.match(/READY TO GO DEEPER\?/g) ?? []).length, 24);
  assert.equal((html.match(/EXPLORE THE 24-WEEK PROGRAMME/g) ?? []).length, 24);
  assert.equal((html.match(/href="\/coaching\/"/g) ?? []).length >= 24, true);
  for (const [title, range] of [["FOUNDATION", "Chapters 1–4"], ["VISUALISATION", "Chapters 5–11"], ["CONCENTRATION", "Chapters 12–18"], ["CONTEMPLATION & MASTERY", "Chapters 19–24"]]) {
    assert.match(html, new RegExp(`${title}[\\s\\S]*?${range}`));
  }
});

test("Master Key page keeps the curriculum source file intact while exposing selected chapter controls", () => {
  const source = readFileSync(new URL("../content/master-key-curriculum.html", import.meta.url), "utf8");
  const client = readFileSync(new URL("../assets/curriculum.mjs", import.meta.url), "utf8");
  const page = routeRenderers[siteData.routes.masterKeySystem](siteData);

  assert.match(source, /One Consciousness - One Power/);
  assert.match(source, /The Truth shall set you free/);
  assert.match(client, /data-curriculum-chapter-link/);
  assert.match(client, /data-curriculum-status/);
  assert.match(client, /data-curriculum-complete/);
  assert.match(client, /data-curriculum-section-link/);
  assert.match(client, /scrollIntoView\(\{ behavior: "smooth", block: "start" \}\)/);
  assert.match(client, /setAttribute\("aria-current", "true"\)/);
  assert.match(client, /removeAttribute\("aria-current"\)/);
  assert.match(client, /\.aiMasteryPrompt pre/);
  assert.match(client, /Prompt copied\./);
  assert.match(client, /Copy failed\./);
  assert.ok(page.scripts?.includes("/assets/curriculum.mjs?v=20260831-section-links-1"));
});

test("Master Key page uses the approved premium visual banners without changing chapter content", () => {
  const html = curriculumPage();
  const visualNames = [
    "master-key-24-week-hero",
    "foundation-chapters-1-4",
    "visualisation-chapters-5-11",
    "concentration-chapters-12-18",
    "contemplation-mastery-chapters-19-24",
  ];

  for (const name of visualNames) {
    assert.doesNotThrow(() => readFileSync(new URL(`../images/master-key-visuals/${name}.png`, import.meta.url)));
    assert.doesNotThrow(() => readFileSync(new URL(`../images/master-key-visuals/${name}.webp`, import.meta.url)));
    assert.match(html, new RegExp(`/images/master-key-visuals/${name}\\.webp`));
  }
  assert.equal((html.match(/class="curriculumPhase__visual"/g) ?? []).length, 4);
  assert.match(html, /class="curriculumPage__heroVisual"/);
});

test("premium curriculum styles protect reading contrast, sticky navigation and mobile chapter controls", () => {
  const css = readFileSync(new URL("../assets/platform.css", import.meta.url), "utf8");

  assert.match(css, /\.curriculumStudyNav\s*\{[^}]*position:\s*sticky/s);
  assert.match(css, /\.curriculumReadingCard\s*\{[^}]*max-width:\s*(?:8[0-9]{2}|900)px/s);
  assert.match(css, /\.curriculumReadingCard \.chapterBody p\s*\{[^}]*font-size:\s*clamp\(1\.0625rem/s);
  assert.match(css, /\.curriculumPage__intro > p:not\(\.curriculumPage__status\)\s*\{[^}]*color:\s*#334558/s);
  assert.match(css, /\.curriculumPractice\s*\{[^}]*background:\s*var\(--cream\)/s);
  assert.match(css, /\.curriculumStudyNav__links\s*\{[^}]*grid-template-columns:\s*repeat\(7, minmax\(0, 1fr\)\)[^}]*overflow:\s*visible/s);
  assert.match(css, /@media \(max-width: 640px\)[\s\S]*?\.curriculumStudyNav__links\s*\{[^}]*grid-template-columns:\s*repeat\(6, minmax\(0, 1fr\)\)[^}]*overflow:\s*visible/s);
  assert.match(css, /\.curriculumPage \.aiMastery > p\s*\{[^}]*color:\s*#e8edf0/s);
  assert.match(css, /\.curriculumPage \.aiMasteryTop h3\s*\{[^}]*color:\s*var\(--cream\) !important/s);
});
