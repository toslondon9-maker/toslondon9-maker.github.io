import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { renderHome } from "../src/pages/home.mjs";
import { routeRenderers } from "../src/routes.mjs";
import { renderHeader } from "../src/shared-chrome.mjs";
import { masterKeyCurriculumPage } from "../src/pages/master-key-curriculum.mjs";

test("the MKS Study Room preserves the complete 24-week curriculum", () => {
  const page = routeRenderers[siteData.routes.masterKeySystem](siteData);
  const html = page.body;
  const curriculum = html.match(/<section class="mksStudyRoom__shell" id="study-room">[\s\S]*<\/section><\/main>/)?.[0] ?? html;
  const weeks = [...curriculum.matchAll(/data-week="(\d+)"/g)].map((match) => Number(match[1]));

  assert.deepEqual(weeks, Array.from({ length: 24 }, (_, index) => index + 1));
  assert.equal((curriculum.match(/<h3>Introduction<\/h3>/g) ?? []).length, 23);
  assert.equal((curriculum.match(/<h3>Content<\/h3>/g) ?? []).length, 24);
  assert.equal((curriculum.match(/<h3>About the exercise<\/h3>/g) ?? []).length, 28);
  assert.equal((curriculum.match(/class="weeklyQA(?:\s|\")/g) ?? []).length, 24);
  assert.equal((curriculum.match(/class="aiMastery"/g) ?? []).length, 24);
  assert.equal((curriculum.match(/class="aiMasteryPrompt"/g) ?? []).length, 24);
  assert.equal((curriculum.match(/Preview of the engineered prompt/g) ?? []).length, 24);
  assert.equal((curriculum.match(/Copy prompt/g) ?? []).length, 24);
  for (const title of ["One Consciousness – One Power", "One Method of Finding the Truth", "Thoughts Become Things", "The True “Self”"]) assert.ok(curriculum.includes(title), title);
  assert.match(curriculum, /The Truth shall set you free/);
  assert.match(curriculum, /class="weekVideo"[^>]+href="https:\/\/photos\.google\.com\/share\//);
  assert.match(curriculum, /Chapter 1 - One Consciousness – One Power/);
  assert.match(curriculum, /class="mksStudyRoom__stage"[^>]*data-stage="foundation"/);
  assert.match(curriculum, /class="mksStudyRoom__stage"[^>]*data-stage="visualisation"/);
  assert.match(curriculum, /class="mksStudyRoom__stage"[^>]*data-stage="concentration"/);
  assert.match(curriculum, /class="mksStudyRoom__stage"[^>]*data-stage="integration-mastery"/);
  assert.ok(page.styles?.includes("/assets/platform.css"));

  const home = renderHome({ language: "en" });
  assert.match(home, /href="\/master-key-system\/"[^>]*>EXPLORE THE METHOD<\/a>/);

  const navigation = renderHeader({ route: "/", language: "en" });
  assert.equal((navigation.match(/href="\/master-key-system\/"[^>]*>Master Key System<\/a>/g) ?? []).length, 2);
});

test("Chapter 1 adds the rewritten study guidance without changing the original exercise", () => {
  const html = routeRenderers[siteData.routes.masterKeySystem](siteData).body;
  const chapterOne = html.match(/<details id="week-1"[\s\S]*?<details id="week-2"/)?.[0] ?? "";
  const chapterTwo = html.match(/<details id="week-2"[\s\S]*?<details id="week-3"/)?.[0] ?? "";

  assert.match(chapterOne, /<h3>About this chapter<\/h3>[\s\S]*?One Consciousness, One Power/);
  assert.match(chapterOne, /Consistency will matter\./);
  assert.match(chapterOne, /<h3>About the exercise<\/h3><p>Sit upright and comfortably in a quiet room for 15–30 minutes\. Allow thoughts to roam, but keep the body perfectly still\. Practise daily until physical stillness becomes natural\.<\/p>/);
  assert.match(chapterOne, /<details class="mksStudyRoom__chapterExerciseAbout"><summary>Read more to master this exercise<\/summary>[\s\S]*?This first exercise is your starting point/);
  assert.doesNotMatch(chapterOne, /<details class="mksStudyRoom__chapterExerciseAbout"[^>]*\sopen(?:=|\s|>)/);
  assert.ok(chapterOne.indexOf("<h3>About the exercise</h3>") < chapterOne.indexOf("Read more to master this exercise"));
});

test("Chapters 2 to 4 add only their supplied guidance and preserve their original exercises", () => {
  const html = routeRenderers[siteData.routes.masterKeySystem](siteData).body;
  const chapters = [2, 3, 4].map((week) => html.match(new RegExp(`<details id="week-${week}"[\\s\\S]*?<details id="week-${week + 1}"`))?.[0] ?? "");
  const expected = [
    ["Welcome to the second part of your study.", "This week, your practice shifts from physical stillness to becoming more aware of your thoughts.", "try the word “freedom”"],
    ["In the first two chapters, you began exploring the idea of one Consciousness", "This week, you’ll practise physical relaxation.", "The Power of Thought"],
    ["This chapter invites you to explore the idea of your true “I”", "This week, you’ll practise relaxing your mind.", "Discovering the True Self"],
  ];
  const exercises = [
    "Use the same place and posture as Week 1. Be perfectly still and gently inhibit thought. Each time care, worry or fear enters, release it and return to mental quiet.",
    "Be perfectly still and inhibit thought as far as possible. Then relax completely: let every muscle and nerve return to its natural condition until you feel quiet, restful and at peace with yourself and the world.",
    "Relax physically, then mentally let go of hatred, anger, worry, jealousy, envy, sorrow, disappointment and every adverse condition. Release them through deliberate intention and persistence.",
  ];

  chapters.forEach((chapter, index) => {
    for (const marker of expected[index]) assert.match(chapter, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(chapter, /<h3>About this chapter<\/h3>/);
    assert.match(chapter, /<details class="mksStudyRoom__chapterExerciseAbout"><summary>Read more to master this exercise<\/summary>[\s\S]*?<h3>About the exercise<\/h3>/);
    assert.doesNotMatch(chapter, /<details class="mksStudyRoom__chapterExerciseAbout"[^>]*\sopen(?:=|\s|>)/);
    assert.match(chapter, new RegExp(exercises[index].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });

  const laterChapters = html.match(/<details id="week-5"[\s\S]*<\/section><\/main>/)?.[0] ?? "";
  assert.doesNotMatch(laterChapters, /About this chapter|Read more to master this exercise/);
  assert.equal((html.match(/class="mksStudyRoom__chapterExerciseAbout"/g) ?? []).length, 4);
});

test("the MKS Study Room links the supplied Google Photos videos to Chapters 2, 3 and 4", () => {
  const html = routeRenderers[siteData.routes.masterKeySystem](siteData).body;
  const chapter2 = "https://photos.google.com/search/CgZWaWRlb3MiCBIGCgQqAggBKN+0mvePNA%3D%3D/photo/AF1QipO7x3Zc8oNkYOlb3Ef0Lnnk_N7TQCWu2gsrwHFD";
  const chapter3 = "https://photos.google.com/search/CgZWaWRlb3MiCBIGCgQqAggBKLbc%2FfWPNA%3D%3D/photo/AF1QipN0t6Aoci1rOGfEm1SPcRENKbtqiHzr1TXTVwOq";
  const chapter4 = "https://photos.google.com/search/CgZWaWRlb3MiCBIGCgQqAggBKLbc%2FfWPNA%3D%3D/photo/AF1QipMEAHCw-7xIqNsdkLlaDCWNWW3CZZ1UFZLcMT_P";
  const chapter2Start = html.indexOf('data-week="2"');
  const chapter3Start = html.indexOf('data-week="3"');
  assert.ok(chapter2Start >= 0 && html.indexOf(chapter2, chapter2Start) < chapter3Start);
  assert.match(html, new RegExp(`data-week="3"[\\s\\S]*?href="${chapter3}"[\\s\\S]*?data-week="4"`));
  assert.match(html, new RegExp(`data-week="4"[\\s\\S]*?href="${chapter4}"`));
  assert.equal((html.match(/class="weekVideo"/g) ?? []).length, 4);
});

test("the MKS Study Room removes promotional preview language and keeps study controls collapsed", () => {
  const page = routeRenderers[siteData.routes.masterKeySystem](siteData);
  const html = page.body;
  assert.doesNotMatch(html, /READY TO GO DEEPER\?/);
  assert.doesNotMatch(html, /EXPLORE THE 24-WEEK PROGRAMME/);
  assert.doesNotMatch(html, /Full teaching is only available to enrolled members/);
  assert.doesNotMatch(html, /START YOUR 7 DAYS/);
  assert.match(html, /class="mksStudyRoom__select"/);
  assert.match(html, /aria-label="Course navigation"/);
  assert.match(html, /Study → Practise → Reflect → Apply/);
  assert.equal((html.match(/<details[^>]*\sopen(?:=|\s|>)/g) ?? []).length, 0);
  assert.match(html, /<details class="aiMasteryPrompt"><summary>Preview of the engineered prompt <b aria-hidden="true">\+<\/b><\/summary><pre>/);
  assert.doesNotMatch(html, /<summary>Preview the engineered prompt/);
  assert.doesNotMatch(html, /<(?:system|developer)>/i);
  assert.equal((html.match(/class="mksStudyRoom__qa"/g) ?? []).length, 240);
  assert.equal((html.match(/class="mksStudyRoom__chapter"/g) ?? []).length, 24);
  assert.equal((html.match(/data-complete-week="\d+"/g) ?? []).length, 24);
  assert.match(html, /Complete Week/);
  assert.match(html, /<h1[^>]*>Chapter 1 - One Consciousness – One Power<\/h1>/);
});

test("the MKS Study Room keeps the free experience route separate", () => {
  const mks = routeRenderers[siteData.routes.masterKeySystem](siteData).body;
  const startFree = routeRenderers[siteData.routes.startFree](siteData).body;
  assert.doesNotMatch(mks, /sevenDayDashboard/);
  assert.match(startFree, /sevenDayDashboard/);
});

test("the Foundation chapters are followed by one bilingual Foundation conversion block", () => {
  const english = routeRenderers[siteData.routes.masterKeySystem](siteData, "en").body;
  const spanish = masterKeyCurriculumPage(siteData, "es").body;
  const foundationEnd = english.indexOf('</div></section><aside class="mksStudyRoom__foundationCta"');
  const visualisation = english.indexOf('id="stage-visualisation"');
  assert.ok(foundationEnd >= 0 && foundationEnd < visualisation);
  assert.match(english, /data-i18n="mks\.foundationCta\.heading">Ready to study Foundation with personal guidance\?</);
  assert.match(english, /href="\/foundation\/"[^>]*data-i18n="mks\.foundationCta\.action">EXPLORE FOUNDATION — £97 \/ €114/);
  assert.match(spanish, /data-i18n="mks\.foundationCta\.heading">¿Listo para estudiar Foundation con orientación personal\?</);
  assert.match(spanish, /data-i18n="mks\.foundationCta\.action">EXPLORA FOUNDATION — £97 \/ €114/);
  assert.equal((english.match(/mksStudyRoom__foundationCta/g) ?? []).length, 1);
});

test("the Foundation callout stays a balanced gold card on mobile", () => {
  const css = readFileSync(new URL("../assets/platform.css", import.meta.url), "utf8");
  assert.match(css, /@media \(max-width: 768px\)[\s\S]*\.mksStudyRoom__foundationCta\s*\{[\s\S]*background:\s*linear-gradient\(/s);
  assert.match(css, /@media \(max-width: 768px\)[\s\S]*\.mksStudyRoom__foundationCta\s*\{[\s\S]*border-radius:\s*(?:1rem|16px)/s);
  assert.match(css, /@media \(max-width: 768px\)[\s\S]*\.mksStudyRoom__foundationCta\s*\{[\s\S]*min-width:\s*0/s);
  assert.match(css, /@media \(max-width: 768px\)[\s\S]*\.mksStudyRoom__foundationCta p\s*\{[\s\S]*overflow-wrap:\s*(?:anywhere|break-word)/s);
  assert.match(css, /@media \(max-width: 768px\)[\s\S]*\.mksStudyRoom__foundationCta \.button--secondary\s*\{[\s\S]*width:\s*100%[\s\S]*box-sizing:\s*border-box[\s\S]*text-align:\s*center/s);
});

test("the MKS Study Room restores four non-promotional stage illustrations", () => {
  const html = routeRenderers[siteData.routes.masterKeySystem](siteData).body;
  for (const [stage, image, week] of [
    ["foundation", "foundation-chapters-1-4.png", 1],
    ["visualisation", "visualisation-chapters-5-11.png", 5],
    ["concentration", "concentration-chapters-12-18.png", 12],
    ["integration-mastery", "contemplation-mastery-chapters-19-24.png", 19],
  ]) {
    assert.match(html, new RegExp(`id="stage-${stage}"`));
    assert.match(html, new RegExp(`href="#stage-${stage}"[^>]*>[\\s\\S]*?${image}`));
    assert.match(html, new RegExp(`href="#week-${week}"[^>]*>[\\s\\S]*?${image}`));
  }
  assert.equal((html.match(/class="mksStudyRoom__visualNavLink"/g) ?? []).length, 4);
  assert.equal((html.match(/class="mksStudyRoom__stageBanner"/g) ?? []).length, 4);
  assert.doesNotMatch(html, /pricing|coaching CTA|start your free 7 days/i);
});

test("the MKS Study Room remains structurally aligned in English and Spanish", () => {
  const english = routeRenderers[siteData.routes.masterKeySystem](siteData, "en").body;
  const spanish = routeRenderers[siteData.routes.masterKeySystem](siteData, "es").body;
  for (const marker of ["mksStudyRoom", "mksStudyRoom__select", "mksStudyRoom__chapter", "mksStudyRoom__qa", "Foundation", "Visualisation", "Concentration", "Integration &amp; Mastery"]) {
    assert.equal((english.match(new RegExp(marker, "g")) ?? []).length, (spanish.match(new RegExp(marker, "g")) ?? []).length, marker);
  }
});

test("the MKS Study Room uses the readable cream study surface", () => {
  const css = readFileSync(new URL("../assets/platform.css", import.meta.url), "utf8");

  assert.match(css, /\.mksStudyRoom\s*\{[^}]*background:\s*var\(--cream\)/s);
  assert.match(css, /\.mksStudyRoom__chapter\s*\{[^}]*background:\s*var\(--paper\)/s);
  assert.match(css, /\.mksStudyRoom__questions\s*\{[^}]*background:\s*var\(--cream\)/s);
});

test("the MKS Study Room has bounded responsive layout and visible focus treatment", () => {
  const css = readFileSync(new URL("../assets/platform.css", import.meta.url), "utf8");
  assert.match(css, /\.mksStudyRoom\s*\{[^}]*overflow-x:\s*clip/s);
  assert.match(css, /\.mksStudyRoom__layout\s*\{[^}]*grid-template-columns:\s*minmax\(13rem, 16rem\) minmax\(0, 1fr\)/s);
  assert.match(css, /\.mksStudyRoom__lesson\s*\{[^}]*max-width:\s*760px/s);
  assert.match(css, /\.mksStudyRoom__chapter summary:focus-visible[^{]*\{/s);
  assert.match(css, /@media \(max-width:\s*768px\)[\s\S]*\.mksStudyRoom__layout[\s\S]*grid-template-columns:\s*minmax\(0, 1fr\)/s);
  assert.match(css, /@media \(max-width:\s*768px\)[\s\S]*\.mksStudyRoom__courseNav[\s\S]*display:\s*none/s);
});

test("Foundation chapters use a scoped, comfortable inner text inset", () => {
  const css = readFileSync(new URL("../assets/platform.css", import.meta.url), "utf8");
  assert.match(css, /\.mksStudyRoom__stageBlock\[data-stage="foundation"\]\s+\.mksStudyRoom__chapter\s+\.chapterBody\s*\{[\s\S]*padding:\s*1\.2rem clamp\(1\.35rem, 4vw, 2\.75rem\) 1\.5rem/s);
  assert.doesNotMatch(css, /\.mksStudyRoom__stageBlock\[data-stage="(?:visualisation|concentration|integration-mastery)"\][\s\S]*padding:\s*1\.2rem clamp\(1\.35rem, 4vw, 2\.75rem\) 1\.5rem/s);
});

test("the Chapter 1 exercise disclosure has accessible desktop and mobile styling", () => {
  const css = readFileSync(new URL("../assets/platform.css", import.meta.url), "utf8");
  assert.match(css, /\.mksStudyRoom__chapterGuidance\s*\{[\s\S]*border-bottom:\s*1px solid var\(--border\)/s);
  assert.match(css, /\.mksStudyRoom__chapterGuidance h4\s*\{[\s\S]*color:\s*var\(--night\)/s);
  assert.match(css, /\.mksStudyRoom__stageBlock\[data-stage="foundation"\]\s+\.mksStudyRoom__chapterExerciseAbout\s*>\s*div\s*\{[\s\S]*padding:\s*1rem clamp\(1rem, 3vw, 1.5rem\) 1.25rem/s);
  assert.match(css, /\.mksStudyRoom__chapterExerciseAbout\s*>\s*summary[^\{]*\{[\s\S]*cursor:\s*pointer/s);
  assert.match(css, /\.mksStudyRoom__chapterExerciseAbout\s*>\s*summary:focus-visible[^\{]*\{[\s\S]*outline:/s);
  assert.match(css, /@media \(max-width:\s*768px\)[\s\S]*\.mksStudyRoom__chapterExerciseAbout/s);
});

test("AI prompt previews keep readable mobile styling and toggle their symbol", () => {
  const css = readFileSync(new URL("../assets/platform.css", import.meta.url), "utf8");
  assert.match(css, /\.aiMasteryPrompt summary b::before\s*\{[\s\S]*content:\s*["']\+["']/s);
  assert.match(css, /\.aiMasteryPrompt\[open\] summary b::before\s*\{[\s\S]*content:\s*["']−["']/s);
  assert.match(css, /@media \(max-width:\s*768px\)[\s\S]*\.aiMasteryPrompt pre\s*\{[\s\S]*white-space:\s*pre-wrap/s);
});
