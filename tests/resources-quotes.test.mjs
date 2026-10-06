import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resourcesPage } from "../src/pages/resources.mjs";
import { haanelQuotes, haanelTopics } from "../content/haanel-quotes.mjs";
import { siteData } from "../content/site-data.mjs";

test("Haanel quote catalogue contains source-backed, topic-tagged quotations", () => {
  assert.ok(haanelQuotes.length >= 12);
  assert.deepEqual(haanelTopics, ["thought", "purpose", "concentration", "action", "inner-power", "habit"]);
  for (const item of haanelQuotes) {
    assert.ok(item.quote.length > 10);
    assert.ok(item.reflection.length > 10);
    assert.equal(item.source, "The Master Key System");
    assert.match(item.part, /^Part /);
    assert.match(item.sourceUrl, /^https:\/\/sacred-texts\.com\//);
    assert.ok(item.topics.length > 0);
    assert.ok(item.topics.every((topic) => haanelTopics.includes(topic)));
  }
});

test("Resources renders the accessible Haanel quote experience without removing existing resource groups", () => {
  const page = resourcesPage(siteData, "en");
  assert.match(page.body, /The Wisdom of Charles F\. Haanel/);
  assert.match(page.body, /data-quote-filter="thought"/);
  assert.match(page.body, /data-quote-filter="inner-power"/);
  assert.match(page.body, /data-quote-random-button/);
  assert.match(page.body, /data-quote-copy/);
  assert.match(page.body, /data-quote-share/);
  assert.match(page.body, /aria-live="polite"/);
  assert.match(page.body, /Explore the 24-week Master Key curriculum/);
  assert.match(page.body, /href="\/resources\/audio\/"/);
  assert.equal((page.body.match(/data-haanel-quote=/g) ?? []).length, haanelQuotes.length);
  assert.deepEqual(page.scripts, ["/assets/resources-quotes.mjs"]);
});

test("Spanish Resources keeps controls translated and identifies original quote wording", () => {
  const page = resourcesPage(siteData, "es");
  assert.match(page.body, /Dame un pensamiento/);
  assert.match(page.body, /redacción original en inglés/);
  assert.match(page.body, /Reflexión:/);
});

test("Resources is a clean static experience without decorative effect markup or runtime", async () => {
  const page = resourcesPage(siteData, "en");
  const css = await readFile("assets/platform.css", "utf8");
  const runtime = await readFile("assets/resources-scroll-field.mjs", "utf8").catch(() => "");
  assert.doesNotMatch(page.body, /resources(?:ScrollField|ParticleField|Portrait|Loop|KeyCta|visualEffects)/);
  assert.doesNotMatch(page.body, /resources-tariq-light-points\.webp/);
  assert.deepEqual(page.scripts, ["/assets/resources-quotes.mjs"]);
  assert.equal(runtime, "");
  for (const effectSelector of ["resourcesPage--scrollField", "resourcesPage--visualEffects", "resourcesScrollField", "resourcesParticleField", "resourcesPortrait", "resourcesLoop", "resourcesKeyCta", "resourcesAtmosphere", "resourcesLoopDrift"]) {
    assert.doesNotMatch(css, new RegExp(`\\.${effectSelector}|${effectSelector}`));
  }
  assert.doesNotMatch(page.body, /href="undefined"/);
  assert.match(page.body, /href="\/resources\/audio\//);
  assert.match(page.body, /data-quote-filter="thought"/);
  assert.match(page.body, /Not sure where to start\? Begin with the free 7-Day Experience\./);
});

test("Resources keeps playback out of the main visual experience", () => {
  const page = resourcesPage(siteData, "en");
  assert.doesNotMatch(page.body, /<audio\b|<video\b|data-(?:audio|sound|playback)/i);
  assert.doesNotMatch(page.body, /home-soundtrack|inspirational-cinematic/i);
  assert.equal(page.scripts.some((script) => /audio|soundtrack/i.test(script)), false);
});

test("Resources keeps the source-backed quote wall and controls without decorative layers", () => {
  const page = resourcesPage(siteData, "en");
  assert.match(page.body, /The Wisdom of Charles F\. Haanel/);
  assert.match(page.body, /data-quote-filter="all"/);
  assert.match(page.body, /data-quote-random-button/);
  assert.match(page.body, /data-quote-copy/);
  assert.match(page.body, /data-quote-share/);
  assert.ok((page.body.match(/data-haanel-quote=/g) ?? []).length >= 12);
});

test("Resources exposes the approved canonical source file with a scoped white button", async () => {
  const expectedHash = "60d4ac3a56eac45a01e4879c18e67a59bd4b94ac36fda631c32429a3b4f86a43";
  const pdf = await readFile("downloads/2026-master-key-system.pdf");
  assert.equal(createHash("sha256").update(pdf).digest("hex"), expectedHash);
  const css = await readFile("assets/platform.css", "utf8");
  for (const language of ["en", "es"]) {
    const page = resourcesPage(siteData, language);
    assert.match(page.body, /class="resourcesQuotes__sourceFile button button--secondary" href="\/downloads\/2026-master-key-system\.pdf"/);
    assert.match(page.body, /data-i18n="resources\.quotes\.sourceFile"/);
  }
  assert.match(css, /\.resourcesQuotes__sourceFile(?:,|\s)/);
  assert.match(css, /\.resourcesQuotes__sourceFile[^}]*color:\s*#fff/);
});

test("Resources featured journey CTA keeps white text in every interaction state", async () => {
  const css = await readFile("assets/platform.css", "utf8");
  const page = resourcesPage(siteData, "en");

  assert.match(page.body, /class="button button--secondary" href="\/master-key-system\/" data-i18n="resources\.quotes\.featuredLink"/);
  assert.match(css, /\.resourcesQuotes__featureActions\s*>\s*a:first-child(?:,|\s)/);
  assert.match(css, /\.resourcesQuotes__featureActions\s*>\s*a:first-child[^{]*\{[^}]*color:\s*#ffffff\s*!important;[^}]*-webkit-text-fill-color:\s*#ffffff\s*!important;/s);
  for (const state of ["visited", "hover", "focus", "focus-visible", "active"]) {
    assert.match(css, new RegExp(`\\.resourcesQuotes__featureActions\\s*>\\s*a:first-child:${state}[^\\{]*\\{[^}]*color:\\s*#ffffff\\s*!important;[^}]*-webkit-text-fill-color:\\s*#ffffff\\s*!important;`, "s"));
  }
});
