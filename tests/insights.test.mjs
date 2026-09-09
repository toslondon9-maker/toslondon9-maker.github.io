import assert from "node:assert/strict";
import test from "node:test";
import { homePage } from "../src/pages/home.mjs";
import { insightsCoursePage } from "../src/pages/insights-course-works.mjs";
import { insightsIndexPage } from "../src/pages/insights-index.mjs";
import { insightsPrinciplesPage } from "../src/pages/insights-principles.mjs";
import { siteData } from "../content/site-data.mjs";

test("homepage presents three Insights & Guides cards above the final conversion panel", () => {
  const body = homePage().body;
  const insightsIndex = body.indexOf("Insights &amp; Guides");
  const finalPanelIndex = body.indexOf('data-home-section="next-step"');
  assert.ok(insightsIndex >= 0);
  assert.ok(finalPanelIndex > insightsIndex);
  assert.equal((body.match(/class="insightsPreview__card"/g) ?? []).length, 3);
  assert.match(body, new RegExp(`href="${siteData.routes.insightsCourse}"`));
});

test("the course article exposes bilingual content, internal links and CTA", () => {
  const english = insightsCoursePage(undefined, "en");
  const spanish = insightsCoursePage(undefined, "es");
  assert.equal(english.route, siteData.routes.insightsCourse);
  assert.match(english.body, /How the Unleash Your Power 24-Week Master Key System Course Works/);
  assert.match(english.body, /Foundation/);
  assert.match(english.body, /Visualisation/);
  assert.match(english.body, /Concentration/);
  assert.match(english.body, /Contemplation and Mastery/);
  assert.match(english.body, new RegExp(`href="${siteData.routes.startFree}"`));
  assert.match(english.body, new RegExp(`href="${siteData.routes.coaching}"`));
  assert.match(english.body, new RegExp(`href="${siteData.routes.masterKeySystem}"`));
  assert.match(spanish.body, /curso de 24 semanas/);
});

test("the course article includes canonical SEO metadata and Article breadcrumbs", () => {
  const page = insightsCoursePage();
  assert.equal(page.titleKey, "insights.courseWorks.metaTitle");
  assert.equal(page.descriptionKey, "insights.courseWorks.metaDescription");
  assert.equal(page.structuredData[0]["@type"], "Article");
  assert.match(page.structuredData[0].mainEntityOfPage, /how-the-24-week-master-key-system-course-works/);
});

test("insights presentation uses scoped responsive layout hooks", () => {
  const page = insightsCoursePage();
  assert.match(page.body, /class="insightArticle/);
  assert.match(homePage().body, /class="insightsPreview/);
});

test("the Insights hub links the existing article and the eight-principles guide", () => {
  const page = insightsIndexPage();
  assert.equal(page.route, siteData.routes.insights);
  assert.match(page.body, new RegExp(`href="${siteData.routes.insightsCourse}"`));
  assert.match(page.body, new RegExp(`href="${siteData.routes.insightsPrinciples}"`));
  assert.match(page.body, /data-i18n="insights\.hub\.heading"/);
});

test("the principles article contains all eight principles, careful Tact guidance and the PDF CTA", () => {
  const english = insightsPrinciplesPage(undefined, "en");
  const spanish = insightsPrinciplesPage(undefined, "es");
  for (const principle of ["Truth", "Tact", "Loyalty", "Individuality", "Courage", "Accumulation", "Constructiveness", "Sagacity"]) assert.match(english.body, new RegExp(principle));
  assert.match(english.body, /sympathy, understanding/);
  assert.match(english.body, /not weakness or people-pleasing/);
  assert.match(english.body, /START THE FREE SEVEN-DAY EXPERIENCE/);
  assert.match(english.body, /href="\/downloads\/eight-principles-master-key-system\.pdf" download/);
  assert.match(english.body, new RegExp(`href="${siteData.routes.startFree}"`));
  assert.match(english.body, new RegExp(`href="${siteData.routes.masterKeySystem}"`));
  assert.match(english.body, new RegExp(`href="${siteData.routes.mksLineage}"`));
  assert.match(english.body, new RegExp(`href="${siteData.routes.coaching}"`));
  assert.match(english.body, new RegExp(`href="${siteData.routes.resources}"`));
  assert.match(spanish.body, /Tacto/);
  assert.doesNotMatch(spanish.body, />insights\.principles\.[^<]*</);
  assert.equal(english.structuredData[0]["@type"], "Article");
});
