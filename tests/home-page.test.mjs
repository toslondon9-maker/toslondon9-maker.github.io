import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { t } from "../content/translations.mjs";
import { homePage, renderHome } from "../src/pages/home.mjs";

const approvedSections = ["hero", "welcome-video", "lineage", "origins", "books", "start-free", "master-key", "outcome", "testimonials", "coaching", "insights", "next-step"];
const conversionJourneyHooks = [
  "conversion.next.heading",
  "conversion.next.step1Title",
  "conversion.next.step1Body",
  "conversion.next.step2Title",
  "conversion.next.step2Body",
  "conversion.next.step3Title",
  "conversion.next.step3Body",
  "conversion.next.cta",
];

test("homepage places one shared What Happens Next journey after its hero", () => {
  const html = renderHome({ language: "en" });
  const heroEnd = html.indexOf("</section>");
  const journeyIndex = html.indexOf('class="conversionJourney"');
  const lineageIndex = html.indexOf('data-home-section="lineage"');

  assert.equal((html.match(/class="conversionJourney"/g) ?? []).length, 1);
  assert.ok(heroEnd < journeyIndex && journeyIndex < lineageIndex);
  assert.match(html.slice(journeyIndex, lineageIndex), /href="\/start-free\/"[^>]*data-i18n="conversion\.next\.cta"/);
});

test("homepage renders the shared journey with stable English and Spanish translation hooks", () => {
  for (const language of ["en", "es"]) {
    const html = renderHome({ language });
    const journey = html.match(/<section class="conversionJourney"[\s\S]*?<\/section>/)?.[0] ?? "";
    for (const key of conversionJourneyHooks) assert.match(journey, new RegExp(`data-i18n="${key}"`));
  }
});

test("homepage follows the approved concise customer journey", () => {
  const html = renderHome({ language: "en" });
  const sections = [...html.matchAll(/<section[^>]+data-home-section="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(sections, approvedSections);
  assert.equal((html.match(/<img[^>]+haanel-tariq-portraits\.jpeg/g) ?? []).length, 1);
  assert.match(html, /<h1[^>]*>Master the world within\.<\/h1>/);
  assert.match(html, /CHARLES F\. HAANEL(?:&#39;|')S MASTER KEY SYSTEM/);
  assert.match(html, /START FREE FOR 7 DAYS/);
  assert.match(html, /EXPLORE THE METHOD/);
  assert.match(html, /Free 7-Day Experience • No Previous Experience Required/);
  assert.match(html, /Free registration required\. No purchase required\./);
  assert.match(html, /<source srcset="\/images\/tariq-happiness-harmony-720\.webp" type="image\/webp">/);
  assert.match(html, /VIEW THE 24-WEEK JOURNEY/);
});

test("homepage provides an honest welcome-video placeholder and accessible fallback", () => {
  const html = renderHome({ language: "en" });
  const video = html.match(/<section class="homeVideo"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(video, /A personal welcome from Tariq/);
  assert.match(video, /Discover why Tariq created Unleash Your Power/);
  assert.match(video, /homeVideo__placeholder/);
  assert.match(video, /Video coming soon/);
  assert.match(video, /captions/i);
  assert.doesNotMatch(video, /<video\b/);
  assert.doesNotMatch(video, /\.mp4|\.webm/);
  assert.match(video, /data-i18n="home\.video\.fallback"/);
  const spanish = renderHome({ language: "es" });
  assert.match(spanish, /Una bienvenida personal de Tariq/);
  assert.match(spanish, /Vídeo próximamente/);
});

test("homepage offers the free fifteen-minute WhatsApp call beside both free-entry CTAs", () => {
  const html = renderHome({ language: "en" });
  const expected = encodeURIComponent("Hi Tariq, I’d like to book a free 15-minute call to discuss Unleash Your Power.");
  assert.equal((html.match(/BOOK A FREE 15-MINUTE CALL/g) ?? []).length, 2);
  assert.equal((html.match(new RegExp(`https://wa\\.me/34611223345\\?text=${expected}`, "g")) ?? []).length, 2);
  assert.match(html, /target="_blank" rel="noopener noreferrer"/);
});

test("homepage explains the independent three-person learning lineage near the top", () => {
  const html = renderHome({ language: "en" });
  const lineage = html.match(/<section[^>]+data-home-section="lineage"[\s\S]*?<\/section>/)?.[0] ?? "";
  for (const text of ["Charles F. Haanel", "The System", "Helmar Rudolph", "Modern Study &amp; Application", "Tariq Saddique", "Your Guide &amp; Coach"]) assert.match(lineage, new RegExp(text));
  assert.match(lineage, /independent coaching/i);
  assert.match(lineage, /not affiliated with or endorsed by/i);
});

test("homepage presents the complete seven-day taster", () => {
  const html = renderHome({ language: "en" });
  const taster = html.match(/<section[^>]+data-home-section="start-free"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.equal((taster.match(/data-i18n="home\.taster\.day\d"/g) ?? []).length, 7);
  assert.match(taster, /See What’s Running Your Life/);
  assert.match(taster, /Choose What Happens Next/);
  assert.match(taster, /href="\/start-free\/"[^>]*>START MY FREE 7 DAYS<\/a>/);
  assert.match(taster, /Free registration required\. No purchase required\./);
  assert.match(taster, /class="[^"]*homeTaster__layout[^"]*"/);
});

test("homepage presents the approved premium conversion upgrades", () => {
  const html = renderHome({ language: "en" });

  assert.match(html, /class="homeHero__proof"/);
  assert.match(html, /class="homeHero__caption"/);
  assert.match(html, /class="homeCoaching__visual"[^>]*><div class="homeCoaching__visualInner">/);
  assert.match(html, /THE 24-WEEK JOURNEY/);
  assert.match(html, /THE MASTER KEY SYSTEM/);
  const coaching = html.match(/<section[^>]+data-home-section="coaching"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.equal((coaching.match(/<article>/g) ?? []).length, 4);
  assert.doesNotMatch(html, /unleash-your-power-programme\.jpeg/);
  assert.match(html, /class="homeNext__actionPanel"/);
});

test("homepage keeps its premium SEO title when language enhancements run", () => {
  assert.equal(homePage(siteData, "en").title, "Unleash Your Power | Master Key System Coaching with Tariq");
  assert.equal(t("meta.home.title", "en"), "Unleash Your Power | Master Key System Coaching with Tariq");
});

test("homepage loads with the concise four-phase journey and safe responsive actions", async () => {
  const html = renderHome({ language: "en" });
  const css = await readFile("assets/platform.css", "utf8");
  const pathway = html.match(/<section[^>]+data-home-section="master-key"[\s\S]*?<\/section>/)?.[0] ?? "";
  const visibleText = pathway.replace(/<[^>]+>/g, "");
  assert.match(html, /^<main class="home">/);
  assert.match(html, /href="\/start-free\/"[^>]*>START FREE FOR 7 DAYS<\/a>/);
  for (const expected of ["Weeks 1–4", "Foundation", "Weeks 5–11", "Awareness &amp; Control", "Weeks 12–18", "Application", "Weeks 19–24", "Integration &amp; Mastery"]) assert.match(visibleText, new RegExp(expected));
  assert.equal((pathway.match(/class="homeMasterKey__phaseDescription"/g) ?? []).length, 4);
  assert.match(pathway, /href="\/master-key-system\/"[^>]*>VIEW THE 24-WEEK JOURNEY<\/a>/);
  assert.doesNotMatch(pathway, /questions?\s*(?:&amp;|and)\s*answers?|mastery prompt|guided exercise/i);
  assert.match(css, /\.homeMasterKey__phases li\s*\{[^}]*min-width:\s*0/s);
  assert.match(css, /@media[^}]*max-width:\s*480px[\s\S]*?\.homeMasterKey__phases[^{]*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
});

test("homepage hero collapses to a readable single column on mobile", async () => {
  const css = await readFile("assets/platform.css", "utf8");
  const finalMobileBlock = css.slice(css.lastIndexOf("@media (max-width: 768px)"));
  assert.match(finalMobileBlock, /\.homeHero\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(finalMobileBlock, /\.homeHero__copy\s*,\s*\.homeHero__visual\s*\{[\s\S]*?width:\s*100%/);
  assert.match(finalMobileBlock, /\.homeHero h1\s*\{[\s\S]*?font-size:\s*clamp\(3rem,\s*12vw,\s*4\.5rem\)/);
  assert.match(finalMobileBlock, /\.homeHero__subheading\s*\{[\s\S]*?font-size:\s*clamp\(1\.5rem,\s*6vw,\s*2rem\)/);
});

test("homepage presents the approved lineage image and people in order", () => {
  const html = renderHome({ language: "en" });
  const lineage = html.match(/<section[^>]+data-home-section="lineage"[\s\S]*?<\/section>/)?.[0] ?? "";
  const names = [...lineage.matchAll(/<h3[^>]*>([^<]+)<\/h3>/g)].map((match) => match[1]);
  assert.deepEqual(names, ["Charles F. Haanel", "Helmar Rudolph", "Tariq Saddique"]);
  assert.match(lineage, /Charles F\. Haanel and Tariq Saddique — Master Key System inspired coaching journey/);
  assert.equal((html.match(/haanel-tariq-portraits\.jpeg/g) ?? []).length, 1);
});

test("homepage lineage section retains the premium portrait, cards and independence disclosure", () => {
  const html = renderHome({ language: "en" });
  const lineage = html.match(/<section[^>]+data-home-section="lineage"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(lineage, /class="homeLineage__portrait"/);
  assert.match(lineage, /class="homeLineage__grid"/);
  assert.equal((lineage.match(/class="homeLineage__card"/g) ?? []).length, 3);
  assert.match(lineage, /class="homeLineage__disclaimer"/);
});

test("homepage origins section grounds the Beyond The Secret message without endorsement claims", () => {
  const html = renderHome({ language: "en" });
  const origins = html.match(/<section class="homeOrigins"[\s\S]*?<\/section>/)?.[0] ?? "";
  for (const text of ["A MESSAGE THAT HAS INSPIRED MILLIONS", "A timeless conversation about thought, purpose and action.", "The Secret", "Oprah Winfrey", "Napoleon Hill", "This is not a promise that thought alone controls life."]) assert.match(origins, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(origins, /not affiliated with, endorsed by, or connected to Rhonda Byrne, Oprah Winfrey, Napoleon Hill, The Secret, or their organisations\./);
  assert.match(origins, /href="\/start-free\/"[^>]*>START FREE FOR 7 DAYS<\/a>/);
  assert.match(renderHome({ language: "es" }), /UNA MENSAJE QUE HA INSPIRADO A MILLONES|UN MENSAJE QUE HA INSPIRADO A MILLONES/);
  assert.match(renderHome({ language: "es" }), /Oprah Winfrey/);
});

test("homepage presents the ten books behind the method in both languages", async () => {
  const english = renderHome({ language: "en" });
  const spanish = renderHome({ language: "es" });
  const books = english.match(/<section[^>]+data-home-section="books"[\s\S]*?<\/section>/)?.[0] ?? "";
  for (const title of [
    "Think and Grow Rich",
    "The Secret",
    "The Science of Getting Rich",
    "The Power of Your Subconscious Mind",
    "Psycho-Cybernetics",
    "The Magic of Believing",
    "You Were Born Rich",
    "Tapping the Source",
    "The Master Key Workbook",
    "Master Key Arcana",
  ]) assert.match(books, new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(books, /wider Master Key and New Thought tradition/i);
  assert.match(books, /not a claim that every author was directly inspired by Charles F\. Haanel/i);
  assert.match(spanish, /LOS LIBROS DETRÁS DEL MÉTODO/);
  assert.match(spanish, /tradición más amplia del Master Key y del New Thought/i);
  const css = await readFile("assets/platform.css", "utf8");
  assert.match(css, /\.homeBooks__grid\s*\{[\s\S]*grid-template-columns:\s*repeat\(2/);
  assert.match(css, /@media[\s\S]*max-width:\s*768px[\s\S]*\.homeBooks__grid\s*\{[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
});

test("homepage Spanish render is complete, natural and conversion focused", () => {
  const html = renderHome({ language: "es" });
  assert.match(html, /Domina tu mente\. Cambia tu rumbo\./);
  assert.match(html, /claridad, enfoque, disciplina y acción con propósito/);
  assert.match(html, /Empieza gratis durante 7 días/);
  assert.match(html, /EXPLORA EL MÉTODO/);
  assert.match(html, /Este programa de coaching independiente está inspirado en el Master Key System/);
  assert.match(html, /Registro gratuito obligatorio\. No es necesario comprar\./);
  assert.doesNotMatch(html, /START FREE FOR 7 DAYS|EXPLORE ALL 24 WEEKS|Book a Session/);
});

test("homepage CTA destinations are generated routes", () => {
  const html = renderHome({ language: "en" });
  const routeSet = new Set(Object.values(siteData.routes));
  const ctaRoutes = [...html.matchAll(/<a class="button--(?:primary|secondary|text)[^"]*" href="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(ctaRoutes.length >= 7);
  for (const route of ctaRoutes) if (!route.startsWith("https://wa.me/")) assert.ok(routeSet.has(route), `missing generated destination: ${route}`);
});

test("homepage keeps detailed pricing off the teaser and never restores the payment plan", () => {
  const html = renderHome({ language: "en" });
  const teaser = html.match(/<section[^>]+data-home-section="start-free"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.doesNotMatch(teaser, /£97|£197|£397|£497|£997|£1,188|£1,788|6\s*[×x]\s*£169|£1,014/);
});
