import { readFileSync } from "node:fs";
import { t } from "../../content/translations.mjs";

const curriculum = readFileSync(new URL("../../content/master-key-curriculum.html", import.meta.url), "utf8").trim()
  .replaceAll("One Consciousness - One Power", "One Consciousness – One Power")
  .replaceAll("Thoughts become Things", "Thoughts Become Things")
  .replaceAll("The true “Self”", "The True “Self”");
const chapterGridOpening = '<div class="chapterGrid">';
const chapterGridStart = curriculum.indexOf(chapterGridOpening);
const chapterGridEnd = curriculum.indexOf('</div><p class="sourceNote">', chapterGridStart);

const chapterOneAbout = `<h3>About this chapter</h3><h4>One Consciousness, One Power</h4><p>Welcome to the first step of your Master Key System journey. You’re beginning a study that can help you understand your mind more clearly and live with greater purpose. Bring your curiosity, give the ideas your attention, and stay open to what you may discover about yourself.</p><p>As you look within, you may notice strengths you haven’t fully used and patterns you’re ready to change. Both are part of learning. Awareness gives you the chance to choose your next thought and action with greater care—and to build a life that feels more peaceful, joyful and meaningful.</p><p>This study is about developing your own ability to think with intention. As you grow in awareness, you may also find new ways to support the people around you. A kind word, a thoughtful action or a generous attitude can make a real difference. The more attention you give to the qualities you want to practise—such as health, kindness, confidence and abundance—the more naturally you can bring them into your daily life.</p><p>In this chapter, you’ll explore the idea of one universal Consciousness expressing itself through many forms. You’ll consider how you are connected to that greater whole, and how thought can help you bring your attention, choices and actions into alignment with what matters to you.</p><p>The Master Key System asks you to do more than think casually. It introduces focused, deliberate thought: choosing a clear aim, giving it sustained attention, and learning to direct your mind calmly and constructively. That takes practice. This first chapter gives you a place to begin.</p><p>Consistency will matter. You don’t need to be perfect, and you don’t need to understand everything at once. Keep showing up, study carefully and complete the exercises. Over time, you may become more observant, pause before reacting, choose your words more thoughtfully and respond to emotions with greater control. Small changes, practised regularly, can shape powerful habits.</p><p>Bring that awareness into your relationships, too. As you practise patience, encouragement and generosity, you can help create a calmer and more supportive atmosphere around you. Begin with the way you think and act each day; let your progress encourage others.</p><h4>Your study routine</h4><p>Read this chapter slowly and thoughtfully. Allow about 40–50 minutes, then complete the exercise. Reading helps you understand the ideas; practice gives you a chance to apply them. Repeating a helpful action can make it easier and more natural over time.</p><p>Set aside about 20–30 minutes for the exercise, and aim to practise it daily. If possible, choose a quiet place where you can return to your study. A familiar routine can help you settle your attention and make this time feel like a meaningful part of your day. If you can’t always use the same place, keep the practice going wherever you are. Your commitment matters more than the room.</p>`;
const chapterOneExerciseAbout = `<details class="mksStudyRoom__chapterExerciseAbout"><summary>Read more to master this exercise</summary><div><p>This first exercise is your starting point for developing physical stillness and control. You’ll return to this skill throughout the next six months, so give yourself time to build it gradually.</p><p>The exercises progress from stillness, relaxation and mental control, through visualisation, and then into concentration and contemplation. Each stage gives you a chance to practise directing your attention and forming clear mental pictures of the life you want to create. Focused attention, repeated consistently, can become a habit—and the habits you practise help shape the person you become.</p><p>You may wonder how you’ll know when you’ve mastered physical control. For now, keep it simple: the aim is to sit comfortably and remain still for a period of time. You don’t need to tense your body or try to control every movement. Start with a few minutes, then add around three or four minutes each day, as feels comfortable. By the end of the week, work towards sitting still for up to half an hour.</p><p>Progress takes patience. If you feel restless, notice it without judging yourself, then gently return to stillness. Each practice is a chance to strengthen your attention. You’re building the foundation one session at a time.</p><p>At the heart of this study is the idea that lasting change begins within. As you become more aware of your thoughts, you can choose which patterns to strengthen and which old habits you’re ready to leave behind. Your practice helps you meet those choices with more intention and consistency.</p><p>Keep going, even when progress feels gradual. With time and steady effort, you may find that your attention becomes clearer, your responses more considered, and new possibilities easier to imagine. Begin with this exercise, return to it regularly, and let each small step build on the one before it.</p></div></details>`;

const chapterGuidance = Object.freeze({
  2: {
    title: "One Method of Finding the Truth",
    about: `<p>Welcome to the second part of your study. You’ll now build on the awareness and physical stillness you practised in Chapter 1. If some of those ideas still feel new, take your time. You can revisit the first chapter whenever you need to; each return may help you notice something more.</p><p>This week, you’ll practise noticing when your thoughts, words or actions are moving in a direction that doesn’t feel helpful. When you catch yourself in a negative or discouraging pattern, try offering your mind a clear, constructive alternative. You’re not pretending that a difficulty doesn’t exist. You’re choosing where to direct your attention next.</p><p>You don’t have to fight every thought you dislike. Struggling against it can keep your attention fixed on it. Instead, notice what’s happening, step back from the story you’re telling yourself, and gently choose a thought that supports the way you want to respond. Repeating that choice can help it become more familiar and, with practice, more natural.</p><p>Your feelings can help you notice when a thought pattern is affecting you. Pause and ask yourself what you’re feeling, without criticising yourself for it. Then consider what response would help you move forward. Events can be difficult, and some things are outside your control; still, you can practise choosing how you meet the moment.</p><p>This is one method of seeking a clearer perspective: notice the thought, then offer a purposeful alternative. Repetition matters. New skills—whether learning to walk, drive or play an instrument—take practice. Give yourself time to strengthen a more helpful way of thinking.</p><p>A thought connected to a clear purpose can hold your attention more steadily. Bring your feelings into the practice by noticing what matters to you and the kind of person you want to be. If you aren’t sure what thought to choose, try the word “freedom” and consider what greater freedom might mean in this moment: a little more patience, confidence, calm or room to choose.</p><p>Charles Haanel also points to the value of practice becoming natural. Think of an actor who has rehearsed a role until they can inhabit it with ease. At first, learning takes conscious effort. With repetition, some actions become familiar, leaving you more attention for what comes next.</p><p>That is the movement this chapter invites you to explore: understand an idea, practise it deliberately, and give helpful habits time to take root. You don’t need to analyse every thought or solve everything at once. Use your awareness to choose your next step, and keep practising.</p>`,
    exercise: `<p>This week, your practice shifts from physical stillness to becoming more aware of your thoughts. Last week, you worked on physical control. Now you’ll practise inhibiting thought—a deliberate choice to pause the usual stream of thinking and direct your attention.</p><p>To make this easier, gently focus on the tip of your nose. Let your attention rest there. You’re not trying to force your mind blank; you’re practising noticing when thoughts arise and returning your focus to the exercise. For this moment, your task is simply to pay attention.</p><p>This practice helps prepare you for the next weeks, when you’ll work on relaxing both body and mind. First comes awareness and control; then you can choose to release tension more consciously. Be patient and give the exercise your steady effort. Your progress comes from practising, one moment at a time.</p><p>Support your study with habits that help you feel well. Make time for regular movement and nourishing food, and notice how your energy and attention respond. Small, consistent choices can help you feel more ready to learn and practise.</p>`,
  },
  3: {
    title: "The Power of Thought",
    about: `<p>In the first two chapters, you began exploring the idea of one Consciousness and the way you can direct your attention. This week, you’ll look more closely at how deliberate, constructive thought can influence the way you feel, the choices you make and the habits you build.</p><p>The Master Key System uses the image of a “Watchman at the Gate” to describe the role of your conscious mind. Think of it as the part of you that can pause, notice what is entering your awareness and decide what deserves your attention. You won’t catch every thought straight away, especially at first. That’s all right. Each time you notice a pattern and choose a more helpful response, you strengthen your ability to act with intention.</p><p>Your thoughts matter because they can shape your words, actions and repeated habits. This is an invitation to take responsibility for your response: to notice what is happening, consider what you want to contribute, and choose your next step with care. Other people and circumstances can influence you, but you can keep building your ability to respond in a way that reflects your values.</p><p>You don’t need to rush or worry that you must get everything right. Let your awareness grow gradually. Notice the small moments when you can meet yourself or someone else with more patience, kindness, compassion or understanding. These everyday choices can bring a greater sense of purpose and connection to your life.</p><p>And remember to enjoy the process. When you catch yourself slipping into an old pattern, treat it as a moment of discovery—not a reason to criticise yourself. Stay curious, learn from what you notice, and give yourself room to smile. A little lightness can make steady practice feel more welcoming and help you keep moving forward.</p>`,
    exercise: `<p>This week, you’ll practise physical relaxation. Give yourself time to settle, breathe slowly and let your muscles soften. You can gently invite each part of your body to release unnecessary tension. There’s no need to force it—simply notice what you’re holding and allow yourself to ease.</p><p>Practise patiently and regularly. As you relax, you may become more aware of your body and the signals it gives you. Treat that awareness with care; your body is an important part of how you experience the world.</p><p>This exercise prepares you for the next chapter, where you’ll begin practising mental relaxation as well. Together, these skills create a steadier foundation for the visualisation exercises that follow. Those exercises will help you develop your imagination and practise forming clear mental pictures of the goals and experiences you want to move towards.</p>`,
  },
  4: {
    title: "Discovering the True Self",
    about: `<p>This chapter invites you to explore the idea of your true “I”—the deeper sense of self behind your thoughts and your physical body. In the language of the Master Key System, your mind and body are instruments through which you express yourself in the world.</p><p>You’ll consider the spiritual idea that your inner nature is connected to a greater Universal Consciousness. Let that idea encourage you to recognise possibility within yourself. A vision becomes a starting point: you give it attention, consider what it would ask of you, and take practical steps towards it.</p><p>At the heart of this chapter is the invitation to understand yourself more deeply and live with greater awareness. As you explore your connection with the whole, consider how your choices can contribute to the wellbeing of others as well as your own. Generosity, respect and cooperation can help create a more supportive life for everyone involved.</p><p>Positive thinking can help you begin, but lasting growth also asks for practice. You can notice the thoughts and habits you want to strengthen, then return to them through consistent choices and actions.</p><p>Accepting yourself doesn’t mean giving up on growth. It means starting from where you are, without shame, while remaining open to who you can become. Recognise your progress, be honest about what you’d like to change, and take the next step with patience.</p><p>This chapter also explores the value of quiet reflection. Rest and silence can give you room to focus on your ideals, understand what matters to you and consider how to move forward. Let your ambitions be meaningful, and let your actions reflect care for yourself and the people around you.</p><p>Thoughts can feel more vivid when they are connected to emotion. Through practice, you can learn to notice how your thoughts affect your feelings and choices, then guide your attention towards what supports you. Emotions naturally shift; you can meet them with awareness and choose your response.</p><p>As you study, reflect on what the idea of a deeper “Self” means to you. You may discover a renewed sense of possibility and purpose. Give that discovery time to develop, and let it inspire the way you think, act and contribute each day.</p>`,
    exercise: `<p>This week, you’ll practise relaxing your mind. When difficult thoughts arise—such as worry, anger, jealousy or disappointment—notice them without judging yourself. You don’t have to follow each thought or let it take over your attention. Gently return your focus to the exercise.</p><p>As you create more space from unhelpful thought patterns, you can give greater attention to qualities you want to strengthen, such as compassion, friendship, joy, understanding and calm. The aim isn’t to deny what you feel; it’s to meet your thoughts with awareness and choose where to place your attention next.</p><p>This practice builds on the physical relaxation and mental awareness you’ve been developing. These skills form a foundation for the exercises that follow. If either still feels challenging, give yourself more time and keep practising steadily. Each session is progress.</p>`,
  },
});

function renderChapterGuidance(guidance) {
  return `<section class="mksStudyRoom__chapterGuidance"><h3>About this chapter</h3><h4>${guidance.title}</h4>${guidance.about}</section>`;
}

function renderExerciseDisclosure(content) {
  return `<details class="mksStudyRoom__chapterExerciseAbout"><summary>Read more to master this exercise</summary><div><h3>About the exercise</h3>${content}</div></details>`;
}

const stages = Object.freeze([
  { id: "foundation", title: "Foundation", weeks: "Chapters 1–4", start: 0, end: 4, image: "foundation-chapters-1-4.png" },
  { id: "visualisation", title: "Visualisation", weeks: "Chapters 5–11", start: 4, end: 11, image: "visualisation-chapters-5-11.png" },
  { id: "concentration", title: "Concentration", weeks: "Chapters 12–18", start: 11, end: 18, image: "concentration-chapters-12-18.png" },
  { id: "integration-mastery", title: "Integration & Mastery", weeks: "Chapters 19–24", start: 18, end: 24, image: "contemplation-mastery-chapters-19-24.png" },
]);

const chapterVideos = Object.freeze({
  2: "https://photos.google.com/search/CgZWaWRlb3MiCBIGCgQqAggBKN+0mvePNA%3D%3D/photo/AF1QipO7x3Zc8oNkYOlb3Ef0Lnnk_N7TQCWu2gsrwHFD",
  3: "https://photos.google.com/search/CgZWaWRlb3MiCBIGCgQqAggBKLbc%2FfWPNA%3D%3D/photo/AF1QipN0t6Aoci1rOGfEm1SPcRENKbtqiHzr1TXTVwOq",
  4: "https://photos.google.com/search/CgZWaWRlb3MiCBIGCgQqAggBKLbc%2FfWPNA%3D%3D/photo/AF1QipMEAHCw-7xIqNsdkLlaDCWNWW3CZZ1UFZLcMT_P",
});

const roomCopy = Object.freeze({
  en: {
    eyebrow: "MKS STUDY ROOM", intro: "A calm place to study one chapter, practise one exercise and carry one principle into the week.", choose: "Choose a week", navigation: "Course navigation", current: "Current week", purpose: "Weekly purpose", rhythm: "Weekly rhythm", rhythmText: "Study → Practise → Reflect → Apply", progress: "Week 1 of 24", previous: "Previous Week", complete: "Complete Week", completed: "Completed", next: "Next Week", week: "Week", start: "Start the free 7-Day Experience", foundation: "Explore Foundation",
  },
  es: {
    eyebrow: "SALA DE ESTUDIO MKS", intro: "Un espacio tranquilo para estudiar un capítulo, practicar un ejercicio y llevar un principio a tu semana.", choose: "Elige una semana", navigation: "Navegación del curso", current: "Semana actual", purpose: "Propósito de la semana", rhythm: "Ritmo semanal", rhythmText: "Estudia → Practica → Reflexiona → Aplica", progress: "Semana 1 de 24", previous: "Semana anterior", complete: "Completar semana", completed: "Completada", next: "Siguiente semana", week: "Semana", start: "Empieza la experiencia gratuita de 7 días", foundation: "Explora Foundation",
  },
});

function chapterNavigation(index, copy) {
  const previous = index > 0 ? `<a href="#week-${index}" class="curriculumWeekNav__previous">${copy.previous}</a>` : "";
  const next = index < 23 ? `<a href="#week-${index + 2}" class="curriculumWeekNav__next">${copy.next}</a>` : "";
  return `<nav class="curriculumWeekNav" aria-label="${copy.week} ${index + 1} navigation">${previous}<button type="button" class="mksStudyRoom__complete" data-complete-week="${index + 1}" aria-pressed="false" data-complete-label="${copy.complete}" data-completed-label="${copy.completed}">${copy.complete}</button>${next}</nav>`;
}
function transformQuestions(chapter) {
  const questionPair = /<div class="qaPair"><dt>([\s\S]*?)<\/dt><dd>([\s\S]*?)<\/dd><\/div>/g;
  return chapter
    .replace('<div class="weeklyQA">', '<div class="weeklyQA mksStudyRoom__questions">')
    .replace("<dl>", '<div class="mksStudyRoom__qaList">')
    .replace("</dl>", "</div>")
    .replace(questionPair, '<details class="mksStudyRoom__qa"><summary>$1</summary><div>$2</div></details>');
}

function chapterVideoCard(number, url) {
  return `<a class="weekVideo" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="Watch the Week ${number} Master Key lesson video in a new tab"><span class="weekVideoPlay" aria-hidden="true">▶</span><span><small>WEEK ${number} VIDEO</small><strong>Watch the guided lesson</strong><em>Opens the public video in Google Photos</em></span><b aria-hidden="true">↗</b></a>`;
}

function renderChapters(language) {
  if (chapterGridStart < 0 || chapterGridEnd < 0) throw new Error("Master Key curriculum chapters could not be located.");
  const source = curriculum.slice(chapterGridStart + chapterGridOpening.length, chapterGridEnd);
  const fragments = source.split("</details><details>");
  if (fragments.length !== 24) throw new Error("Expected exactly 24 Master Key curriculum chapters.");
  const copy = roomCopy[language] ?? roomCopy.en;

  return fragments.map((fragment, index) => {
    const opening = index === 0 ? fragment : `<details>${fragment}`;
    let chapter = `${opening}${index === fragments.length - 1 ? "" : "</details>"}`
      .replace("<details>", `<details id="week-${index + 1}" class="mksStudyRoom__chapter" data-week="${index + 1}">`)
      .replaceAll("AI MASTERY COACH", "AI MASTERY PROMPT")
      .replace("Paste this into ChatGPT. Your AI coach will test, challenge and guide you one step at a time—without giving away the answers too early.", "Copy this guided prompt into ChatGPT to explore this week's Master Key lesson more deeply.")
      .replaceAll("<h3>Exercise</h3>", "<h3>About the exercise</h3>");
    if (index === 0) {
      chapter = chapter.replace(/<h3>Introduction<\/h3>[\s\S]*?(?=<a class="weekVideo")/, chapterOneAbout);
      chapter = chapter.replace(/(<h3>About the exercise<\/h3><p>[\s\S]*?<\/p>)(?=<div class="aiMastery">)/, `$1${chapterOneExerciseAbout.replace("<div><p>", "<div><h3>About the exercise</h3><p>")}`);
    } else if (chapterGuidance[index + 1]) {
      chapter = chapter.replace("<h3>Introduction</h3>", `${renderChapterGuidance(chapterGuidance[index + 1])}<h3>Introduction</h3>`);
      chapter = chapter.replace(/(<h3>About the exercise<\/h3><p>[\s\S]*?<\/p>)(?=<div class="aiMastery">)/, `$1${renderExerciseDisclosure(chapterGuidance[index + 1].exercise)}`);
    }
    chapter = transformQuestions(chapter);
    if (chapterVideos[index + 1]) chapter = chapter.replace("<h3>Introduction</h3>", `<h3>Introduction</h3>${chapterVideoCard(index + 1, chapterVideos[index + 1])}`);
    chapter = chapter.replace("</div></details>", `${chapterNavigation(index, copy)}</div></details>`);
    return { index, title: chapter.match(/<summary>[\s\S]*?<strong>([\s\S]*?)<\/strong>/)?.[1] ?? `${copy.week} ${index + 1}`, html: chapter };
  });
}

function renderCourseNavigation(chapters, copy) {
  const stagesMarkup = stages.map((stage) => `<section class="mksStudyRoom__stage" data-stage="${stage.id}"><header><p>${stage.weeks}</p><h2>${stage.title}</h2></header><ol>${chapters.slice(stage.start, stage.end).map((chapter) => `<li><a href="#week-${chapter.index + 1}"><span>${copy.week} ${chapter.index + 1}</span><strong>${chapter.title}</strong></a></li>`).join("")}</ol></section>`).join("");
  return `<nav class="mksStudyRoom__courseNav" aria-label="${copy.navigation}">${stagesMarkup}<p class="mksStudyRoom__conversion"><a href="/start-free/">${copy.start}</a> · <a href="/foundation/">${copy.foundation}</a></p></nav>`;
}

function renderStageVisualNavigation(copy) {
  return `<nav class="mksStudyRoom__visualNav" aria-label="${copy.navigation}">${stages.map((stage) => `<a href="#stage-${stage.id}" class="mksStudyRoom__visualNavLink"><img src="/images/master-key-visuals/${stage.image}" alt="${stage.title} — ${stage.weeks}" loading="lazy"><span>${stage.title}</span></a>`).join("")}</nav>`;
}

function renderCurriculum(language) {
  const copy = roomCopy[language] ?? roomCopy.en;
  const chapters = renderChapters(language);
  const options = chapters.map((chapter) => `<option value="week-${chapter.index + 1}">${copy.week} ${chapter.index + 1} — ${chapter.title}</option>`).join("");
  const foundationCta = `<aside class="mksStudyRoom__foundationCta" aria-labelledby="mks-foundation-cta-heading"><p id="mks-foundation-cta-heading" data-i18n="mks.foundationCta.heading">${t("mks.foundationCta.heading", language)}</p><a class="button--secondary" href="/foundation/" data-i18n="mks.foundationCta.action">${t("mks.foundationCta.action", language)}</a></aside>`;
  const groupedChapters = stages.map((stage) => `<section class="mksStudyRoom__stageBlock" id="stage-${stage.id}" data-stage="${stage.id}"><a class="mksStudyRoom__stageBanner" href="#week-${stage.start + 1}" aria-label="${stage.title} — ${stage.weeks}"><img src="/images/master-key-visuals/${stage.image}" alt="${stage.title} — ${stage.weeks}" loading="lazy"></a><header class="mksStudyRoom__stageHeader"><p>${stage.weeks}</p><h2>${stage.title}</h2></header><div class="chapterGrid">${chapters.slice(stage.start, stage.end).map((chapter) => chapter.html).join("")}</div></section>${stage.id === "foundation" ? foundationCta : ""}`).join("");

  return `<section class="mksStudyRoom__shell" id="study-room"><header class="mksStudyRoom__intro"><p class="eyebrow">${copy.eyebrow}</p><h1>Chapter 1 - One Consciousness – One Power</h1><p>${copy.intro}</p></header><div class="mksStudyRoom__layout"><aside class="mksStudyRoom__sidebar"><label for="mks-week-select">${copy.choose}</label><select id="mks-week-select" class="mksStudyRoom__select" aria-label="${copy.choose}">${options}</select>${renderStageVisualNavigation(copy)}${renderCourseNavigation(chapters, copy)}</aside><div class="mksStudyRoom__lesson"><section class="mksStudyRoom__current" aria-labelledby="mks-current-title"><p class="eyebrow">${copy.current}</p><h2 id="mks-current-title">${copy.week} 1 · Foundation</h2><p class="mksStudyRoom__currentTitle">One Consciousness – One Power</p><p class="mksStudyRoom__purpose"><strong>${copy.purpose}</strong> Study the relationship between the world within and the world without, then practise stillness and conscious choice.</p><div class="mksStudyRoom__progress"><span>${copy.progress}</span><progress value="1" max="24">1/24</progress></div><aside class="mksStudyRoom__rhythm"><strong>${copy.rhythm}</strong><span>${copy.rhythmText}</span></aside></section><div class="mksStudyRoom__chapters">${groupedChapters}</div></div></div></section>`;
}

export function masterKeyCurriculumPage(data, language = "en") {
  return {
    route: data.routes.masterKeySystem,
    language,
    title: t("route.masterKeySystem.metaTitle", language),
    description: t("route.masterKeySystem.metaDescription", language),
    titleKey: "route.masterKeySystem.metaTitle",
    descriptionKey: "route.masterKeySystem.metaDescription",
    body: `<main class="curriculumPage mksStudyRoom" id="main-content">${renderCurriculum(language)}</main>`,
    styles: ["/assets/platform.css"],
    scripts: ["/assets/curriculum.mjs"],
  };
}
