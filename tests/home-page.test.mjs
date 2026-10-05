import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { t } from "../content/translations.mjs";
import { homePage, renderHome } from "../src/pages/home.mjs";

const approvedSections = ["hero", "welcome", "free-experience", "tradition", "journey", "offers", "receive", "why-tariq", "testimonials", "insights", "final-cta", "next-step"];
const legacySections = ["lineage-expanded", "origins", "books", "ideal", "outcome", "coaching"];

function section(html, id) {
  return html.match(new RegExp(`<section[^>]+data-home-section="${id}"[\\s\\S]*?</section>`))?.[0] ?? "";
}

test("homepage follows the approved concise 12-section sequence", () => {
  const html = renderHome({ language: "en" });
  const sections = [...html.matchAll(/<section[^>]+data-home-section="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(sections, approvedSections);
  assert.equal(sections.indexOf("offers"), sections.indexOf("journey") + 1);
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
  const messageIndex = welcome.indexOf("A personal welcome from Tariq");
  const logoIndex = welcome.indexOf('src="/images/secret-mark-transparent.png"');
  const portraitIndex = welcome.indexOf('src="/images/tariq-welcome-portrait.png"');
  assert.ok(messageIndex >= 0);
  assert.ok(logoIndex > messageIndex);
  assert.ok(portraitIndex > logoIndex);
  assert.match(welcome, /A personal welcome from Tariq/);
  assert.match(welcome, /class="homeWelcome__visual"/);
  assert.match(welcome, /class="homeWelcome__imagePair"/);
  assert.match(welcome, /src="\/images\/secret-mark-transparent\.png"[^>]+alt="The Secret logo"/);
  assert.doesNotMatch(welcome, /the-secret-inspiration\.png/);
  assert.match(welcome, /homeWelcome__imagePair">[\s\S]*secret-mark-transparent\.png[\s\S]*tariq-welcome-portrait\.png/);
  assert.match(welcome, /tariq-welcome-portrait\.png/);
  assert.match(welcome, /class="homeWelcome__panel"/);
  assert.match(welcome, /data-i18n="home\.video\.body"/);
  assert.match(welcome, /data-i18n="home\.video\.panelBody"/);
  assert.doesNotMatch(welcome, /Video coming soon/);
  assert.doesNotMatch(welcome, /<video\b|\.mp4|\.webm/);
  assert.doesNotMatch(welcome, /affiliated|endorsed|partnership/i);
});

test("homepage does not expose the removed soundtrack or its runtime", async () => {
  const html = renderHome({ language: "en" });
  const runtime = await readFile("assets/home-soundtrack.mjs", "utf8").catch(() => null);
  assert.doesNotMatch(html, /homeSoundtrack|home-soundtrack|data-home-audio|pixabay\.com\/music\/main-title-inspirational-cinematic/);
  assert.deepEqual(homePage(siteData, "en").scripts, ["/assets/home-testimonials.mjs", "/assets/life-power-accordion.mjs"]);
  assert.equal(runtime, null);
});

test("homepage hero keeps the primary seven-day CTA before secondary actions", () => {
  const hero = section(renderHome({ language: "en" }), "hero");
  assert.match(hero, /class="button--primary[^>]*href="\/start-free\/"[^>]*>START YOUR 7 DAYS<\/a>/);
  assert.match(hero, /href="\/master-key-system\/"[^>]*>EXPLORE THE METHOD<\/a>/);
  assert.doesNotMatch(hero, /WhatsApp/);
});

test("free experience is the clearest primary action and contains all approved value", () => {
  const html = renderHome({ language: "en" });
  const free = section(html, "free-experience");
  for (const title of ["See What’s Running Your Life", "Take Back Your Attention", "Recognise What Keeps Repeating", "Give Your Mind a Direction", "Become Someone You Can Rely On", "Strengthen the New Pattern", "Choose What Happens Next"]) assert.match(free, new RegExp(title.replace(/[.*+?^${}()|[\\]\\]/g, "\\\\$&")));
  for (const value of ["10–15 minutes", "workbook", "online lessons", "AI learning support", "No purchase required"]) assert.match(free, new RegExp(value, "i"));
  assert.match(free, /href="\/start-free\/"[^>]*>START MY FREE 7 DAYS<\/a>/);
  assert.match(html, /class="button--primary[^>]*href="\/start-free\/"[^>]*>START MY FREE 7 DAYS/);
});

test("tradition section combines lineage, context and dedicated links", () => {
  const html = renderHome({ language: "en" });
  const tradition = section(html, "tradition");
  for (const value of ["Charles F. Haanel", "Helmar Rudolph", "Tariq Saddique", "The Master Key System", "The Secret", "Think and Grow Rich", "wider personal-development tradition", "not affiliated with or endorsed by", "not a claim of endorsement"]) assert.match(tradition, new RegExp(value, "i"));
  for (const href of [siteData.routes.mksLineage, siteData.routes.getTheBook, siteData.routes.resources, siteData.routes.masterKeySystem]) assert.match(tradition, new RegExp(`href="${href.replaceAll("/", "\\/")}"`));
});

test("homepage Master Key introduction includes the closed life-power accordion before Foundation link", () => {
  const html = renderHome({ language: "en" });
  const tradition = section(html, "tradition");
  assert.equal((tradition.match(/class="homeTradition__lifePowerDetails"/g) ?? []).length, 1);
  assert.match(tradition, /<details class="homeTradition__lifePowerDetails">/);
  assert.match(tradition, /<summary id="home-life-power-heading" aria-controls="home-life-power-article" aria-expanded="false">/);
  assert.doesNotMatch(tradition, /<details[^>]+open/);
  assert.match(tradition, /data-i18n="foundation\.lifePower\.heading">The Life-Changing Power of the Master Key System/);
  assert.match(tradition, /data-i18n="foundation\.lifePower\.teaser">Discover how applying/);
  assert.match(tradition, /data-i18n="foundation\.lifePower\.articleTitle">Unlock a Richer Life/);
  for (let index = 1; index <= 5; index += 1) assert.match(tradition, new RegExp(`data-i18n="foundation\\.lifePower\\.paragraph${index}"`));
  const accordionIndex = tradition.indexOf('class="homeTradition__lifePower"');
  const foundationIndex = tradition.indexOf(`href="${siteData.routes.foundation}"`);
  assert.ok(accordionIndex >= 0 && foundationIndex > accordionIndex);
  const spanish = renderHome({ language: "es" });
  assert.match(spanish, /data-i18n="home\.tradition\.foundationLink">Explora Foundation/);
  assert.match(spanish, /data-i18n="foundation\.lifePower\.heading">El poder transformador del Master Key System/);
  assert.match(spanish, /data-i18n="foundation\.lifePower\.toggle">LEER MÁS/);
  assert.match(homePage(siteData, "en").scripts.join(" "), /life-power-accordion\.mjs/);
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
  for (const value of [
    "WHY TARIQ",
    "Find your focus in a world competing for your attention.",
    "Social media can keep us scrolling.",
    "I’m Tariq.",
    "The Master Key System offers a powerful framework",
    "My aim is to help you step back from the noise",
  ]) assert.match(why, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  assert.match(why, /href="\/about-tariq\/"[^>]*>Meet Tariq</i);
  assert.match(why, new RegExp(`href="${siteData.routes.aboutTariq.replaceAll("/", "\\/")}"`));
});

test("Why Tariq keeps its exact copy in readable accessible disclosure paragraphs", async () => {
  const html = renderHome({ language: "en" });
  const why = section(html, "why-tariq");
  const paragraphKeys = [
    "home.whyTariq.body.intro",
    "home.whyTariq.body.context",
    "home.whyTariq.body.framework",
    "home.whyTariq.body.application",
  ];
  assert.equal(paragraphKeys.map((key) => t(key, "en")).join(" "), t("home.whyTariq.body", "en"));
  assert.match(why, /<p class="homeWhyTariq__paragraph" data-i18n="home\.whyTariq\.body\.intro">/);
  assert.match(why, /<details class="homeWhyTariq__details">/);
  assert.match(why, /<summary><span[^>]*data-i18n="home\.whyTariq\.readMore">Read more<\/span>/);
  assert.match(why, /<p class="homeWhyTariq__paragraph" data-i18n="home\.whyTariq\.body\.framework">The Master Key System offers a powerful framework/);
  assert.match(why, /<span[^>]*data-i18n="home\.whyTariq\.readLess">Read less<\/span>/);
  assert.doesNotMatch(why, /<details[^>]+open/);
  assert.equal((why.match(/class="homeWhyTariq__paragraph"/g) ?? []).length, 4);
  const css = await readFile("assets/platform.css", "utf8");
  assert.match(css, /\.homeWhyTariq__paragraph\s*\{[^}]*font-size:\s*clamp\(/);
  assert.match(css, /\.homeWhyTariq__paragraph\s*\{[^}]*margin:/);
  assert.match(css, /\.homeWhyTariq__details\s+summary[^}]*cursor:\s*pointer/);
});

test("homepage retains existing testimonials and selected insights", () => {
  const html = renderHome({ language: "en" });
  const testimonials = section(html, "testimonials");
  const insights = section(html, "insights");
  for (const name of ["Paul Best", "Sandra Mildebrath", "Carmen Amaya"]) assert.match(testimonials, new RegExp(name));
  for (const name of ["Mark Smith", "Andy White", "David White"]) assert.doesNotMatch(testimonials, new RegExp(name));
  assert.match(testimonials, /Before I began working with Tariq, I had achieved a great deal professionally/);
  assert.match(testimonials, /What impressed me was Tariq’s thoughtful, chapter-by-chapter guidance/);
  assert.match(testimonials, /Over time, I became more aware of the thoughts I was repeating/);
  assert.match(testimonials, /Before I started working with Tariq, I felt stuck/);
  assert.match(testimonials, /I feel clearer about my next steps, and I have a routine I can continue/);
  assert.match(testimonials, /Affiliate relationship disclosed/);
  assert.match(testimonials, /class="homeTestimonials__disclosure"[^>]*>Affiliate relationship disclosed/);
  assert.doesNotMatch(testimonials, /[“”]/);
  assert.equal((testimonials.match(/class="homeTestimonials__quoteParagraph"/g) ?? []).length, 10);
  assert.equal((testimonials.match(/class="homeTestimonials__card"/g) ?? []).length, 3);
  assert.ok((insights.match(/class="insightCard|class="insightsPreview__card/g) ?? []).length <= 3);
  assert.doesNotMatch(insights, /insightsPreview__meta|insightsPreview__date|\/downloads\/|download/);
  assert.match(insights, /VIEW ALL INSIGHTS|VIEW ALL INSIGHTS &amp; GUIDES/);
});

test("Paul Best testimonial preserves the exact approved experience and disclosure", () => {
  const testimonials = section(renderHome({ language: "en" }), "testimonials");
  for (const paragraph of [
    "I’ve tried several forms of personal development, but studying the Master Key System with Tariq is the best personal-development study I’ve come across. What makes it stand out is the way he guides you through the chapters, shares his insight into the ideas and helps you put them into practice.",
    "Tariq brings real passion to helping people understand the material. He connects each chapter to everyday situations and encourages you to keep working with the exercises, reflection and meditation. That regular practice helped me become more aware of my habits and more consistent in applying what I was learning.",
    "I began by meditating for 15 minutes each day, then slowly increased this to one hour daily over six months while completing the full 24-week programme. Now my mind feels calm and focused, and I visualise a clear goal each morning.",
    "I valued the experience enough to recommend Tariq’s Mastery Circle to four friends, who purchased through my affiliate link. I’m pleased to have shared something I believe can help others, and I’m happy for the affiliate relationship to be disclosed.",
  ]) assert.match(testimonials, new RegExp(paragraph.replace(/[.*+?^${}()|[\\]\\]/g, "\\\\$&")));
  assert.match(testimonials, /Affiliate relationship disclosed: Paul’s recommendation includes purchases made through his affiliate link\./);
  assert.match(testimonials, /<strong>Paul Best<\/strong><span>UK<\/span>/);
});

test("homepage testimonials disclose remaining paragraphs accessibly", () => {
  const english = section(renderHome({ language: "en" }), "testimonials");
  const spanish = section(renderHome({ language: "es" }), "testimonials");
  assert.equal((english.match(/<details class="homeTestimonials__more"/g) ?? []).length, 3);
  assert.equal((english.match(/data-i18n="home\.testimonials\.readMore"/g) ?? []).length, 3);
  assert.equal((english.match(/data-i18n="home\.testimonials\.readLess"/g) ?? []).length, 3);
  assert.equal((english.match(/aria-controls="home-testimonial-[^"]+"/g) ?? []).length, 3);
  assert.equal((english.match(/id="home-testimonial-[^"]+-content"/g) ?? []).length, 3);
  assert.doesNotMatch(english, /<details class="homeTestimonials__more"[^>]*open/);
  assert.match(english, /READ MORE/);
  assert.match(english, /READ LESS/);
  assert.match(spanish, /LEER MÁS/);
  assert.match(spanish, /LEER MENOS/);
  for (const paragraph of [
    "I’ve tried several forms of personal development",
    "Tariq brings real passion to helping people understand the material",
    "I valued the experience enough to recommend Tariq’s Mastery Circle",
    "Before I started working with Tariq, I felt stuck",
    "Tariq helped me understand the Master Key System one chapter at a time",
    "I started to notice my thoughts and habits more",
    "Before I began working with Tariq, I had achieved a great deal professionally",
    "What impressed me was Tariq’s thoughtful, chapter-by-chapter guidance",
    "Over time, I became more aware of the thoughts I was repeating",
  ]) assert.match(english, new RegExp(paragraph.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("testimonial disclosure runtime and styling preserve keyboard and responsive access", async () => {
  const runtime = await readFile("assets/home-testimonials.mjs", "utf8");
  const css = await readFile("assets/platform.css", "utf8");
  assert.match(runtime, /addEventListener\("toggle"/);
  assert.match(runtime, /setAttribute\("aria-expanded", String\(disclosure\.open\)\)/);
  assert.match(css, /\.homeTestimonials__more summary[\s\S]*?background: var\(--night\)/);
  assert.match(css, /\.homeTestimonials__more summary:focus-visible[\s\S]*?outline:/);
  assert.match(css, /\.homeTestimonials__more\[open\] \.homeTestimonials__readLess/);
  assert.match(css, /\.homeTestimonials__more\[open\] \.homeTestimonials__readMore/);
  assert.match(css, /\.homeTestimonials__card\s*\{[\s\S]*?min-width:\s*0/);
  assert.match(css, /\.homeTestimonials__more summary\s*\{[\s\S]*?max-width:\s*100%/);
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

test("homepage offer note reflects only the current public offer structure", () => {
  const english = section(renderHome({ language: "en" }), "offers");
  const spanish = section(renderHome({ language: "es" }), "offers");
  assert.match(english, /Mastery Circle/);
  assert.match(english, /Alumni Practice Membership/);
  assert.doesNotMatch(english, /Private Mentoring|Corporate Programmes/);
  assert.match(spanish, /Círculo de dominio/);
  assert.match(spanish, /membresía de práctica para antiguos alumnos/i);
  assert.doesNotMatch(spanish, /Mentoría privada|Programas corporativos/);
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

test("homepage Lineage cards stack safely on mobile", async () => {
  const css = await readFile("assets/platform.css", "utf8");
  const gridIndex = css.lastIndexOf(".homeLineage__grid {\n    grid-template-columns: minmax(0, 1fr);");
  const mobileStart = css.lastIndexOf("@media (max-width: 480px)", gridIndex);
  const mobileBlock = css.slice(mobileStart, gridIndex + 320);
  assert.match(mobileBlock, /\.homeLineage__grid\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\);[\s\S]*?\}/);
  assert.match(mobileBlock, /\.homeLineage__card\s*\{[\s\S]*?min-width:\s*0;[\s\S]*?width:\s*100%;[\s\S]*?\}/);
});

test("Haanel lineage card provides a closed bilingual reference disclosure", () => {
  const english = renderHome({ language: "en" });
  const spanish = renderHome({ language: "es" });
  const disclosure = english.match(/<details class="homeLineage__links">[\s\S]*?<\/details>/)?.[0] ?? "";

  assert.match(english, /<details class="homeLineage__links">/);
  assert.match(english, /<summary[^>]*>WHO WAS CHARLES HAANEL<\/summary>/);
  assert.doesNotMatch(disclosure, /<details[^>]* open/);
  assert.match(disclosure, /href="\/insights\/who-was-charles-f-haanel-life-and-legacy\/"[^>]*>Who Was Charles F\. Haanel\?</);
  assert.match(disclosure, /href="\/master-key-system\/"[^>]*>The Master Key System</);
  assert.match(disclosure, /href="https:\/\/en\.wikipedia\.org\/wiki\/Charles_F\._Haanel"[^>]*target="_blank"[^>]*rel="noopener noreferrer"[^>]*>Charles F\. Haanel — Wikipedia</);
  assert.match(disclosure, /href="https:\/\/en\.wikipedia\.org\/wiki\/The_Master_Key_System"[^>]*target="_blank"[^>]*rel="noopener noreferrer"[^>]*>The Master Key System — Wikipedia</);
  assert.match(spanish, /<summary[^>]*>¿QUIÉN FUE CHARLES F\. HAANEL\?<\/summary>/);
  assert.match(spanish, /¿Quién fue Charles F\. Haanel\?/);
  assert.match(spanish, /El Master Key System/);
});

test("homepage preserves SEO metadata", () => {
  assert.equal(homePage(siteData, "en").title, "Unleash Your Power | Master Key System Coaching with Tariq");
  assert.equal(t("meta.home.title", "en"), "Unleash Your Power | Master Key System Coaching with Tariq");
});

test("homepage reader connection moves from challenge to a clear next step in both languages", () => {
  const english = renderHome({ language: "en" });
  const spanish = renderHome({ language: "es" });

  assert.match(english, /overthinking|scattered|stuck/i);
  assert.match(english, /START YOUR 7 DAYS/i);
  assert.match(english, /Foundation/);
  assert.match(spanish, /mente|atención|atascad|dirección/i);
  assert.match(spanish, /EMPIEZA TUS 7 DÍAS/i);
  assert.match(spanish, /Fundamentos/);
});

test("homepage Foundation offer uses the shared concise summary", () => {
  const english = section(renderHome({ language: "en" }), "offers");
  const spanish = section(renderHome({ language: "es" }), "offers");
  for (const html of [english, spanish]) {
    assert.match(html, /class="homeOffers__card homeOffers__card--foundation"/);
    assert.doesNotMatch(html, /compactFoundationOffer__details|foundation\.compact\.(seeIncluded|chapterDay|meditationDay|chapterTotal|meditationTotal|commitment)/);
    for (const key of ["weeks", "lessons", "calls", "totalCalls", "access", "support"]) {
      assert.match(html, new RegExp(`data-i18n="foundation\\.compact\\.${key}"`));
    }
    assert.match(html, /href="\/foundation\/"/);
  }
  assert.match(english, /Four weeks/);
  assert.match(english, /Four progressive lessons/);
  assert.match(english, /Two private 45-minute Zoom calls each week/);
  assert.match(english, /Eight calls total/);
  assert.match(english, /Workbook and online lessons/);
  assert.match(english, /WhatsApp support/);
  assert.match(english, /WhatsApp support/);
  assert.match(english, /EXPLORE FOUNDATION — £97/);
  assert.match(spanish, /Cuatro semanas/);
  assert.match(spanish, /Ocho llamadas en total/);
});

test("homepage next-step choices preserve canonical destinations and translated CTAs", async () => {
  const english = section(renderHome({ language: "en" }), "next-step");
  const spanish = section(renderHome({ language: "es" }), "next-step");
  assert.match(english, /I want to try this first/);
  assert.match(english, /href="\/start-free\/"[^>]*>START YOUR 7 DAYS<\/a>/);
  assert.match(english, /I want personal guidance/);
  assert.match(english, /href="https:\/\/calendly\.com\/tariq-unleashyourpowerwithtariq"[^>]*target="_blank"[^>]*rel="noopener noreferrer"[^>]*>BOOK A FREE CALL<\/a>/);
  assert.match(english, /I am ready for structured support/);
  assert.match(english, /href="\/foundation\/"[^>]*>EXPLORE FOUNDATION<\/a>/);
  assert.match(spanish, /Quiero probar esto primero/);
  assert.match(spanish, /EMPIEZA TUS 7 DÍAS/);
  assert.match(spanish, /Quiero orientación personal/);
  assert.match(spanish, /RESERVAR UNA LLAMADA GRATUITA/);
  assert.match(spanish, /Estoy preparado para un apoyo estructurado/);
  assert.match(spanish, /EXPLORA FOUNDATION/);
  const css = await readFile("assets/platform.css", "utf8");
  assert.match(css, /\.homeNext__choices\{[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(css, /\.homeNext__choices\{[^}]*grid-template-columns:minmax\(0,1fr\)\}/);
  assert.match(css, /\.homeNext__choice \.button--secondary,[^\n]+:visited,[^\n]+:hover,[^\n]+:focus,[^\n]+:active\{color:var\(--cream\)\}/);
});
