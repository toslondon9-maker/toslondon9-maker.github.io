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
  assert.equal((curriculum.match(/<h3 id="week-\d+-introduction">Introduction<\/h3>/g) ?? []).length, 24);
  assert.equal((curriculum.match(/<h3 id="week-\d+-content">Content<\/h3>/g) ?? []).length, 24);
  assert.equal((curriculum.match(/<h3 id="week-\d+-exercise">Exercise<\/h3>/g) ?? []).length, 24);
  assert.equal((curriculum.match(/class="weeklyQA"/g) ?? []).length, 24);
  assert.equal((curriculum.match(/class="aiMastery"/g) ?? []).length, 24);
  assert.equal((curriculum.match(/Copy prompt/g) ?? []).length, 24);
  assert.match(curriculum, /One Consciousness - One Power/);
  assert.match(curriculum, /The Truth shall set you free/);
  assert.match(curriculum, /class="weekVideo"[^>]+href="https:\/\/photos\.google\.com\/share\//);
  const source = readFileSync(new URL("../content/master-key-curriculum.html", import.meta.url));
  assert.equal(createHash("sha256").update(source).digest("hex"), "0aa7a56e605c934f40ec8fbf57602813cf96b504882bf9199ce9688e6bc454fd");
  assert.ok(page.styles?.includes("/assets/index-Bgwsdhov.css"));

  const home = renderHome({ language: "en" });
  assert.match(home, /href="\/master-key-system\/"[^>]*>EXPLORE ALL 24 WEEKS<\/a>/);

  const navigation = renderHeader({ route: "/", language: "en" });
  assert.equal((navigation.match(/href="\/master-key-system\/"[^>]*>Master Key System<\/a>/g) ?? []).length, 2);
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
