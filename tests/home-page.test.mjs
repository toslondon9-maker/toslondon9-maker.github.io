import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { t } from "../content/translations.mjs";
import { homePage, renderHome } from "../src/pages/home.mjs";

const approvedSections = ["hero", "welcome", "free-experience", "lineage", "ideas", "journey", "receive", "why-tariq", "testimonials", "offers", "insights", "final-cta"];
const legacySections = ["lineage-expanded", "origins", "books", "ideal", "outcome", "coaching"];

function section(html, id) {
  return html.match(new RegExp(`<section[^>]+data-home-section="${id}"[\\s\\S]*?</section>`))?.[0] ?? "";
}

test("homepage follows the approved concise 12-section sequence", () => {
  const html = renderHome({ language: "en" });
  const sections = [...html.matchAll(/<section[^>]+data-home-section="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(sections, approvedSections);
  assert.doesNotMatch(html, /conversionJourney/);
  assert.match(html, /<h1[^>]*>Master the world within\.<\/h1>/);
  assert.match(html, /CHARLES F\. HAANEL(?:&#39;|')S MASTER KEY SYSTEM/);
  assert.match(html, /tariq-happiness-harmony\.png/);
  assert.match(html, /tariq-welcome-portrait\.png/);
});

test("homepage does not render the previous expanded sections", () => {
  const html = renderHome({ language: "en" });
  for (const id of legacySections) assert.doesNotMatch(html, new RegExp(`data-home-section="${id}"`));
  assert.doesNotMatch(html, /class="homeOrigins|class="homeBooks|class="homeIdeal|class="homeOutcome|class="homeCoaching/);
});

test("homepage keeps an intentional personal welcome without fake video", () => {
  const welcome = section(renderHome({ language: "en" }), "welcome");
  assert.match(welcome, /A personal welcome from Tariq/);
  assert.match(welcome, /tariq-welcome-portrait\.png/);
  assert.match(welcome, /Video coming soon/);
  assert.doesNotMatch(welcome, /<video\b|\.mp4|\.webm/);
});

test("free experience is the clearest primary action and contains all approved value", () => {
  const html = renderHome({ language: "en" });
  const free = section(html, "free-experience");
  for (const title of ["See What’s Running Your Life", "Take Back Your Attention", "Recognise What Keeps Repeating", "Give Your Mind a Direction", "Become Someone You Can Rely On", "Strengthen the New Pattern", "Choose What Happens Next"]) assert.match(free, new RegExp(title.replace(/[.*+?^${}()|[\\]\\]/g, "\\\\$&")));
  for (const value of ["10–15 minutes", "workbook", "online lessons", "AI learning support", "No purchase required"]) assert.match(free, new RegExp(value, "i"));
  assert.match(free, /href="\/start-free\/"[^>]*>START MY FREE 7 DAYS<\/a>/);
  assert.match(html, /class="button--primary[^>]*href="\/start-free\/"[^>]*>START MY FREE 7 DAYS/);
});

test("lineage and ideas sections preserve authority, context and dedicated links", () => {
  const html = renderHome({ language: "en" });
  const lineage = section(html, "lineage");
  const ideas = section(html, "ideas");
  for (const value of ["Charles F. Haanel", "Helmar Rudolph", "Tariq Saddique", "independent coaching", "not affiliated with or endorsed by"]) assert.match(lineage, new RegExp(value, "i"));
  for (const href of [siteData.routes.mksLineage, siteData.routes.masterKeySystem, siteData.routes.resources]) assert.match(lineage, new RegExp(`href="${href.replaceAll("/", "\\/")}"`));
  for (const value of ["The Master Key System", "The Secret", "Think and Grow Rich", "wider personal-development tradition", "not a claim of endorsement"]) assert.match(ideas, new RegExp(value, "i"));
  assert.match(ideas, new RegExp(`href="${siteData.routes.resources.replaceAll("/", "\\/")}"`));
});

test("24-week journey shows exact stages and the study-practise-apply model", () => {
  const journey = section(renderHome({ language: "en" }), "journey");
  const visibleJourney = journey.replace(/<[^>]+>/g, "");
  for (const value of ["Foundation", "Weeks 1–4", "Visualisation", "Weeks 5–11", "Concentration", "Weeks 12–18", "Integration &amp; Mastery", "Weeks 19–24", "Study → Practise → Apply"]) assert.match(visibleJourney, new RegExp(value.replace(/[.*+?^${}()|[\\]\\]/g, "\\\\$&")));
  assert.match(journey, new RegExp(`href="${siteData.routes.masterKeySystem.replaceAll("/", "\\/")}"`));
});

test("homepage presents what students receive and why Tariq with approved links", () => {
  const html = renderHome({ language: "en" });
  const receive = section(html, "receive");
  const why = section(html, "why-tariq");
  for (const value of ["Weekly focus", "Practical exercises", "Reflection", "Personal guidance", "Accountability", "AI learning support"]) assert.match(receive, new RegExp(value, "i"));
  for (const value of ["Why Tariq", "created", "Master Key System", "guide", "coach"]) assert.match(why, new RegExp(value, "i"));
  assert.match(why, new RegExp(`href="${siteData.routes.aboutTariq.replaceAll("/", "\\/")}"`));
});

test("homepage retains existing testimonials and selected insights", () => {
  const html = renderHome({ language: "en" });
  const testimonials = section(html, "testimonials");
  const insights = section(html, "insights");
  for (const name of ["Mark Smith", "Andy White", "David White"]) assert.match(testimonials, new RegExp(name));
  assert.ok((insights.match(/class="insightCard|class="insightsPreview__card/g) ?? []).length >= 3);
  assert.match(insights, /VIEW ALL INSIGHTS|VIEW ALL INSIGHTS &amp; GUIDES/);
});

test("offers use the exact canonical commercial destinations", () => {
  const offers = section(renderHome({ language: "en" }), "offers");
  assert.match(offers, /Free 7-Day Experience/);
  assert.match(offers, /£97/);
  assert.match(offers, /£997/);
  assert.match(offers, new RegExp(`href="${siteData.routes.startFree.replaceAll("/", "\\/")}"`));
  assert.match(offers, new RegExp(`href="${siteData.routes.foundation.replaceAll("/", "\\/")}"`));
  assert.match(offers, new RegExp(`href="${siteData.routes.coaching.replaceAll("/", "\\/")}"`));
});

test("final CTA keeps Free primary, WhatsApp secondary and full journey available", () => {
  const finalCta = section(renderHome({ language: "en" }), "final-cta");
  const expectedWhatsApp = encodeURIComponent("Hi Tariq, I’d like to book a free 15-minute call to discuss Unleash Your Power.");
  assert.match(finalCta, new RegExp(`href="${siteData.routes.startFree.replaceAll("/", "\\/")}"`));
  assert.match(finalCta, new RegExp(`https://wa\\.me/34611223345\\?text=${expectedWhatsApp}`));
  assert.match(finalCta, new RegExp(`href="${siteData.routes.masterKeySystem.replaceAll("/", "\\/")}"`));
});

test("homepage changed content remains bilingual and route-safe", async () => {
  const english = renderHome({ language: "en" });
  const spanish = renderHome({ language: "es" });
  assert.match(spanish, /EMPIEZA|EXPERIENCIA|Master Key System/);
  assert.doesNotMatch(spanish, /START MY FREE 7 DAYS|EXPLORE THE METHOD/);
  for (const html of [english, spanish]) {
    for (const href of [siteData.routes.startFree, siteData.routes.foundation, siteData.routes.coaching, siteData.routes.aboutTariq, siteData.routes.mksLineage, siteData.routes.resources]) assert.match(html, new RegExp(`href="${href.replaceAll("/", "\\/")}"`));
  }
  const css = await readFile("assets/platform.css", "utf8");
  assert.match(css, /\.home/);
});

test("homepage preserves SEO metadata", () => {
  assert.equal(homePage(siteData, "en").title, "Unleash Your Power | Master Key System Coaching with Tariq");
  assert.equal(t("meta.home.title", "en"), "Unleash Your Power | Master Key System Coaching with Tariq");
});
