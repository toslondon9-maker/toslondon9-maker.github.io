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
  assert.ok(existsSync(path.join(root, "images", "unleash-your-power-programme.jpeg")));
});

test("the four stages use the approved week ranges and complete-programme value", () => {
  const programme = html.match(/<section class="programme section" id="programme">([\s\S]*?)<section class="cta">/)?.[1] ?? "";

  for (const [stage, weeks] of [
    ["foundation", "Weeks 1–4"],
    ["visualisation", "Weeks 5–11"],
    ["concentration", "Weeks 12–18"],
    ["mastery", "Weeks 19–24"],
  ]) {
    const card = programme.match(new RegExp(`<article class="stagePriceCard" data-stage="${stage}">([\\s\\S]*?)<\\/article>`))?.[1] ?? "";
    assert.match(card, new RegExp(weeks));
  }

  assert.match(programme, /Complete 24-Week Programme/);
  assert.match(programme, /<strong>£997<\/strong>/);
  assert.match(programme, /Four stages separately: <b>£1,188<\/b>/);
  assert.match(programme, /Save £191/);
  assert.match(programme, /Full combined MSRP: <b>£1,788<\/b>/);
  assert.match(programme, /Save £791/);
  assert.match(programme, /44% off full MSRP/);
  assert.doesNotMatch(programme, /6\s*[×x]\s*£169/);
  assert.doesNotMatch(programme, /£1,014/);
});

test("client navigation contains the same approved programme value", () => {
  for (const value of ["Weeks 1–4", "Weeks 5–11", "Weeks 12–18", "Weeks 19–24", "£1,188", "£997", "£191", "£1,788", "£791", "44% off full MSRP"]) {
    assert.match(rsc, new RegExp(value));
  }
  assert.doesNotMatch(rsc, /6\s*[×x]\s*£169/);
  assert.doesNotMatch(rsc, /£1,014/);
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
  assert.match(hero, /class="heroJourneyStory"/);
  assert.equal((hero.match(/src="\/images\/haanel-tariq-portraits\.jpeg"/g) ?? []).length, 2);
  assert.match(hero, /<h3 class="journeyName">Charles F\. Haanel<\/h3>/);
  assert.match(hero, /<h3 class="journeyName">Tariq Saddique<\/h3>/);
  assert.match(hero, /From inner mastery to <em>purposeful action\.<\/em>/);
  assert.doesNotMatch(hero, /homepage-master-key-journey\.png/);
  assert.doesNotMatch(hero, /class="authorityPortrait/);
  assert.doesNotMatch(hero, /class="heroVisual dualPortraits"/);
  assert.match(hero, /href="#free-taster"/);
  assert.match(hero, /href="#meet-tariq"/);
  assert.ok(existsSync(path.join(root, "images", "haanel-tariq-portraits.jpeg")));
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

test("the embedded streamed page data contains valid JSON records so hydration cannot blank the page", () => {
  const embeddedRsc = [...html.matchAll(/__VINEXT_RSC_CHUNKS__\.push\(("(?:\\.|[^"\\])*")\)/g)]
    .map((match) => JSON.parse(match[1]))
    .join("");

  assert.ok(embeddedRsc.length > 0, "the homepage must include its streamed page data");
  for (const line of embeddedRsc.split("\n")) {
    const record = line.match(/^([0-9a-f]+):(.*)$/);
    if (!record || !/^[\[{\"]/.test(record[2])) continue;

    assert.doesNotThrow(
      () => JSON.parse(record[2]),
      `RSC record ${record[1]} must contain valid JSON`,
    );
  }
});
