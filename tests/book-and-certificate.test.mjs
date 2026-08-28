import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { routeRenderers } from "../src/routes.mjs";
import { renderFooter, renderHeader } from "../src/shared-chrome.mjs";

test("book route exposes only verified direct purchase destinations safely", () => {
  const page = routeRenderers[siteData.routes.getTheBook](siteData);
  assert.equal(page.route, "/get-the-book/");
  assert.match(page.body, /GET YOUR\s+<em>MASTER KEY SYSTEM BOOK<\/em>/);
  assert.match(page.body, /THE COMPLETE ORIGINAL EDITION/);
  assert.match(page.body, /TARIQ'S RECOMMENDED EDITION/);
  assert.match(page.body, /HELMAR RUDOLPH'S CENTENARY EDITION/);
  assert.match(page.body, /href="https:\/\/www\.amazon\.co\.uk\/Master-Key-System-Complete-Chemistry\/dp\/1250874483" target="_blank" rel="noopener noreferrer">AMAZON UK<\/a>/);
  assert.match(page.body, /href="https:\/\/www\.amazon\.es\/-\/en\/Master-Key-System-Complete-Original\/dp\/1250874483" target="_blank" rel="noopener noreferrer">AMAZON SPAIN<\/a>/);
  assert.match(page.body, /href="https:\/\/www\.amazon\.es\/Master-Key-System-Centenary-Higher\/dp\/1456336045" target="_blank" rel="noopener noreferrer">AMAZON SPAIN<\/a>/);
  assert.doesNotMatch(page.body, /bookOption__pending|Availability being confirmed|href="(?:#|\s*)"/i);
  assert.match(page.body, /WHICH ONE SHOULD I CHOOSE\?/);
  assert.match(page.body, /A MESSAGE FROM TARIQ/);
  assert.doesNotMatch(page.body, /\.pdf/i);
});

test("book route uses dedicated edition cover images instead of the design mock-up crop", () => {
  const page = routeRenderers[siteData.routes.getTheBook](siteData);
  const originalCover = "/images/master-key-system-complete-original-edition.jpg";
  const centenaryCover = "/images/master-key-system-centenary-edition.jpg";

  assert.equal(existsSync(path.join(process.cwd(), originalCover)), true);
  assert.equal(existsSync(path.join(process.cwd(), centenaryCover)), true);
  assert.match(page.body, /<img[^>]+src="\/images\/master-key-system-complete-original-edition\.jpg"[^>]+width="360"[^>]+height="540"[^>]+alt="The Master Key System: The Complete Original Edition by Charles F\. Haanel"[^>]*>/);
  assert.match(page.body, /<img[^>]+src="\/images\/master-key-system-centenary-edition\.jpg"[^>]+width="364"[^>]+height="582"[^>]+alt="The Master Key System: Centenary Edition by Charles F\. Haanel, with Helmar Rudolph"[^>]*>/);
  assert.doesNotMatch(page.body, /bookCover--|master-key-book-design-reference/i);
  assert.doesNotMatch(readFileSync(path.join(process.cwd(), "assets", "platform.css"), "utf8"), /\.bookCover\s*\{[^}]*master-key-book-design-reference/i);
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
