import test from "node:test";
import assert from "node:assert/strict";
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
