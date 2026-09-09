import assert from "node:assert/strict";
import test from "node:test";
import { homePage } from "../src/pages/home.mjs";
import { insightsCoursePage } from "../src/pages/insights-course-works.mjs";
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
