import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { sevenDayExperience } from "../content/seven-day-experience.mjs";
import { siteData } from "../content/site-data.mjs";
import { routeRenderers } from "../src/routes.mjs";
import { buildSite } from "../tools/build-site.mjs";

const expectedLessons = [
  ["day-1", 1, "see-whats-running-your-life", "/start-free/day-1-see-whats-running-your-life/", "See What's Running Your Life", "sevenDay.lessons.day1"],
  ["day-2", 2, "take-back-your-attention", "/start-free/day-2-take-back-your-attention/", "Take Back Your Attention", "sevenDay.lessons.day2"],
  ["day-3", 3, "recognise-what-keeps-repeating", "/start-free/day-3-recognise-what-keeps-repeating/", "Recognise What Keeps Repeating", "sevenDay.lessons.day3"],
  ["day-4", 4, "give-your-mind-a-direction", "/start-free/day-4-give-your-mind-a-direction/", "Give Your Mind a Direction", "sevenDay.lessons.day4"],
  ["day-5", 5, "become-someone-you-can-rely-on", "/start-free/day-5-become-someone-you-can-rely-on/", "Become Someone You Can Rely On", "sevenDay.lessons.day5"],
  ["day-6", 6, "change-from-the-inside-out", "/start-free/day-6-change-from-the-inside-out/", "Change From the Inside Out", "sevenDay.lessons.day6"],
  ["day-7", 7, "make-it-part-of-how-you-live", "/start-free/day-7-make-it-part-of-how-you-live/", "Make It Part of How You Live", "sevenDay.lessons.day7"],
];

test("the seven-day experience fixes the ordered lesson contract", () => {
  const lessons = sevenDayExperience.lessons;

  assert.deepEqual(
    lessons.map(({ id, sequence, slug, route, title, translationKey }) => [id, sequence, slug, route, title, translationKey]),
    expectedLessons,
  );
  assert.equal(Object.isFrozen(sevenDayExperience), true);
  assert.equal(Object.isFrozen(lessons), true);
  assert.equal(Object.isFrozen(lessons[0]), true);
});

test("experience lesson routes build without joining shared navigation routes", async () => {
  const lessonRoutes = expectedLessons.map(([, , , route]) => route);
  const outputRoot = await mkdtemp(path.join(os.tmpdir(), "unleash-seven-day-routes-"));

  try {
    assert.deepEqual(siteData.experienceRoutes, lessonRoutes);
    assert.deepEqual(
      siteData.experienceRoutes.filter((route) => Object.values(siteData.routes).includes(route)),
      [],
    );

    for (const route of [siteData.routes.startFree, ...siteData.experienceRoutes]) {
      assert.ok(routeRenderers[route], `${route} should have a renderer`);
    }

    const { files } = await buildSite({ outputRoot });
    assert.deepEqual(
      files.filter((file) => file.endsWith("index.html")).slice(-7),
      lessonRoutes.map((route) => `${route.slice(1)}index.html`),
    );
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});
