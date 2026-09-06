import assert from "node:assert/strict";
import test from "node:test";
import { captureAffiliateAttribution, getStoredAffiliateCode, sanitiseAffiliateCode } from "../assets/affiliate-tracking.mjs";

function storage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), values };
}

test("affiliate codes are sanitised and limited to safe characters", () => {
  assert.equal(sanitiseAffiliateCode("  Maria<script>2026!! "), "Maria2026");
  assert.equal(sanitiseAffiliateCode("a_b-c"), "a_b-c");
  assert.equal(sanitiseAffiliateCode("!!!"), "");
});

test("first-touch attribution persists for 60 days without overwrite", () => {
  const store = storage();
  const first = captureAffiliateAttribution({ search: "?ref=englishbookshop", pathname: "/" }, store, 1_000);
  assert.equal(first.affiliate_code, "englishbookshop");
  const later = captureAffiliateAttribution({ search: "?ref=second", pathname: "/coaching/" }, store, 2_000);
  assert.equal(later.affiliate_code, "englishbookshop");
  assert.equal(getStoredAffiliateCode(store, 2_000), "englishbookshop");
  assert.equal(captureAffiliateAttribution({ search: "", pathname: "/start-free/" }, store, 60 * 24 * 60 * 60 * 1_000 + 2_000), null);
});
