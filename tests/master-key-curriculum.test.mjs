import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { renderHome } from "../src/pages/home.mjs";
import { routeRenderers } from "../src/routes.mjs";
import { renderHeader } from "../src/shared-chrome.mjs";

test("the complete historic 24-week curriculum is visitor-accessible from home and navigation", () => {
  const page = routeRenderers[siteData.routes.masterKeySystem](siteData);
  const html = page.body;
  const curriculum = html.match(/<section class="curriculum section" id="curriculum">[\s\S]*<\/section>/)?.[0] ?? "";
  const weeks = [...curriculum.matchAll(/<span class="week">WEEK <!-- -->(\d+)<\/span>/g)].map((match) => Number(match[1]));

  assert.deepEqual(weeks, Array.from({ length: 24 }, (_, index) => index + 1));
  assert.equal((curriculum.match(/<h3>Introduction<\/h3>/g) ?? []).length, 24);
  assert.equal((curriculum.match(/<h3>Content<\/h3>/g) ?? []).length, 24);
  assert.equal((curriculum.match(/<h3>Exercise<\/h3>/g) ?? []).length, 24);
  assert.equal((curriculum.match(/class="weeklyQA"/g) ?? []).length, 24);
  assert.equal((curriculum.match(/class="aiMastery"/g) ?? []).length, 24);
  assert.equal((curriculum.match(/Copy prompt/g) ?? []).length, 24);
  assert.match(curriculum, /One Consciousness - One Power/);
  assert.match(curriculum, /The Truth shall set you free/);
  assert.match(curriculum, /class="weekVideo"[^>]+href="https:\/\/photos\.google\.com\/share\//);
  assert.equal(createHash("sha256").update(curriculum).digest("hex"), "30076ab416e90b65d015c0bdf83bcd1e3da27ffedb3dd8c35db6f619e6563709");
  assert.ok(page.styles?.includes("/assets/index-Bgwsdhov.css"));

  const home = renderHome({ language: "en" });
  assert.match(home, /href="\/master-key-system\/"[^>]*>EXPLORE ALL 24 WEEKS<\/a>/);

  const navigation = renderHeader({ route: "/", language: "en" });
  assert.equal((navigation.match(/href="\/master-key-system\/"[^>]*>Master Key System<\/a>/g) ?? []).length, 2);
});
