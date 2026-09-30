import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { siteData } from "../content/site-data.mjs";
import { routeRenderers } from "../src/routes.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const home = await readFile(path.join(root, "index.html"), "utf8");
const coaching = await readFile(path.join(root, "coaching", "index.html"), "utf8");

test("deployed homepage uses the approved static Master Key experience", () => {
  assert.match(home, /^<!doctype html>/i);
  assert.match(home, /<main class="home">/);
  assert.match(home, /Master the world within\./);
  assert.match(home, /START YOUR 7 DAYS/);
  assert.match(home, /EXPLORE THE METHOD/);
  assert.doesNotMatch(home, /__VINEXT_RSC_CHUNKS__|data-rsc|_rsc=/);
});

test("deployed homepage preserves the approved compact lineage section", () => {
  const lineage = home.match(/<section[^>]+data-home-section="tradition"[\s\S]*?<\/section>/)?.[0] ?? "";
  const names = [...lineage.matchAll(/<h3[^>]*>([^<]+)<\/h3>/g)].map((match) => match[1]).slice(0, 3);
  assert.deepEqual(names, ["Charles F. Haanel", "Helmar Rudolph", "Tariq Saddique"]);
  assert.match(lineage, /Modern Study &amp; Application/);
  assert.match(lineage, /Your Guide &amp; Coach/);
  assert.match(lineage, /not affiliated with or endorsed by/i);
  assert.match(lineage, new RegExp(`href="${escapeRegExp(siteData.routes.mksLineage)}"`));
  assert.match(lineage, new RegExp(`href="${escapeRegExp(siteData.routes.resources)}"`));
  assert.match(home, new RegExp(`href="${escapeRegExp(siteData.routes.aboutTariq)}"`));
});

test("canonical coaching page owns every locked commercial fact", () => {
  for (const value of [
    "Weeks 1–4", "Weeks 5–11", "Weeks 12–18", "Weeks 19–24",
    "£97 / approximately €114", "£197 / approximately €231", "£397 / approximately €465", "£497 / approximately €582",
    "£1,188 / approximately €1,390", "£997 / approximately €1,167", "£191 / approximately €223",
    "£900 / approximately €1,053", "£3,000–£5,000 / approximately €3,510–€5,850",
    "£7,500–£15,000 / approximately €8,776–€17,551", "£29–£79/month / approximately €34–€92/month",
    "From £5,000 / approximately from €5,850", "GBP is the payment currency",
  ]) assert.ok(coaching.includes(value), value);
  assert.doesNotMatch(coaching, /6\s*[×x]\s*£169|£1,014/);
  const offers = home.match(/<section[^>]+data-home-section="offers"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(offers, /Free 7-Day Experience/);
  assert.match(offers, new RegExp(`Foundation[\\s\\S]*£97[\\s\\S]*href="${escapeRegExp(siteData.routes.foundation)}"`));
  assert.match(offers, new RegExp(`Complete 24-Week Journey[\\s\\S]*£997[\\s\\S]*href="${escapeRegExp(siteData.routes.coaching)}"`));
  assert.doesNotMatch(home, /£197|£397|£497|£1,188|£1,788/);
  assert.doesNotMatch(home, /class="foundationNextStep"|href="https:\/\/www\.paypal\.com\/ncp\/payment\//);
});

test("canonical coaching page is static, bilingual and uses a real contact fallback", () => {
  assert.match(coaching, /<title data-i18n="route\.coaching\.metaTitle">Master Key System Coaching \| 24-Week Course/);
  assert.match(coaching, /data-i18n="pricing\.note"/);
  assert.doesNotMatch(coaching, /href="https:\/\/www\.paypal\.com\/ncp\/payment\/V5QYXZZS6KQE2" target="_blank" rel="noopener noreferrer"/);
  assert.match(coaching, /data-i18n="route\.coaching\.action"/);
  assert.match(coaching, />EN<.*>ES</s);
  assert.match(coaching, /https:\/\/www\.paypal\.com\/ncp\/payment\/JW7JRY5GTRTA6/);
  assert.doesNotMatch(coaching, /__VINEXT_RSC_CHUNKS__|hydrate/i);
});

test("all commercial comparisons are derived from the canonical offer data", () => {
  assert.equal(siteData.stages.reduce((sum, stage) => sum + stage.price, 0), siteData.offer.separateTotal);
  assert.equal(siteData.offer.separateTotal - siteData.offer.completePrice, siteData.offer.foundingSaving);
  assert.equal(siteData.stages.reduce((sum, stage) => sum + stage.msrp, 0), siteData.offer.msrpTotal);
  assert.equal(siteData.offer.msrpTotal - siteData.offer.completePrice, siteData.offer.msrpSaving);
  assert.equal(Math.round((1 - siteData.offer.completePrice / siteData.offer.msrpTotal) * 100), siteData.offer.msrpDiscount);
});

test("the Foundation offer stays inside the registration-gated dashboard", () => {
  const html = routeRenderers[siteData.routes.startFree](siteData).body;
  const foundation = siteData.stages.find((stage) => stage.id === "foundation");
  const dashboardIndex = html.indexOf("data-lead-capture-dashboard hidden");

  assert.ok(foundation, "the canonical Foundation offer is available");
  assert.match(html, /data-lead-capture-form/);
  assert.match(html, /data-lead-capture-dashboard hidden/);
  assert.doesNotMatch(html.slice(0, dashboardIndex), /paypal\.com\/ncp\/payment|stripe\.com\/|data-payment/i);
  assert.match(html.slice(dashboardIndex), /href="\/foundation\/"/);
  assert.match(html, /href="\/start-free\/day-1-see-whats-running-your-life\/"/);
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
