import test from "node:test";
import assert from "node:assert/strict";
import { referralPage } from "../src/pages/referral.mjs";
import { siteData } from "../content/site-data.mjs";
import { translations } from "../content/translations.mjs";

test("referral page contains the approved share journey sections", () => {
  const page = referralPage(siteData);
  assert.match(page.body, /What if your next introduction could[\s\S]*change someone’s direction/);
  assert.match(page.body, /HOW IT WORKS/);
  assert.match(page.body, /Why become a UYP referral partner/);
  assert.match(page.body, /YOUR PERSONAL INVITE/);
  assert.match(page.body, /SHARE ON WHATSAPP/);
  assert.match(page.body, /COPY MESSAGE/);
  assert.match(page.body, /Someone in your world is ready for their next chapter/);
  assert.match(page.body, /PASS ON THE POWER. SHARE THE POSSIBILITY./);
  assert.match(page.body, /YOUR PERSONAL AFFILIATE LINK/);
  assert.match(page.body, /Affiliate Toolkit/);
  assert.match(page.body, /Use this link on your website, social media, WhatsApp, email or community page\./);
  assert.match(page.body, /affiliate terms/);
  assert.match(page.body, /href="#personal-invite"|share-personally/);
  assert.deepEqual(page.scripts, ["/assets/referral.mjs"]);
  assert.deepEqual(page.styles, ["/assets/referral-page.css?v=20261108-commission-contrast-2"]);
});

test("bottom referral CTA targets the personal invite section", () => {
  const page = referralPage(siteData);
  assert.match(page.body, /href="#share-personally">I’M READY TO REFER &amp; EARN<\/a>/);
  assert.doesNotMatch(page.body, /href="#personal-invite">I’M READY TO REFER &amp; EARN<\/a>/);
});

test("referral page explains the approved 25% reward across eligible product lines", () => {
  const page = referralPage(siteData);
  const reward = page.body.match(/<section[^>]+class="referralSection affiliateReward"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(reward, /Let your influence create a return/);
  assert.match(reward, /25% commission across all eligible product lines/);
  assert.match(reward, /turn trust, relationships and genuine enthusiasm into something positive/);
  assert.match(reward, /Share what matters\. Spark possibility\. Earn as the journey grows\./);
  for (const text of [
    "25% Commission",
    "All Eligible Product Lines",
    "Your Personal Affiliate Link",
    "Earn As You Inspire Others",
    "Foundation step",
    "£97 product",
    "You earn £24.25",
    "Signature programme",
    "£997 product",
    "You earn £249.25",
    "Growth example",
    "£5,000 in eligible referred sales",
    "You earn £1,250",
    "A simple introduction can still create momentum.",
    "One meaningful referral can create real value for both of you.",
    "As your reach grows, your rewards can grow with it.",
  ]) assert.match(reward, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), text);
  assert.match(reward, /eligible referred sales[\s\S]*not a product price/i);
  assert.match(page.body, /Create your affiliate link and start sharing today\./);
  assert.match(reward, /Affiliate reward summary/);
  assert.match(reward, /£97 sale → £24\.25 commission/);
  assert.match(reward, /£997 sale → £249\.25 commission/);
  assert.match(reward, /£5,000 in eligible referred sales → £1,250 commission/);
  assert.match(reward, /eligible, completed, non-refunded purchases successfully attributed to your tracked affiliate link/i);
  assert.doesNotMatch(page.body, /Affiliate rewards and commission terms will be confirmed upon approval/);
});

test("referral page includes the concise affiliate terms summary", () => {
  const page = referralPage(siteData);
  for (const text of [
    "25% of eligible completed full-course sales",
    "successfully attributed to the affiliate’s tracked link or code",
    "Refunded, cancelled, reversed or fraudulent transactions are not commissionable",
    "Self-referrals are not eligible unless explicitly approved",
    "must not be altered to misrepresent attribution",
    "must not make misleading claims",
    "applicable disclosure rules",
    "Payment timing and method will be confirmed",
    "may review or reject affiliate applications",
    "accrued eligible commissions should not be retrospectively reduced",
  ]) assert.match(page.body, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), text);
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
  assert.equal(translations["nav.referral"].en, "Refer & Earn");
});

test("referral share script builds an encoded WhatsApp invitation without an affiliate code", async () => {
  const source = await import("../assets/referral.mjs");
  const share = source.buildReferralShareUrl();
  assert.match(share, /^https:\/\/wa\.me\/\?text=/);
  assert.match(decodeURIComponent(share), /I’ve been exploring a 24-week Master Key System programme/);
  assert.match(decodeURIComponent(share), /https:\/\/unleashyourpowerwithtariq\.com\/start-free\//);
});

test("referral share script preserves tracked affiliate URLs and encodes the invitation", async () => {
  const source = await import("../assets/referral.mjs");
  const share = source.buildReferralShareUrl(source.buildAffiliateLink("Tariq"));
  assert.match(share, /^https:\/\/wa\.me\/\?text=/);
  assert.match(decodeURIComponent(share), /https:\/\/unleashyourpowerwithtariq\.com\/start-free\/\?ref=tariq/);
  assert.equal(share, `https://wa.me/?text=${encodeURIComponent(`${source.invitation} ${source.buildAffiliateLink("Tariq")}`)}`);
  assert.equal(typeof source.copyReferralMessage, "function");
});

test("referral WhatsApp button stays usable across rendered desktop and mobile layouts", () => {
  const page = referralPage(siteData);
  const whatsapp = page.body.match(/<a class="button--primary" data-referral-whatsapp[^>]*>/)?.[0] ?? "";
  assert.match(whatsapp, /href="https:\/\/wa\.me\/\?text=/);
  assert.match(whatsapp, /target="_blank"/);
  assert.doesNotMatch(whatsapp, /aria-disabled|disabled/);
  assert.match(page.body, /referralInvite__actions/);
});

test("referral page keeps existing header and footer shell", () => {
  const page = referralPage(siteData);
  assert.match(page.body, /class="referralPage"/);
  assert.match(page.body, /data-referral-copy/);
  assert.match(page.body, /https:\/\/unleashyourpowerwithtariq\.com\/start-free\//);
});

test("affiliate links use the Start Free route and sanitised ref code", async () => {
  const source = await import("../assets/referral.mjs");
  assert.equal(source.sanitiseAffiliateCode("Tariq"), "tariq");
  assert.equal(source.sanitiseAffiliateCode("John Smith"), "john-smith");
  assert.equal(source.sanitiseAffiliateCode("Book_Club01"), "book_club01");
  assert.equal(source.buildAffiliateLink("Tariq"), "https://unleashyourpowerwithtariq.com/start-free/?ref=tariq");
  assert.equal(source.buildAffiliateLink("!!!"), "https://unleashyourpowerwithtariq.com/start-free/");
  let copied = "";
  assert.equal(await source.copyAffiliateLink("https://unleashyourpowerwithtariq.com/start-free/?ref=tariq", { clipboard: { writeText: async (value) => { copied = value; } } }), true);
  assert.equal(copied, "https://unleashyourpowerwithtariq.com/start-free/?ref=tariq");
  let message = "";
  assert.equal(await source.copyReferralMessage(source.buildAffiliateLink("John Smith"), { clipboard: { writeText: async (value) => { message = value; } } }), true);
  assert.match(message, /start-free\/\?ref=john-smith/);
});
