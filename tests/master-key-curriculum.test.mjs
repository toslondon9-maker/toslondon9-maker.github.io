import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { renderHome } from "../src/pages/home.mjs";
import { routeRenderers } from "../src/routes.mjs";
import { renderHeader } from "../src/shared-chrome.mjs";

test("the MKS Study Room preserves the complete 24-week curriculum", () => {
  const page = routeRenderers[siteData.routes.masterKeySystem](siteData);
  const html = page.body;
  const curriculum = html.match(/<section class="mksStudyRoom__shell" id="study-room">[\s\S]*<\/section><\/main>/)?.[0] ?? html;
  const weeks = [...curriculum.matchAll(/data-week="(\d+)"/g)].map((match) => Number(match[1]));

  assert.deepEqual(weeks, Array.from({ length: 24 }, (_, index) => index + 1));
  assert.equal((curriculum.match(/<h3>Introduction<\/h3>/g) ?? []).length, 24);
  assert.equal((curriculum.match(/<h3>Content<\/h3>/g) ?? []).length, 24);
  assert.equal((curriculum.match(/<h3>About the exercise<\/h3>/g) ?? []).length, 24);
  assert.equal((curriculum.match(/class="weeklyQA(?:\s|\")/g) ?? []).length, 24);
  assert.equal((curriculum.match(/class="aiMastery"/g) ?? []).length, 24);
  assert.equal((curriculum.match(/Copy prompt/g) ?? []).length, 24);
  assert.match(curriculum, /One Consciousness - One Power/);
  assert.match(curriculum, /The Truth shall set you free/);
  assert.match(curriculum, /class="weekVideo"[^>]+href="https:\/\/photos\.google\.com\/share\//);
  assert.match(curriculum, /Chapter 1 - One Consciousness - One Power/);
  assert.match(curriculum, /class="mksStudyRoom__stage"[^>]*data-stage="foundation"/);
  assert.match(curriculum, /class="mksStudyRoom__stage"[^>]*data-stage="visualisation"/);
  assert.match(curriculum, /class="mksStudyRoom__stage"[^>]*data-stage="concentration"/);
  assert.match(curriculum, /class="mksStudyRoom__stage"[^>]*data-stage="integration-mastery"/);
  assert.ok(page.styles?.includes("/assets/platform.css"));

  const home = renderHome({ language: "en" });
  assert.match(home, /href="\/master-key-system\/"[^>]*>EXPLORE THE METHOD<\/a>/);

  const navigation = renderHeader({ route: "/", language: "en" });
  assert.equal((navigation.match(/href="\/master-key-system\/"[^>]*>Master Key System<\/a>/g) ?? []).length, 2);
});

test("the MKS Study Room removes promotional preview language and keeps study controls collapsed", () => {
  const page = routeRenderers[siteData.routes.masterKeySystem](siteData);
  const html = page.body;
  assert.doesNotMatch(html, /READY TO GO DEEPER\?/);
  assert.doesNotMatch(html, /EXPLORE THE 24-WEEK PROGRAMME/);
  assert.doesNotMatch(html, /Full teaching is only available to enrolled members/);
  assert.doesNotMatch(html, /START YOUR 7 DAYS/);
  assert.match(html, /class="mksStudyRoom__select"/);
  assert.match(html, /aria-label="Course navigation"/);
  assert.match(html, /Study → Practise → Reflect → Apply/);
  assert.equal((html.match(/<details[^>]*\sopen(?:=|\s|>)/g) ?? []).length, 0);
  assert.equal((html.match(/class="mksStudyRoom__qa"/g) ?? []).length, 240);
  assert.equal((html.match(/class="mksStudyRoom__chapter"/g) ?? []).length, 24);
  assert.equal((html.match(/data-complete-week="\d+"/g) ?? []).length, 24);
  assert.match(html, /Complete Week/);
  assert.match(html, /<h1[^>]*>Chapter 1 - One Consciousness - One Power<\/h1>/);
});

test("the MKS Study Room keeps the free experience route separate", () => {
  const mks = routeRenderers[siteData.routes.masterKeySystem](siteData).body;
  const startFree = routeRenderers[siteData.routes.startFree](siteData).body;
  assert.doesNotMatch(mks, /sevenDayDashboard/);
  assert.match(startFree, /sevenDayDashboard/);
});

test("the MKS Study Room restores four non-promotional stage illustrations", () => {
  const html = routeRenderers[siteData.routes.masterKeySystem](siteData).body;
  for (const [stage, image, week] of [
    ["foundation", "foundation-chapters-1-4.png", 1],
    ["visualisation", "visualisation-chapters-5-11.png", 5],
    ["concentration", "concentration-chapters-12-18.png", 12],
    ["integration-mastery", "contemplation-mastery-chapters-19-24.png", 19],
  ]) {
    assert.match(html, new RegExp(`id="stage-${stage}"`));
    assert.match(html, new RegExp(`href="#stage-${stage}"[^>]*>[\\s\\S]*?${image}`));
    assert.match(html, new RegExp(`href="#week-${week}"[^>]*>[\\s\\S]*?${image}`));
  }
  assert.equal((html.match(/class="mksStudyRoom__visualNavLink"/g) ?? []).length, 4);
  assert.equal((html.match(/class="mksStudyRoom__stageBanner"/g) ?? []).length, 4);
  assert.doesNotMatch(html, /pricing|coaching CTA|start your free 7 days/i);
});

test("the MKS Study Room remains structurally aligned in English and Spanish", () => {
  const english = routeRenderers[siteData.routes.masterKeySystem](siteData, "en").body;
  const spanish = routeRenderers[siteData.routes.masterKeySystem](siteData, "es").body;
  for (const marker of ["mksStudyRoom", "mksStudyRoom__select", "mksStudyRoom__chapter", "mksStudyRoom__qa", "Foundation", "Visualisation", "Concentration", "Integration &amp; Mastery"]) {
    assert.equal((english.match(new RegExp(marker, "g")) ?? []).length, (spanish.match(new RegExp(marker, "g")) ?? []).length, marker);
  }
});

test("the MKS Study Room uses the readable cream study surface", () => {
  const css = readFileSync(new URL("../assets/platform.css", import.meta.url), "utf8");

  assert.match(css, /\.mksStudyRoom\s*\{[^}]*background:\s*var\(--cream\)/s);
  assert.match(css, /\.mksStudyRoom__chapter\s*\{[^}]*background:\s*var\(--paper\)/s);
  assert.match(css, /\.mksStudyRoom__questions\s*\{[^}]*background:\s*var\(--cream\)/s);
});

test("the MKS Study Room has bounded responsive layout and visible focus treatment", () => {
  const css = readFileSync(new URL("../assets/platform.css", import.meta.url), "utf8");
  assert.match(css, /\.mksStudyRoom\s*\{[^}]*overflow-x:\s*clip/s);
  assert.match(css, /\.mksStudyRoom__layout\s*\{[^}]*grid-template-columns:\s*minmax\(13rem, 16rem\) minmax\(0, 1fr\)/s);
  assert.match(css, /\.mksStudyRoom__lesson\s*\{[^}]*max-width:\s*760px/s);
  assert.match(css, /\.mksStudyRoom__chapter summary:focus-visible[^{]*\{/s);
  assert.match(css, /@media \(max-width:\s*768px\)[\s\S]*\.mksStudyRoom__layout[\s\S]*grid-template-columns:\s*minmax\(0, 1fr\)/s);
  assert.match(css, /@media \(max-width:\s*768px\)[\s\S]*\.mksStudyRoom__courseNav[\s\S]*display:\s*none/s);
});
