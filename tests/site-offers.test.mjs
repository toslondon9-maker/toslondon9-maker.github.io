import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { siteData } from "../content/site-data.mjs";
import { routeRenderers } from "../src/routes.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const home = await readFile(path.join(root, "index.html"), "utf8");
const coaching = await readFile(path.join(root, "coaching", "index.html"), "utf8");

test("deployed homepage uses the approved static premium experience", () => {
  assert.match(home, /^<!doctype html>/i);
  assert.match(home, /<main class="home">/);
  assert.match(home, /Start Free for 7 Days/);
  assert.match(home, /Discover the Journey/);
  assert.doesNotMatch(home, /__VINEXT_RSC_CHUNKS__|data-rsc|_rsc=/);
});

test("deployed homepage preserves the approved origins sequence and assets", () => {
  const origins = home.match(/<section class="homeOrigins"[\s\S]*?<\/section>/)?.[0] ?? "";
  const cream = origins.indexOf("homeOrigins__prelude");
  const portraits = origins.indexOf("homeOrigins__portrait");
  const navy = origins.indexOf("homeOrigins__statement");
  assert.ok(cream >= 0 && cream < portraits && portraits < navy);
  assert.equal((home.match(/<img[^>]+haanel-tariq-portraits\.jpeg/g) ?? []).length, 1);
  assert.match(origins, /Where timeless wisdom meets modern transformation\./);
  assert.match(origins, /From inner mastery to purposeful action\./);
  assert.ok(existsSync(path.join(root, "images", "haanel-tariq-portraits.jpeg")));
  assert.ok(existsSync(path.join(root, "images", "tariq-happiness-harmony.png")));
});

test("canonical coaching page owns every locked commercial fact", () => {
  for (const value of [
    "Weeks 1–4", "Weeks 5–11", "Weeks 12–18", "Weeks 19–24",
    "£97", "£197", "£397", "£497", "£1,188", "£997",
    "Save £191", "£1,788", "Save £791", "44% off full MSRP",
  ]) assert.ok(coaching.includes(value), value);
  assert.doesNotMatch(coaching, /6\s*[×x]\s*£169|£1,014/);
  assert.doesNotMatch(home, /£97|£197|£397|£497|£997|£1,188|£1,788/);
});

test("canonical coaching page is static, bilingual and uses a real contact fallback", () => {
  assert.match(coaching, /<title data-i18n="route\.coaching\.metaTitle">24-Week Coaching/);
  assert.match(coaching, /src="\/assets\/tabs\.mjs"/);
  assert.match(coaching, /href="\/contact\/"/);
  assert.match(coaching, /data-i18n="route\.coaching\.action"/);
  assert.match(coaching, />EN<.*>ES</s);
  assert.doesNotMatch(coaching, /paypal|__VINEXT_RSC_CHUNKS__|hydrate/i);
});

test("all commercial comparisons are derived from the canonical offer data", () => {
  assert.equal(siteData.stages.reduce((sum, stage) => sum + stage.price, 0), siteData.offer.separateTotal);
  assert.equal(siteData.offer.separateTotal - siteData.offer.completePrice, siteData.offer.foundingSaving);
  assert.equal(siteData.stages.reduce((sum, stage) => sum + stage.msrp, 0), siteData.offer.msrpTotal);
  assert.equal(siteData.offer.msrpTotal - siteData.offer.completePrice, siteData.offer.msrpSaving);
  assert.equal(Math.round((1 - siteData.offer.completePrice / siteData.offer.msrpTotal) * 100), siteData.offer.msrpDiscount);
});

test("the free dashboard remains free and does not add a registration or payment flow", () => {
  const html = routeRenderers[siteData.routes.startFree](siteData).body;

  assert.doesNotMatch(html, /<form\b|<input\b|paypal|stripe|payment|checkout|register|sign up|account (?:created|creation)/i);
  assert.match(html, /href="\/start-free\/day-1-see-whats-running-your-life\/"/);
});
