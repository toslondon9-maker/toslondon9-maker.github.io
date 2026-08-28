import assert from "node:assert/strict";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { renderPage } from "../src/page-shell.mjs";
import { routeRenderers } from "../src/routes.mjs";

const baseUrl = "https://toslondon9-maker.github.io";
const publicRoutes = [...Object.values(siteData.routes).filter((route) => route !== siteData.routes.liveCoaching), ...siteData.experienceRoutes];

test("every public page has canonical, Open Graph and Twitter metadata for its live route", () => {
  for (const route of publicRoutes) {
    const page = routeRenderers[route](siteData);
    const html = renderPage(page);
    const url = `${baseUrl}${route}`;

    assert.equal((html.match(/<link rel="canonical"/g) ?? []).length, 1, route);
    assert.match(html, new RegExp(`<link rel="canonical" href="${url}">`), route);
    assert.match(html, new RegExp(`<meta property="og:url" content="${url}">`), route);
    assert.match(html, /<meta property="og:type" content="website">/);
    assert.match(html, /<meta property="og:site_name" content="Unleash Your Power">/);
    assert.match(html, /<meta property="og:title" content="[^"]+">/);
    assert.match(html, /<meta property="og:description" content="[^"]+">/);
    assert.match(html, /<meta property="og:image" content="https:\/\/toslondon9-maker\.github\.io\/images\/haanel-tariq-portraits\.jpeg">/);
    assert.match(html, /<meta property="og:image:alt" content="[^"]+">/);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image">/);
    assert.match(html, /<meta name="twitter:title" content="[^"]+">/);
    assert.match(html, /<meta name="twitter:description" content="[^"]+">/);
    assert.match(html, /<meta name="twitter:image" content="https:\/\/toslondon9-maker\.github\.io\/images\/haanel-tariq-portraits\.jpeg">/);
    assert.match(html, /<meta name="twitter:image:alt" content="[^"]+">/);
  }
});

test("private Session Hub remains noindex and has no public sharing metadata", () => {
  const html = renderPage(routeRenderers[siteData.routes.liveCoaching](siteData));
  assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
  assert.doesNotMatch(html, /rel="canonical"|property="og:|name="twitter:/);
});
