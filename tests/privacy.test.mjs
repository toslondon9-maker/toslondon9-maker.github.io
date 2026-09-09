import assert from "node:assert/strict";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { routeRenderers } from "../src/routes.mjs";

test("privacy copy documents consent-gated anonymous Phase 2 analytics", () => {
  const page = routeRenderers[siteData.routes.privacy](siteData).body;

  assert.match(page, /Google Analytics 4 is used only after you choose to accept optional Analytics/i);
  for (const phrase of [
    "article CTA clicks",
    "opening the Free 7-Day experience",
    "opening Day 1",
    "completing Day 7",
    "choosing WhatsApp",
    "beginning a Foundation or complete-journey checkout",
  ]) assert.match(page, new RegExp(phrase, "i"));
  assert.match(page, /No names, emails, WhatsApp numbers, goals, difficulties or form-answer content is sent to Google Analytics/i);
  assert.match(page, /Referral codes are not sent to Google Analytics either/i);
  assert.match(page, /decline, withdraw or change your choice/i);
});
