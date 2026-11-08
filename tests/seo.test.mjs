import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { siteData } from "../content/site-data.mjs";
import { routeRenderers } from "../src/routes.mjs";
import { renderPage } from "../src/page-shell.mjs";
import { renderSitemap } from "../src/sitemap.mjs";

function page(route) {
  return renderPage(routeRenderers[route](siteData));
}

test("SEO route contract includes the online course route", () => {
  assert.equal(siteData.routes.masterKeySystemOnlineCourse, "/master-key-system-online-course/");
  assert.equal(typeof routeRenderers[siteData.routes.masterKeySystemOnlineCourse], "function");
});

test("core public pages expose canonical metadata and requested search phrasing", () => {
  const expectations = [
    [siteData.routes.home, "Master Key System Coaching with Tariq"],
    [siteData.routes.coaching, "Master Key System Coaching", "24-Week Course"],
    [siteData.routes.masterKeySystem, "Master Key System 24 Week Course"],
    [siteData.routes.mksLineage, "Charles Haanel Master Key System"],
    [siteData.routes.resources, "Master Key System Exercises", "Study Guide"],
    [siteData.routes.faq, "Master Key System Course FAQ"],
    [siteData.routes.aiMentors, "AI Master Key System Study Companion"],
    [siteData.routes.insightsHaanelBiography, "Who Was Charles F. Haanel?"],
  ];
  for (const [route, ...phrases] of expectations) {
    const html = page(route);
    assert.match(html, new RegExp(`<link rel="canonical" href="https://unleashyourpowerwithtariq\\.com${route.replaceAll("/", "\\/")}"`));
    assert.match(html, /<title[^>]*>[^<]+<\/title>/);
    assert.match(html, /<meta name="description" content="[^"]+"/);
    for (const phrase of phrases) assert.match(html.toLowerCase(), new RegExp(phrase.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("sitewide and page-specific JSON-LD types match visible public pages", () => {
  const home = page(siteData.routes.home);
  assert.match(home, /application\/ld\+json/);
  assert.match(home, /"@type":"Organization"/);
  assert.match(home, /"@type":"WebSite"/);
  const curriculum = routeRenderers[siteData.routes.masterKeySystem](siteData);
  assert.match(curriculum.body, /<h1[^>]*>Master Key System: 24-Week Study Guide and Course<\/h1>/);
  assert.doesNotMatch(curriculum.body, /href="\/ai-mentors\/"/);
  const resources = routeRenderers[siteData.routes.resources](siteData);
  assert.match(resources.body, /href="\/ai-mentors\/"/);
  const curriculumSpanish = renderPage(routeRenderers[siteData.routes.masterKeySystem](siteData, "es"));
  assert.match(curriculumSpanish, /<h1>Master Key System: guía de estudio y curso de 24 semanas<\/h1>/);
  for (const [route, type] of [
    [siteData.routes.aboutTariq, "Person"],
    [siteData.routes.masterKeySystem, "Course"],
    [siteData.routes.coaching, "Course"],
    [siteData.routes.aiMentors, "SoftwareApplication"],
    [siteData.routes.faq, "FAQPage"],
    [siteData.routes.resources, "BreadcrumbList"],
  ]) {
    assert.match(page(route), new RegExp(`"@type":"${type}"`));
  }
});

test("legacy online course URL redirects canonically to the Complete Journey", () => {
  const html = page(siteData.routes.masterKeySystemOnlineCourse);
  assert.match(html, /http-equiv="refresh" content="0; url=\/complete-journey\//);
  assert.match(html, /<link rel="canonical" href="https:\/\/unleashyourpowerwithtariq\.com\/complete-journey\//);
  assert.match(html, /href="\/complete-journey\//);
  assert.match(html, /The 24-week journey has a new home/);
});

test("Complete Journey contains the merged weekly study guidance in English and Spanish", () => {
  const html = page(siteData.routes.completeJourney);
  assert.match(html, /How the learning works each week/);
  assert.match(html, /Study one chapter/);
  assert.match(html, /Practise the weekly exercise/);
  assert.match(html, /Reflect and apply/);
  const spanish = renderPage(routeRenderers[siteData.routes.completeJourney](siteData, "es"));
  assert.match(spanish, /Cómo funciona el aprendizaje cada semana/);
  assert.match(spanish, /Estudia un capítulo/);
});

test("sitemap excludes the legacy online course redirect URL", () => {
  const sitemap = renderSitemap(siteData);
  assert.doesNotMatch(sitemap, /https:\/\/unleashyourpowerwithtariq\.com\/master-key-system-online-course\//);
  assert.match(sitemap, /https:\/\/unleashyourpowerwithtariq\.com\/complete-journey\//);
});

test("insight CTAs keep readable navy text on gold and cream surfaces", () => {
  const css = readFileSync(new URL("../assets/platform.css", import.meta.url), "utf8");
  assert.match(css, /\.button--text\s*\{[^}]*color:\s*var\(--night\)/s);
  assert.match(css, /\.insightArticle__links a\.button--primary\s*\{[^}]*color:\s*var\(--night\)/s);
  assert.match(css, /\.insightArticle__links a\s*\{[^}]*color:\s*var\(--night\)/s);
  assert.match(css, /\.insightArticle__start \.insightArticle__links a:not\(\.button--primary\)\s*\{[^}]*color:\s*var\(--cream\)/s);
  assert.match(css, /\.insightArticle__start \.insightArticle__links a\.button--text,[\s\S]*?color: var\(--cream\); text-decoration-color: var\(--cream\)/);
  assert.match(css, /\.insightArticle__start \.insightArticle__links a,[\s\S]*?color: var\(--cream\); text-decoration-color: var\(--cream\)/);
});
