import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { access, mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { buildSite } from "../tools/build-site.mjs";

const liveDomain = "https://toslondon9-maker.github.io";
const indexableRoutes = Object.freeze([
  ...Object.values(siteData.routes).filter((route) => route !== siteData.routes.liveCoaching),
  ...siteData.experienceRoutes,
]);

function sitemapLocations(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

test("sitemap lists every indexable generated route exactly once and excludes Session Hub", () => {
  const sitemap = readFileSync(new URL("../sitemap.xml", import.meta.url), "utf8");
  const locations = sitemapLocations(sitemap);
  const expected = indexableRoutes.map((route) => `${liveDomain}${route}`);

  assert.deepEqual(locations, expected);
  assert.equal(new Set(locations).size, locations.length);
  assert.ok(locations.every((location) => location.startsWith(`${liveDomain}/`)));
  assert.ok(locations.every((location) => location.endsWith("/") || location === liveDomain));
  assert.ok(!locations.includes(`${liveDomain}${siteData.routes.liveCoaching}`));
});

test("robots advertises the canonical sitemap and keeps Session Hub out of search", () => {
  const robots = readFileSync(new URL("../robots.txt", import.meta.url), "utf8");

  assert.match(robots, /^Disallow: \/live-coaching\/$/m);
  assert.match(robots, new RegExp(`^Sitemap: ${liveDomain}/sitemap\\.xml$`, "m"));
});

test("the static build publishes each sitemap URL as one canonical public page", async () => {
  const outputRoot = await mkdtemp(path.join(os.tmpdir(), "unleash-sitemap-"));

  try {
    await buildSite({ outputRoot });
    const sitemap = await readFile(path.join(outputRoot, "sitemap.xml"), "utf8");
    const locations = sitemapLocations(sitemap);

    assert.equal(locations.length, indexableRoutes.length);
    for (const location of locations) {
      const route = new URL(location).pathname;
      const outputFile = route === "/" ? "index.html" : `${route.slice(1)}index.html`;
      await access(path.join(outputRoot, outputFile));
    }

    await access(path.join(outputRoot, "robots.txt"));
    assert.ok(!locations.some((location) => location.includes("/live-coaching/")));
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});
