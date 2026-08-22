import assert from "node:assert/strict";
import test from "node:test";
import { sevenDayExperience } from "../content/seven-day-experience.mjs";
import { siteData } from "../content/site-data.mjs";
import { t } from "../content/translations.mjs";
import { routeRenderers } from "../src/routes.mjs";

const dashboard = () => routeRenderers[siteData.routes.startFree](siteData);

test("the free dashboard starts Day 1 immediately and makes all seven ordered lessons available", () => {
  const page = dashboard();
  const html = page.body;

  assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1);
  assert.match(html, new RegExp(`href="${sevenDayExperience.lessons[0].route}"`));
  assert.match(html, /data-i18n="sevenDay\.dashboard\.start"/);
  assert.equal((html.match(/class="sevenDayDashboard__lesson"/g) ?? []).length, 7);

  for (const lesson of sevenDayExperience.lessons) {
    assert.match(html, new RegExp(`href="${lesson.route}"`));
    assert.match(html, new RegExp(`data-i18n="${lesson.translationKey}\\.title"`));
    assert.match(html, new RegExp(`data-i18n="${lesson.translationKey}\\.status"`));
  }
});

test("the free dashboard provides an honest progressive, private no-JavaScript baseline", () => {
  const page = dashboard();
  const html = page.body;

  assert.match(html, /data-i18n="sevenDay\.dashboard\.progressive"/);
  assert.match(html, /role="status"[^>]+data-progress-status/);
  assert.match(html, /data-i18n="sevenDay\.progress\.empty"/);
  assert.match(html, /type="button"[^>]+data-progress-reset/);
  assert.match(html, /data-i18n="sevenDay\.reset\.label"/);
  assert.match(html, /data-i18n="sevenDay\.privacy\.body"/);
  assert.match(html, /Only lesson-completion flags are saved in this browser on this device/);
  assert.match(html, /Progress is not transmitted to or stored by Tariq/);
  assert.match(html, /Clearing browser data or changing devices may remove/);
  assert.match(html, /aria-labelledby="seven-day-progress-heading"[\s\S]*?<h2 id="seven-day-progress-heading"/);
  assert.match(html, /aria-labelledby="seven-day-lessons-heading"[\s\S]*?<h2 id="seven-day-lessons-heading"/);
  assert.match(html, /aria-labelledby="seven-day-privacy-heading"[\s\S]*?<h2 id="seven-day-privacy-heading"/);
  assert.doesNotMatch(html, /<form\b|<input\b|account (?:created|creation)|register|sign up|saved to (?:our|Tariq)/i);
});

test("the dashboard describes active local-only progress saving in both languages", () => {
  const privacyKey = sevenDayExperience.sharedKeys.privacy.body;

  assert.match(t(privacyKey, "en"), /saved in this browser on this device/);
  assert.match(t(privacyKey, "en"), /not transmitted to or stored by Tariq/i);
  assert.match(t(privacyKey, "en"), /Clearing browser data or changing devices may remove/i);
  assert.match(t(privacyKey, "es"), /se guardan en este navegador y dispositivo/);
  assert.match(t(privacyKey, "es"), /no se transmiten a Tariq ni se almacenan con él/i);
  assert.match(t(privacyKey, "es"), /Borrar los datos del navegador o cambiar de dispositivo puede eliminar/i);
});

test("the dashboard loads one progress enhancement while preserving disabled no-JavaScript controls", () => {
  const page = dashboard();

  assert.deepEqual(page.scripts, ["/assets/seven-day-progress.mjs"]);
  assert.match(page.body, /data-progress-reset disabled/);
  for (const lesson of sevenDayExperience.lessons) {
    assert.match(page.body, new RegExp(`data-progress-lesson="${lesson.id}"`));
  }
});

test("the free dashboard hides workbook actions until their files exist", () => {
  const page = dashboard();
  const html = page.body;

  assert.doesNotMatch(html, /\/downloads\/|\.pdf|sevenDay\.workbook|\bdownload\b/i);
});

test("the free dashboard connects every changeable dashboard value to the bilingual registry", () => {
  const html = dashboard().body;
  const { sharedKeys } = sevenDayExperience;
  const keys = [
    sharedKeys.independence,
    ...Object.values(sharedKeys.dashboard),
    sharedKeys.progress.heading,
    sharedKeys.progress.empty,
    sharedKeys.privacy.heading,
    sharedKeys.privacy.body,
    sharedKeys.reset.label,
    ...sevenDayExperience.lessons.flatMap((lesson) => [
      lesson.contentKeys.title,
      lesson.contentKeys.status,
    ]),
  ];

  for (const key of keys) assert.match(html, new RegExp(`data-i18n="${key}"`));
});
