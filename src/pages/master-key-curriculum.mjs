import { readFileSync } from "node:fs";
import { siteData as canonicalSiteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";

const curriculum = readFileSync(new URL("../../content/master-key-curriculum.html", import.meta.url), "utf8").trim();
const chapterGridOpening = '<div class="chapterGrid">';
const chapterGridStart = curriculum.indexOf(chapterGridOpening);
const chapterGridEnd = curriculum.indexOf('</div><p class="sourceNote">', chapterGridStart);
const phases = Object.freeze([
  { title: "FOUNDATION", range: "Chapters 1–4", start: 0, end: 4, image: "/images/master-key-visuals/foundation-chapters-1-4.webp", alt: "Foundation — Master Key System Chapters 1 to 4" },
  { title: "VISUALISATION", range: "Chapters 5–11", start: 4, end: 11, image: "/images/master-key-visuals/visualisation-chapters-5-11.webp", alt: "Visualisation — Master Key System Chapters 5 to 11" },
  { title: "CONCENTRATION", range: "Chapters 12–18", start: 11, end: 18, image: "/images/master-key-visuals/concentration-chapters-12-18.webp", alt: "Concentration — Master Key System Chapters 12 to 18" },
  { title: "CONTEMPLATION & MASTERY", range: "Chapters 19–24", start: 18, end: 24, image: "/images/master-key-visuals/contemplation-mastery-chapters-19-24.webp", alt: "Contemplation and Mastery — Master Key System Chapters 19 to 24" },
]);

const practiceGuides = Object.freeze([
  { focus: "Physical stillness", steps: ["Choose a quiet place and sit upright but comfortably.", "For 15-30 minutes, let thoughts come and go while keeping the body still.", "Repeat daily until remaining physically still feels natural rather than forced."], purpose: "Train deliberate control of physical movement before adding more demanding mental work." },
  { focus: "Mental quiet", steps: ["Use the same place, chair and posture when possible.", "Remain physically still and gently release each thought instead of following it.", "When care, worry or fear appears, notice it, let it go and return to quiet."], purpose: "Practise choosing whether to continue a thought instead of being carried along by it." },
  { focus: "Complete physical relaxation", steps: ["Begin with the stillness you practised in Weeks 1 and 2.", "Systematically let tension leave the face, shoulders, hands, torso and legs.", "Stay with the exercise until the body feels quiet, loose and restful."], purpose: "Learn the difference between being motionless and being genuinely relaxed." },
  { focus: "Mental letting go", steps: ["Relax the body first so you are not fighting physical tension.", "Bring one adverse state to mind - such as anger, worry, jealousy or disappointment - without feeding it.", "Deliberately release it and return to a calmer, more constructive state; repeat with persistence."], purpose: "Strengthen your ability to disengage from destructive emotional and mental patterns." },
  { focus: "Build a complete mental scene", steps: ["Choose one familiar place that carries pleasant associations.", "Re-create the setting in your mind: buildings, trees, people, light, colour and atmosphere.", "Return to the same scene each day and add detail rather than constantly changing the image."], purpose: "Develop steadier, more detailed mental imagery." },
  { focus: "Train visual accuracy", steps: ["Choose one small photograph and study it closely for about ten minutes.", "Notice expression, clothing, hair, background, shapes and small details.", "Close your eyes and reproduce it mentally; reopen the image, check what you missed and repeat."], purpose: "Improve observation, recall and the accuracy of your inner pictures." },
  { focus: "Visualise a person in motion", steps: ["Picture a friend exactly as you last saw them and reconstruct the setting around them.", "See their face clearly, then imagine a natural conversation on a familiar subject.", "Notice their expression changing - for example, a smile or look of interest - while keeping the scene coherent."], purpose: "Move from static imagery to a vivid, continuous mental scene." },
  { focus: "Trace effects back to causes", steps: ["Choose a familiar manufactured object and hold it clearly in mind.", "Mentally work backwards through assembly, tools, people, transport and raw materials.", "Continue back to the design, decision or original idea that started the chain."], purpose: "Train analytical imagination: look beneath a finished result to the causes that produced it." },
  { focus: "Visualise growth as a sequence", steps: ["Choose a favourite flower and picture its seed being planted and cared for.", "Watch the roots, shoot, stem, leaves, bud and flower develop in the correct order.", "Keep the sequence continuous and add sensory detail such as colour, movement and fragrance."], purpose: "Strengthen sustained visualisation across a changing process rather than a single image." },
  { focus: "Construct shapes in the mind", steps: ["On an imagined blank wall, draw a black horizontal line about six inches long.", "Add the remaining lines to form a square, then a circle inside it and a point in the centre.", "Extend the point toward you to form a cone, then deliberately change the image through the instructed colours."], purpose: "Build precise, controllable visual concentration." },
  { focus: "Practise faith as a present mental attitude", steps: ["Choose one worthy desire or objective rather than several competing ones.", "Contemplate the idea of receiving it in principle instead of repeatedly rehearsing doubt or absence.", "Identify one thought and one practical action today that would be consistent with that belief."], purpose: "Connect conviction with deliberate action rather than treating faith as passive wishing." },
  { focus: "Contemplate unity and capacity", steps: ["Relax both physically and mentally before beginning.", "Hold the idea that your ability to think, choose and act participates in a larger field of intelligence.", "Stay with that single idea calmly, without straining to force a feeling or result."], purpose: "Develop sustained contemplation without physical or mental pressure." },
  { focus: "Recognise the directing 'I'", steps: ["Settle into silence and distinguish the observing, choosing 'I' from passing thoughts and sensations.", "Contemplate Haanel's idea that the individual is a part of a greater whole and shares its qualities in degree.", "After the sitting, write one constructive action this understanding suggests."], purpose: "Turn an abstract idea of identity into a principle you can consciously apply." },
  { focus: "Concentrate on harmony", steps: ["Choose the single word and idea 'harmony' as the object of attention.", "Let it mean orderly, constructive relations in body, thought, conduct and relationships - not merely a repeated word.", "Each time the mind wanders, return to the felt meaning of harmony until it becomes the dominant awareness."], purpose: "Deepen one-pointed concentration on a constructive quality." },
  { focus: "Develop practical insight", steps: ["Choose one real problem or decision that matters now.", "Separate what you genuinely know from assumption, habit and reaction.", "Formulate one definite programme for applying a known principle to that problem during the week."], purpose: "Move from collecting knowledge to seeing how and where to apply it." },
  { focus: "Create the inner attitude first", steps: ["Choose the harmonious result you want to understand or work toward.", "Build the corresponding mental attitude before focusing on possessions or external circumstances.", "Visualise the result as complete, then identify the service or constructive action that belongs with it."], purpose: "Practise linking inner attitude, mental imagery and outward action." },
  { focus: "Become absorbed in one ideal", steps: ["Relax completely and put aside anxiety about when or how results may come.", "Select one worthy quality or objective - such as courage, abundance or healthful conduct - and hold attention there.", "Return to the same ideal whenever the mind wanders until, for a period, it occupies your awareness fully."], purpose: "Strengthen concentration by identifying with one constructive ideal instead of its opposite." },
  { focus: "Contemplate creative power", steps: ["Begin in silence and choose the idea of your capacity to create through thought and action.", "Follow Haanel's analogy carefully: physical life depends on conditions such as air; his philosophy proposes a corresponding spiritual source.", "Seek a reasoned understanding rather than trying to manufacture belief or emotion."], purpose: "Use contemplation to examine the logical basis of a principle and what it means for your choices." },
  { focus: "Look beyond appearances", steps: ["Hold one example in mind where immediate appearance differs from a deeper explanation.", "Use Haanel's examples - the apparently flat earth, moving sun or seemingly fixed matter - as prompts for careful observation.", "Ask what underlying process, cause or change may be hidden beneath the surface of a current situation."], purpose: "Train yourself to question first impressions and search for underlying causes." },
  { focus: "Contemplate oneness", steps: ["Enter the Silence and settle into a calm, unhurried state.", "Contemplate the statement 'In Him we live and move and have our being' as an idea of inseparability from an all-pervading source.", "Finish by choosing one constructive action today that expresses connection rather than isolation or fear."], purpose: "Bring a metaphysical idea into a practical, constructive choice." },
  { focus: "Concentrate on truth", steps: ["Choose truth - what is real, accurate and constructive - as the single subject of contemplation.", "Notice where fear, assumption, exaggeration or habit may be obscuring your view of a situation.", "Identify one practical way to act more consistently with what you judge to be true."], purpose: "Develop discernment and connect contemplation with honest action." },
  { focus: "Contemplate nearness rather than distance", steps: ["Settle into quiet and use Tennyson's image of the Divine as 'closer than breathing' as the focus.", "Rest with the sense of immediate connection rather than trying to force an unusual experience.", "For any health concern, keep the contemplation separate from medical treatment and choose one sensible, evidence-based supportive action."], purpose: "Practise calm contemplation while keeping practical care grounded and responsible." },
  { focus: "Link spirit, service and value", steps: ["Contemplate Haanel's distinction between being merely a body and being a spiritual being expressing through a body.", "Choose one financial or material objective and ask what real service or value it would need to represent.", "Write one action that increases that service or value instead of concentrating only on the money itself."], purpose: "Connect material aims with contribution, usefulness and constructive action." },
  { focus: "Integrate the whole 24-week practice", steps: ["Contemplate the wonder of the world, your own capacity to learn and the principles you have studied.", "Review all 24 weeks and identify the four exercises that produced the most meaningful learning for you.", "Choose when and how you will continue those four practices over the next 90 days."], purpose: "Turn the final week into integration and continued practice rather than treating it as an ending." },
]);

function phaseFor(index) {
  return phases.find((phase) => index >= phase.start && index < phase.end);
}

function chapterNavigation(index) {
  const previous = index > 0 ? `<a href="#week-${index}" class="curriculumWeekNav__previous" data-curriculum-chapter-link="${index}">← Previous Chapter</a>` : "";
  const next = index < 23 ? `<a href="#week-${index + 2}" class="curriculumWeekNav__next" data-curriculum-chapter-link="${index + 2}">Next Chapter →</a>` : "";
  return `<div class="curriculumChapterClosing"><aside class="curriculumPracticeBridge"><strong>One chapter. One week. One daily practice.</strong><span>You do not need to master everything today. Focus on this week's principle and practise it consistently before moving on.</span></aside><aside class="curriculumCoachingCta"><h3>READY TO GO DEEPER?</h3><p>The Master Key System can be studied alone. But lasting change comes from consistent practice, honest reflection and application.</p><p>The Unleash Your Power 24-Week Programme gives you structured guidance, weekly coaching, accountability and support as you work through all 24 parts of the system.</p><a href="${canonicalSiteData.routes.coaching}">EXPLORE THE 24-WEEK PROGRAMME</a><small>Study the system. Practise it daily. Learn to apply it to your life.</small></aside><nav class="curriculumWeekNav" aria-label="Chapter ${index + 1} navigation">${previous}<button type="button" data-curriculum-complete aria-pressed="false">Complete Chapter <span aria-hidden="true">✓</span></button>${next}</nav></div>`;
}

function renderPracticeGuide(number) {
  const guide = practiceGuides[number - 1];
  if (!guide) throw new Error(`Missing practice guide for Master Key Week ${number}.`);
  const steps = guide.steps.map((step) => `<li>${step}</li>`).join("");
  return `<aside class="curriculumPracticeGuide" aria-label="How to practise Week ${number}"><p class="curriculumPracticeGuide__label">HOW TO PRACTISE IT</p><h4>${guide.focus}</h4><ol>${steps}</ol><p class="curriculumPracticeGuide__purpose"><strong>What you're training:</strong> ${guide.purpose}</p></aside>`;
}

function wrapPractice(chapter, number) {
  return chapter.replace(/<h3>Exercise<\/h3><p>([\s\S]*?)<\/p>(?=(?:<aside class="curriculumReflectionBridge">[\s\S]*?<\/aside>)?<div class="aiMastery">)/, `<section class="curriculumPractice" aria-label="This week's practice"><p class="curriculumPractice__eyebrow">🔑 THIS WEEK'S PRACTICE</p><div><h3>Exercise</h3><p>$1</p>${renderPracticeGuide(number)}<p class="curriculumPractice__message">“The reading gives you the knowledge. The daily exercise creates the transformation.”</p><p class="curriculumPractice__support">Consistency matters more than intensity. Give the exercise your full attention each day and let the results compound over time.</p></div></section>`);
}

function enhanceAiPrompt(chapter, number) {
  return chapter
    .replace(/<details class="promptPreview"><summary>Preview the engineered prompt <b>＋<\/b><\/summary><pre>([\s\S]*?)<\/pre><\/details>/, `<details class="aiMasteryPrompt" aria-label="Week ${number} guided prompt"><summary>View guided prompt <b aria-hidden="true">＋</b></summary><div class="aiMasteryPrompt__content"><p class="aiMasteryPrompt__label">WEEK ${number} GUIDED PROMPT</p><pre>$1</pre></div></details>`)
    .replace(/(<button type="button" aria-label="Copy the Week \d+ AI mastery prompt">Copy prompt<\/button>)(<\/div>)/, `$1<span class="aiCopyFeedback" data-ai-copy-feedback role="status" aria-live="polite"></span>$2`);
}

function chapterSectionLinks(number) {
  return `<nav class="curriculumSectionLinks" aria-label="Chapter ${number} study sections"><a href="#week-${number}-introduction" data-curriculum-section-link="introduction">Introduction</a><a href="#week-${number}-content" data-curriculum-section-link="content">Core lesson</a><a href="#week-${number}-exercise" data-curriculum-section-link="exercise">Weekly exercise</a></nav>`;
}

function renderChapters() {
  if (chapterGridStart < 0 || chapterGridEnd < 0) throw new Error("Master Key curriculum chapters could not be located.");
  const source = curriculum.slice(chapterGridStart + chapterGridOpening.length, chapterGridEnd);
  const fragments = source.split("</details><details>");
  if (fragments.length !== 24) throw new Error("Expected exactly 24 Master Key curriculum chapters.");

  return fragments.map((fragment, index) => {
    const number = index + 1;
    const phase = phaseFor(index);
    const opening = index === 0 ? fragment : `<details>${fragment}`;
    const chapter = `${opening}${index === fragments.length - 1 ? "" : "</details>"}`
      .replace("<details>", `<details id="week-${number}" data-curriculum-chapter="${number}" data-curriculum-stage="${phase.title}"${index === 0 ? " open" : ""}>`)
      .replace("<summary>", `<summary><span class="curriculumChapterSummary__number">CHAPTER ${String(number).padStart(2, "0")}</span>`)
      .replace("</summary>", `<span class="curriculumChapterSummary__stage">${phase.title}</span></summary>`)
      .replace('<div class="chapterBody">', '<article class="curriculumReadingCard"><div class="chapterBody">')
      .replace("AI MASTERY COACH", "AI MASTERY PROMPT")
      .replace("Paste this into ChatGPT. Your AI coach will test, challenge and guide you one step at a time—without giving away the answers too early.", "Copy this guided prompt into ChatGPT to explore this week's Master Key lesson more deeply.")
      .replace('<div class="aiMastery">', '<aside class="curriculumReflectionBridge"><h3>TURN KNOWLEDGE INTO APPLICATION</h3><p>Understanding a principle intellectually is only the beginning. Take a moment to reflect on what this week\'s lesson means in your own life and how you can apply it today.</p></aside><div class="aiMastery">');
    return enhanceAiPrompt(wrapPractice(chapter, number), number)
      .replace('<article class="curriculumReadingCard">', `${chapterSectionLinks(number)}<article class="curriculumReadingCard">`)
      .replace("<h3>Introduction</h3>", `<h3 id="week-${number}-introduction">Introduction</h3>`)
      .replace("<h3>Content</h3>", `<h3 id="week-${number}-content">Content</h3>`)
      .replace("<h3>Exercise</h3>", `<h3 id="week-${number}-exercise">Exercise</h3>`)
      .replace("</div></details>", `</div>${chapterNavigation(index)}</article></details>`);
  });
}

function renderStudyNavigator() {
  const groups = phases.map((phase) => {
    const links = Array.from({ length: phase.end - phase.start }, (_, offset) => {
      const chapter = phase.start + offset + 1;
      const current = chapter === 1 ? ' aria-current="true"' : "";
      return `<a href="#week-${chapter}" data-curriculum-chapter-link="${chapter}"${current}>${String(chapter).padStart(2, "0")}</a>`;
    }).join("");
    return `<section class="curriculumStudyNav__group"><header><strong>${phase.title}</strong><span>${phase.range}</span></header><div class="curriculumStudyNav__links">${links}</div></section>`;
  }).join("");
  return `<button class="curriculumStudyNav__toggle" type="button" data-curriculum-navigator-toggle aria-expanded="false" aria-controls="curriculum-study-navigator">Show all 24 chapters <span aria-hidden="true">⌄</span></button><nav class="curriculumStudyNav" id="curriculum-study-navigator" data-curriculum-navigator aria-label="24 chapter navigator">${groups}</nav>`;
}

function renderEndResult() {
  return `<aside class="curriculumEndResult" aria-label="24-week end result"><p class="eyebrow">THE END RESULT</p><h2>Carry the practice forward.</h2><p>The final chapter is not an ending; it is an invitation to keep studying, reflecting and applying what you have practised.</p><div class="curriculumEndResult__quotes"><blockquote>“Thought is spiritual energy.” <cite>— Charles F. Haanel, <em>The Master Key System</em>, Part Four</cite></blockquote><blockquote>“Thought is the seed; it results in action, and action results in form.” <cite>— Charles F. Haanel, <em>The Master Key System</em>, Part Nineteen</cite></blockquote></div><a class="button--primary" href="/downloads/mks-end-result.pdf" download>Download the 24-Week End Result</a></aside>`;
}

function renderCurriculum() {
  const chapters = renderChapters();
  const groupedChapters = phases.map((phase) => (
    `<section class="curriculumPhase" aria-labelledby="${phase.title.toLowerCase().replaceAll(/[^a-z]+/g, "-")}"><figure class="curriculumPhase__visual"><img src="${phase.image}" alt="${phase.alt}" width="1440" height="810" loading="lazy" decoding="async"></figure><header><p>${phase.range}</p><h2 id="${phase.title.toLowerCase().replaceAll(/[^a-z]+/g, "-")}">${phase.title}</h2></header><div class="chapterGrid">${chapters.slice(phase.start, phase.end).join("")}</div></section>`
  )).join("");
  const notes = curriculum.slice(chapterGridEnd + "</div>".length, -"</section>".length);
  return `<section class="curriculum section" id="curriculum"><header class="curriculumPage__intro"><figure class="curriculumPage__heroVisual"><img src="/images/master-key-visuals/master-key-24-week-hero.webp" alt="The Master Key System — 24 Weeks to Master the Way You Use Your Mind" width="1440" height="810" fetchpriority="high" decoding="async"></figure><p class="eyebrow">THE MASTER KEY SYSTEM</p><h1>24 Weeks to Master the Way You Use Your Mind</h1><p class="curriculumPage__status" data-curriculum-status aria-live="polite">Chapter 1 of 24 · FOUNDATION</p><p class="curriculumPage__lead">The Master Key System is not simply a book to read. It is a 24-week system of study, reflection and daily practice designed to help you develop greater control of your attention, thinking and actions.</p><p>Move through one chapter each week. Study the principle, practise the exercise each day and allow the learning to compound through consistent application.</p><div class="curriculumPage__introActions"><a class="button--secondary" href="${canonicalSiteData.routes.getTheBook}">GET THE MKS BOOK</a><a class="button--text" href="${canonicalSiteData.routes.aiMentors}">USE THE FREE AI MENTOR</a></div></header><div class="curriculumJourneyNote"><strong>Your transformation is built one week at a time.</strong><span>Study the chapter. Practise the exercise. Apply the principle. Then move forward.</span></div>${renderStudyNavigator()}${groupedChapters}${notes}<aside class="curriculumLineageLink"><span>Explore the study tradition behind this journey.</span><a class="button--text" href="${canonicalSiteData.routes.mksLineage}">Explore the MKS Lineage</a></aside>${renderEndResult()}</section>`;
}

export function masterKeyCurriculumPage(data = canonicalSiteData, language = "en") {
  return {
    route: data.routes.masterKeySystem,
    language,
    title: t("route.masterKeySystem.metaTitle", language),
    description: t("route.masterKeySystem.metaDescription", language),
    titleKey: "route.masterKeySystem.metaTitle",
    descriptionKey: "route.masterKeySystem.metaDescription",
    body: `<main class="curriculumPage" id="main-content">${renderCurriculum()}</main>`,
    styles: ["/assets/index-Bgwsdhov.css"],
    scripts: ["/assets/curriculum.mjs?v=20260831-section-links-1"],
    socialImage: "/images/master-key-visuals/master-key-24-week-hero.png",
    socialImageAlt: "The Master Key System — 24 Weeks to Master the Way You Use Your Mind",
  };
}
