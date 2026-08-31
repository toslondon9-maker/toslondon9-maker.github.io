import { readFileSync } from "node:fs";
import { siteData as canonicalSiteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";

const curriculum = readFileSync(new URL("../../content/master-key-curriculum.html", import.meta.url), "utf8").trim();
const chapterGridOpening = '<div class="chapterGrid">';
const chapterGridStart = curriculum.indexOf(chapterGridOpening);
const chapterGridEnd = curriculum.indexOf('</div><p class="sourceNote">', chapterGridStart);

const mentorProfiles = Object.freeze([
  {
    id: "haanel",
    name: "Charles Haanel Study Mentor",
    description: "A focused guide for studying the chapter ideas with care and clarity.",
    instruction: "Help me study the chapter carefully. Ask thoughtful questions, clarify the central ideas and keep the discussion grounded in the supplied lesson.",
  },
  {
    id: "helmar",
    name: "Helmar Rudolph Study Mentor",
    description: "A modern study-and-application guide for working through the material.",
    instruction: "Help me turn the supplied lesson into a practical study plan. Keep the guidance independent and do not imply Helmar Rudolph created, approved or endorsed this tool.",
  },
  {
    id: "tariq",
    name: "Tariq Coaching Mentor",
    description: "A supportive guide for reflection, accountability and everyday application.",
    instruction: "Help me reflect honestly, choose one practical next step and create a gentle accountability plan based only on the supplied lesson.",
  },
]);

const purposes = Object.freeze([
  { id: "understand", label: "Understand this chapter", instruction: "Explain the key principle in clear language, then guide me through it with one thoughtful question at a time." },
  { id: "apply", label: "Apply it to my life", instruction: "Help me connect this chapter to one real situation in my life without making promises or unsupported claims." },
  { id: "exercise", label: "Prepare for the weekly exercise", instruction: "Help me prepare to do the original weekly exercise faithfully, safely and consistently." },
]);

const phases = Object.freeze([
  { title: "FOUNDATION", start: 1, end: 4 },
  { title: "VISUALISATION", start: 5, end: 11 },
  { title: "CONCENTRATION", start: 12, end: 18 },
  { title: "CONTEMPLATION & MASTERY", start: 19, end: 24 },
]);

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function plainText(value) {
  return decodeHtml(value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim());
}

function textBelowHeading(fragment, heading) {
  const match = fragment.match(new RegExp(`<h3>${heading}</h3><p>([\\s\\S]*?)</p>`));
  if (!match) throw new Error(`Could not find ${heading} in Master Key curriculum source.`);
  return plainText(match[1]);
}

function phaseFor(week) {
  return phases.find((phase) => week >= phase.start && week <= phase.end)?.title ?? "MASTER KEY STUDY";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function safeJson(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c").replaceAll(">", "\\u003e").replaceAll("&", "\\u0026");
}

function extractChapters() {
  if (chapterGridStart < 0 || chapterGridEnd < 0) throw new Error("Master Key curriculum chapters could not be located.");
  const source = curriculum.slice(chapterGridStart + chapterGridOpening.length, chapterGridEnd);
  const fragments = source.split("</details><details>");
  if (fragments.length !== 24) throw new Error("Expected exactly 24 Master Key curriculum chapters.");

  return Object.freeze(fragments.map((fragment, index) => {
    const title = fragment.match(/<strong>([\s\S]*?)<\/strong>/)?.[1];
    if (!title) throw new Error(`Could not find title for Week ${index + 1}.`);
    return Object.freeze({
      week: index + 1,
      title: plainText(title),
      phase: phaseFor(index + 1),
      introduction: textBelowHeading(fragment, "Introduction"),
      teaching: textBelowHeading(fragment, "Content"),
      exercise: textBelowHeading(fragment, "Exercise"),
    });
  }));
}

export const aiMentorChapters = extractChapters();
export { mentorProfiles, purposes };

function promptFor({ mentor, purpose, chapter }) {
  return `You are a study guide, not Charles F. Haanel, Helmar Rudolph or Tariq Saddique. Do not impersonate Charles F. Haanel, Helmar Rudolph or Tariq Saddique, and do not claim endorsement or affiliation.\n\nSTUDY GUIDE\n${mentor.name}\n${mentor.instruction}\n\nPURPOSE\n${purpose.label}\n${purpose.instruction}\n\nAPPROVED STUDY MATERIAL\nWeek ${chapter.week}: ${chapter.title}\nProgramme stage: ${chapter.phase}\n\nIntroduction: ${chapter.introduction}\n\nCore teaching: ${chapter.teaching}\n\nWeekly exercise: ${chapter.exercise}\n\nGUIDANCE\nUse only the supplied material. Help me think, reflect and apply it responsibly; do not promise outcomes, invent facts or replace professional advice. Begin by asking me one thoughtful question.`;
}

function mentorChoice(mentor, active) {
  const perspective = {
    haanel: "Haanel Perspective",
    helmar: "Helmar Perspective",
    tariq: "Tariq Coaching Perspective",
  }[mentor.id];
  return `<button class="aiMentorChoice" type="button" data-ai-mentor-id="${mentor.id}" aria-pressed="${active}"><strong>${perspective}</strong><span>${escapeHtml(mentor.description)}</span></button>`;
}

function chapterChoice(chapter) {
  return `<button type="button" data-ai-mentor-chapter="${chapter.week}" aria-pressed="${chapter.week === 1 ? "true" : "false"}" aria-label="Select Week ${chapter.week}: ${escapeHtml(chapter.title)}">${String(chapter.week).padStart(2, "0")}</button>`;
}

function purposeChoice(purpose, active) {
  return `<button class="aiMentorPurpose" type="button" data-ai-mentor-purpose="${purpose.id}" aria-pressed="${active}">${escapeHtml(purpose.label)}</button>`;
}

export function aiMentorsPage(data = canonicalSiteData, language = "en") {
  const initialMentor = mentorProfiles[0];
  const initialPurpose = purposes[0];
  const initialChapter = aiMentorChapters[0];
  const initialPrompt = promptFor({ mentor: initialMentor, purpose: initialPurpose, chapter: initialChapter });
  const clientData = safeJson({ mentors: mentorProfiles, purposes, chapters: aiMentorChapters });

  return {
    route: data.routes.aiMentors,
    language,
    title: t("route.aiMentors.metaTitle", language),
    description: t("route.aiMentors.metaDescription", language),
    titleKey: "route.aiMentors.metaTitle",
    descriptionKey: "route.aiMentors.metaDescription",
    body: `<main class="aiMentorPage" id="main-content" data-ai-mentor-language="${escapeHtml(language)}"><section class="aiMentorHero"><p class="eyebrow">AI MENTOR</p><h1 data-i18n="aiMentor.hero.title">Your Master Key Study Companion</h1><p data-i18n="aiMentor.hero.intro">Choose a perspective and chapter, then explore the lesson in a thoughtful conversation without leaving Unleash Your Power.</p></section><section class="aiMentorBuilder" aria-labelledby="ai-mentor-builder-title"><div class="aiMentorBuilder__heading"><p class="eyebrow" data-i18n="aiMentor.chat.eyebrow">STUDY CONVERSATION</p><h2 id="ai-mentor-builder-title" data-i18n="aiMentor.chat.title">A guided way to go deeper</h2></div><section class="aiMentorControl" aria-labelledby="ai-mentor-guide-title"><h3 id="ai-mentor-guide-title" data-i18n="aiMentor.perspective.heading">CHOOSE YOUR PERSPECTIVE</h3><div class="aiMentorOptionGrid">${mentorProfiles.map((mentor, index) => mentorChoice(mentor, index === 0)).join("")}</div></section><section class="aiMentorControl" aria-labelledby="ai-mentor-chapter-title"><h3 id="ai-mentor-chapter-title" data-i18n="aiMentor.chapter.heading">CHOOSE YOUR CHAPTER</h3><p class="aiMentorSelectedChapter" data-ai-mentor-selected-chapter>Week 1 · One Consciousness - One Power · FOUNDATION</p><div class="aiMentorChapters" aria-label="Choose a chapter from 1 to 24" data-i18n-aria-label="aiMentor.chapter.label">${aiMentorChapters.map(chapterChoice).join("")}</div></section><section class="aiMentorChat" aria-labelledby="ai-mentor-chat-title"><div class="aiMentorChat__heading"><p class="eyebrow" data-i18n="aiMentor.chat.eyebrow">STUDY CONVERSATION</p><h3 id="ai-mentor-chat-title" data-i18n="aiMentor.chat.title">Talk through this chapter</h3><button class="button--text" type="button" data-ai-mentor-new-conversation data-i18n="aiMentor.chat.newConversation">NEW CONVERSATION</button></div><div class="aiMentorMessages" data-ai-mentor-messages role="log" aria-live="polite" aria-relevant="additions"><article class="aiMentorMessage aiMentorMessage--welcome" data-ai-mentor-welcome><p data-i18n="aiMentor.chat.welcome">Welcome. I am here to help you study the selected chapter with care, clarity and practical reflection.</p></article></div><p class="aiMentorChat__status" data-ai-mentor-status role="status" aria-live="polite" data-i18n="aiMentor.chat.ready">Choose a starter question or write your own.</p><p class="aiMentorChat__error" data-ai-mentor-error role="alert" hidden></p><div class="aiMentorStarters" aria-label="Starter questions" data-i18n-aria-label="aiMentor.chat.starters"><button type="button" data-ai-mentor-starter="Explain this chapter simply" data-i18n="aiMentor.chat.starter.explain">Explain this chapter simply</button><button type="button" data-ai-mentor-starter="What is the central idea?" data-i18n="aiMentor.chat.starter.centralIdea">What is the central idea?</button><button type="button" data-ai-mentor-starter="How can I apply this today?" data-i18n="aiMentor.chat.starter.apply">How can I apply this today?</button><button type="button" data-ai-mentor-starter="Give me a reflection question" data-i18n="aiMentor.chat.starter.reflection">Give me a reflection question</button><button type="button" data-ai-mentor-starter="Help me with this week&#39;s exercise" data-i18n="aiMentor.chat.starter.exercise">Help me with this week&#39;s exercise</button><button type="button" data-ai-mentor-starter="What should I focus on this week?" data-i18n="aiMentor.chat.starter.focus">What should I focus on this week?</button></div><form class="aiMentorQuestion" data-ai-mentor-form><label for="ai-mentor-question" data-i18n="aiMentor.chat.questionLabel">Your question</label><textarea id="ai-mentor-question" name="question" rows="3" required data-ai-mentor-question data-i18n-placeholder="aiMentor.chat.questionPlaceholder" placeholder="Ask about this chapter"></textarea><button class="button--primary" type="submit" data-ai-mentor-send data-i18n="aiMentor.chat.send">SEND</button></form><p class="aiMentorChat__disclosure" data-i18n="aiMentor.chat.disclosure">AI-generated study guidance based on the selected perspective. It is not the person themselves.</p></section><details class="aiMentorFallback"><summary data-i18n="aiMentor.fallback.summary">Prefer to use your own ChatGPT account?</summary><section class="aiMentorControl" aria-labelledby="ai-mentor-purpose-title"><h3 id="ai-mentor-purpose-title" data-i18n="aiMentor.fallback.purpose">Choose your purpose</h3><div class="aiMentorPurposeGrid">${purposes.map((purpose, index) => purposeChoice(purpose, index === 0)).join("")}</div></section><section class="aiMentorPrompt" aria-labelledby="ai-mentor-prompt-title"><div class="aiMentorPrompt__heading"><p class="eyebrow">YOUR COMPLETE PROMPT</p><h3 id="ai-mentor-prompt-title" data-i18n="aiMentor.fallback.title">Ready for your ChatGPT study session</h3></div><pre data-ai-mentor-prompt>${escapeHtml(initialPrompt)}</pre><div class="aiMentorPrompt__actions"><button class="button--primary" type="button" data-ai-mentor-copy>COPY PROMPT</button><a class="button--secondary" href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">OPEN CHATGPT <span aria-hidden="true">↗</span></a><span class="aiMentorCopyFeedback" data-ai-mentor-copy-status role="status" aria-live="polite"></span></div><p class="aiMentorPrompt__notice">Use your own ChatGPT account. Unleash Your Power does not store your conversations. This independent study aid is not created, approved or endorsed by Charles F. Haanel, Helmar Rudolph or Tariq Saddique.</p></section></details></section><script type="application/json" id="ai-mentor-data">${clientData}</script></main>`,
    scripts: ["/assets/ai-mentors.mjs"],
  };
}
