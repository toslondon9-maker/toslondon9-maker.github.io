import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = await readFile(path.join(root, "index.html"), "utf8");
const rsc = await readFile(path.join(root, "index.rsc"), "utf8");

test("the free seven-day taster is offered with its flyer and enquiry action", () => {
  assert.match(html, /<section class="taster section" id="free-taster">/);
  assert.match(html, /src="\/images\/free-7-day-taster\.jpeg"/);
  assert.match(html, /mailto:toslondon9@gmail\.com\?subject=Free%207-Day%20Taster/);
  assert.ok(existsSync(path.join(root, "images", "free-7-day-taster.jpeg")));
});

test("the programme shows four progressively priced founding stages", () => {
  const programme = html.match(/<section class="programme section" id="programme">([\s\S]*?)<section class="cta">/)?.[1] ?? "";
  const expected = [
    ["foundation", "147", "97"],
    ["visualisation", "297", "197"],
    ["concentration", "597", "397"],
    ["mastery", "747", "497"],
  ];

  for (const [stage, standardPrice, launchPrice] of expected) {
    const card = programme.match(new RegExp(`<article class="stagePriceCard" data-stage="${stage}">([\\s\\S]*?)<\\/article>`))?.[1] ?? "";
    assert.match(card, new RegExp(`<s>£${standardPrice}<\\/s>`));
    assert.match(card, new RegExp(`<strong>£${launchPrice}<\\/strong>`));
    assert.match(card, new RegExp(`subject=Master%20Key%20${stage === "mastery" ? "Contemplation%20%26%20Mastery" : stage[0].toUpperCase() + stage.slice(1)}%20Stage`));
  }

  assert.match(programme, /Available to the first 10 founding members/);
  assert.doesNotMatch(programme, /<sup>£<\/sup>997/);
  assert.ok(existsSync(path.join(root, "images", "unleash-your-power-programme.jpeg")));
});

test("client navigation receives the same taster and stage pricing content", () => {
  assert.match(rsc, /FREE 7-DAY TASTER/);
  for (const price of ["£97", "£197", "£397", "£497"]) {
    assert.match(rsc, new RegExp(price));
  }
});

test("the homepage opens with Haanel and Tariq as complementary authorities", () => {
  const hero = html.match(/<section class="hero haanelHero" id="top">([\s\S]*?)<section class="principle">/)?.[1] ?? "";
  assert.match(hero, /Charles F\. Haanel revealed the Master Key/);
  assert.match(hero, /Tariq helps you use it/);
  assert.match(hero, /src="\/images\/master-key-wisdom\.png"/);
  assert.match(hero, /src="\/images\/tariq-happiness-harmony\.png"/);
  assert.match(hero, /href="#free-taster"/);
  assert.match(hero, /href="#meet-tariq"/);
});

test("the weekly progression explains the transformation before introducing coaching", () => {
  const progressionIndex = html.indexOf('id="weekly-progression"');
  const coachIndex = html.indexOf('id="meet-tariq"');
  const tasterIndex = html.indexOf('id="free-taster"');

  assert.ok(progressionIndex > 0);
  assert.ok(coachIndex > progressionIndex);
  assert.ok(tasterIndex > coachIndex);
  assert.match(html, /Each weekly lesson builds upon the last/);
  assert.match(html, /an almost magical process can begin to unfold/);
  assert.match(html, /Haanel created the system\. Tariq helps you live it\./);
});

test("client navigation preserves the Haanel-first coaching story", () => {
  assert.match(rsc, /Charles F\. Haanel revealed the Master Key/);
  assert.match(rsc, /an almost magical process can begin to unfold/);
  assert.match(rsc, /Haanel created the system\. Tariq helps you live it\./);
});

test("homepage metadata leads with Charles F. Haanel", () => {
  assert.match(html, /<title>Charles F\. Haanel’s Master Key System \| Coaching with Tariq Saddique<\/title>/);
  assert.match(html, /<meta name="description" content="Discover Charles F\. Haanel’s progressive 24-part Master Key System with practical coaching, weekly guidance and accountability from Tariq Saddique\."\/>/);
});
