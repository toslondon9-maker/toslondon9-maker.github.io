import assert from "node:assert/strict";
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
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
  assert.match(html, /<link rel="stylesheet" href="\/assets\/platform\.css\?v=20260829-master-key">/);
  assert.match(html, /<link rel="preload" href="\/images\/the-secret-logo\.png" as="image">/);
  assert.equal((html.match(/rel="preload"/g) ?? []).length, 1);
  assert.match(html, /<header[\s>]/);
  assert.match(html, /<footer[\s>]/);
  assert.match(html, /<script type="module" src="\/assets\/app\.mjs" defer><\/script>/);
});

test("route renderers cover every canonical route with essential response copy", () => {
  const routes = [...Object.values(siteData.routes), ...siteData.experienceRoutes];
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
      "get-the-book/index.html",
      "ai-mentors/index.html",
      "contact/index.html",
      "faq/index.html",
      "referral/index.html",
      "privacy/index.html",
      "terms/index.html",
      "live-coaching/index.html",
      "start-free/day-1-see-whats-running-your-life/index.html",
      "start-free/day-2-take-back-your-attention/index.html",
      "start-free/day-3-recognise-what-keeps-repeating/index.html",
      "start-free/day-4-give-your-mind-a-direction/index.html",
      "start-free/day-5-become-someone-you-can-rely-on/index.html",
      "start-free/day-6-change-from-the-inside-out/index.html",
      "start-free/day-7-make-it-part-of-how-you-live/index.html",
    ];

    assert.deepEqual(first.files.filter((file) => file.endsWith("index.html")), expected);
    const home = await readFile(path.join(outputRoot, "index.html"), "utf8");
    const coaching = await readFile(path.join(outputRoot, "coaching", "index.html"), "utf8");
    assert.match(home, /Charles F\. Haanel/);
    assert.match(coaching, /£997/);
    assert.doesNotMatch(home, /__VINEXT_RSC_CHUNKS__/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("every public route builds with unique metadata, bilingual copy hooks, and one canonical action", async () => {
  const outputRoot = await mkdtemp(path.join(os.tmpdir(), "unleash-route-shells-"));

  try {
    const result = await buildSite({ outputRoot });
    const pageFiles = result.files.filter((file) => file.endsWith("index.html"));
    assert.equal(pageFiles.length, 21);

    const globalPageFiles = pageFiles.filter((file) => [
      "index.html",
      ...Object.entries(siteData.routes)
        .filter(([routeId, route]) => routeId !== "liveCoaching" && route !== "/")
        .map(([, route]) => `${route.slice(1)}index.html`),
    ].includes(file));
    const pages = await Promise.all(globalPageFiles.map((file) => readFile(path.join(outputRoot, file), "utf8")));
    const titles = pages.map((page) => page.match(/<title[^>]*>(.*?)<\/title>/)?.[1]);
    const descriptions = pages.map((page) => page.match(/<meta name="description" content="([^"]+)"/)?.[1]);
    assert.equal(new Set(titles).size, pages.length);
    assert.equal(new Set(descriptions).size, pages.length);

    for (const [index, page] of pages.entries()) {
      assert.equal((page.match(/<h1[ >]/g) ?? []).length, 1);

      if (globalPageFiles[index] === "get-the-book/index.html") {
        assert.match(page, /<title>Get Your Master Key System Book \| Unleash Your Power<\/title>/);
        assert.match(page, /https:\/\/www\.amazon\.co\.uk\/Master-Key-System-Complete-Chemistry\/dp\/1250874483/);
        assert.match(page, /THE COMPLETE ORIGINAL EDITION/);
        continue;
      }

      assert.match(page, /<title data-i18n="route\.[^"]+\.metaTitle">/);
      assert.match(page, /<meta name="description"[^>]+data-i18n="route\.[^"]+\.metaDescription">/);

      if (globalPageFiles[index] === "start-free/index.html") {
        assert.match(page, /<main class="sevenDayDashboard"/);
        assert.match(page, /<h1 data-i18n="sevenDay\.dashboard\.title">/);
        assert.match(page, /class="routeShell__purpose" data-i18n="sevenDay\.dashboard\.intro">/);
        assert.match(page, /class="button--primary routeShell__action" href="\/start-free\/day-1-see-whats-running-your-life\/" data-i18n="sevenDay\.dashboard\.start">/);
        continue;
      }

      if (["index.html", "master-key-system/index.html", "coaching/index.html", "about-tariq/index.html", "resources/index.html"].includes(globalPageFiles[index])) {
        assert.match(page, /href="\/(?:start-free|master-key-system|coaching|contact|get-the-book)\//);
        continue;
      }

      assert.equal((page.match(/class="routeShell__purpose"/g) ?? []).length, 1);
      assert.equal((page.match(/class="button--primary routeShell__action"/g) ?? []).length, 1);
      assert.match(page, /<h1 data-i18n="route\.[^"]+\.heading">/);
      assert.match(page, /class="routeShell__purpose" data-i18n="route\.[^"]+\.purpose">/);
      assert.match(page, /class="button--primary routeShell__action"[^>]+data-i18n="route\.[^"]+\.action">/);
    }
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("standalone previews include every local dependency referenced by route shells", async () => {
  const outputRoot = await mkdtemp(path.join(os.tmpdir(), "unleash-assets-"));

  try {
    const result = await buildSite({ outputRoot });
    const requiredFiles = [
      "assets/platform.css",
      "assets/seven-day-progress.mjs",
      "assets/site-language.mjs",
      "assets/site-navigation.mjs",
      "content/translations.mjs",
      "images/the-secret-logo.png",
      "images/haanel-tariq-portraits.jpeg",
    ];

    for (const file of requiredFiles) {
      assert.ok(result.files.includes(file), `${file} should be reported in the build manifest`);
      await access(path.join(outputRoot, file));
    }
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("seven-day routes load the progress module exactly once", async () => {
  const outputRoot = await mkdtemp(path.join(os.tmpdir(), "unleash-progress-assets-"));

  try {
    await buildSite({ outputRoot });
    const sevenDayFiles = [
      "start-free/index.html",
      ...siteData.experienceRoutes.map((route) => `${route.slice(1)}index.html`),
    ];

    for (const file of sevenDayFiles) {
      const html = await readFile(path.join(outputRoot, file), "utf8");
      assert.equal((html.match(/src="\/assets\/seven-day-progress\.mjs"/g) ?? []).length, 1, file);
    }
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("the AI mentor action resolves to a generated destination", () => {
  const page = routeRenderers[siteData.routes.aiMentors](siteData);
  const actionHref = page.body.match(/class="button--primary routeShell__action" href="([^"]+)"/)?.[1];

  assert.equal(actionHref, siteData.routes.contact);
  assert.ok(routeRenderers[actionHref]);
});

test("contact actions derive their email address from shared site data", () => {
  const data = {
    ...siteData,
    contact: { ...siteData.contact, email: "shared-data@example.test" },
  };
  const page = routeRenderers[siteData.routes.contact](data);

  assert.match(page.body, /href="mailto:shared-data@example\.test(?:\?[^\"]*)?"/);
  assert.doesNotMatch(page.body, /mailto:toslondon9@gmail\.com/);
});

test("default preview builds remove stale output without cleaning custom destinations", async () => {
  const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const previewRoot = path.join(repositoryRoot, ".build-preview");
  const previewMarker = path.join(previewRoot, ".gitkeep");
  const stalePreviewFile = path.join(previewRoot, "stale", "old-page.html");
  const customRoot = await mkdtemp(path.join(os.tmpdir(), "unleash-custom-output-"));
  const customSentinel = path.join(customRoot, "keep-me.txt");

  try {
    await mkdir(path.dirname(stalePreviewFile), { recursive: true });
    await writeFile(previewMarker, "", "utf8");
    await writeFile(stalePreviewFile, "obsolete", "utf8");
    await writeFile(customSentinel, "caller-owned", "utf8");

    await buildSite();
    await assert.rejects(access(stalePreviewFile), { code: "ENOENT" });
    await access(previewMarker);

    await buildSite({ outputRoot: customRoot });
    assert.equal(await readFile(customSentinel, "utf8"), "caller-owned");
  } finally {
    await rm(customRoot, { recursive: true, force: true });
  }
});
