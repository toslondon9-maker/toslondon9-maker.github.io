import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { routeRenderers } from "../src/routes.mjs";
import { getTheBookPage } from "../src/pages/get-the-book.mjs";
import { renderFooter, renderHeader } from "../src/shared-chrome.mjs";

test("book route exposes only verified direct purchase destinations safely", () => {
  const page = routeRenderers[siteData.routes.getTheBook](siteData);
  assert.equal(page.route, "/get-the-book/");
  assert.match(page.body, /GET YOUR\s+<em>MASTER KEY SYSTEM BOOK<\/em>/);
  assert.match(page.body, /THE COMPLETE ORIGINAL EDITION/);
  assert.match(page.body, /TARIQ'S RECOMMENDED EDITION/);
  assert.match(page.body, /HELMAR RUDOLPH'S CENTENARY EDITION/);
  assert.match(page.body, /class="button--primary bookAmazonButton" href="https:\/\/www\.amazon\.co\.uk\/Master-Key-System-Complete-Chemistry\/dp\/1250874483" target="_blank" rel="noopener noreferrer">AMAZON UK<\/a>/);
  assert.match(page.body, /class="button--primary bookAmazonButton" href="https:\/\/www\.amazon\.es\/-\/en\/Master-Key-System-Complete-Original\/dp\/1250874483" target="_blank" rel="noopener noreferrer">AMAZON SPAIN<\/a>/);
  assert.match(page.body, /class="button--primary bookAmazonButton" href="https:\/\/www\.amazon\.es\/Master-Key-System-Centenary-Higher\/dp\/1456336045" target="_blank" rel="noopener noreferrer">AMAZON SPAIN<\/a>/);
  assert.match(page.body, /data-i18n="book\.helmar\.editionTitle">HELMAR RUDOLPH'S CENTENARY EDITION<\/h2>/);
  assert.match(page.body, /data-i18n="book\.helmar\.productTitle">The Master Key System — Centenary Edition: Live Your Life on Higher Planes<\/p>/);
  assert.match(page.body, /class="button--primary bookAmazonButton" href="https:\/\/www\.amazon\.co\.uk\/Master-Key-System-Centenary-Higher\/dp\/1456336045\/" target="_blank" rel="noopener noreferrer" data-i18n="book\.helmar\.amazonCta">VIEW HELMAR RUDOLPH’S CENTENARY EDITION ON AMAZON<\/a>/);
  assert.match(page.body, /Charles F\. Haanel is the original author of the Master Key System/);
  const spanishPage = getTheBookPage(siteData, "es");
  assert.match(spanishPage.body, /data-i18n="book\.helmar\.editionTitle">EDICIÓN CENTENARIA DE HELMAR RUDOLPH<\/h2>/);
  assert.match(spanishPage.body, /data-i18n="book\.helmar\.amazonCta">VER LA EDICIÓN CENTENARIA DE HELMAR RUDOLPH EN AMAZON<\/a>/);
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

test("About Tariq presents the supplied portrait and approved write-up", () => {
  const page = routeRenderers[siteData.routes.aboutTariq](siteData);

  assert.equal(existsSync(path.join(process.cwd(), "images", "tariq-saddique-about.jpeg")), true);
  assert.match(page.body, /class="aboutTariqHero__visual"[\s\S]*class="aboutTariqHero__logos"/);
  assert.match(page.body, /src="\/images\/secret-mark-transparent\.png"[^>]+width="122"[^>]+height="139"[^>]+alt="The Secret logo"/);
  assert.doesNotMatch(page.body, /src="\/images\/the-secret-logo\.png"/);
  assert.doesNotMatch(page.body, /the-secret-inspiration\.png/);
  assert.match(page.body, /class="aboutTariqHero__logos"[\s\S]*class="aboutTariqHero__portrait"/);
  assert.match(page.body, /src="\/images\/tariq-saddique-about\.jpeg"[^>]+width="720"[^>]+height="1600"/);
  assert.match(page.body, /alt="Tariq Saddique, creator of Unleash Your Power\."/);
  assert.match(page.body, /I know what it feels like when life changes before you feel ready\./);
  assert.match(page.body, /My journey has taken me from London to Barcelona/);
  assert.match(page.body, /customers across the globe/);
  assert.match(page.body, /<strong>Master Key System \(MKS\)<\/strong> and <em>The Power<\/em>/);
  assert.match(page.body, /<strong>Before,<\/strong>/);
  assert.match(page.body, /<strong>Now,<\/strong>/);
  assert.match(page.body, /I created <strong>Unleash Your Power<\/strong> to share that practical process/);
  assert.match(page.body, /Your next chapter doesn’t have to begin with everything figured out\./);
  assert.match(page.body, new RegExp(`href="${siteData.routes.startFree.replaceAll("/", "\\/")}"[^>]*>Start with the free 7-Day journey<`));
});

test("book page gives all Amazon purchase links one responsive equal-button treatment", () => {
  const page = routeRenderers[siteData.routes.getTheBook](siteData);
  const css = readFileSync(path.join(process.cwd(), "assets", "platform.css"), "utf8");
  const buttons = page.body.match(/<a class="button--primary bookAmazonButton"[\s\S]*?<\/a>/g) ?? [];

  assert.equal(buttons.length, 4);
  assert.equal((page.body.match(/class="bookOption__amazonActions"/g) ?? []).length, 2);
  assert.match(css, /\.bookOption__amazonActions\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(css, /\.bookAmazonButton\s*\{[^}]*width:\s*100%[^}]*min-height:\s*3\.25rem[^}]*padding:\s*\.75rem 1rem[^}]*border-radius:\s*\.7rem[^}]*background:\s*linear-gradient\(145deg, #b88935 0%, #d3aa58 52%, #a87828 100%\)/s);
  assert.match(css, /\.bookAmazonButton\s*\{[^}]*font-size:\s*\.78rem[^}]*line-height:\s*1\.2[^}]*text-align:\s*center/);
  assert.match(css, /\.bookAmazonButton:focus-visible\s*\{[^}]*outline:/s);
  assert.match(css, /@media \(max-width: 520px\)[\s\S]*?\.bookOption__content, \.bookChoose__grid, \.bookOption__amazonActions\s*\{\s*grid-template-columns:\s*1fr/s);
  assert.match(buttons[2], /data-i18n="book\.helmar\.amazonCta">VIEW HELMAR RUDOLPH’S CENTENARY EDITION ON AMAZON<\/a>/);
});

test("About Tariq offers Foundation after the personal story while keeping the free route", () => {
  const page = routeRenderers[siteData.routes.aboutTariq](siteData);
  assert.match(page.body, /class="aboutTariqStory"[\s\S]*href="\/start-free\/"/);
  assert.match(page.body, /class="aboutTariqStory"[\s\S]*href="\/foundation\/"/);
  assert.match(page.body, /data-i18n="aboutTariq\.foundation"/);
});
