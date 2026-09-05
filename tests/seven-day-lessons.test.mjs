import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { sevenDayExperience } from "../content/seven-day-experience.mjs";
import { siteData } from "../content/site-data.mjs";
import { t } from "../content/translations.mjs";
import { routeRenderers } from "../src/routes.mjs";

function lessonPage(lesson) {
  return routeRenderers[lesson.route](siteData);
}

test("every seven-day lesson renders its complete teaching and practice flow without JavaScript", () => {
  const { lesson: headings, navigation, progress } = sevenDayExperience.sharedKeys;

  for (const lesson of sevenDayExperience.lessons) {
    const page = lessonPage(lesson);
    const html = page.body;

    assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1, `${lesson.id} should have one H1`);
    assert.match(html, new RegExp(`data-i18n="${lesson.contentKeys.title}"`));
    assert.match(html, new RegExp(`>${escapeRegExp(escapeHtml(t(lesson.contentKeys.title, "en")))}<`));

    for (const [section, headingKey] of practiceHeadings(headings)) {
      const contentKey = lesson.contentKeys[section];
      assert.match(html, new RegExp(`<section[^>]+aria-labelledby="${lesson.id}-${section}"[\\s\\S]*?<h2 id="${lesson.id}-${section}"[^>]+data-i18n="${headingKey}">[\\s\\S]*?data-i18n="${contentKey}"`));
      assert.match(html, new RegExp(escapeRegExp(escapeHtml(t(contentKey, "en")))));
    }

    assert.match(html, new RegExp(`<button[^>]+type="button"[^>]+data-progress-complete="${lesson.id}"[^>]+disabled[^>]*data-i18n="${lesson.contentKeys.completion}"`));
    assert.match(html, new RegExp(`role="status"[^>]+data-progress-status[^>]+data-i18n="${progress.empty}"`));
    assert.match(html, new RegExp(`data-i18n="${lesson.contentKeys.status}"`));
    assert.doesNotMatch(html, /data-lead-capture|lead sheet|Google Sheet/i);

    assert.match(html, new RegExp(`href="${siteData.routes.startFree}"[^>]+data-i18n="${navigation.dashboard}"`));
    assert.match(html, /data-contact-action/);
  }
});

test("lessons provide working sequential navigation and reserve coaching for day seven", () => {
  const { navigation } = sevenDayExperience.sharedKeys;

  for (const [index, lesson] of sevenDayExperience.lessons.entries()) {
    const html = lessonPage(lesson).body;
    const previous = sevenDayExperience.lessons[index - 1];
    const next = sevenDayExperience.lessons[index + 1];

    if (previous) {
      assert.match(html, new RegExp(`href="${previous.route}"[^>]+data-i18n="${navigation.previous}"`));
    } else {
      assert.doesNotMatch(html, new RegExp(`href="${sevenDayExperience.lessons.at(-1).route}"[^>]+data-i18n="${navigation.previous}"`));
    }

    if (next) {
      assert.match(html, new RegExp(`href="${next.route}"[^>]+data-i18n="${lesson.contentKeys.navigation}"`));
    } else {
      assert.match(html, new RegExp(`href="${siteData.routes.startFree}"[^>]+data-i18n="${lesson.contentKeys.navigation}"`));
    }

    if (lesson.sequence === 7) {
      assert.match(html, new RegExp(`href="${siteData.routes.coaching}"[^>]+data-i18n="cta.exploreJourney"`));
    } else {
      assert.doesNotMatch(html, new RegExp(`href="${siteData.routes.coaching}"`));
    }
  }
});

test("lesson pages expose every changeable value to the runtime language switcher", () => {
  const { dashboard, lesson: headings, navigation, progress } = sevenDayExperience.sharedKeys;

  for (const lesson of sevenDayExperience.lessons) {
    const html = lessonPage(lesson).body;
    const keys = [
      lesson.contentKeys.title,
      lesson.contentKeys.teaching,
      lesson.contentKeys.observation,
      lesson.contentKeys.reflection,
      lesson.contentKeys.action,
      lesson.contentKeys.completion,
      lesson.contentKeys.navigation,
      lesson.contentKeys.status,
      ...Object.values(headings),
      navigation.dashboard,
      dashboard.eyebrow,
      progress.heading,
      progress.empty,
    ];
    if (lesson.sequence > 1) keys.push(navigation.previous);
    if (lesson.sequence === 7) keys.push("cta.exploreJourney");

    for (const key of keys) assert.match(html, new RegExp(`data-i18n="${key}"`), `${lesson.id} needs ${key}`);
  }
});

test("lesson pages load one reversible progress enhancement and stay fully available without it", () => {
  for (const lesson of sevenDayExperience.lessons) {
    const page = lessonPage(lesson);

    assert.deepEqual(page.scripts, ["/assets/seven-day-progress.mjs", "/assets/seven-day-workbook.mjs"]);
    assert.match(page.body, new RegExp(`data-progress-complete="${lesson.id}"[^>]+disabled`));
    assert.match(page.body, new RegExp(`href="${siteData.routes.startFree}"`));
  }
});

test("every lesson includes a private online workbook that remains on the visitor device", () => {
  const workbook = sevenDayExperience.sharedKeys.workbook;

  for (const lesson of sevenDayExperience.lessons) {
    const page = lessonPage(lesson);
    const html = page.body;

    assert.match(html, new RegExp(`<textarea[^>]+data-workbook-answer[^>]+data-workbook-lesson="${lesson.id}"[^>]+maxlength="4000"`));
    assert.match(html, /data-workbook-status/);
    assert.match(html, new RegExp(`data-workbook-clear[^>]+data-workbook-lesson="${lesson.id}"`));
    assert.match(html, new RegExp(`data-i18n="${workbook.privacy}"`));
    assert.match(html, /Nothing you write here is sent to Tariq/);
    assert.ok(page.scripts.includes("/assets/seven-day-workbook.mjs"));
  }
});

test("lesson styles preserve the shared design system and collapse navigation safely on mobile", () => {
  const css = readFileSync(new URL("../assets/platform.css", import.meta.url), "utf8");

  for (const selector of [
    ".sevenDayLesson__header",
    ".sevenDayLesson__practice",
    ".sevenDayLesson__completion",
    ".sevenDayLesson__workbook",
    ".sevenDayLesson__navigation",
  ]) assert.match(css, new RegExp(escapeRegExp(selector)));
  assert.match(css, /\.sevenDayLesson__header[\s\S]*?var\(--night\)/);
  assert.match(css, /\.sevenDayLesson__practice[\s\S]*?var\(--paper\)/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*?\.sevenDayLesson__navigationActions[\s\S]*?grid-template-columns: minmax\(0, 1fr\)/);
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function practiceHeadings(headings) {
  return Object.entries(headings).map(([name, key]) => [name.replace("Heading", ""), key]);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
