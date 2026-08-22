import assert from "node:assert/strict";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { renderHome } from "../src/pages/home.mjs";

const approvedSections = [
  "hero",
  "lineage",
  "why",
  "journey",
  "start-free",
  "master-key",
  "origins",
  "coaching",
  "mentors",
  "next-step",
];

test("homepage follows the approved concise journey", () => {
  const html = renderHome({ language: "en" });
  const sections = [...html.matchAll(/<section[^>]+data-home-section="([^"]+)"/g)].map((match) => match[1]);

  assert.deepEqual(sections, approvedSections);
  assert.equal((html.match(/haanel-tariq-portraits\.jpeg/g) ?? []).length, 2);
  assert.equal((html.match(/<img[^>]+haanel-tariq-portraits\.jpeg/g) ?? []).length, 1);
  assert.match(html, /<h1[^>]*>Master Your Mind\. Change Your Direction\.<\/h1>/);
  assert.match(html, /Charles F\. Haanel(?:&#39;|')s Master Key System/);
  assert.match(html, /Start Free for 7 Days/);
  assert.match(html, /Discover the Journey/);
  assert.match(html, /Free 7-Day Experience • No Previous Experience Required/);
});

test("homepage explains the independent three-person learning lineage near the top", () => {
  const html = renderHome({ language: "en" });
  const lineage = html.match(/<section[^>]+data-home-section="lineage"[\s\S]*?<\/section>/)?.[0] ?? "";

  assert.match(lineage, /Charles F\. Haanel/);
  assert.match(lineage, /The System/);
  assert.match(lineage, /Helmar Rudolph/);
  assert.match(lineage, /Interpretation &amp; Application/);
  assert.match(lineage, /Tariq Saddique/);
  assert.match(lineage, /Guidance &amp; Coaching/);
  assert.match(lineage, /independent coaching/i);
  assert.match(lineage, /not affiliated with or endorsed by/i);
});

test("homepage presents a simple three-step journey", () => {
  const html = renderHome({ language: "en" });
  const journey = html.match(/<section[^>]+data-home-section="journey"[\s\S]*?<\/section>/)?.[0] ?? "";
  const steps = [...journey.matchAll(/<li class="homeJourney__step"/g)];

  assert.equal(steps.length, 3);
  assert.match(journey, />Experience<\/h3>/);
  assert.match(journey, />Learn &amp; Apply<\/h3>/);
  assert.match(journey, />Go Deeper<\/h3>/);
});

test("homepage education pathway uses the approved four progressive phases", () => {
  const html = renderHome({ language: "en" });
  const pathway = html.match(/<section[^>]+data-home-section="master-key"[\s\S]*?<\/section>/)?.[0] ?? "";
  const visibleText = pathway.replace(/<[^>]+>/g, "");

  for (const expected of [
    "Weeks 1–4", "Foundation",
    "Weeks 5–11", "Awareness &amp; Control",
    "Weeks 12–18", "Application",
    "Weeks 19–24", "Integration &amp; Mastery",
  ]) assert.match(visibleText, new RegExp(expected));
});

test("homepage presents the approved origins sequence once and in order", () => {
  const html = renderHome({ language: "en" });
  const origins = html.match(/<section[^>]+data-home-section="origins"[\s\S]*?<\/section>/)?.[0] ?? "";
  const cream = origins.indexOf("homeOrigins__prelude");
  const portraits = origins.indexOf("homeOrigins__portrait");
  const navy = origins.indexOf("homeOrigins__statement");

  assert.ok(cream >= 0 && cream < portraits && portraits < navy);
  assert.equal((html.match(/Where timeless wisdom meets modern transformation\./g) ?? []).length, 1);
  assert.equal((html.match(/From inner mastery to purposeful action\./g) ?? []).length, 1);
  assert.equal((html.match(/independent coaching experience inspired by the Master Key System/gi) ?? []).length, 1);
  assert.match(origins, /Charles F\. Haanel and Tariq Saddique — Master Key System inspired coaching journey/);
  assert.match(html, /not affiliated with or endorsed by/i);
});

test("homepage origins statement uses the premium key and gold-emphasis treatment", () => {
  const html = renderHome({ language: "en" });
  const origins = html.match(/<section[^>]+data-home-section="origins"[\s\S]*?<\/section>/)?.[0] ?? "";

  assert.match(origins, /class="homeOrigins__ornament"[^>]+aria-hidden="true"/);
  assert.match(origins, /class="homeOrigins__key"/);
  assert.match(origins, /<h2 class="homeOrigins__statementTitle"[^>]+data-i18n-aria-label="home\.origins\.statementTitle"/);
  assert.match(origins, /class="homeOrigins__statementLead"[^>]+data-i18n="home\.origins\.statementLead"/);
  assert.match(origins, /class="homeOrigins__statementEmphasis"[^>]+data-i18n="home\.origins\.statementEmphasis"/);
  assert.match(origins, /class="homeOrigins__statementDivider"[^>]+aria-hidden="true"/);
});

test("homepage Spanish render is complete, natural and conversion focused", () => {
  const html = renderHome({ language: "es" });

  assert.match(html, /Domina tu mente\. Cambia tu rumbo\./);
  assert.match(html, /Desarrolla claridad, enfoque y una acción con propósito/);
  assert.match(html, /Empieza gratis durante 7 días/);
  assert.match(html, /Descubre el recorrido/);
  assert.match(html, /Una experiencia de coaching independiente inspirada en el Master Key System\./);
  assert.doesNotMatch(html, /Start Free for 7 Days|Explore the 24-Week Journey|Book a Session/);
});

test("homepage CTA destinations are generated routes", () => {
  const html = renderHome({ language: "en" });
  const routeSet = new Set(Object.values(siteData.routes));
  const ctaRoutes = [...html.matchAll(/<a class="button--(?:primary|secondary|text)[^"]*" href="([^"]+)"/g)]
    .map((match) => match[1]);

  assert.ok(ctaRoutes.length >= 8);
  for (const route of ctaRoutes) assert.ok(routeSet.has(route), `missing generated destination: ${route}`);
});

test("homepage keeps detailed pricing off the teaser and never restores the payment plan", () => {
  const html = renderHome({ language: "en" });

  assert.doesNotMatch(html, /£97|£197|£397|£497|£997|£1,188|£1,788|6\s*[×x]\s*£169|£1,014/);
});
