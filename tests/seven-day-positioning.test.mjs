import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { translations } from "../content/translations.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const positioning = {
  en: "7 Days to Change the Way You Use Your Mind",
  es: "7 días para cambiar la forma en que usas tu mente",
};

test("the seven-day offer has one canonical English and Spanish name", () => {
  assert.equal(translations["home.taster.title"].en, positioning.en);
  assert.equal(translations["home.taster.title"].es, positioning.es);
  assert.equal(translations["route.startFree.metaTitle"].en, `${positioning.en} | Unleash Your Power`);
  assert.equal(translations["route.startFree.metaTitle"].es, `${positioning.es} | Unleash Your Power`);
});

test("generated public pages use the canonical positioning and remove retired CTA labels", async () => {
  const files = [
    "index.html",
    "start-free/index.html",
    "coaching/index.html",
    "faq/index.html",
    "resources/index.html",
    "referral/index.html",
    "master-key-system-online-course/index.html",
    "insights/index.html",
  ];
  const pages = await Promise.all(files.map((file) => readFile(path.join(root, file), "utf8")));
  for (const page of pages) {
    assert.match(page, /7 Days to Change the Way You Use Your Mind|7 días para cambiar la forma en que usas tu mente/);
    assert.doesNotMatch(page, /START THE FREE SEVEN-DAY EXPERIENCE|START FREE FOR 7 DAYS|Give Yourself Seven Days/);
  }
});
