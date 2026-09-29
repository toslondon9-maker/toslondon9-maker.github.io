import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { renderPage } from "../src/page-shell.mjs";
import { unlistedSessionHubPage, unlistedSessionHubRoute } from "../src/pages/unlisted-session-hub.mjs";
import { renderSitemap } from "../src/sitemap.mjs";

test("unlisted Session Hub route is private-by-discovery and reuses the Session Hub", () => {
  const page = unlistedSessionHubPage(siteData);
  const html = renderPage(page);

  assert.equal(page.route, unlistedSessionHubRoute);
  assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
  assert.match(html, /sessionHub__reflection/);
  assert.match(html, /Your Master Key Session Hub/);
  assert.match(html, /data-unlisted-access="true"/);
  assert.match(html, /not secure authentication/);
  assert.doesNotMatch(html, /href="\/members-study-room-7f3k\//);
  assert.doesNotMatch(renderSitemap(siteData), /members-study-room-7f3k/);
});

test("unlisted Session Hub preserves bilingual content and does not enter public navigation", () => {
  const spanish = renderPage(unlistedSessionHubPage(siteData, "es"));
  const shared = readFileSync(new URL("../src/shared-chrome.mjs", import.meta.url), "utf8");

  assert.match(spanish, /data-i18n="phase2\.hub\.reflectionTitle"/);
  assert.match(spanish, /Acceso no listado/);
  assert.doesNotMatch(shared, /members-study-room-7f3k/);
});
