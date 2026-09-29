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
    "Eight calls total — six hours of live Zoom coaching",
    "WhatsApp support between calls",
    "Workbook and online lesson access",
    "Week 1 — One Consciousness – One Power",
    "Week 2 — One Method of Finding the Truth",
    "Week 3 — Thoughts Become Things",
    "Week 4 — The True “Self”",
    "Approximately 45 minutes to read the chapter",
    "30 minutes for the meditation exercise each day",
    "approximately 21 hours of chapter reading", "approximately 14 hours of meditation practice", "six hours of live Zoom coaching", "approximately 41 hours total commitment", "eight 45-minute Zoom calls",
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

test("Foundation page leads with a compact canonical facts summary", () => {
  const page = routeRenderers[siteData.routes.foundation](siteData);
  const summary = page.body.match(/<section class="foundationPage__facts"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.ok(summary, "facts summary should be present");
  for (const text of ["Four weeks", "Four progressive lessons", "Two 45-minute Zoom calls each week", "Eight calls total", "Six hours of live Zoom coaching", "Workbook and online lessons", "WhatsApp support", "21 hours", "14 hours", "41 hours total", "£97"]) assert.ok(summary.includes(text), text);
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

