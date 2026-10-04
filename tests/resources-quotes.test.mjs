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
  assert.deepEqual(page.scripts, ["/assets/resources-quotes.mjs", "/assets/resources-scroll-field.mjs"]);
});

test("Spanish Resources keeps controls translated and identifies original quote wording", () => {
  const page = resourcesPage(siteData, "es");
  assert.match(page.body, /Dame un pensamiento/);
  assert.match(page.body, /redacción original en inglés/);
  assert.match(page.body, /Reflexión:/);
});

test("Resources adds a scoped, reduced-motion-aware reactive quote field", async () => {
  const page = resourcesPage(siteData, "en");
  const runtime = await import("node:fs/promises").then(({ readFile }) => readFile("assets/resources-scroll-field.mjs", "utf8")).catch(() => "");
  assert.match(page.body, /resourcesScrollField/);
  for (const phrase of ["Thought", "Purpose", "Concentration", "Action", "Inner Power", "Habit"]) assert.match(page.body, new RegExp(phrase));
  assert.equal(page.scripts.includes("/assets/resources-scroll-field.mjs"), true);
  assert.match(runtime, /prefers-reduced-motion/);
  assert.match(runtime, /requestAnimationFrame/);
  assert.match(runtime, /resourcesScrollField/);
});

test("Resources adds a noticeable scoped word field and derived light-point portrait", async () => {
  const page = resourcesPage(siteData, "en");
  const runtime = await readFile("assets/resources-scroll-field.mjs", "utf8");
  const css = await readFile("assets/platform.css", "utf8");
  assert.match(page.body, /class="resourcesPortrait"/);
  assert.match(page.body, /class="resourcesPortrait"[^>]*aria-hidden="true"/);
  assert.match(page.body, /resources-tariq-light-points\.webp" alt=""/);
  assert.match(page.body, /class="resourcesScrollField__phrase/);
  assert.ok((page.body.match(/class="resourcesScrollField__phrase/g) ?? []).length >= 12);
  assert.match(page.scripts.join(" "), /resources-scroll-field\.mjs/);
  assert.match(runtime, /pointermove/);
  assert.match(runtime, /touchmove/);
  assert.match(runtime, /prefers-reduced-motion/);
  assert.match(runtime, /requestAnimationFrame/);
  assert.match(css, /\.resourcesPage--scrollField::before/);
  assert.match(css, /\.resourcesPortrait\s*\{/);
  assert.match(css, /\.resourcesScrollField__phrase\s*\{/);
  assert.match(css, /prefers-reduced-motion/);
});

test("Resources adds the complete visual effects layer without changing resource destinations", async () => {
  const page = resourcesPage(siteData, "en");
  const runtime = await readFile("assets/resources-scroll-field.mjs", "utf8");
  const css = await readFile("assets/platform.css", "utf8");
  assert.match(page.body, /resourcesPage--visualEffects/);
  assert.match(page.body, /resourcesParticleField/);
  assert.match(page.body, /<canvas[^>]+aria-hidden="true"/);
  assert.match(page.body, /resourcesLoop/);
  assert.match(page.body, /AND AGAIN HERE/);
  assert.match(page.body, /resourcesKeyCta/);
  assert.match(page.body, /href="\/master-key-system\/"/);
  assert.match(runtime, /IntersectionObserver/);
  assert.match(runtime, /scroll-headline/);
  assert.match(runtime, /canvas\.getContext\("2d"\)/);
  assert.match(runtime, /Array\.from\(\{ length: 128/);
  assert.match(runtime, /pointermove/);
  assert.match(runtime, /touchmove/);
  assert.match(runtime, /prefers-reduced-motion/);
  assert.match(runtime, /requestAnimationFrame/);
  assert.match(css, /resourcesPage--visualEffects/);
  assert.match(css, /resourcesParticleField/);
  assert.match(css, /resourcesLoop/);
  assert.match(css, /resourcesKeyCta/);
  assert.match(css, /resourcesAtmosphere/);
  assert.match(css, /resourcesLoopDrift/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /\.resourcesPortraitStage\s*\{/);
  assert.match(css, /\.resourcesPortrait\s*\{[^}]*z-index:\s*1/);
  assert.match(css, /\.resourcesPortraitStage\s*\{[^}]*min-height:/);
  assert.doesNotMatch(page.body, /href="undefined"/);
  assert.match(page.body, /href="\/resources\/audio\//);
  assert.match(page.body, /data-quote-filter="thought"/);
});

test("Resources keeps playback out of the main visual experience", () => {
  const page = resourcesPage(siteData, "en");
  assert.doesNotMatch(page.body, /<audio\b|<video\b|data-(?:audio|sound|playback)/i);
  assert.doesNotMatch(page.body, /home-soundtrack|inspirational-cinematic/i);
  assert.equal(page.scripts.some((script) => /audio|soundtrack/i.test(script)), false);
});

test("Resources reserves a visible portrait stage above the content panels", () => {
  const page = resourcesPage(siteData, "en");
  assert.match(page.body, /class="resourcesPortraitStage"[^>]*>[\s\S]*class="resourcesPortrait"/);
  assert.match(page.body, /resourcesPortraitStage[\s\S]*resourcesQuotes__feature/);
});
