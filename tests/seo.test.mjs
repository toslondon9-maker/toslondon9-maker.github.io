import test from "node:test";
import assert from "node:assert/strict";
import { siteData } from "../content/site-data.mjs";
import { routeRenderers } from "../src/routes.mjs";
import { renderPage } from "../src/page-shell.mjs";
import { renderSitemap } from "../src/sitemap.mjs";

function page(route) {
  return renderPage(routeRenderers[route](siteData));
}

test("SEO route contract includes the online course route", () => {
  assert.equal(siteData.routes.masterKeySystemOnlineCourse, "/master-key-system-online-course/");
  assert.equal(typeof routeRenderers[siteData.routes.masterKeySystemOnlineCourse], "function");
});

test("core public pages expose canonical metadata and requested search phrasing", () => {
  const expectations = [
    [siteData.routes.home, "Master Key System Coaching with Tariq"],
    [siteData.routes.coaching, "Master Key System Coaching", "24-Week Course"],
    [siteData.routes.masterKeySystem, "Master Key System 24 Week Course"],
    [siteData.routes.mksLineage, "Charles Haanel Master Key System"],
    [siteData.routes.resources, "Master Key System Exercises", "Study Guide"],
    [siteData.routes.faq, "Master Key System Course FAQ"],
    [siteData.routes.masterKeySystemOnlineCourse, "Master Key System online course"],
  ];
  for (const [route, ...phrases] of expectations) {
    const html = page(route);
    assert.match(html, new RegExp(`<link rel="canonical" href="https://toslondon9-maker\\.github\\.io${route.replaceAll("/", "\\/")}"`));
    assert.match(html, /<title[^>]*>[^<]+<\/title>/);
    assert.match(html, /<meta name="description" content="[^"]+"/);
    for (const phrase of phrases) assert.match(html.toLowerCase(), new RegExp(phrase.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("sitewide and page-specific JSON-LD types match visible public pages", () => {
  const home = page(siteData.routes.home);
  assert.match(home, /application\/ld\+json/);
  assert.match(home, /"@type":"Organization"/);
  assert.match(home, /"@type":"WebSite"/);
  for (const [route, type] of [
    [siteData.routes.aboutTariq, "Person"],
    [siteData.routes.masterKeySystem, "Course"],
    [siteData.routes.coaching, "Course"],
    [siteData.routes.faq, "FAQPage"],
    [siteData.routes.resources, "BreadcrumbList"],
  ]) {
    assert.match(page(route), new RegExp(`"@type":"${type}"`));
  }
});

test("online course page links the requested next steps", () => {
  const html = page(siteData.routes.masterKeySystemOnlineCourse);
  for (const route of [siteData.routes.startFree, siteData.routes.coaching, siteData.routes.resources, siteData.routes.faq]) {
    assert.match(html, new RegExp(`href="${route.replaceAll("/", "\\/" )}"`));
  }
  assert.match(html, /Master Key System online course/i);
  assert.match(html, /24-week/i);
  assert.match(html, /practical exercises/i);
});

test("sitemap includes the online course route and preserves private-route exclusion", () => {
  const sitemap = renderSitemap(siteData);
  assert.match(sitemap, /https:\/\/toslondon9-maker\.github\.io\/master-key-system-online-course\//);
  assert.doesNotMatch(sitemap, /\/live-coaching\//);
});
