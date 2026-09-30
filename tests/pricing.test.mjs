import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { pricing, pricingNote } from "../content/pricing.mjs";
import { siteData } from "../content/site-data.mjs";
import { routeRenderers } from "../src/routes.mjs";
import { coachingPage } from "../src/pages/coaching.mjs";
import { faqPage } from "../src/pages/faq.mjs";
import { startFreePage } from "../src/pages/start-free.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const approved = {
  foundation: ["£97", "€114"],
  visualisation: ["£197", "€231"],
  concentration: ["£397", "€465"],
  mastery: ["£497", "€582"],
  complete: ["£997", "€1,167"],
  separate: ["£1,188", "€1,390"],
  foundingSaving: ["£191", "€223"],
  balance: ["£900", "€1,053"],
  masteryCircle: ["£3,000–£5,000", "€3,510–€5,850"],
  privateMentoring: ["£7,500–£15,000", "€8,776–€17,551"],
  alumni: ["£29–£79/month", "€34–€92/month"],
  corporate: ["From £5,000", "from €5,850"],
};

test("canonical pricing catalogue contains every approved GBP/EUR pair", () => {
  assert.deepEqual(Object.keys(pricing).sort(), Object.keys(approved).sort());
  for (const [key, [gbp, eur]] of Object.entries(approved)) {
    assert.equal(pricing[key].gbp, gbp);
    assert.match(pricing[key].en, new RegExp(`${escapeRegExp(gbp)}.*${escapeRegExp(eur)}`));
    assert.match(pricing[key].es, new RegExp(`${escapeRegExp(gbp.replace("From ", ""))}.*${escapeRegExp(eur.replace("from ", ""))}`));
  }
  assert.match(pricingNote.en, /GBP is the payment currency/);
  assert.match(pricingNote.en, /EUR figures are indicative/);
  assert.match(pricingNote.es, /El pago se realiza en GBP/);
  assert.match(pricingNote.es, /cifras en EUR son orientativas/);
  for (const value of Object.values(pricing)) {
    assert.doesNotMatch(value.en, /approximately/);
    assert.doesNotMatch(value.es, /aproximadamente/);
  }
});

test("public paid routes render every approved price in both languages and keep GBP official", () => {
  const english = coachingPage(siteData, "en").body;
  const spanish = coachingPage(siteData, "es").body;
  for (const value of Object.values(pricing)) {
    assert.match(english, new RegExp(escapeRegExp(value.en)));
    assert.match(spanish, new RegExp(escapeRegExp(value.es)));
  }
  assert.match(english, /GBP is the payment currency/);
  assert.match(spanish, /El pago se realiza en GBP/);
  assert.doesNotMatch(english, /approximately €|aproximadamente €/);
  assert.doesNotMatch(spanish, /approximately €|aproximadamente €/);
  assert.match(english, /GBP is the payment currency/);
});

test("Foundation, homepage and FAQ use paired pricing while free and book pages stay unpriced", async () => {
  const foundation = routeRenderers[siteData.routes.foundation](siteData).body;
  const home = routeRenderers[siteData.routes.home](siteData).body;
  const faq = routeRenderers[siteData.routes.faq](siteData).body;
  const free = routeRenderers[siteData.routes.startFree](siteData).body;
  const book = routeRenderers[siteData.routes.getTheBook](siteData).body;
  assert.match(foundation, /£97.*€114/);
  assert.match(home, /£97.*€114/);
  assert.match(home, /£997.*€1,167/);
  assert.match(faq, /£97.*€114/);
  assert.match(faq, /GBP is the payment currency/);
  assert.match(faqPage(siteData, "es").body, /El pago se realiza en GBP/);
  assert.match(free, /Free registration required|No purchase required/);
  assert.match(free, /GBP is the payment currency/);
  assert.match(startFreePage(siteData, "es").body, /El pago se realiza en GBP/);
  assert.doesNotMatch(book, /€114|€1,167|approximately €|aproximadamente €/);
  const referral = await readFile(path.join(root, "referral", "index.html"), "utf8");
  assert.match(referral, /£97/);
  assert.doesNotMatch(referral, /€114|approximately €|aproximadamente €/);
});

test("PayPal URLs and GBP amounts remain unchanged", () => {
  const expectedUrls = siteData.stages.map((stage) => stage.paymentUrl).concat(siteData.offer.paymentUrl);
  const coaching = routeRenderers[siteData.routes.coaching](siteData).body;
  const foundation = routeRenderers[siteData.routes.foundation](siteData).body;
  for (const url of expectedUrls.slice(1)) assert.match(coaching, new RegExp(escapeRegExp(url)));
  assert.match(foundation, new RegExp(escapeRegExp(siteData.stages[0].paymentUrl)));
  assert.deepEqual(siteData.stages.map((stage) => stage.price), [97, 197, 397, 497]);
  assert.deepEqual(siteData.offer, {
    separateTotal: 1188,
    completePrice: 997,
    foundingSaving: 191,
    msrpTotal: 1788,
    msrpSaving: 791,
    msrpDiscount: 44,
    paymentUrl: "https://www.paypal.com/ncp/payment/JW7JRY5GTRTA6",
  });
});

test("generated public HTML does not leave an approved paid offer GBP-only", async () => {
  const files = ["index.html", "foundation/index.html", "coaching/index.html", "faq/index.html", "start-free/index.html", "start-free/day-7-make-it-part-of-how-you-live/index.html"];
  for (const relativeFile of files) {
    const html = await readFile(path.join(root, relativeFile), "utf8");
    assert.doesNotMatch(html, /(?:approximately|aproximadamente) €|(?:approximately|aproximadamente) desde €/);
    for (const value of Object.values(pricing)) {
      if (!html.includes(value.gbp)) continue;
      assert.match(html, new RegExp(escapeRegExp(value.en.split(" / ")[0])));
      assert.match(html, new RegExp(escapeRegExp(value.en.split(" / ")[1])));
    }
  }
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
}
