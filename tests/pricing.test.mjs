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
  foundation: ["£97"],
  visualisation: ["£197"],
  concentration: ["£397"],
  mastery: ["£497"],
  complete: ["£997"],
  separate: ["£1,188"],
  foundingSaving: ["£191"],
  balance: ["£900"],
  masteryCircle: ["£3,000–£5,000"],
  privateMentoring: ["£7,500–£15,000"],
  alumni: ["£49/month"],
  corporate: ["From £5,000"],
};

test("canonical pricing catalogue contains every approved GBP/EUR pair", () => {
  assert.deepEqual(Object.keys(pricing).sort(), Object.keys(approved).sort());
  for (const [key, [gbp]] of Object.entries(approved)) {
    assert.equal(pricing[key].gbp, gbp);
    assert.equal(pricing[key].en, gbp);
    assert.equal(pricing[key].es, key === "corporate" ? "Desde £5,000" : gbp);
  }
  assert.match(pricingNote.en, /All prices are shown in GBP/);
  
  assert.match(pricingNote.es, /Todos los precios se muestran en GBP/);
  
  for (const value of Object.values(pricing)) {
    assert.doesNotMatch(value.en, /approximately/);
    assert.doesNotMatch(value.es, /aproximadamente/);
  }
});

test("public paid routes render every approved price in both languages and keep GBP official", () => {
  const english = coachingPage(siteData, "en").body;
  const spanish = coachingPage(siteData, "es").body;
  for (const key of ["foundation", "visualisation", "concentration", "mastery", "complete", "balance", "masteryCircle", "alumni"]) {
    const value = pricing[key];
    assert.match(english, new RegExp(escapeRegExp(value.en)));
    assert.match(spanish, new RegExp(escapeRegExp(value.es)));
  }
  for (const hidden of ["privateMentoring", "corporate", "separate", "foundingSaving"]) {
    assert.doesNotMatch(english, new RegExp(escapeRegExp(pricing[hidden].en)));
    assert.doesNotMatch(spanish, new RegExp(escapeRegExp(pricing[hidden].es)));
  }
  assert.match(english, /All prices are shown in GBP/);
  assert.match(spanish, /Todos los precios se muestran en GBP/);
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
  assert.match(foundation, /£97/);
  assert.match(home, /£97/);
  assert.match(home, /£997/);
  assert.match(faq, /£97/);
  assert.match(faq, /All prices are shown in GBP/);
  assert.match(faqPage(siteData, "es").body, /Todos los precios se muestran en GBP/);
  assert.match(free, /Free registration required|No purchase required/);
  
  
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
