import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { hasTranslation, t } from "../content/translations.mjs";
import { routeRenderers } from "../src/routes.mjs";
import { aiMentorChapters, mentorProfiles, purposes } from "../src/pages/ai-mentors.mjs";
import { CONCISE_RESPONSE_INSTRUCTION, buildAiMentorPrompt } from "../assets/ai-mentors.mjs";

function mentorPage() {
  return routeRenderers[siteData.routes.aiMentors](siteData).body;
}

test("AI Mentor page offers three independent study guides, 24 chapters and three prompt purposes", () => {
  const html = mentorPage();

  for (const name of ["Charles Haanel Study Mentor", "Helmar Rudolph Study Mentor", "Tariq Coaching Mentor"]) assert.match(html, new RegExp(name));
  assert.equal((html.match(/<option value="(?:[1-9]|1[0-9]|2[0-4])"/g) ?? []).length, 24);
  assert.match(html, /<label[^>]+for="ai-mentor-chapter-select"[^>]*>Choose a chapter<\/label>/);
  assert.doesNotMatch(html, /data-ai-mentor-chapter="/);
  for (const purpose of ["Understand this chapter", "Apply it to my life", "Prepare for the weekly exercise"]) assert.match(html, new RegExp(purpose));
  assert.match(html, /data-ai-mentor-prompt/);
  assert.match(html, /COPY PROMPT/);
  assert.match(html, /href="https:\/\/chatgpt\.com\/" target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /does not store your conversations/);
  assert.match(html, /independent study aid/);
  assert.match(html, /not created, approved or endorsed by Charles F\. Haanel, Helmar Rudolph or Tariq Saddique/);
});

test("AI Mentor page renders an accessible on-page conversation shell with the prompt fallback intact", () => {
  const html = mentorPage();

  assert.match(html, /CHOOSE YOUR PERSPECTIVE/);
  assert.match(html, /Haanel Perspective/);
  assert.match(html, /Helmar Perspective/);
  assert.match(html, /Tariq Coaching Perspective/);
  assert.match(html, /CHOOSE YOUR CHAPTER/);
  assert.match(html, /<select[^>]+id="ai-mentor-chapter-select"[^>]+data-ai-mentor-chapter-select/);
  assert.match(html, /data-ai-mentor-selected-chapter/);
  assert.match(html, /data-ai-mentor-messages/);
  assert.match(html, /data-ai-mentor-welcome/);
  assert.match(html, /data-ai-mentor-status[^>]*role="status"[^>]*aria-live="polite"/);
  assert.match(html, /data-ai-mentor-error[^>]*role="alert"/);
  assert.match(html, /data-ai-mentor-form/);
  assert.match(html, /data-ai-mentor-question/);
  assert.match(html, /data-ai-mentor-send/);
  assert.match(html, /data-ai-mentor-new-conversation/);
  assert.equal((html.match(/data-ai-mentor-starter/g) ?? []).length, 6);
  assert.match(html, /AI-generated study guidance based on the selected perspective\. It is not the person themselves\./);
  assert.match(html, /data-i18n="aiMentor\.chat\.send"/);
  assert.match(html, /data-i18n="aiMentor\.chat\.disclosure"/);
  assert.match(html, /<details class="aiMentorFallback"/);
  assert.match(html, /data-ai-mentor-copy/);
  assert.match(html, /href="https:\/\/chatgpt\.com\/" target="_blank" rel="noopener noreferrer"/);
});

test("AI Mentor page offers the free journey and canonical Foundation next steps", () => {
  const html = mentorPage();
  assert.match(html, /href="\/start-free\/"[^>]*data-i18n="aiMentor\.cta\.start"/);
  assert.match(html, /href="\/foundation\/"[^>]*data-i18n="aiMentor\.cta\.foundation"/);
});

test("AI Mentor Foundation CTA keeps white text in every interaction state", () => {
  const html = mentorPage();
  const css = readFileSync(new URL("../assets/platform.css", import.meta.url), "utf8");

  assert.match(html, /<a class="aiMentorHero__quietCta"[^>]*data-i18n="aiMentor\.cta\.foundation">Explore Foundation<\/a>/);
  assert.match(css, /\.aiMentorHero__quietCta(?:,|\s)/);
  assert.match(css, /\.aiMentorHero__quietCta[^{]*\{[^}]*color:\s*#ffffff\s*!important;[^}]*-webkit-text-fill-color:\s*#ffffff\s*!important;/s);
  for (const state of ["visited", "hover", "focus", "focus-visible", "active"]) {
    assert.match(css, new RegExp(`\\.aiMentorHero__quietCta:${state}[^\\{]*\\{[^}]*color:\\s*#ffffff\\s*!important;[^}]*-webkit-text-fill-color:\\s*#ffffff\\s*!important;`, "s"));
  }
});

test("AI Mentor closing free-journey CTA keeps white text in every interaction state", () => {
  const html = mentorPage();
  const css = readFileSync(new URL("../assets/platform.css", import.meta.url), "utf8");

  assert.match(html, /<section class="aiMentorClosing"[\s\S]*?<a class="button--secondary" href="\/start-free\/"[^>]*data-i18n="aiMentor\.cta\.start">START THE FREE 7 DAYS<\/a>/);
  assert.match(css, /\.aiMentorClosing a\.button--secondary(?:,|\s)/);
  assert.match(css, /\.aiMentorClosing a\.button--secondary[^{]*\{[^}]*color:\s*#ffffff\s*!important;[^}]*-webkit-text-fill-color:\s*#ffffff\s*!important;/s);
  for (const state of ["visited", "hover", "focus", "focus-visible", "active"]) {
    assert.match(css, new RegExp(`\\.aiMentorClosing a\\.button--secondary:${state}[^\\{]*\\{[^}]*color:\\s*#ffffff\\s*!important;[^}]*-webkit-text-fill-color:\\s*#ffffff\\s*!important;`, "s"));
  }
  assert.match(css, /\.aiMentorClosing a\.button--secondary[^}]*\*[^}]*color:\s*#ffffff\s*!important;[^}]*-webkit-text-fill-color:\s*#ffffff\s*!important;/s);
});

test("AI Mentor page does not use a self-referential Explore AI Learning CTA", () => {
  const html = mentorPage();
  assert.doesNotMatch(html, /data-i18n="aiMentor\.closing\.explore"/);
  assert.match(html, /href="\/start-free\/"[^>]*data-i18n="aiMentor\.cta\.start"/);
  assert.match(html, /href="\/foundation\/"[^>]*data-i18n="aiMentor\.cta\.foundation"/);
});

test("AI Mentor page presents the approved companion journey without changing the study shell", () => {
  const html = mentorPage();

  assert.match(html, /Understand the Master Key System, one part at a time\./);
  assert.match(html, /Ask questions in plain English, explore all 24 parts and turn difficult ideas into practical study, reflection and action\./);
  assert.match(html, /Be among the first to study the complete Master Key System with a dedicated AI companion built for this journey\./);
  assert.match(html, /href="#ai-mentor-builder"[^>]*data-i18n="aiMentor\.cta\.companion"/);
  assert.match(html, /id="ai-mentor-builder"/);
  assert.match(html, /NOT ANOTHER GENERIC CHATBOT/);
  assert.match(html, /Built to help you understand, practise and keep going\./);
  for (const label of ["MAKE IT SIMPLE", "MAKE IT PERSONAL", "MAKE IT PRACTICAL"]) assert.match(html, new RegExp(label));
  assert.match(html, /Be early to this way of studying\./);
  assert.doesNotMatch(html, /ONE COMPANION ACROSS ALL 24 PARTS\./);
  assert.doesNotMatch(html, /data-ai-mentor-map-week=/);
  assert.match(html, /data-ai-mentor-selected-chapter[^>]*role="status"[^>]*aria-live="polite"/);
});

test("AI Mentor chat shell supplies complete English and Spanish UI translations", () => {
  const keys = [
    "aiMentor.hero.title",
    "aiMentor.hero.intro",
    "aiMentor.hero.earlyAdopter",
    "aiMentor.cta.companion",
    "aiMentor.value.eyebrow",
    "aiMentor.value.title",
    "aiMentor.value.intro",
    "aiMentor.value.simple",
    "aiMentor.value.personal",
    "aiMentor.value.practical",
    "aiMentor.closing.title",
    "aiMentor.closing.intro",
    "aiMentor.closing.explore",
    "aiMentor.chat.eyebrow",
    "aiMentor.chat.title",
    "aiMentor.perspective.heading",
    "aiMentor.chapter.heading",
    "aiMentor.chapter.label",
    "aiMentor.chat.newConversation",
    "aiMentor.chat.welcome",
    "aiMentor.chat.ready",
    "aiMentor.chat.starters",
    "aiMentor.chat.starter.explain",
    "aiMentor.chat.starter.centralIdea",
    "aiMentor.chat.starter.apply",
    "aiMentor.chat.starter.reflection",
    "aiMentor.chat.starter.exercise",
    "aiMentor.chat.starter.focus",
    "aiMentor.chat.questionLabel",
    "aiMentor.chat.questionPlaceholder",
    "aiMentor.chat.send",
    "aiMentor.chat.disclosure",
    "aiMentor.fallback.summary",
    "aiMentor.fallback.purpose",
    "aiMentor.fallback.title",
  ];

  for (const key of keys) {
    assert.equal(hasTranslation(key), true, `${key} needs both language values`);
    assert.notEqual(t(key, "en"), key);
    assert.notEqual(t(key, "es"), key);
  }
  assert.equal(t("aiMentor.chat.send", "es"), "ENVIAR");
  assert.equal(t("aiMentor.chat.disclosure", "es"), "Orientación de estudio generada por IA basada en la perspectiva seleccionada. No es la persona en sí.");
});

test("AI Mentor page uses approved Week 1 and Week 24 study content without impersonation", () => {
  const html = mentorPage();

  assert.match(html, /One Consciousness - One Power/);
  assert.match(html, /The Truth shall set you free/);
  assert.match(html, /Do not impersonate Charles F\. Haanel, Helmar Rudolph or Tariq Saddique/);
  assert.match(html, /You are a study guide, not Charles F\. Haanel, Helmar Rudolph or Tariq Saddique/);
});

test("AI Mentor client code produces selected prompts, copy feedback and safe ChatGPT launch", () => {
  const client = readFileSync(new URL("../assets/ai-mentors.mjs", import.meta.url), "utf8");

  assert.match(client, /data-ai-mentor-chapter-select/);
  assert.match(client, /data-ai-mentor-purpose/);
  assert.match(client, /data-ai-mentor-prompt/);
  assert.match(client, /Prompt copied\./);
  assert.match(client, /buildAiMentorPrompt/);
});

test("AI Mentor client sends only selected study context and offers a safe on-page fallback", () => {
  const client = readFileSync(new URL("../assets/ai-mentors.mjs", import.meta.url), "utf8");
  const css = readFileSync(new URL("../assets/platform.css", import.meta.url), "utf8");

  assert.match(client, /const HISTORY_LIMIT = 12/);
  assert.match(client, /meta\[name="ai-mentor-endpoint"\]/);
  assert.match(client, /endpointElement\?\.content \|\| "\/api\/mentor"/);
  assert.match(client, /mentorId: backendMentorId\(current\.mentor\.id\)/);
  assert.match(client, /chapter: current\.chapter\.week/);
  assert.match(client, /messages: state\.history\.slice\(-HISTORY_LIMIT\)/);
  assert.match(client, /Content-Type": "application\/json/);
  assert.match(client, /data-ai-mentor-starter/);
  assert.match(client, /data-ai-mentor-new-conversation/);
  assert.match(client, /event\.key === "Enter" && !event\.shiftKey/);
  assert.match(client, /text\.textContent = content/);
  assert.match(client, /AI mentor is unavailable right now\. You can still copy the complete prompt or open ChatGPT\./);
  assert.doesNotMatch(client, /(?:model|system(?:Prompt)?)\s*:/);
  assert.match(css, /\.aiMentorChat\s*\{/);
  assert.match(css, /\.aiMentorMessage p\s*\{[^}]*overflow-wrap:\s*anywhere/s);
  assert.match(css, /@media \(max-width: 640px\)[\s\S]*?\.aiMentorQuestion\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/s);
});

test("AI Mentor client maps the established Helmar ID and discards replies after a context reset", async () => {
  const clientModule = await import("../assets/ai-mentors.mjs");
  const client = readFileSync(new URL("../assets/ai-mentors.mjs", import.meta.url), "utf8");

  assert.equal(typeof clientModule.backendMentorId, "function");
  assert.equal(clientModule.backendMentorId("helmar"), "rudolph");
  assert.equal(clientModule.backendMentorId("haanel"), "haanel");
  assert.match(client, /requestVersion/);
  assert.match(client, /const requestVersion = state\.requestVersion/);
  assert.match(client, /if \(requestVersion !== state\.requestVersion\) return/);
  assert.match(client, /state\.requestVersion \+= 1/);
  assert.match(client, /data-ai-mentor-purpose[^\n]+render\(\{ reset: true \}\)/);
});

test("AI Mentor prompt generator supports every mentor, chapter and purpose", () => {
  for (const mentor of mentorProfiles) {
    for (const purpose of purposes) {
      for (const chapter of aiMentorChapters) {
        const prompt = buildAiMentorPrompt({ mentor, purpose, chapter });
        assert.match(prompt, new RegExp(`Week ${chapter.week}: ${chapter.title.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}`));
        assert.match(prompt, new RegExp(mentor.name));
        assert.match(prompt, new RegExp(purpose.label));
        assert.match(prompt, new RegExp(chapter.exercise.slice(0, 28).replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")));
        assert.match(prompt, /Respond in approximately 150–250 words/);
        assert.match(prompt, /external ChatGPT account; the website cannot technically enforce the word count/);
      }
    }
  }
});

test("copied prompt exposes the concise-response target without changing chapter or language hooks", () => {
  assert.equal(CONCISE_RESPONSE_INSTRUCTION, "Respond in approximately 150–250 words. Use short paragraphs or concise bullets. Answer directly, avoid repetition and end with one practical reflection or action.");
  const html = mentorPage();
  assert.match(html, /data-ai-mentor-chapter-select/);
  assert.match(html, /data-i18n="aiMentor\.chat\.disclosure"/);
});

test("AI Mentor presentation uses accessible contrast and responsive chapter grids", () => {
  const css = readFileSync(new URL("../assets/platform.css", import.meta.url), "utf8");

  assert.match(css, /\.aiMentorPage\s*\{[^}]*background:\s*var\(--cream-deep\)/s);
  assert.match(css, /\.aiMentorPrompt\s*\{[^}]*background:\s*var\(--night\)/s);
  assert.match(css, /\.aiMentorPrompt pre\s*\{[^}]*color:\s*var\(--cream\)/s);
  assert.match(css, /\.aiMentorChapterSelect\s*\{/);
  assert.match(css, /\.aiMentorChapterSelect:focus-visible\s*\{/);
  assert.match(css, /\.aiMentorHero__layout\s*\{/);
  assert.doesNotMatch(css, /\.aiMentorChapterMap\s*\{/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.aiMentorPage/s);
});

test("Resources and the Master Key page link directly to the AI Mentor experience", () => {
  const resources = routeRenderers[siteData.routes.resources](siteData).body;
  const curriculum = routeRenderers[siteData.routes.masterKeySystem](siteData).body;

  assert.match(resources, /href="\/ai-mentors\/"/);
  assert.doesNotMatch(curriculum, /href="\/ai-mentors\/"/);
});
