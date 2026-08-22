import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { siteData } from "../content/site-data.mjs";

test("commercial and identity values are locked", () => {
  assert.equal(siteData.founder.firstName, "Tariq");
  assert.deepEqual(siteData.stages.map(({ weeks, price }) => [weeks, price]), [
    ["1–4", 97], ["5–11", 197], ["12–18", 397], ["19–24", 497]
  ]);
  assert.deepEqual(siteData.offer, {
    separateTotal: 1188, completePrice: 997, foundingSaving: 191,
    msrpTotal: 1788, msrpSaving: 791, msrpDiscount: 44
  });
  assert.equal(JSON.stringify(siteData).includes("169"), false);
  assert.equal(JSON.stringify(siteData).includes("1,014"), false);
});

test("canonical route definitions are locked", () => {
  assert.deepEqual(siteData.routes, {
    home: "/",
    masterKeySystem: "/master-key-system/",
    startFree: "/start-free/",
    coaching: "/coaching/",
    aboutTariq: "/about-tariq/",
    resources: "/resources/",
    aiMentors: "/ai-mentors/",
    contact: "/contact/",
    faq: "/faq/",
    referral: "/referral/",
    privacy: "/privacy/",
    terms: "/terms/",
    liveCoaching: "/live-coaching/"
  });
});

test("every mapped section has one canonical destination", () => {
  const map = JSON.parse(readFileSync(new URL("../content/content-map.json", import.meta.url)));
  assert.ok(map.length >= 20);
  for (const item of map) {
    assert.match(item.source, /^\//);
    assert.match(item.destination, /^\//);
    assert.ok(["move", "shorten", "retain", "replace"].includes(item.disposition));
  }
  assert.equal(new Set(map.map(({ source }) => source)).size, map.length);

  const mapBySource = new Map(map.map((item) => [item.source, item]));
  assert.equal(mapBySource.get("/#master-key").destination, siteData.routes.masterKeySystem);
  assert.equal(mapBySource.get("/#seven-day").destination, siteData.routes.startFree);
  assert.equal(mapBySource.get("/#pricing").destination, siteData.routes.coaching);
  assert.equal(mapBySource.get("/#story").destination, siteData.routes.aboutTariq);
  assert.equal(mapBySource.get("/coaching/#soundtrack").destination, siteData.routes.resources);
  assert.equal(mapBySource.get("/#word-check").destination, siteData.routes.aiMentors);
  assert.equal(mapBySource.get("/coaching/#contact").destination, siteData.routes.contact);
});

test("shared site data is deeply immutable", () => {
  assert.throws(() => {
    siteData.founder.firstName = "Changed";
  }, TypeError);
  assert.throws(() => {
    siteData.stages.push({ id: "changed" });
  }, TypeError);
  assert.throws(() => {
    siteData.offer.completePrice = 0;
  }, TypeError);
  assert.throws(() => {
    siteData.routes.home = "/changed/";
  }, TypeError);
});
