import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { renderPage } from "../src/page-shell.mjs";
import { routeRenderers } from "../src/routes.mjs";
import { siteData } from "../content/site-data.mjs";
import { buildSite } from "../tools/build-site.mjs";

test("renderPage emits semantic standalone HTML", () => {
  const html = renderPage({
    route: "/start-free/",
    language: "en",
    title: "Start Free",
    description: "Begin the free experience.",
    body: "<main><h1>Start Free</h1></main>",
    scripts: [],
  });

  assert.match(html, /^<!doctype html>/i);
  assert.match(html, /<html lang="en">/);
  assert.equal((html.match(/<h1/g) ?? []).length, 1);
  assert.doesNotMatch(html, /__VINEXT_RSC_CHUNKS__/);
});

test("renderPage escapes metadata, uses the shared shell, and defers module scripts", () => {
  const html = renderPage({
    route: "/",
    language: "en",
    title: 'A "title" & <tag>',
    description: 'A "description" & <tag>',
    body: "<main><h1>One heading</h1></main>",
    scripts: ["/assets/app.mjs"],
  });

  assert.match(html, /<title>A &quot;title&quot; &amp; &lt;tag&gt;<\/title>/);
  assert.match(html, /<meta name="description" content="A &quot;description&quot; &amp; &lt;tag&gt;">/);
  assert.match(html, /<link rel="stylesheet" href="\/assets\/platform\.css">/);
  assert.match(html, /<link rel="preload" href="\/images\/the-secret-logo\.png" as="image">/);
  assert.equal((html.match(/rel="preload"/g) ?? []).length, 1);
  assert.match(html, /<header[\s>]/);
  assert.match(html, /<footer[\s>]/);
  assert.match(html, /<script type="module" src="\/assets\/app\.mjs" defer><\/script>/);
});

test("route renderers cover every canonical route with essential response copy", () => {
  const routes = Object.values(siteData.routes);
  assert.deepEqual(Object.keys(routeRenderers).sort(), [...routes].sort());

  for (const route of routes) {
    const page = routeRenderers[route](siteData);
    assert.equal(page.route, route);
    assert.match(page.body, /<main[\s>]/);
    assert.match(page.body, /<h1[\s>]/);
    assert.ok(page.title.length > 0);
    assert.ok(page.description.length > 0);
  }
});

test("buildSite writes the canonical route tree deterministically", async () => {
  const outputRoot = await mkdtemp(path.join(os.tmpdir(), "unleash-build-"));

  try {
    const first = await buildSite({ outputRoot, check: true });
    const expected = [
      "index.html",
      "master-key-system/index.html",
      "start-free/index.html",
      "coaching/index.html",
      "about-tariq/index.html",
      "resources/index.html",
      "ai-mentors/index.html",
      "contact/index.html",
      "faq/index.html",
      "referral/index.html",
      "privacy/index.html",
      "terms/index.html",
      "live-coaching/index.html",
    ];

    assert.deepEqual(first.files, expected);
    const home = await readFile(path.join(outputRoot, "index.html"), "utf8");
    const coaching = await readFile(path.join(outputRoot, "coaching", "index.html"), "utf8");
    assert.match(home, /Charles F\. Haanel/);
    assert.match(coaching, /£997/);
    assert.doesNotMatch(home, /__VINEXT_RSC_CHUNKS__/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});
