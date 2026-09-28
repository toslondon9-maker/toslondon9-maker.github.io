import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { sevenDayExperience } from "../content/seven-day-experience.mjs";
import { t } from "../content/translations.mjs";
import { routeRenderers } from "../src/routes.mjs";
import { siteData } from "../content/site-data.mjs";

const expectedParts = [1, 2, 3, 4, 5, 6, 7];
const requiredFields = [
  "title",
  "teaching",
  "observation",
  "reflection",
  "action",
  "mksConnection",
  "optionalPractice",
  "practiceTime",
];

test("canonical lessons map one-to-one to Master Key System Parts One to Seven", () => {
  assert.deepEqual(sevenDayExperience.lessons.map((lesson) => lesson.mksPart), expectedParts);
  for (const lesson of sevenDayExperience.lessons) {
    for (const field of requiredFields) {
      assert.ok(lesson.contentKeys[field], `${lesson.id} exposes ${field}`);
      for (const language of ["en", "es"]) {
        assert.ok(t(lesson.contentKeys[field], language).trim(), `${lesson.id} ${field} needs ${language}`);
      }
    }
    assert.match(t(lesson.contentKeys.practiceTime, "en"), /5[–-]10 minutes|10[–-]15 minutes|10 minutes/);
    assert.match(t(lesson.contentKeys.practiceTime, "es"), /5[–-]10 minutos|10[–-]15 minutos|10 minutos/);
  }
});

test("online lesson rendering includes the canonical connection and optional practice", () => {
  for (const lesson of sevenDayExperience.lessons) {
    const html = routeRenderers[lesson.route](siteData).body;
    assert.match(html, /MASTER KEY CONNECTION|CONEXIÓN CON EL MASTER KEY SYSTEM/);
    assert.match(html, /OPTIONAL MKS PRACTICE|PRÁCTICA OPCIONAL DEL MKS/);
    assert.match(html, new RegExp(escapeRegExp(escapeHtml(t(lesson.contentKeys.mksConnection, "en")))));
    assert.match(html, new RegExp(escapeRegExp(escapeHtml(t(lesson.contentKeys.optionalPractice, "en")))));
    assert.match(html, new RegExp(escapeRegExp(escapeHtml(t(lesson.contentKeys.practiceTime, "en")))));
    assert.match(html, new RegExp(`data-progress-complete="${lesson.id}"`));
  }
});

test("canonical copy remains beginner-safe and preserves existing contracts", () => {
  const css = readFileSync(new URL("../assets/platform.css", import.meta.url), "utf8");
  const copy = sevenDayExperience.lessons
    .flatMap((lesson) => requiredFields.slice(1).flatMap((field) => [t(lesson.contentKeys[field], "en"), t(lesson.contentKeys[field], "es")]))
    .join(" ");
  assert.doesNotMatch(copy, /guaranteed (?:wealth|healing|success|transformation)|automatically (?:creates|create) money|garantiza(?:r)? (?:riqueza|salud|éxito|transformación)/i);
  assert.match(css, /\.sevenDayLesson__mksConnection/);
  assert.match(css, /\.sevenDayLesson__optionalPractice/);
  assert.match(routeRenderers["/start-free/"](siteData).body, /sevenDayDashboard/);
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
