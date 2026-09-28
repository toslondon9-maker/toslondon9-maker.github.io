import assert from "node:assert/strict";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { routeRenderers } from "../src/routes.mjs";

test("Foundation route renders the bilingual £97 PayPal offer", () => {
  const page = routeRenderers[siteData.routes.foundation](siteData);
  assert.equal(page.route, "/foundation/");
  assert.match(page.body, /Four weeks to build your practice/);
  assert.match(page.body, /Weeks 1–4/);
  assert.match(page.body, /£97/);
  assert.match(page.body, /https:\/\/www\.paypal\.com\/ncp\/payment\/V5QYXZZS6KQE2/);
  assert.match(page.body, /href="\/start-free\/"/);
  const spanish = routeRenderers[siteData.routes.foundation](siteData, "es");
  assert.match(spanish.body, /data-i18n="foundation\.heading"/);
  assert.match(spanish.body, /data-i18n="foundation\.cta"/);
});

test("Foundation page presents the confirmed four-week decision path", () => {
  const page = routeRenderers[siteData.routes.foundation](siteData);
  for (const text of [
    "Four weeks to build your practice",
    "Two 45-minute Zoom coaching calls each week throughout the four-week Foundation stage",
    "WhatsApp support between calls",
    "Workbook and online lesson access",
    "Week 1 — Awareness of the inner world",
    "Week 2 — Understanding the conscious and subconscious mind",
    "Week 3 — Desire and definite purpose",
    "Week 4 — Concentration, visualisation and application",
    "Approximately 30 minutes of personal practice per day",
    "Approximately 30 minutes of personal practice per day", "around 14 hours across four weeks", "Approximately 20 hours total commitment", "eight 45-minute Zoom calls",
    "What happens after payment",
    "What to expect in Week 1",
    "A word from a student",
    "Common questions",
  ]) assert.ok(page.body.includes(text), text);
  assert.match(page.body, /<ol[^>]*class="foundationPage__afterPaymentSteps"/);
  assert.match(page.body, /href="\/refund-policy\/"/);
  assert.match(page.body, /href="\/start-free\/"/);
  assert.match(page.body, /href="https:\/\/www\.paypal\.com\/ncp\/payment\/V5QYXZZS6KQE2"/);
  for (const key of [
    "foundation.heroLead", "foundation.receiveHeading", "foundation.weeksHeading",
    "foundation.afterPaymentHeading", "foundation.timeHeading", "foundation.fitHeading",
    "foundation.week1Heading", "foundation.testimonial", "foundation.questionsHeading",
  ]) assert.match(page.body, new RegExp(`data-i18n="${key}"`));
});

test("Foundation page keeps the approved structure available in Spanish", () => {
  const page = routeRenderers[siteData.routes.foundation](siteData, "es");
  for (const key of [
    "foundation.heroLead", "foundation.receiveHeading", "foundation.weeksHeading",
    "foundation.afterPaymentHeading", "foundation.timeHeading", "foundation.fitHeading",
    "foundation.week1Heading", "foundation.testimonial", "foundation.questionsHeading",
  ]) assert.match(page.body, new RegExp(`data-i18n="${key}"`));
  assert.match(page.body, /Fundamentos/);
  assert.match(page.body, /href="\/refund-policy\/"/);
});

