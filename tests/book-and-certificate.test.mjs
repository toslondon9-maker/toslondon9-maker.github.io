import assert from "node:assert/strict";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { routeRenderers } from "../src/routes.mjs";
import { renderFooter, renderHeader } from "../src/shared-chrome.mjs";

test("book route presents verified and pending purchase destinations honestly", () => {
  const page = routeRenderers[siteData.routes.getTheBook](siteData);
  assert.equal(page.route, "/get-the-book/");
  assert.match(page.body, /GET YOUR\s+<em>MASTER KEY SYSTEM BOOK<\/em>/);
  assert.match(page.body, /THE COMPLETE ORIGINAL EDITION/);
  assert.match(page.body, /TARIQ'S RECOMMENDED EDITION/);
  assert.match(page.body, /HELMAR RUDOLPH'S CENTENARY EDITION/);
  assert.match(page.body, /https:\/\/www\.amazon\.co\.uk\/Master-Key-System-Complete-Chemistry\/dp\/1250874483/);
  assert.match(page.body, /Availability being confirmed/);
  assert.match(page.body, /Purchase link being updated/);
  assert.match(page.body, /WHICH ONE SHOULD I CHOOSE\?/);
  assert.match(page.body, /A MESSAGE FROM TARIQ/);
  assert.doesNotMatch(page.body, /\.pdf/i);
});

test("book page is discoverable from navigation, supporting pages and footer", () => {
  assert.match(renderHeader({ route: "/", language: "en" }), /href="\/get-the-book\/"[^>]*>BUY THE MKS BOOK</);
  assert.match(renderFooter({ route: "/", language: "en" }), /href="\/get-the-book\/"/);
  assert.match(routeRenderers[siteData.routes.resources](siteData).body, /href="\/get-the-book\/"/);
  assert.match(routeRenderers[siteData.routes.masterKeySystem](siteData).body, /href="\/get-the-book\/"/);
  assert.match(routeRenderers[siteData.routes.coaching](siteData).body, /href="\/get-the-book\/"/);
});

test("About Tariq accurately presents the Study Service certificate", () => {
  const page = routeRenderers[siteData.routes.aboutTariq](siteData);
  assert.match(page.body, /MY MASTER KEY SYSTEM FOUNDATION/);
  assert.match(page.body, /A journey of study, practice and application\./);
  assert.match(page.body, /Master Key System Study completed with Helmar Rudolph · <strong>2014<\/strong>/);
  assert.match(page.body, /href="\/images\/tariq-master-key-certificate-restored\.png"/);
  assert.match(page.body, /Framed certificate confirming Tariq Saddique’s completion of Helmar Rudolph’s Master Key System Study Service in August 2014\./);
  assert.doesNotMatch(page.body, /qualification|accreditation|endorsement/i);
});
