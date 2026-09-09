import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import { resourcesPage } from "../src/pages/resources.mjs";
import { resourcesAudioPage } from "../src/pages/resources-audio.mjs";
import { siteData } from "../content/site-data.mjs";

const lessonNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 24];
const audioRoot = new URL("../audio/mks/", import.meta.url);

test("main Resources keeps LISTEN as a compact link card without audio players", () => {
  const page = resourcesPage();
  assert.match(page.body, /<h2>LISTEN<\/h2>/);
  assert.match(page.body, new RegExp(`href="${siteData.routes.resourcesAudio}"[^>]*>Use the guided daily practice`));
  assert.doesNotMatch(page.body, /<audio controls/);
  assert.doesNotMatch(page.body, /youtube\.com\/watch\?v=/);
});

test("the guided-practice destination contains every available audio and missing-lesson links", async () => {
  const page = resourcesAudioPage();
  assert.equal(page.route, siteData.routes.resourcesAudio);
  assert.match(page.body, /Master Key System Audio Lessons/);

  for (const number of lessonNumbers) {
    await access(new URL(`Lesson_${number}.mp3`, audioRoot));
    assert.match(page.body, new RegExp(`/audio/mks/Lesson_${number}\.mp3`));
    assert.match(page.body, new RegExp(`>${String(number).padStart(2, "0")}<`));
  }
  assert.equal((page.body.match(/<audio controls/g) ?? []).length, 21);
  assert.match(page.body, /XfuM-NAMX3E/);
  assert.match(page.body, /sDKwDhfXTOM/);
  assert.match(page.body, /SSH9AioaNZE/);
  assert.match(page.body, /tzNhOZTELX4/);
  assert.match(page.body, /MKS Affirmations for Success and Prosperity/);
});

test("missing lessons use clearly labelled external recordings without local MP3 links", () => {
  const page = resourcesAudioPage().body;
  const external = [
    [9, "XfuM-NAMX3E"],
    [11, "sDKwDhfXTOM"],
    [19, "SSH9AioaNZE"],
    [23, "tzNhOZTELX4"],
  ];
  for (const [number, videoId] of external) {
    assert.match(page, new RegExp(`Lesson ${number === 9 || number === 11 || number === 19 || number === 23 ? number : number}`));
    assert.match(page, new RegExp(`youtube\\.com/watch\\?v=${videoId}`));
    assert.match(page, /target="_blank" rel="noopener noreferrer"/);
    assert.doesNotMatch(page, new RegExp(`Lesson_${number}\\.mp3`));
  }
  assert.match(page, /These four lessons currently link to external recordings/);
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
  assert.equal((english.match(/<audio controls/g) ?? []).length, 21);
});

test("the build copies the complete audio directory into generated output", async () => {
  const build = await readFile(new URL("../tools/build-site.mjs", import.meta.url), "utf8");
  assert.match(build, /collectFiles\(path\.join\(repositoryRoot, "audio"\), "audio"\)/);
  const css = await readFile(new URL("../assets/platform.css", import.meta.url), "utf8");
  assert.match(css, /resourcesPage__audioGrid/);
  assert.match(css, /resourcesPage__audio audio/);
});
