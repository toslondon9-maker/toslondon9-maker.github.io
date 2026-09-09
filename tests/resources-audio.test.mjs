import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import { resourcesPage } from "../src/pages/resources.mjs";
import { resourcesAudioPage } from "../src/pages/resources-audio.mjs";
import { siteData } from "../content/site-data.mjs";

const lessonNumbers = Array.from({ length: 24 }, (_, index) => index + 1);
const audioRoot = new URL("../audio/mks/", import.meta.url);

test("main Resources keeps LISTEN as a compact link card without audio players", () => {
  const page = resourcesPage();
  assert.match(page.body, /<h2>LISTEN<\/h2>/);
  assert.match(page.body, new RegExp(`href="${siteData.routes.resourcesAudio}"[^>]*>Use the guided daily practice`));
  assert.doesNotMatch(page.body, /<audio controls/);
  assert.doesNotMatch(page.body, /youtube\.com\/watch\?v=/);
});

test("the guided-practice destination contains all 24 local lessons in numerical order", async () => {
  const page = resourcesAudioPage();
  assert.equal(page.route, siteData.routes.resourcesAudio);
  assert.match(page.body, /Master Key System Audio Lessons/);

  for (const number of lessonNumbers) {
    await access(new URL(`Lesson_${number}.mp3`, audioRoot));
    assert.match(page.body, new RegExp(`/audio/mks/Lesson_${number}\.mp3`));
    assert.equal((page.body.match(new RegExp(`/audio/mks/Lesson_${number}\.mp3`, "g")) ?? []).length, 1);
    assert.match(page.body, new RegExp(`>${String(number).padStart(2, "0")}<`));
  }
  assert.equal((page.body.match(/<audio controls/g) ?? []).length, 25);
  assert.doesNotMatch(page.body, /youtube\.com\/watch\?v=/);
  assert.doesNotMatch(page.body, /External recording/);
  assert.doesNotMatch(page.body, /These four lessons currently link to external recordings/);
  const lessonPositions = lessonNumbers.map((number) => page.body.indexOf(`/audio/mks/Lesson_${number}.mp3`));
  assert.ok(lessonPositions.every((position) => position >= 0));
  assert.deepEqual([...lessonPositions].sort((a, b) => a - b), lessonPositions);
  assert.match(page.body, /MKS Affirmations for Success and Prosperity/);
});

test("Resources separates the supplied affirmations track and keeps labels bilingual", async () => {
  const english = resourcesAudioPage(undefined, "en").body;
  const spanish = resourcesAudioPage(undefined, "es").body;
  const file = "The Master Key System Affirmations For Success And Prosperity.mp3";
  await access(new URL(file, audioRoot));
  assert.match(english, /MKS Affirmations for Success and Prosperity/);
  assert.equal((english.match(/Master Key System Audio Lessons/g) ?? []).length, 1);
  assert.match(english, /audio\/mks\/The%20Master%20Key%20System%20Affirmations%20For%20Success%20And%20Prosperity\.mp3/);
  assert.match(spanish, /Afirmaciones del MKS para el éxito y la prosperidad/);
  assert.match(spanish, /Audio de la lección 1/);
  assert.match(english, /<audio controls[^>]+aria-label=/g);
  assert.equal((english.match(/<audio controls/g) ?? []).length, 25);
});

test("the build copies the complete audio directory into generated output", async () => {
  const build = await readFile(new URL("../tools/build-site.mjs", import.meta.url), "utf8");
  assert.match(build, /collectFiles\(path\.join\(repositoryRoot, "audio"\), "audio"\)/);
  const css = await readFile(new URL("../assets/platform.css", import.meta.url), "utf8");
  assert.match(css, /resourcesPage__audioGrid/);
  assert.match(css, /resourcesPage__audio audio/);
});
