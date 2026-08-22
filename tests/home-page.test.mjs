import assert from "node:assert/strict";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { renderHome } from "../src/pages/home.mjs";

const approvedSections = [
  "hero",
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
  assert.match(html, /<h1[^>]*>Unleash Your Power<\/h1>/);
  assert.match(html, /Start Free for 7 Days/);
  assert.match(html, /Explore the 24-Week Journey/);
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
  assert.doesNotMatch(html, /endors(?:e|ed|ement)|affiliat(?:e|ed|ion)/i);
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

  assert.match(html, /Libera tu poder/);
  assert.match(html, /Cambia tu forma de pensar\. Cambia tu forma de actuar\. Cambia los resultados que creas\./);
  assert.match(html, /Empieza gratis durante 7 días/);
  assert.match(html, /Descubre el recorrido de 24 semanas/);
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

  assert.match(html, /£997/);
  assert.doesNotMatch(html, /£97|£197|£397|£497|£1,188|£1,788|6\s*[×x]\s*£169|£1,014/);
});
