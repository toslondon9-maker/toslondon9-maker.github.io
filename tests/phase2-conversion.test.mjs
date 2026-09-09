import assert from "node:assert/strict";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { renderCoaching } from "../src/pages/coaching.mjs";
import { renderContact } from "../src/pages/contact.mjs";
import { renderSessionHub } from "../src/pages/session-hub.mjs";
import { renderStartFree } from "../src/pages/start-free.mjs";
import { renderSevenDayLesson } from "../src/pages/seven-day-lesson.mjs";
import { sevenDayExperience } from "../content/seven-day-experience.mjs";

const daySeven = sevenDayExperience.lessons.at(-1);

test("free experience gives visitors a clear post-Day-7 choice without forcing coaching", () => {
  const html = renderStartFree({ language: "en" });
  assert.match(html, /AFTER DAY 7/);
  assert.match(html, /EXPLORE THE 24-WEEK PROGRAMME/);
  assert.match(html, /OPEN THE AI MENTOR/);
  assert.match(html, /OPEN THE 24 CHAPTERS/);
});

test("Day 7 presents informed independent, WhatsApp, Foundation and complete-journey choices", () => {
  const html = renderSevenDayLesson({ lesson: daySeven, data: siteData, language: "en" });
  assert.match(html, /YOUR OPTIONS/);
  assert.match(html, /Choose the next step that suits you/);
  assert.match(html, /USE THE RESOURCES/);
  assert.match(html, /ASK ON WHATSAPP/);
  assert.match(html, /CONTINUE WITH FOUNDATION/);
  assert.match(html, /EXPLORE THE COMPLETE JOURNEY/);
});

test("coaching page clarifies fit, boundaries and the enquiry path", () => {
  const html = renderCoaching({ language: "en", siteData });
  assert.match(html, /IS THIS FOR YOU\?/);
  assert.match(html, /What this is not/);
  assert.match(html, /FROM ENQUIRY TO WEEK 1/);
  assert.match(html, /A simple next step\. No pressure\./);
});

test("coaching and contact pages offer the free fifteen-minute WhatsApp call", () => {
  const expected = encodeURIComponent("Hi Tariq, I’d like to book a free 15-minute call to discuss Unleash Your Power.");
  const coaching = renderCoaching({ language: "en", siteData });
  const contact = renderContact({ data: siteData, language: "en" });
  for (const html of [coaching, contact]) {
    assert.match(html, /BOOK A FREE 15-MINUTE CALL/);
    assert.match(html, new RegExp(`https://wa\\.me/34611223345\\?text=${expected}`));
    assert.match(html, /target="_blank" rel="noopener noreferrer"/);
  }
  assert.match(contact, /contactPage__hero[\s\S]*BOOK A FREE 15-MINUTE CALL/);
});

test("Session Hub provides a private weekly return point", () => {
  const html = renderSessionHub({ data: siteData, language: "en" });
  assert.match(html, /YOUR SESSION HUB/);
  assert.match(html, /Continue your current chapter/);
  assert.match(html, /Use the AI Mentor/);
  assert.match(html, /BEFORE A COACHING SESSION/);
});

test("contact page offers coaching, WhatsApp, questions and a free fallback", () => {
  const html = renderContact({ data: siteData, language: "en" });
  assert.match(html, /ENQUIRE ABOUT COACHING/);
  assert.match(html, /https:\/\/wa\.me\/34611223345/);
  assert.match(html, /ASK A QUESTION/);
  assert.match(html, /START FREE FOR 7 DAYS/);
});

test("Phase 2 conversion sections remain complete when visitors switch to Spanish", () => {
  const pages = [
    renderStartFree({ language: "es" }),
    renderCoaching({ language: "es", siteData }),
    renderContact({ data: siteData, language: "es" }),
    renderSessionHub({ data: siteData, language: "es" }),
  ];
  const html = pages.join("\n");

  assert.match(html, /DESPUÉS DEL DÍA 7/);
  assert.match(html, /Sin presión\./);
  assert.match(html, /RECORRIDO COMPLETO/);
  assert.match(html, /TU CENTRO DE SESIONES/);
  assert.ok((html.match(/data-i18n="phase2\./g) ?? []).length >= 70);
});
