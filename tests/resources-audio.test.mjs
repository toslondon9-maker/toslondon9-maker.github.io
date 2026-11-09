import assert from "node:assert/strict";
import test from "node:test";
import { resourcesPage } from "../src/pages/resources.mjs";
import { resourcesAudioPage } from "../src/pages/resources-audio.mjs";
import { siteData } from "../content/site-data.mjs";

const lessonNumbers = Array.from({ length: 24 }, (_, index) => index + 1);
const lessonUrl = (number) => `https://media.unleashyourpowerwithtariq.com/Lesson_${number}.mp3`;
const affirmationsUrl = "https://media.unleashyourpowerwithtariq.com/affirmations/The%20Master%20Key%20System%20Affirmations%20For%20Success%20And%20Prosperity.mp3";

test("main Resources keeps LISTEN as a compact link card without audio players", () => {
  const page = resourcesPage();
  assert.match(page.body, /<h2>LISTEN<\/h2>/);
  assert.match(page.body, new RegExp(`href="${siteData.routes.resourcesAudio}"[^>]*>Use the guided daily practice`));
  assert.doesNotMatch(page.body, /<audio controls/);
  assert.doesNotMatch(page.body, /youtube\.com\/watch\?v=/);
});

test("guided practice serves all 24 lesson recordings from Cloudflare R2 in numerical order", () => {
  const page = resourcesAudioPage();
  assert.equal(page.route, siteData.routes.resourcesAudio);
  assert.match(page.body, /Master Key System Audio Lessons/);
  const positions = lessonNumbers.map((number) => {
    const url = lessonUrl(number);
    assert.equal(page.body.split(url).length - 1, 1);
    return page.body.indexOf(url);
  });
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
  assert.equal((page.body.match(/<audio controls/g) ?? []).length, 25);
  assert.match(page.body, /MKS Affirmations for Success and Prosperity/);
  assert.ok(page.body.includes(affirmationsUrl));
  assert.doesNotMatch(page.body, /youtube\.com\/watch\?v=/);
  assert.doesNotMatch(page.body, /External recording/);
});

test("English and Spanish guided-practice pages retain translated labels and R2 playback", () => {
  const english = resourcesAudioPage(undefined, "en").body;
  const spanish = resourcesAudioPage(undefined, "es").body;
  assert.ok(english.includes(affirmationsUrl));
  assert.match(english, /MKS Affirmations for Success and Prosperity/);
  assert.match(spanish, /Afirmaciones del MKS para el éxito y la prosperidad/);
  assert.match(spanish, /Audio de la lección 1/);
  assert.match(english, /<audio controls[^>]+aria-label=/);
  assert.equal((english.match(/<audio controls/g) ?? []).length, 25);
});

test("the generated build does not require a local audio directory after the R2 migration", async () => {
  const { readFile } = await import("node:fs/promises");
  const build = await readFile(new URL("../tools/build-site.mjs", import.meta.url), "utf8");
  assert.match(build, /repositoryRoot, "audio"/);
  assert.match(build, /error\?\.code === "ENOENT"/);
});
