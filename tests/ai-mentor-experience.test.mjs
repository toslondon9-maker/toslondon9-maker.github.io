import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { routeRenderers } from "../src/routes.mjs";
import { aiMentorChapters, mentorProfiles, purposes } from "../src/pages/ai-mentors.mjs";
import { buildAiMentorPrompt } from "../assets/ai-mentors.mjs";

function mentorPage() {
  return routeRenderers[siteData.routes.aiMentors](siteData).body;
}

test("AI Mentor page offers three independent study guides, 24 chapters and three prompt purposes", () => {
  const html = mentorPage();

  for (const name of ["Charles Haanel Study Mentor", "Helmar Rudolph Study Mentor", "Tariq Coaching Mentor"]) assert.match(html, new RegExp(name));
  assert.equal((html.match(/data-ai-mentor-chapter/g) ?? []).length, 24);
  for (const purpose of ["Understand this chapter", "Apply it to my life", "Prepare for the weekly exercise"]) assert.match(html, new RegExp(purpose));
  assert.match(html, /data-ai-mentor-prompt/);
  assert.match(html, /COPY PROMPT/);
  assert.match(html, /href="https:\/\/chatgpt\.com\/" target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /does not store your conversations/);
  assert.match(html, /independent study aid/);
  assert.match(html, /not created, approved or endorsed by Charles F\. Haanel, Helmar Rudolph or Tariq Saddique/);
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

  assert.match(client, /data-ai-mentor-chapter/);
  assert.match(client, /data-ai-mentor-purpose/);
  assert.match(client, /data-ai-mentor-prompt/);
  assert.match(client, /Prompt copied\./);
  assert.match(client, /buildAiMentorPrompt/);
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
      }
    }
  }
});

test("AI Mentor presentation uses accessible contrast and responsive chapter grids", () => {
  const css = readFileSync(new URL("../assets/platform.css", import.meta.url), "utf8");

  assert.match(css, /\.aiMentorPage\s*\{[^}]*background:\s*var\(--cream-deep\)/s);
  assert.match(css, /\.aiMentorPrompt\s*\{[^}]*background:\s*var\(--night\)/s);
  assert.match(css, /\.aiMentorPrompt pre\s*\{[^}]*color:\s*var\(--cream\)/s);
  assert.match(css, /\.aiMentorChapters\s*\{[^}]*grid-template-columns:\s*repeat\(8, minmax\(0, 1fr\)\)/s);
  assert.match(css, /@media \(max-width: 640px\)[\s\S]*?\.aiMentorChapters\s*\{[^}]*grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\)/s);
});

test("Resources and the Master Key page link directly to the AI Mentor experience", () => {
  const resources = routeRenderers[siteData.routes.resources](siteData).body;
  const curriculum = routeRenderers[siteData.routes.masterKeySystem](siteData).body;

  assert.match(resources, /href="\/ai-mentors\/"/);
  assert.match(curriculum, /href="\/ai-mentors\/"/);
});
