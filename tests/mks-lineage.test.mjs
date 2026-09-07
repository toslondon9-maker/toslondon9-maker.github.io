import assert from "node:assert/strict";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { mksLineagePage } from "../src/pages/mks-lineage.mjs";
import { routeRenderers } from "../src/routes.mjs";

test("MKS Lineage page presents the approved independent study positioning", async () => {
  const page = routeRenderers[siteData.routes.mksLineage](siteData);
  assert.equal(page.route, "/mks-lineage/");
  assert.match(page.title, /Charles Haanel Master Key System/);
  assert.match(page.body, /A TIMELESS LINEAGE OF STUDY/);
  assert.match(page.body, /From Original Wisdom to Practical Application/);
  assert.match(page.body, /Charles F\. Haanel — The Original Author/);
  assert.match(page.body, /A Tradition of Study, Reflection and Practice/);
  assert.match(page.body, /Helmar Rudolph — A Modern Student and Teacher of the System/);
  assert.match(page.body, /Tariq Saddique — Your Guide Through the 24-Week Journey/);
  assert.match(page.body, /src="\/images\/lineage\/tariq-lineage-guide\.jpg" alt="Tariq Saddique guiding students through the 24-week Master Key journey"/);
  assert.doesNotMatch(page.body, /src="\/images\/lineage\/tariq-saddique\.png"/);
  assert.match(page.body, /Study It\. Practise It\. Live It\./);
  assert.match(page.body, /href="\/master-key-system\/"/);
  assert.match(page.body, /href="\/coaching\/"/);
  assert.match(page.body, /href="\/resources\/"/);
  assert.doesNotMatch(page.body, /endorses Unleash Your Power|official succession|exclusive lineage/i);
  assert.doesNotMatch(page.body, /guaranteed (wealth|healing|results|transformation)/i);
});

test("MKS Lineage adds Haanel's five selected works and Helmar's secure external resource", () => {
  const page = routeRenderers[siteData.routes.mksLineage](siteData, "en");
  const books = [
    "The Master Key System",
    "The New Psychology",
    "Mental Chemistry",
    "A Book About You",
    "The Amazing Secrets of the Yogi",
  ];

  assert.match(page.body, /Selected works by Charles F\. Haanel/);
  assert.match(page.body, /These are the five known books attributed to Charles F\. Haanel\./);
  for (const title of books) assert.match(page.body, new RegExp(`>${title}<`));
  assert.match(
    page.body,
    /<a[^>]+href="https:\/\/en\.mrmasterkey\.com\/"[^>]+target="_blank"[^>]+rel="noopener noreferrer"[^>]*>Visit Mr Master Key →<\/a>/,
  );
  assert.match(page.body, /Continue exploring Helmar Rudolph’s work/);

  const charlesIndex = page.body.indexOf("Charles F. Haanel — The Original Author");
  const helmarIndex = page.body.indexOf("Helmar Rudolph — A Modern Student and Teacher of the System");
  const tariqIndex = page.body.indexOf("Tariq Saddique — Your Guide Through the 24-Week Journey");
  assert.ok(charlesIndex < helmarIndex && helmarIndex < tariqIndex);
  assert.match(page.body, /does not imply that he endorses, partners with or is formally affiliated with Unleash Your Power/);
});

test("MKS Lineage renders the new supporting content naturally in Spanish", () => {
  const page = mksLineagePage(siteData, "es");

  assert.match(page.body, /Obras seleccionadas de Charles F\. Haanel/);
  assert.match(page.body, /Estos son los cinco libros conocidos atribuidos a Charles F\. Haanel\./);
  assert.match(page.body, /Continúa explorando la obra de Helmar Rudolph/);
  assert.match(page.body, /Visitar Mr Master Key →/);
  assert.match(page.body, />The Amazing Secrets of the Yogi</);
  assert.match(page.body, /data-i18n="route\.mksLineage\.works\.heading"/);
  assert.match(page.body, /data-i18n="route\.mksLineage\.helmarResource\.cta"/);
});

test("Master Key and Resources pages link to the lineage page", async () => {
  const master = routeRenderers[siteData.routes.masterKeySystem](siteData).body;
  const resources = routeRenderers[siteData.routes.resources](siteData).body;
  assert.match(master, /href="\/mks-lineage\/"/);
  assert.match(resources, /href="\/mks-lineage\/"/);
});
