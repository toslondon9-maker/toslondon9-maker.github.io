import test from "node:test";
import assert from "node:assert/strict";
import { referralPage } from "../src/pages/referral.mjs";
import { siteData } from "../content/site-data.mjs";
import { translations } from "../content/translations.mjs";

test("referral page contains the approved share journey sections", () => {
  const page = referralPage(siteData);
  assert.match(page.body, /Help Someone You Care About[\s\S]*Begin Their Journey/);
  assert.match(page.body, /HOW IT WORKS/);
  assert.match(page.body, /WHY REFER/);
  assert.match(page.body, /YOUR PERSONAL INVITE/);
  assert.match(page.body, /SHARE ON WHATSAPP/);
  assert.match(page.body, /COPY MESSAGE/);
  assert.match(page.body, /Ready to share the gift of growth\?/);
  assert.match(page.body, /Become an Unleash Your Power Affiliate/);
  assert.match(page.body, /YOUR PERSONAL AFFILIATE LINK/);
  assert.match(page.body, /Affiliate Toolkit/);
  assert.match(page.body, /Website \/ Social Media \/ Community URL/);
  assert.match(page.body, /affiliate terms/);
  assert.match(page.body, /href="#personal-invite"|share-personally/);
  assert.deepEqual(page.scripts, ["/assets/referral.mjs"]);
});

test("referral runtime provides stable personal and affiliate anchors with a bridge", async () => {
  const source = await import("../assets/referral.mjs");
  const script = await (await import("node:fs/promises")).readFile(new URL("../assets/referral.mjs", import.meta.url), "utf8");
  assert.match(script, /setAttribute\("id", "share-personally"\)/);
  assert.match(script, /setAttribute\("id", "affiliate-link"\)/);
  assert.match(script, /Create your affiliate link/);
  assert.equal(typeof source.buildAffiliateLink, "function");
});

test("navigation labels identify the affiliate area", () => {
  assert.equal(translations["nav.referral"].en, "Affiliate / Refer & Earn");
});

test("referral share script builds an encoded WhatsApp invitation and copy fallback", async () => {
  const source = await import("../assets/referral.mjs");
  const share = source.buildReferralShareUrl(source.buildAffiliateLink("Tariq"));
  assert.match(share, /^https:\/\/wa\.me\/\?text=/);
  assert.match(decodeURIComponent(share), /I’ve been exploring a 24-week Master Key System programme/);
  assert.match(decodeURIComponent(share), /https:\/\/toslondon9-maker\.github\.io\/start-free\/\?ref=tariq/);
  assert.equal(typeof source.copyReferralMessage, "function");
  assert.equal(source.buildReferralShareUrl(), "");
  assert.equal(await source.copyReferralMessage(""), false);
});

test("referral page keeps existing header and footer shell", () => {
  const page = referralPage(siteData);
  assert.match(page.body, /class="referralPage"/);
  assert.match(page.body, /data-referral-copy/);
  assert.match(page.body, /https:\/\/toslondon9-maker\.github\.io\/start-free\//);
});

test("affiliate links use the Start Free route and sanitised ref code", async () => {
  const source = await import("../assets/referral.mjs");
  assert.equal(source.sanitiseAffiliateCode("Tariq"), "tariq");
  assert.equal(source.sanitiseAffiliateCode("John Smith"), "john-smith");
  assert.equal(source.sanitiseAffiliateCode("Book_Club01"), "book_club01");
  assert.equal(source.buildAffiliateLink("Tariq"), "https://toslondon9-maker.github.io/start-free/?ref=tariq");
  assert.equal(source.buildAffiliateLink("!!!"), "https://toslondon9-maker.github.io/start-free/");
  let copied = "";
  assert.equal(await source.copyAffiliateLink("https://toslondon9-maker.github.io/start-free/?ref=tariq", { clipboard: { writeText: async (value) => { copied = value; } } }), true);
  assert.equal(copied, "https://toslondon9-maker.github.io/start-free/?ref=tariq");
  let message = "";
  assert.equal(await source.copyReferralMessage(source.buildAffiliateLink("John Smith"), { clipboard: { writeText: async (value) => { message = value; } } }), true);
  assert.match(message, /start-free\/\?ref=john-smith/);
});
