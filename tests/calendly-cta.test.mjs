import assert from "node:assert/strict";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { t } from "../content/translations.mjs";
import { homePage } from "../src/pages/home.mjs";
import { foundationPage } from "../src/pages/foundation.mjs";
import { coachingPage } from "../src/pages/coaching.mjs";
import { aboutTariqPage } from "../src/pages/about-tariq.mjs";
import { insightsIndexPage } from "../src/pages/insights-index.mjs";
import { sourceArticlePage } from "../src/pages/insights-source-article.mjs";
import { insightsCoursePage } from "../src/pages/insights-course-works.mjs";
import { insightsPrinciplesPage } from "../src/pages/insights-principles.mjs";
import { aiMentorsPage } from "../src/pages/ai-mentors.mjs";
import { startFreePage } from "../src/pages/start-free.mjs";
import { renderPage } from "../src/page-shell.mjs";

const calendlyUrl = "https://calendly.com/tariq-unleashyourpowerwithtariq";

const pages = [
  ["homepage", homePage],
  ["Foundation", foundationPage],
  ["Coaching", coachingPage],
  ["About Tariq", aboutTariqPage],
  ["Insights hub", insightsIndexPage],
  ["Insights source article", (data, language) => sourceArticlePage({ data, language, id: "journey", metaKey: "insights.journey", pdf: "master-key-system-24-week-journey.pdf" })],
  ["Insights course article", insightsCoursePage],
  ["Insights principles article", insightsPrinciplesPage],
  ["AI Learning", aiMentorsPage],
  ["Start Free", startFreePage],
];

test("Calendly CTA is translated, safe and present on every reassurance surface", () => {
  for (const [label, page] of pages) {
    for (const language of ["en", "es"]) {
      const html = renderPage(page(siteData, language));
      assert.match(html, new RegExp(`href="${calendlyUrl}"`), `${label} URL (${language})`);
      assert.match(html, /data-i18n="cta\.calendlyCall"/, `${label} translation hook (${language})`);
      assert.match(html, /target="_blank" rel="noopener noreferrer"/, `${label} safe target (${language})`);
      assert.match(html, new RegExp(t("cta.calendlyCall", language).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${label} label (${language})`);
    }
  }
});

test("Calendly CTA keeps the approved booking URL exact", () => {
  assert.equal(calendlyUrl, "https://calendly.com/tariq-unleashyourpowerwithtariq");
});
