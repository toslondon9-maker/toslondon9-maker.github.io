import assert from "node:assert/strict";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { routeRenderers } from "../src/routes.mjs";
import { t } from "../content/translations.mjs";

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

test("Foundation purchase page places the closed life-changing power accordion before price and CTA", () => {
  const page = routeRenderers[siteData.routes.foundation](siteData);
  const body = page.body;
  const message = body.match(/<section class="foundationPage__lifePower"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.ok(message, "life-changing power message should be present");
  assert.equal((message.match(/<details class="foundationPage__lifePowerDetails"/g) ?? []).length, 1);
  assert.doesNotMatch(message, /<details[^>]+open/);
  for (const key of [
    "foundation.lifePower.heading", "foundation.lifePower.teaser", "foundation.lifePower.toggle",
    "foundation.lifePower.articleTitle", "foundation.lifePower.paragraph1", "foundation.lifePower.paragraph2",
    "foundation.lifePower.paragraph3", "foundation.lifePower.paragraph4", "foundation.lifePower.paragraph5",
  ]) assert.match(message, new RegExp(`data-i18n="${key}"`));
  assert.match(message, /The Life-Changing Power of the Master Key System/);
  assert.match(message, /Unlock a Richer Life: The Transformative Power of the Master Key System/);
  assert.ok(body.indexOf('class="foundationPage__lifePower"') < body.indexOf('class="foundationPage__price"'));
  assert.ok(body.indexOf('class="foundationPage__lifePower"') < body.indexOf('class="foundationPage__actions"'));
  assert.match(body, /href="https:\/\/www\.paypal\.com\/ncp\/payment\/V5QYXZZS6KQE2"/);
});

test("Foundation page presents the confirmed four-week decision path", () => {
  const page = routeRenderers[siteData.routes.foundation](siteData);
  for (const text of [
    "Four weeks to build your practice",
    "Two private 45-minute Zoom calls each week",
    "Eight calls total",
    "WhatsApp support between calls",
    "Workbook and online lessons",
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
  for (const text of ["Four weeks", "Four progressive lessons", "Two private 45-minute Zoom calls each week", "Eight calls total", "Workbook and online lessons", "WhatsApp support", "£97"]) assert.ok(summary.includes(text), text);
  assert.doesNotMatch(summary, /21 hours|14 hours|41 hours total commitment/);
});

test("Foundation short commercial copy is approachable and omits the detailed time commitment", () => {
  for (const key of ["home.offers.foundationBody", "coaching.foundation.summary", "conversion.foundation.body"]) {
    for (const language of ["en", "es"]) {
      const value = t(key, language);
      assert.match(value, /four weeks|Cuatro semanas/i, key);
      assert.match(value, /45-minute|45 minutos/i, key);
      assert.doesNotMatch(value, /41 hours|41 horas|41-hour|41 horas de dedicación/i, key);
    }
  }
});

test("Foundation purchase page leads with three values, five benefits and closed detail accordions", () => {
  const page = routeRenderers[siteData.routes.foundation](siteData);
  const body = page.body;
  const benefits = body.match(/<ul class="foundationPage__tickList">[\s\S]*?<\/ul>/)?.[0] ?? "";
  const testimonial = body.indexOf('class="foundationPage__testimonial"');
  const weeks = body.indexOf('id="foundation-weeks-heading"');
  assert.match(body, /class="foundationPage__valueSummary"/);
  assert.equal((body.match(/class="foundationPage__valueSummary"/g) ?? []).length, 1);
  assert.equal((benefits.match(/<li/g) ?? []).length, 5);
  assert.ok(testimonial > body.indexOf('id="foundation-receive"'));
  assert.ok(testimonial < weeks);
  for (const key of ["foundation.afterPaymentHeading", "foundation.timeHeading", "foundation.fitHeading", "foundation.week1Heading", "foundation.questionsHeading"]) assert.match(body, new RegExp(`data-i18n="${key}"`));
  assert.equal((body.match(/<details class="foundationPage__accordion"/g) ?? []).length, 5);
  assert.doesNotMatch(body, /<details class="foundationPage__accordion"[^>]+open/);
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
  for (const key of ["foundation.lifePower.heading", "foundation.lifePower.teaser", "foundation.lifePower.toggle", "foundation.lifePower.articleTitle", "foundation.lifePower.paragraph1", "foundation.lifePower.paragraph5"]) assert.match(page.body, new RegExp(`data-i18n="${key}"`));
  assert.match(page.body, /El poder transformador del Master Key System/);
});

