import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { homePage, renderHome } from "../src/pages/home.mjs";
import { siteData } from "../content/site-data.mjs";
import { t } from "../content/translations.mjs";

function section(html, id) {
  const marker = `data-home-section="${id}"`;
  const markerIndex = html.indexOf(marker);
  if (markerIndex < 0) return "";
  const start = html.lastIndexOf("<section", markerIndex);
  const end = html.indexOf("</section>", markerIndex);
  return start >= 0 && end >= 0 ? html.slice(start, end + "</section>".length) : "";
}

test("homepage renders the current coaching headline, hero artwork and primary free CTA", () => {
  const html = renderHome({ language: "en" });
  assert.match(html, /<h1[^>]*data-i18n="route\.home\.heading">Master Key System Coaching for Focus, Clarity and Personal Growth<\/h1>/);
  assert.match(html, /src="\/uyp-home-hero\.jpg"/);
  assert.match(html, /href="\/start-free\/"[^>]*data-i18n="route\.home\.action"/);
  assert.match(html, /<strong>7<\/strong>/);
  assert.match(html, /<strong>24<\/strong>/);
  assert.match(html, /<strong>3<\/strong>/);
  assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1);
});

test("homepage follows the current concise section sequence", () => {
  const html = renderHome({ language: "en" });
  const sections = [...html.matchAll(/<section[^>]+data-home-section="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(sections, ["hero", "free-experience", "journey", "transformation-reveal", "testimonials", "offers", "why-tariq", "insights", "final-cta"]);
  assert.ok(sections.indexOf("insights") < sections.indexOf("final-cta"));
});

test("free experience presents seven lessons, a workbook and no-purchase reassurance", () => {
  const html = section(renderHome({ language: "en" }), "free-experience");
  assert.match(html, /YOUR FREE 7-DAY EXPERIENCE/);
  assert.match(html, /Seven online lessons/);
  assert.match(html, /Workbook included/);
  assert.match(html, /No purchase required/);
  const dayList = html.match(/<ol class="homeFreeExperience__days">([\s\S]*?)<\/ol>/)?.[1] ?? "";
  assert.equal((dayList.match(/<li>/g) ?? []).length, 7);
  assert.match(html, new RegExp(`href="${siteData.routes.startFree.replaceAll("/", "\\/")}"`));
});

test("the 24-week journey presents the four progressive study stages", () => {
  const html = section(renderHome({ language: "en" }), "journey");
  for (const value of ["Foundation", "Weeks 1–4", "Visualisation", "Weeks 5–11", "Concentration", "Weeks 12–18", "Integration &amp; Mastery", "Weeks 19–24", "Study → Practise → Apply"]) {
    assert.ok(html.includes(value), value);
  }
  assert.match(html, new RegExp(`href="${siteData.routes.masterKeySystem.replaceAll("/", "\\/")}"`));
});

test("the transformation reveal is accessible and avoids instant-result promises", () => {
  const english = section(renderHome({ language: "en" }), "transformation-reveal");
  const spanish = section(renderHome({ language: "es" }), "transformation-reveal");
  assert.match(english, /data-transformation-open/);
  assert.match(english, /<dialog[^>]+aria-labelledby="home-transformation-title"/);
  assert.match(english, /This is not instant magic or an easy promise/);
  assert.match(english, /24 weeks\. 24 lessons\./);
  assert.match(spanish, /HAZ CLIC AQUÍ PARA DESCUBRIR TU PROCESO/);
  assert.match(spanish, /No se trata de magia instantánea/);
});

test("homepage testimonials retain the three supplied student experiences and disclosure", () => {
  const html = section(renderHome({ language: "en" }), "testimonials");
  for (const name of ["Paul Best", "Sandra Mildebrath", "Carmen Amaya"]) assert.ok(html.includes(name), name);
  assert.match(html, /Affiliate relationship disclosed/);
  assert.equal((html.match(/class="homeTestimonials__card"/g) ?? []).length, 3);
  assert.equal((html.match(/class="homeTestimonials__more"/g) ?? []).length, 3);
});

test("homepage offers use the canonical free, Foundation and Complete Journey routes", () => {
  const offers = section(renderHome({ language: "en" }), "offers");
  assert.match(offers, /Free 7-Day Experience/);
  assert.match(offers, /£97/);
  assert.match(offers, /£997/);
  assert.match(offers, new RegExp(`href="${siteData.routes.startFree.replaceAll("/", "\\/")}"`));
  assert.match(offers, new RegExp(`href="${siteData.routes.foundation.replaceAll("/", "\\/")}"`));
  assert.match(offers, new RegExp(`href="${siteData.routes.completeJourney.replaceAll("/", "\\/")}"`));
  assert.doesNotMatch(offers, /href="\/coaching\/"/);
});

test("Why Tariq section uses the current bilingual story and canonical profile link", () => {
  const english = section(renderHome({ language: "en" }), "why-tariq");
  const spanish = section(renderHome({ language: "es" }), "why-tariq");
  assert.match(english, /data-i18n="home\.whyTariq\.title"/);
  assert.match(english, /data-i18n="home\.whyTariq\.body\.intro"/);
  assert.match(english, /data-i18n="home\.whyTariq\.readMore">Read more/);
  assert.match(english, new RegExp(`href="${siteData.routes.aboutTariq.replaceAll("/", "\\/")}"`));
  assert.match(spanish, /data-i18n="home\.whyTariq\.title"/);
  assert.match(spanish, /data-i18n="home\.whyTariq\.body\.intro"/);
});

test("homepage insights preview and final call to action keep the free route prominent", () => {
  const html = renderHome({ language: "en" });
  const insights = section(html, "insights");
  const finalCta = section(html, "final-cta");
  assert.ok(insights.length > 0);
  assert.ok(finalCta.length > 0);
  assert.match(insights, /VIEW ALL INSIGHTS|VIEW ALL INSIGHTS &amp; GUIDES/);
  assert.match(finalCta, new RegExp(`href="${siteData.routes.startFree.replaceAll("/", "\\/")}"`));
  assert.match(finalCta, /data-i18n="home\.final\.start"/);
  assert.match(finalCta, /data-i18n="home\.cta\.whatsappQuestion"/);
  assert.match(finalCta, /data-i18n="home\.final\.method"/);
});

test("homepage content remains bilingual and route-safe", () => {
  const english = renderHome({ language: "en" });
  const spanish = renderHome({ language: "es" });
  assert.match(spanish, /EMPIEZA|EXPERIENCIA|Master Key System/);
  assert.doesNotMatch(spanish, /START YOUR 7 DAYS|EXPLORE THE METHOD/);
  for (const html of [english, spanish]) {
    for (const href of [siteData.routes.startFree, siteData.routes.foundation, siteData.routes.completeJourney, siteData.routes.masterKeySystem, siteData.routes.aboutTariq, siteData.routes.insights]) {
      assert.match(html, new RegExp(`href="${href.replaceAll("/", "\\/")}"`));
    }
  }
});

test("homepage SEO title is sourced from the bilingual translation registry", () => {
  assert.equal(homePage(siteData, "en").title, t("route.home.metaTitle", "en"));
  assert.equal(homePage(siteData, "es").title, t("route.home.metaTitle", "es"));
  assert.equal(homePage(siteData, "en").titleKey, "route.home.metaTitle");
});

test("homepage layout styles retain responsive safeguards", async () => {
  const css = await readFile("assets/platform.css", "utf8");
  assert.match(css, /\.homeHero__proof/);
  assert.match(css, /@media \(max-width:/);
  assert.match(css, /min-width:\s*0/);
});
