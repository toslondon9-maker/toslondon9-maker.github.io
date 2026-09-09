import assert from "node:assert/strict";
import test from "node:test";
import { homePage } from "../src/pages/home.mjs";
import { insightsCoursePage } from "../src/pages/insights-course-works.mjs";
import { insightsIndexPage } from "../src/pages/insights-index.mjs";
import { insightsPrinciplesPage } from "../src/pages/insights-principles.mjs";
import { insightsIntroductionPage } from "../src/pages/insights-introduction.mjs";
import { insightsWorldWithinPage } from "../src/pages/insights-world-within.mjs";
import { siteData } from "../content/site-data.mjs";

test("homepage presents three Insights & Guides cards above the final conversion panel", () => {
  const body = homePage().body;
  const insightsIndex = body.indexOf("Insights &amp; Guides");
  const finalPanelIndex = body.indexOf('data-home-section="next-step"');
  assert.ok(insightsIndex >= 0);
  assert.ok(finalPanelIndex > insightsIndex);
  assert.equal((body.match(/class="insightsPreview__card"/g) ?? []).length, 3);
  assert.match(body, new RegExp(`href="${siteData.routes.insightsIntroduction}"`));
  assert.match(body, new RegExp(`href="${siteData.routes.insightsPrinciples}"`));
  assert.match(body, new RegExp(`href="${siteData.routes.insightsWorldWithin}"`));
  assert.equal((body.match(/class="insightsPreview__category"/g) ?? []).length, 3);
  assert.equal((body.match(/data-i18n="insights\.preview\.[^"]+\.pdfAction"/g) ?? []).length, 3);
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

test("the Insights hub links the three branded collection articles", () => {
  const page = insightsIndexPage();
  assert.equal(page.route, siteData.routes.insights);
  assert.match(page.body, new RegExp(`href="${siteData.routes.insightsIntroduction}"`));
  assert.match(page.body, new RegExp(`href="${siteData.routes.insightsPrinciples}"`));
  assert.match(page.body, new RegExp(`href="${siteData.routes.insightsWorldWithin}"`));
  assert.match(page.body, /data-i18n="insights\.hub\.heading"/);
});

test("the Insights hub gives bilingual readers a free-study or optional WhatsApp choice", () => {
  const english = insightsIndexPage(undefined, "en").body;
  const spanish = insightsIndexPage(undefined, "es").body;
  const bookingMessage = encodeURIComponent("Hi Tariq, I’d like to book a free 15-minute call to discuss Unleash Your Power.");

  assert.match(english, /Start with the free seven-day experience, or book a free 15-minute WhatsApp call to ask a question before you begin\./);
  assert.match(english, /BOOK A FREE 15-MINUTE CALL/);
  assert.match(english, new RegExp(`href="https://wa\\.me/34611223345\\?text=${bookingMessage}"`));
  assert.match(english, /target="_blank" rel="noopener noreferrer"/);
  assert.match(spanish, /Empieza con la experiencia gratuita de siete días o reserva una llamada gratuita de 15 minutos por WhatsApp para hacer una pregunta antes de empezar\./);
  assert.match(spanish, /RESERVAR UNA LLAMADA GRATUITA DE 15 MINUTOS/);
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

test("the introduction and world-within articles render bilingual content, links and PDF downloads", () => {
  for (const [page, route, pdf, phrase] of [[insightsIntroductionPage(), siteData.routes.insightsIntroduction, "charles-haanel-master-key-system-introduction.pdf", "The mind as a creative power"], [insightsWorldWithinPage(), siteData.routes.insightsWorldWithin, "world-within-and-world-without.pdf", "The world within"]]) {
    assert.equal(page.route, route);
    assert.match(page.body, new RegExp(phrase));
    assert.match(page.body, /DOWNLOAD THIS ARTICLE AS A PDF/);
    assert.match(page.body, new RegExp(`/downloads/${pdf}`));
    assert.match(page.body, new RegExp(`href="${siteData.routes.startFree}"`));
    assert.match(page.body, new RegExp(`href="${siteData.routes.masterKeySystem}"`));
    assert.equal(page.structuredData[0]["@type"], "Article");
  }
  assert.match(insightsIntroductionPage(undefined, "es").body, /La mente como poder creativo/);
  assert.match(insightsWorldWithinPage(undefined, "es").body, /El mundo interior/);
});

test("every published article has one free-experience hook, a 24-week journey hook, and no payment link", () => {
  const articles = [insightsCoursePage, insightsIntroductionPage, insightsWorldWithinPage, insightsPrinciplesPage];

  for (const renderArticle of articles) {
    const body = renderArticle(undefined, "en").body;
    const startHooks = body.match(/<a\b(?=[^>]*href="\/start-free\/")[^>]*>START THE FREE SEVEN-DAY EXPERIENCE<\/a>/g) ?? [];

    assert.equal(startHooks.length, 1, "article has one primary free-experience CTA");
    assert.match(body, /<a\b(?=[^>]*href="\/master-key-system\/")[^>]*data-i18n="insights\.cta\.viewJourney"/);
    assert.doesNotMatch(body, /paypal\.com/i);
  }
});
