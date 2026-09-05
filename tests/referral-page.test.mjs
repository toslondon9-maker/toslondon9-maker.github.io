import test from "node:test";
import assert from "node:assert/strict";
import { referralPage } from "../src/pages/referral.mjs";
import { siteData } from "../content/site-data.mjs";

test("referral page contains the approved share journey sections", () => {
  const page = referralPage(siteData);
  assert.match(page.body, /Help Someone You Care About[\s\S]*Begin Their Journey/);
  assert.match(page.body, /HOW IT WORKS/);
  assert.match(page.body, /WHY REFER/);
  assert.match(page.body, /YOUR PERSONAL INVITE/);
  assert.match(page.body, /SHARE ON WHATSAPP/);
  assert.match(page.body, /COPY MESSAGE/);
  assert.match(page.body, /Ready to share the gift of growth\?/);
  assert.deepEqual(page.scripts, ["/assets/referral.mjs"]);
});

test("referral share script builds an encoded WhatsApp invitation and copy fallback", async () => {
  const source = await import("../assets/referral.mjs");
  const share = source.buildReferralShareUrl();
  assert.match(share, /^https:\/\/wa\.me\/\?text=/);
  assert.match(decodeURIComponent(share), /I’ve been exploring a 24-week Master Key System programme/);
  assert.match(decodeURIComponent(share), /https:\/\/toslondon9-maker\.github\.io\/start-free\//);
  assert.equal(typeof source.copyReferralMessage, "function");
});

test("referral page keeps existing header and footer shell", () => {
  const page = referralPage(siteData);
  assert.match(page.body, /class="referralPage"/);
  assert.match(page.body, /data-referral-copy/);
  assert.match(page.body, /https:\/\/toslondon9-maker\.github\.io\/start-free\//);
});
