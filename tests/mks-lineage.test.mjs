import assert from "node:assert/strict";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { routeRenderers } from "../src/routes.mjs";

test("MKS Lineage page presents the approved independent study positioning", async () => {
  const page = routeRenderers[siteData.routes.mksLineage](siteData);
  assert.equal(page.route, "/mks-lineage/");
  assert.match(page.title, /MKS Lineage: A Timeless Tradition of Study/);
  assert.match(page.body, /A TIMELESS LINEAGE OF STUDY/);
  assert.match(page.body, /From Original Wisdom to Practical Application/);
  assert.match(page.body, /Charles F\. Haanel — The Original Author/);
  assert.match(page.body, /A Tradition of Study, Reflection and Practice/);
  assert.match(page.body, /Helmar Rudolph — A Modern Student and Teacher of the System/);
  assert.match(page.body, /Tariq Saddique — Your Guide Through the 24-Week Journey/);
  assert.match(page.body, /Study It\. Practise It\. Live It\./);
  assert.match(page.body, /href="\/master-key-system\/"/);
  assert.match(page.body, /href="\/coaching\/"/);
  assert.match(page.body, /href="\/resources\/"/);
  assert.doesNotMatch(page.body, /endorses Unleash Your Power|official succession|exclusive lineage/i);
  assert.doesNotMatch(page.body, /guaranteed (wealth|healing|results|transformation)/i);
});

test("Master Key and Resources pages link to the lineage page", async () => {
  const master = routeRenderers[siteData.routes.masterKeySystem](siteData).body;
  const resources = routeRenderers[siteData.routes.resources](siteData).body;
  assert.match(master, /href="\/mks-lineage\/"/);
  assert.match(resources, /href="\/mks-lineage\/"/);
});
