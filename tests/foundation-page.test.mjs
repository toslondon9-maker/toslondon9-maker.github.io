import assert from "node:assert/strict";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { routeRenderers } from "../src/routes.mjs";

test("Foundation route renders the bilingual £97 PayPal offer", () => {
  const page = routeRenderers[siteData.routes.foundation](siteData);
  assert.equal(page.route, "/foundation/");
  assert.match(page.body, /Foundation — 4-Week Master Key Coaching/);
  assert.match(page.body, /Weeks 1–4/);
  assert.match(page.body, /£97/);
  assert.match(page.body, /https:\/\/www\.paypal\.com\/ncp\/payment\/V5QYXZZS6KQE2/);
  assert.match(page.body, /href="\/start-free\/"/);
  const spanish = routeRenderers[siteData.routes.foundation](siteData, "es");
  assert.match(spanish.body, /data-i18n="foundation\.heading"/);
  assert.match(spanish.body, /data-i18n="foundation\.cta"/);
});

