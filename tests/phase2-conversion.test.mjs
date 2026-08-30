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

test("Day 7 bridges to independent study, AI reflection and coaching", () => {
  const html = renderSevenDayLesson({ lesson: daySeven, data: siteData, language: "en" });
  assert.match(html, /YOU HAVE COMPLETED THE FREE EXPERIENCE/);
  assert.match(html, /Continue through all 24 chapters/);
  assert.match(html, /Use the AI Mentor/);
  assert.match(html, /Explore the 24-week programme/);
});

test("coaching page clarifies fit, boundaries and the enquiry path", () => {
  const html = renderCoaching({ language: "en", siteData });
  assert.match(html, /IS THIS FOR YOU\?/);
  assert.match(html, /What this is not/);
  assert.match(html, /FROM ENQUIRY TO WEEK 1/);
  assert.match(html, /A simple next step\. No pressure\./);
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
