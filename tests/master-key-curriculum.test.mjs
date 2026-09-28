import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { renderHome } from "../src/pages/home.mjs";
import { routeRenderers } from "../src/routes.mjs";
import { renderHeader } from "../src/shared-chrome.mjs";

test("the complete historic 24-week curriculum is visitor-accessible from home and navigation", () => {
  const page = routeRenderers[siteData.routes.masterKeySystem](siteData);
  const html = page.body;
  const curriculum = html.match(/<section class="curriculum section" id="curriculum">[\s\S]*<\/section>/)?.[0] ?? "";
  const weeks = [...curriculum.matchAll(/<span class="week">WEEK <!-- -->(\d+)<\/span>/g)].map((match) => Number(match[1]));

  assert.deepEqual(weeks, Array.from({ length: 24 }, (_, index) => index + 1));
  assert.equal((curriculum.match(/<summary>Introduction<b/g) ?? []).length, 24);
  assert.equal((curriculum.match(/<summary>Content<b/g) ?? []).length, 24);
  assert.equal((curriculum.match(/<summary>About the exercise<b/g) ?? []).length, 24);
  assert.equal((curriculum.match(/class="weeklyQA"/g) ?? []).length, 24);
  assert.equal((curriculum.match(/class="aiMastery"/g) ?? []).length, 24);
  assert.equal((curriculum.match(/Copy prompt/g) ?? []).length, 24);
  assert.match(curriculum, /One Consciousness - One Power/);
  assert.match(curriculum, /The Truth shall set you free/);
  assert.match(curriculum, /class="weekVideo"[^>]+href="https:\/\/photos\.google\.com\/share\//);
  const source = readFileSync(new URL("../content/master-key-curriculum.html", import.meta.url));
  assert.equal(createHash("sha256").update(source.toString().replaceAll("\r\n", "\n"), "utf8").digest("hex"), "ec546dcc6adff8d81d87c97e99afcc0dac27fe918c6e4176b2e21e98f1c2cac2");
  assert.ok(page.styles?.includes("/assets/index-Bgwsdhov.css"));

  const home = renderHome({ language: "en" });
  assert.match(home, /href="\/master-key-system\/"[^>]*>VIEW THE 24-WEEK JOURNEY<\/a>/);

  const navigation = renderHeader({ route: "/", language: "en" });
  assert.equal((navigation.match(/href="\/master-key-system\/"[^>]*>Master Key System<\/a>/g) ?? []).length, 2);
});

test("the curriculum keeps the exact Chapter 1 title and collapses all lesson and answer sections", () => {
  const html = routeRenderers[siteData.routes.masterKeySystem](siteData).body;
  const curriculum = html.match(/<section class="curriculum section" id="curriculum">[\s\S]*<\/section>/)?.[0] ?? "";

  assert.match(curriculum, /Chapter 1 - One Consciousness - One Power/);
  for (const stage of ["Foundation", "Visualisation", "Concentration", "Integration & Mastery"]) assert.match(curriculum, new RegExp(`<h2[^>]*>${stage}<\\/h2>`));
  assert.equal((curriculum.match(/class="curriculumPhase__visual"/g) ?? []).length, 4);
  assert.equal((curriculum.match(/<details id="week-\d+"/g) ?? []).length, 24);
  assert.doesNotMatch(curriculum, /<details[^>]+open/);
  assert.equal((curriculum.match(/class="curriculumLesson"/g) ?? []).length, 24 * 5);
  assert.equal((curriculum.match(/class="qaItem"/g) ?? []).length, 24 * 10);
  assert.match(curriculum, /About the exercise/);
  assert.match(curriculum, /Your First Practice: Discover the Strength of Stillness/);
  assert.match(curriculum, /Each practice is a small promise to yourself/);
  assert.match(curriculum, /<details class="qaItem"><summary><span class="qaNumber">1<\/span>What is the world without in its relation to the world within\?<b/);
});

test("Master Key prompts begin minimised with native disclosure controls without changing their original prompt content", () => {
  const html = routeRenderers[siteData.routes.masterKeySystem](siteData).body;

  assert.equal((html.match(/<details class="aiMasteryPrompt" aria-label="Week \d+ guided prompt">/g) ?? []).length, 24);
  assert.equal((html.match(/<summary>View guided prompt <b aria-hidden="true">＋<\/b><\/summary>/g) ?? []).length, 24);
  assert.match(html, /Act as my personal Master Key System tutor, Socratic coach and accountability partner for Week 1/);
});

test("Master Key page exposes a mobile navigator control alongside all 24 chapter links", () => {
  const html = routeRenderers[siteData.routes.masterKeySystem](siteData).body;

  assert.match(html, /data-curriculum-navigator-toggle aria-expanded="false" aria-controls="curriculum-study-navigator"/);
  assert.match(html, /Show all 24 chapters/);
  assert.match(html, /<nav class="curriculumStudyNav" id="curriculum-study-navigator" data-curriculum-navigator/);
  assert.equal((html.match(/data-curriculum-chapter-link/g) ?? []).length, 70);
});

test("Master Key hero keeps its existing actions and adds a Start Free CTA", () => {
  const html = routeRenderers[siteData.routes.masterKeySystem](siteData).body;

  assert.match(html, /<a class="button--primary" href="\/start-free\/">START YOUR 7 DAYS<\/a>/);
  assert.match(html, /<a class="button--secondary" href="\/get-the-book\/">GET THE MKS BOOK<\/a>/);
  assert.match(html, /<a class="button--text" href="\/ai-mentors\/">USE THE FREE AI MENTOR<\/a>/);
});
