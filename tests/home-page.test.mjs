import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { t } from "../content/translations.mjs";
import { homePage, renderHome } from "../src/pages/home.mjs";

const approvedSections = ["hero", "lineage", "start-free", "master-key", "testimonials", "coaching", "next-step"];

test("homepage follows the approved concise customer journey", () => {
  const html = renderHome({ language: "en" });
  const sections = [...html.matchAll(/<section[^>]+data-home-section="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(sections, approvedSections);
  assert.equal((html.match(/<img[^>]+haanel-tariq-portraits\.jpeg/g) ?? []).length, 1);
  assert.match(html, /<h1[^>]*>Master the world within\.<\/h1>/);
  assert.match(html, /CHARLES F\. HAANEL(?:&#39;|')S MASTER KEY SYSTEM/);
  assert.match(html, /START FREE FOR 7 DAYS/);
  assert.match(html, /EXPLORE THE MASTER KEY SYSTEM/);
  assert.match(html, /Free 7-Day Experience • No Previous Experience Required/);
});

test("homepage explains the independent three-person learning lineage near the top", () => {
  const html = renderHome({ language: "en" });
  const lineage = html.match(/<section[^>]+data-home-section="lineage"[\s\S]*?<\/section>/)?.[0] ?? "";
  for (const text of ["Charles F. Haanel", "The System", "Helmar Rudolph", "Modern Study &amp; Application", "Tariq Saddique", "Your Guide &amp; Coach"]) assert.match(lineage, new RegExp(text));
  assert.match(lineage, /independent coaching/i);
  assert.match(lineage, /not affiliated with or endorsed by/i);
});

test("homepage presents the complete seven-day taster", () => {
  const html = renderHome({ language: "en" });
  const taster = html.match(/<section[^>]+data-home-section="start-free"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.equal((taster.match(/data-i18n="home\.taster\.day\d"/g) ?? []).length, 7);
  assert.match(taster, /See What’s Running Your Life/);
  assert.match(taster, /Choose What Happens Next/);
  assert.match(taster, /href="\/start-free\/"[^>]*>START MY FREE 7 DAYS<\/a>/);
  assert.match(taster, /No pressure\. No purchase required\./);
  assert.match(taster, /class="[^"]*homeTaster__layout[^"]*"/);
});

test("homepage presents the approved premium conversion upgrades", () => {
  const html = renderHome({ language: "en" });

  assert.match(html, /class="homeHero__proof"/);
  assert.match(html, /class="homeHero__caption"/);
  assert.match(html, /class="homeCoaching__visual"[^>]*><div class="homeCoaching__visualInner">/);
  assert.match(html, /THE 24-WEEK JOURNEY/);
  assert.match(html, /THE MASTER KEY SYSTEM/);
  const coaching = html.match(/<section[^>]+data-home-section="coaching"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.equal((coaching.match(/<article>/g) ?? []).length, 4);
  assert.doesNotMatch(html, /unleash-your-power-programme\.jpeg/);
  assert.match(html, /class="homeNext__actionPanel"/);
});

test("homepage keeps its premium SEO title when language enhancements run", () => {
  assert.equal(homePage(siteData, "en").title, "Unleash Your Power | Master Key System Coaching with Tariq");
  assert.equal(t("meta.home.title", "en"), "Unleash Your Power | Master Key System Coaching with Tariq");
});

test("homepage loads with the concise four-phase journey and safe responsive actions", async () => {
  const html = renderHome({ language: "en" });
  const css = await readFile("assets/platform.css", "utf8");
  const pathway = html.match(/<section[^>]+data-home-section="master-key"[\s\S]*?<\/section>/)?.[0] ?? "";
  const visibleText = pathway.replace(/<[^>]+>/g, "");
  assert.match(html, /^<main class="home">/);
  assert.match(html, /href="\/start-free\/"[^>]*>START FREE FOR 7 DAYS<\/a>/);
  for (const expected of ["Weeks 1–4", "Foundation", "Weeks 5–11", "Awareness &amp; Control", "Weeks 12–18", "Application", "Weeks 19–24", "Integration &amp; Mastery"]) assert.match(visibleText, new RegExp(expected));
  assert.equal((pathway.match(/class="homeMasterKey__phaseDescription"/g) ?? []).length, 4);
  assert.match(pathway, /href="\/master-key-system\/"[^>]*>EXPLORE ALL 24 WEEKS<\/a>/);
  assert.doesNotMatch(pathway, /questions?\s*(?:&amp;|and)\s*answers?|mastery prompt|guided exercise/i);
  assert.match(css, /\.homeMasterKey__phases li\s*\{[^}]*min-width:\s*0/s);
  assert.match(css, /@media[^}]*max-width:\s*480px[\s\S]*?\.homeMasterKey__phases[^{]*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
});

test("homepage presents the approved lineage image and people in order", () => {
  const html = renderHome({ language: "en" });
  const lineage = html.match(/<section[^>]+data-home-section="lineage"[\s\S]*?<\/section>/)?.[0] ?? "";
  const names = [...lineage.matchAll(/<h3[^>]*>([^<]+)<\/h3>/g)].map((match) => match[1]);
  assert.deepEqual(names, ["Charles F. Haanel", "Helmar Rudolph", "Tariq Saddique"]);
  assert.match(lineage, /Charles F\. Haanel and Tariq Saddique — Master Key System inspired coaching journey/);
  assert.equal((html.match(/haanel-tariq-portraits\.jpeg/g) ?? []).length, 1);
});

test("homepage lineage section retains the premium portrait, cards and independence disclosure", () => {
  const html = renderHome({ language: "en" });
  const lineage = html.match(/<section[^>]+data-home-section="lineage"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(lineage, /class="homeLineage__portrait"/);
  assert.match(lineage, /class="homeLineage__grid"/);
  assert.equal((lineage.match(/class="homeLineage__card"/g) ?? []).length, 3);
  assert.match(lineage, /class="homeLineage__disclaimer"/);
});

test("homepage Spanish render is complete, natural and conversion focused", () => {
  const html = renderHome({ language: "es" });
  assert.match(html, /Domina tu mente\. Cambia tu rumbo\./);
  assert.match(html, /Desarrolla claridad, enfoque y una acción con propósito/);
  assert.match(html, /Empieza gratis durante 7 días/);
  assert.match(html, /Descubre el recorrido/);
  assert.match(html, /Este programa de coaching independiente está inspirado en el Master Key System/);
  assert.doesNotMatch(html, /START FREE FOR 7 DAYS|EXPLORE ALL 24 WEEKS|Book a Session/);
});

test("homepage CTA destinations are generated routes", () => {
  const html = renderHome({ language: "en" });
  const routeSet = new Set(Object.values(siteData.routes));
  const ctaRoutes = [...html.matchAll(/<a class="button--(?:primary|secondary|text)[^"]*" href="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(ctaRoutes.length >= 7);
  for (const route of ctaRoutes) assert.ok(routeSet.has(route), `missing generated destination: ${route}`);
});

test("homepage keeps detailed pricing off the teaser and never restores the payment plan", () => {
  assert.doesNotMatch(renderHome({ language: "en" }), /£97|£197|£397|£497|£997|£1,188|£1,788|6\s*[×x]\s*£169|£1,014/);
});
