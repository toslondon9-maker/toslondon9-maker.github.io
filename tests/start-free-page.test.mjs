import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { sevenDayExperience } from "../content/seven-day-experience.mjs";
import { siteData } from "../content/site-data.mjs";
import { t } from "../content/translations.mjs";
import { routeRenderers } from "../src/routes.mjs";
import { renderStartFree } from "../src/pages/start-free.mjs";

const dashboard = () => routeRenderers[siteData.routes.startFree](siteData);

test("Start Free places the shared journey immediately before the anchored registration gate", () => {
  const html = dashboard().body;
  const journeyIndex = html.indexOf('class="conversionJourney"');
  const registrationIndex = html.indexOf('id="start-free-registration"');

  assert.equal((html.match(/class="conversionJourney"/g) ?? []).length, 1);
  assert.ok(journeyIndex >= 0 && journeyIndex < registrationIndex);
  assert.match(html.slice(journeyIndex, registrationIndex), /href="#start-free-registration"[^>]*data-i18n="conversion\.next\.cta"/);
  assert.match(html, /<section class="sevenDayRegistration" id="start-free-registration">/);
});

test("Start Free keeps shared journey translation hooks stable in English and Spanish", () => {
  for (const language of ["en", "es"]) {
    const html = renderStartFree({ language });
    const journey = html.match(/<section class="conversionJourney"[\s\S]*?<\/section>/)?.[0] ?? "";
    for (const key of ["conversion.next.heading", "conversion.next.step1Title", "conversion.next.step1Body", "conversion.next.step2Title", "conversion.next.step2Body", "conversion.next.step3Title", "conversion.next.step3Body", "conversion.next.cta"]) assert.match(journey, new RegExp(`data-i18n="${key}"`));
  }
});

test("the Start Free page requires registration before its main dashboard while public lesson URLs remain present", () => {
  const page = dashboard();
  const html = page.body;

  assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1);
  assert.match(html, /data-lead-capture-form/);
  assert.match(html, /name="firstName"[^>]+required/);
  assert.match(html, /name="surname"[^>]+required/);
  assert.match(html, /name="whatsapp"[^>]+required/);
  assert.match(html, /name="consent"[^>]+required/);
  assert.match(html, /name="goal"[^>]+required/);
  assert.match(html, /name="difficulty"[^>]+required/);
  assert.match(html, /What would you most like to change or improve right now\?(?! \(optional\))/);
  assert.match(html, /What is currently holding you back most\?(?! \(optional\))/);
  assert.match(html, /name="emailMarketing"/);
  assert.match(html, /data-lead-heading/);
  assert.match(html, /data-lead-placeholder="first"/);
  assert.match(html, /<input type="checkbox" name="consent" required><span data-lead-label="consent"/);
  assert.match(html, /data-lead-privacy-link/);
  assert.match(html, /data-lead-success-action/);
  assert.match(html, /data-lead-capture-dashboard hidden/);
  assert.equal((html.match(/class="sevenDayDashboard__lesson"/g) ?? []).length, 7);

  for (const lesson of sevenDayExperience.lessons) {
    assert.match(html, new RegExp(`href="${lesson.route}"`));
    assert.match(html, new RegExp(`data-i18n="${lesson.translationKey}\\.title"`));
    assert.match(html, new RegExp(`data-i18n="${lesson.translationKey}\\.status"`));
  }
});

test("the Start Free qualifying-question labels are required in both languages", () => {
  const spanish = renderStartFree({ language: "es" });

  assert.match(spanish, /¿Qué te gustaría cambiar o mejorar ahora mismo\?(?! \(opcional\))/);
  assert.match(spanish, /¿Qué te está frenando más\?(?! \(opcional\))/);
  assert.match(spanish, /<textarea name="goal"[^>]+required/);
  assert.match(spanish, /<textarea name="difficulty"[^>]+required/);
});

test("the registration honeypot is hidden without changing the status message element", () => {
  const html = dashboard().body;
  const css = fs.readFileSync(new URL("../assets/platform.css", import.meta.url), "utf8");

  assert.match(html, /<input name="website" class="visually-hidden"[^>]*>/);
  assert.match(css, /\.sevenDayRegistration input\.visually-hidden\s*\{[^}]*position:\s*absolute[^}]*width:\s*1px[^}]*height:\s*1px[^}]*clip:\s*rect\(/s);
  assert.match(html, /<p data-lead-capture-status role="status"[^>]*><\/p>/);
  assert.doesNotMatch(html, /<input[^>]+data-lead-capture-status/);
});

test("the registration form cannot fall back to a GET query-string submission", () => {
  const html = dashboard().body;

  assert.match(html, /<form data-lead-capture-form[^>]*method="post"/);
  assert.doesNotMatch(html, /<form data-lead-capture-form[^>]*\bnovalidate\b/);
  assert.match(html, /<button type="button"[^>]+data-lead-submit[^>]+disabled/);
});

test("the registration page provides a no-JavaScript WhatsApp fallback without exposing the form", () => {
  const html = dashboard().body;
  const css = fs.readFileSync(new URL("../assets/platform.css", import.meta.url), "utf8");

  assert.match(html, /<noscript>[\s\S]*sevenDayRegistration__noScript[\s\S]*wa\.me\/34611223345[\s\S]*<\/noscript>/);
  assert.match(css, /html:not\(\.has-js\) \.sevenDayRegistration form\s*\{[^}]*display:\s*none/s);
});

test("success panel offers online and PDF continuation choices", () => {
  const html = dashboard().body;
  assert.match(html, /data-lead-capture-success hidden/);
  assert.match(html, /data-lead-success-prompt/);
  assert.match(html, /data-lead-success-prompt>Choose how you’d like to continue\.<\/p>/);
  assert.match(html, /data-lead-success-action[^>]*>COMPLETE ONLINE<\/a>/);
  assert.match(html, /data-lead-success-download[^>]*>DOWNLOAD WORKBOOK \(PDF\)<\/a>/);
  assert.match(html, /data-lead-success-action[^>]+href="\/start-free\/day-1-see-whats-running-your-life\/"/);
  assert.match(html, /data-lead-success-download[^>]+href="\/downloads\/seven-day-experience-workbook-en\.pdf"[^>]+download/);
  assert.match(html, /data-lead-success-note/);
});

test("hidden registration form stays out of layout despite generic form display", () => {
  const css = fs.readFileSync(new URL("../assets/platform.css", import.meta.url), "utf8");
  assert.match(css, /\.sevenDayRegistration form\[hidden\]\s*\{[\s\S]*display:\s*none\s*!important/);
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
  assert.match(html, /Clearing browser data or changing devices may remove/);
  assert.match(html, /aria-labelledby="seven-day-progress-heading"[\s\S]*?<h2 id="seven-day-progress-heading"/);
  assert.match(html, /aria-labelledby="seven-day-lessons-heading"[\s\S]*?<h2 id="seven-day-lessons-heading"/);
  assert.match(html, /aria-labelledby="seven-day-workbook-heading"[\s\S]*?<h2 id="seven-day-workbook-heading"/);
  assert.match(html, /aria-labelledby="seven-day-privacy-heading"[\s\S]*?<h2 id="seven-day-privacy-heading"/);
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

test("the dashboard loads form and progress enhancements while preserving disabled no-JavaScript controls", () => {
  const page = dashboard();

  assert.deepEqual(page.scripts, ["/assets/lead-capture-form.mjs", "/assets/seven-day-progress.mjs", "/assets/flyer-lightbox.mjs"]);
  assert.match(page.body, /data-progress-reset disabled/);
  for (const lesson of sevenDayExperience.lessons) {
    assert.match(page.body, new RegExp(`data-progress-lesson="${lesson.id}"`));
  }
});

test("the free dashboard exposes only the available English workbook", () => {
  const page = dashboard();
  const html = page.body;

  assert.match(html, /href="\/downloads\/seven-day-experience-workbook-en\.pdf"[^>]+download/);
  assert.match(html, /data-i18n="sevenDay\.workbook\.english"/);
  assert.doesNotMatch(html, /experiencia-siete-dias-cuaderno-es\.pdf/);
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
    sharedKeys.workbook.heading,
    sharedKeys.workbook.intro,
    sharedKeys.workbook.english,
    ...sevenDayExperience.lessons.flatMap((lesson) => [
      lesson.contentKeys.title,
      lesson.contentKeys.status,
    ]),
  ];

  for (const key of keys) assert.match(html, new RegExp(`data-i18n="${key}"`));
});

test("the seven-day flyer has an accessible enlarge control and lightbox", () => {
  const page = dashboard();
  const html = page.body;

  assert.match(html, /data-flyer-trigger/);
  assert.match(html, /aria-haspopup="dialog"/);
  assert.match(html, /Click to enlarge/);
  assert.match(html, /Tap to enlarge/);
  assert.match(html, /data-flyer-dialog/);
  assert.match(html, /role="dialog"/);
  assert.match(html, /aria-modal="true"/);
  assert.match(html, /data-flyer-close/);
  assert.match(html, /free-7-day-taster\.jpeg/);
  assert.match(html, /data-flyer-image/);
  assert.ok(page.scripts.includes("/assets/flyer-lightbox.mjs"));
});
