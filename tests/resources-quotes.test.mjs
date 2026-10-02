import test from "node:test";
import assert from "node:assert/strict";
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
