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
  if (chapter.week !== 1) return "";
  const options = aiMentorChapters.map((option) => `<option value="${option.week}">Week ${option.week} · ${escapeHtml(option.title)}</option>`).join("");
  return `<label class="aiMentorChapterLabel" for="ai-mentor-chapter-select" data-i18n="aiMentor.chapter.label">Choose a chapter</label><select class="aiMentorChapterSelect" id="ai-mentor-chapter-select" data-ai-mentor-chapter-select aria-describedby="ai-mentor-selected-chapter">${options}</select>`;
}

function purposeChoice(purpose, active) {
  return `<button class="aiMentorPurpose" type="button" data-ai-mentor-purpose="${purpose.id}" aria-pressed="${active}">${escapeHtml(purpose.label)}</button>`;
}

function companionVisual() {
  const nodes = aiMentorChapters.map((chapter) => {
    const angle = chapter.week * 1.7;
    const x = Math.round(Math.cos(angle) * 38);
    const y = Math.round(Math.sin(angle) * 38);
    const size = 0.2 + (chapter.week % 4) * 0.08;
    return `<span class="aiMentorConstellation__node" style="--node-x:${x};--node-y:${y};--node-size:${size}rem" title="Week ${chapter.week}: ${escapeHtml(chapter.title)}"></span>`;
  }).join("");
  return `<div class="aiMentorHero__visual" aria-hidden="true"><div class="aiMentorOrbital aiMentorOrbital--one"></div><div class="aiMentorOrbital aiMentorOrbital--two"></div><div class="aiMentorKeyMark"><span class="aiMentorKeyMark__ring"></span><span class="aiMentorKeyMark__stem"></span><span class="aiMentorKeyMark__tooth aiMentorKeyMark__tooth--one"></span><span class="aiMentorKeyMark__tooth aiMentorKeyMark__tooth--two"></span></div><div class="aiMentorConstellation">${nodes}</div><div class="aiMentorStudyCard"><p class="eyebrow">STUDY COMPANION</p><strong>WEEK 01 · FOUNDATION</strong><span>Ask, reflect, practise.</span></div><div class="aiMentorPromptChips"><span>Explain this simply</span><span>How can I apply this?</span><span>Give me a reflection</span></div></div>`;
}

export function aiMentorsPage(data = canonicalSiteData, language = "en") {
  const initialMentor = mentorProfiles[0];
  const initialPurpose = purposes[0];
  const initialChapter = aiMentorChapters[0];
  const initialPrompt = promptFor({ mentor: initialMentor, purpose: initialPurpose, chapter: initialChapter });
  const clientData = safeJson({ mentors: mentorProfiles, purposes, chapters: aiMentorChapters });

  const page = {
    route: data.routes.aiMentors,
    language,
    title: t("route.aiMentors.metaTitle", language),
    description: t("route.aiMentors.metaDescription", language),
    titleKey: "route.aiMentors.metaTitle",
    descriptionKey: "route.aiMentors.metaDescription",
    body: `<main class="aiMentorPage" id="main-content" data-ai-mentor-language="${escapeHtml(language)}"><section class="aiMentorHero"><div class="aiMentorHero__layout"><div class="aiMentorHero__copy"><p class="eyebrow" data-i18n="aiMentor.hero.eyebrow">YOUR DEDICATED AI STUDY COMPANION</p><h1 data-i18n="aiMentor.hero.title">Understand the Master Key System, one part at a time.</h1><p class="aiMentorHero__intro" data-i18n="aiMentor.hero.intro">Ask questions in plain English, explore all 24 parts and turn difficult ideas into practical study, reflection and action.</p><p class="aiMentorHero__early" data-i18n="aiMentor.hero.earlyAdopter">Be among the first to study the complete Master Key System with a dedicated AI companion built for this journey.</p><div class="aiMentorHero__actions"><a class="button--primary" href="#ai-mentor-builder" data-i18n="aiMentor.cta.companion">TRY THE AI COMPANION</a><a class="button--secondary" href="${data.routes.startFree}" data-i18n="aiMentor.cta.start">START THE FREE 7-DAY JOURNEY</a><a class="aiMentorHero__quietCta" href="${data.routes.foundation}" data-i18n="aiMentor.cta.foundation">Explore Foundation</a></div></div>${companionVisual()}</div></section><section class="aiMentorValue" aria-labelledby="ai-mentor-value-title"><p class="eyebrow" data-i18n="aiMentor.value.eyebrow">NOT ANOTHER GENERIC CHATBOT</p><h2 id="ai-mentor-value-title" data-i18n="aiMentor.value.title">Built to help you understand, practise and keep going.</h2><p data-i18n="aiMentor.value.intro">This companion is designed around the way the Master Key System is actually studied: one part at a time, with room to ask questions, reflect honestly and return to the practice.</p><div class="aiMentorValue__grid"><article><h3 data-i18n="aiMentor.value.simple">MAKE IT SIMPLE</h3><p data-i18n="aiMentor.value.simpleBody">Ask for a plain-English explanation without losing the depth of the original lesson.</p></article><article><h3 data-i18n="aiMentor.value.personal">MAKE IT PERSONAL</h3><p data-i18n="aiMentor.value.personalBody">Explore how each idea connects with your thoughts, habits, choices and daily circumstances.</p></article><article><h3 data-i18n="aiMentor.value.practical">MAKE IT PRACTICAL</h3><p data-i18n="aiMentor.value.practicalBody">Move from understanding the words to preparing for the weekly practice and applying what you learn.</p></article></div></section><section class="aiMentorBuilder" id="ai-mentor-builder" aria-labelledby="ai-mentor-builder-title"><div class="aiMentorBuilder__heading"><p class="eyebrow" data-i18n="aiMentor.chat.eyebrow">STUDY CONVERSATION</p><h2 id="ai-mentor-builder-title" data-i18n="aiMentor.chat.title">A guided way to go deeper</h2></div><section class="aiMentorControl" aria-labelledby="ai-mentor-guide-title"><h3 id="ai-mentor-guide-title" data-i18n="aiMentor.perspective.heading">CHOOSE YOUR PERSPECTIVE</h3><div class="aiMentorOptionGrid">${mentorProfiles.map((mentor, index) => mentorChoice(mentor, index === 0)).join("")}</div></section><section class="aiMentorControl" aria-labelledby="ai-mentor-chapter-title"><h3 id="ai-mentor-chapter-title" data-i18n="aiMentor.chapter.heading">CHOOSE YOUR CHAPTER</h3><p class="aiMentorSelectedChapter" data-ai-mentor-selected-chapter role="status" aria-live="polite">Week 1 · One Consciousness - One Power · FOUNDATION</p><div class="aiMentorChapters" aria-label="Choose a chapter from 1 to 24" data-i18n-aria-label="aiMentor.chapter.label">${aiMentorChapters.map(chapterChoice).join("")}</div></section><section class="aiMentorChat" aria-labelledby="ai-mentor-chat-title"><div class="aiMentorChat__heading"><p class="eyebrow" data-i18n="aiMentor.chat.eyebrow">STUDY CONVERSATION</p><h3 id="ai-mentor-chat-title" data-i18n="aiMentor.chat.title">Talk through this chapter</h3><button class="button--text" type="button" data-ai-mentor-new-conversation data-i18n="aiMentor.chat.newConversation">NEW CONVERSATION</button></div><div class="aiMentorMessages" data-ai-mentor-messages role="log" aria-live="polite" aria-relevant="additions"><article class="aiMentorMessage aiMentorMessage--welcome" data-ai-mentor-welcome><p data-i18n="aiMentor.chat.welcome">Welcome. I am here to help you study the selected chapter with care, clarity and practical reflection.</p></article></div><p class="aiMentorChat__status" data-ai-mentor-status role="status" aria-live="polite" data-i18n="aiMentor.chat.ready">Choose a starter question or write your own.</p><p class="aiMentorChat__error" data-ai-mentor-error role="alert" hidden></p><div class="aiMentorStarters" aria-label="Starter questions" data-i18n-aria-label="aiMentor.chat.starters"><button type="button" data-ai-mentor-starter="Explain this chapter simply" data-i18n="aiMentor.chat.starter.explain">Explain this chapter simply</button><button type="button" data-ai-mentor-starter="What is the central idea?" data-i18n="aiMentor.chat.starter.centralIdea">What is the central idea?</button><button type="button" data-ai-mentor-starter="How can I apply this today?" data-i18n="aiMentor.chat.starter.apply">How can I apply this today?</button><button type="button" data-ai-mentor-starter="Give me a reflection question" data-i18n="aiMentor.chat.starter.reflection">Give me a reflection question</button><button type="button" data-ai-mentor-starter="Help me with this week&#39;s exercise" data-i18n="aiMentor.chat.starter.exercise">Help me with this week&#39;s exercise</button><button type="button" data-ai-i-mentor-starter="What should I focus on this week?" data-i18n="aiMentor.chat.starter.focus">What should I focus on this week?</button></div><form class="aiMentorQuestion" data-ai-mentor-form><label for="ai-mentor-question" data-i18n="aiMentor.chat.questionLabel">Your question</label><textarea id="ai-mentor-question" name="question" rows="3" required data-ai-mentor-question data-i18n-placeholder="aiMentor.chat.questionPlaceholder" placeholder="Ask about this chapter"></textarea><button class="button--primary" type="submit" data-ai-mentor-send data-i18n="aiMentor.chat.send">SEND</button></form><p class="aiMentorChat__disclosure" data-i18n="aiMentor.chat.disclosure">AI-generated study guidance based on the selected perspective. It is not the person themselves.</p></section><details class="aiMentorFallback"><summary data-i18n="aiMentor.fallback.summary">Prefer to use your own ChatGPT account?</summary><section class="aiMentorControl" aria-labelledby="ai-mentor-purpose-title"><h3 id="ai-mentor-purpose-title" data-i18n="aiMentor.fallback.purpose">Choose your purpose</h3><div class="aiMentorPurposeGrid">${purposes.map((purpose, index) => purposeChoice(purpose, index === 0)).join("")}</div></section><section class="aiMentorPrompt" aria-labelledby="ai-mentor-prompt-title"><div class="aiMentorPrompt__heading"><p class="eyebrow">YOUR COMPLETE PROMPT</p><h3 id="ai-mentor-prompt-title" data-i18n="aiMentor.fallback.title">Ready for your ChatGPT study session</h3></div><pre data-ai-mentor-prompt>${escapeHtml(initialPrompt)}</pre><div class="aiMentorPrompt__actions"><button class="button--primary" type="button" data-ai-mentor-copy>COPY PROMPT</button><a class="button--secondary" href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">OPEN CHATGPT <span aria-hidden="true">↗</span></a><span class="aiMentorCopyFeedback" data-ai-mentor-copy-status role="status" aria-live="polite"></span></div><p class="aiMentorPrompt__notice">Use your own ChatGPT account. Unleash Your Power does not store your conversations. This independent study aid is not created, approved or endorsed by Charles F. Haanel, Helmar Rudolph or Tariq Saddique.</p></section></details></section><section class="aiMentorClosing" aria-labelledby="ai-mentor-closing-title"><h2 id="ai-mentor-closing-title" data-i18n="aiMentor.closing.title">Be early to this way of studying.</h2><p data-i18n="aiMentor.closing.intro">Study the complete Master Key System with a dedicated companion designed to help you understand the ideas, practise the exercises and keep moving forward.</p><div class="aiMentorHero__actions"><a class="button--primary" href="${data.routes.aiMentors}" data-i18n="aiMentor.closing.explore">EXPLORE AI LEARNING</a><a class="button--secondary" href="${data.routes.startFree}" data-i18n="aiMentor.cta.start">START THE FREE 7 DAYS</a><a class="aiMentorHero__quietCta" href="${data.routes.foundation}" data-i18n="aiMentor.cta.foundation">Explore Foundation</a></div></section><script type="application/json" id="ai-mentor-data">${clientData}</script></main>`,
    scripts: ["/assets/ai-mentors.mjs"],
  };
  page.body = page.body.replaceAll("data-ai-i-mentor-starter", "data-ai-mentor-starter");
  return page;
}
