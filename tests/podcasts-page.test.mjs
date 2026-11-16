import assert from "node:assert/strict";
import test from "node:test";
import { podcastsPage } from "../src/pages/podcasts.mjs";
import { siteData } from "../content/site-data.mjs";

test("podcasts page links to the first LinkedIn interview and free experience", () => {
  const page = podcastsPage(siteData, "en");
  assert.equal(page.route, "/podcasts/");
  assert.match(page.body, /https:\/\/lnkd\.in\/p\/eprSyrbV/);
  assert.match(page.body, /\/start-free\//);
  assert.match(page.body, /more than 200 podcast interviews/);
});

test("podcasts page has Spanish copy and keeps the interview link", () => {
  const page = podcastsPage(siteData, "es");
  assert.equal(page.language, "es");
  assert.match(page.body, /Podcasts y conversaciones/);
  assert.match(page.body, /https:\/\/lnkd\.in\/p\/eprSyrbV/);
});
