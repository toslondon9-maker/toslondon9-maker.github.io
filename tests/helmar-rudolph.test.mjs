import assert from "node:assert/strict";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { routeRenderers } from "../src/routes.mjs";

const helmarRoutes = [
  ["overview", "helmarRudolph"],
  ["approach", "helmarRudolphMasterKeySystem"],
  ["videos", "helmarRudolphStudyVideos"],
];

test("Helmar Rudolph has the supplied canonical route family", () => {
  assert.deepEqual(
    helmarRoutes.map(([, key]) => siteData.routes[key]),
    [
      "/helmar-rudolph/",
      "/helmar-rudolph/master-key-system/",
      "/helmar-rudolph/study-videos/",
    ],
  );
  for (const [, key] of helmarRoutes) assert.equal(typeof routeRenderers[siteData.routes[key]], "function");
});

test("Helmar overview links the supplied study pages and keeps the independent disclaimer", () => {
  const html = routeRenderers[siteData.routes.helmarRudolph](siteData).body;
  assert.match(html, /Who Is Helmar Rudolph\?/);
  assert.match(html, /HIS APPROACH TO THE MASTER KEY SYSTEM/i);
  assert.match(html, /HELMAR RUDOLPH STUDY VIDEOS/i);
  assert.match(html, /href="\/helmar-rudolph\/master-key-system\/"/);
  assert.match(html, /href="\/helmar-rudolph\/study-videos\/"/);
  assert.match(html, /href="\/master-key-system\/"/);
  assert.match(html, /not affiliated with or endorsed by Charles F\. Haanel, his estate or Helmar Rudolph/i);
  assert.doesNotMatch(html, /official|endorsed by Helmar Rudolph|formal partner|exclusive representative/i);
});

test("Helmar subpages are available in English and Spanish", () => {
  for (const [, key] of helmarRoutes) {
    const route = siteData.routes[key];
    for (const language of ["en", "es"]) {
      const page = routeRenderers[route](siteData, language);
      assert.equal(page.route, route);
      assert.match(page.body, /<main[^>]+helmarRudolphPage/);
      assert.match(page.body, /not affiliated|no está afiliad/i);
      assert.match(page.body, /data-i18n="route\.helmarRudolph\./);
    }
  }
});

test("the homepage Helmar card points to the canonical overview", () => {
  const html = routeRenderers[siteData.routes.home](siteData).body;
  assert.match(html, /data-i18n="home\.lineage\.helmar\.name"/);
  assert.match(html, /<details class="homeLineage__links"><summary data-i18n="home\.lineage\.helmar\.linksTrigger"[^>]*>WHO IS HELMAR RUDOLPH\?/i);
  assert.match(html, /href="https:\/\/en\.mrmasterkey\.com\/helmar-rudolph\/"[^>]*target="_blank"[^>]*rel="noopener noreferrer"[^>]*data-i18n="home\.lineage\.helmar\.linkWho"/);
  assert.match(html, /href="https:\/\/en\.mrmasterkey\.com\/master-key-system\/"[^>]*target="_blank"[^>]*rel="noopener noreferrer"[^>]*data-i18n="home\.lineage\.helmar\.linkApproach"/);
  assert.match(html, /href="https:\/\/www\.amazon\.es\/Master-Key-System-Centenary-Higher\/dp\/1456336045"[^>]*target="_blank"[^>]*rel="noopener noreferrer"[^>]*data-i18n="home\.lineage\.helmar\.linkBook"/);
  assert.match(html, /href="\/master-key-system\/"[^>]*data-i18n="home\.lineage\.helmar\.linkReturn"/);
  assert.doesNotMatch(html, /details class="homeLineage__links"[^>]*open/);
});
