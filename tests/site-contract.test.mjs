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

test("every mapped section has one canonical destination", () => {
  const map = JSON.parse(readFileSync(new URL("../content/content-map.json", import.meta.url)));
  assert.ok(map.length >= 20);
  for (const item of map) {
    assert.match(item.source, /^\//);
    assert.match(item.destination, /^\//);
    assert.ok(["move", "shorten", "retain", "replace"].includes(item.disposition));
  }
});
