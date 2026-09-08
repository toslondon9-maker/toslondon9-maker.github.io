import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { renderPage } from "../src/page-shell.mjs";
import { routeRenderers } from "../src/routes.mjs";

const baseUrl = "https://unleashyourpowerwithtariq.com";
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
    const socialImage = page.socialImage ? `${baseUrl}${page.socialImage}` : `${baseUrl}/images/haanel-tariq-portraits.jpeg`;
    assert.match(html, new RegExp(`<meta property="og:image" content="${socialImage.replaceAll("/", "\\/")}">`));
    assert.match(html, /<meta property="og:image:alt" content="[^"]+">/);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image">/);
    assert.match(html, /<meta name="twitter:title" content="[^"]+">/);
    assert.match(html, /<meta name="twitter:description" content="[^"]+">/);
    assert.match(html, new RegExp(`<meta name="twitter:image" content="${socialImage.replaceAll("/", "\\/")}">`));
    assert.match(html, /<meta name="twitter:image:alt" content="[^"]+">/);
  }
});

test("public generated HTML uses only the custom-domain SEO base", () => {
  const oldDomain = "toslondon9-maker.github.io";
  const oldDomainPattern = new RegExp(oldDomain.replaceAll(".", "\\."));
  for (const route of publicRoutes) {
    const relativeFile = route === "/" ? "index.html" : `${route.slice(1)}index.html`;
    const publicHtml = readFileSync(new URL(`../${relativeFile}`, import.meta.url), "utf8");
    assert.doesNotMatch(publicHtml, oldDomainPattern, relativeFile);
  }
  const notFound = readFileSync(new URL("../404.html", import.meta.url), "utf8");
  assert.doesNotMatch(notFound, oldDomainPattern, "404.html");
});

test("Start Free generated SEO metadata uses the custom-domain route", () => {
  const html = readFileSync(new URL("../start-free/index.html", import.meta.url), "utf8");
  assert.match(html, /<link rel="canonical" href="https:\/\/unleashyourpowerwithtariq\.com\/start-free\/">/);
  assert.match(html, /<meta property="og:url" content="https:\/\/unleashyourpowerwithtariq\.com\/start-free\/">/);
  assert.match(html, /<script type="application\/ld\+json">[\s\S]*https:\/\/unleashyourpowerwithtariq\.com\/start-free\//);
  assert.doesNotMatch(html, /toslondon9-maker\.github\.io/);
});


test("key conversion pages use relevant social preview artwork", () => {
  const expected = new Map([
    [siteData.routes.masterKeySystem, "/images/master-key-visuals/master-key-24-week-hero.png"],
    [siteData.routes.startFree, "/images/free-7-day-taster.jpeg"],
    [siteData.routes.coaching, "/images/unleash-your-power-programme.jpeg"],
    [siteData.routes.aboutTariq, "/images/tariq-happiness-harmony.png"],
  ]);

  for (const [route, image] of expected) {
    const page = routeRenderers[route](siteData);
    assert.equal(page.socialImage, image, route);
    assert.ok(page.socialImageAlt?.length > 10, route);
  }
});

test("private Session Hub remains noindex and has no public sharing metadata", () => {
  const html = renderPage(routeRenderers[siteData.routes.liveCoaching](siteData));
  assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
  assert.doesNotMatch(html, /rel="canonical"|property="og:|name="twitter:/);
});
