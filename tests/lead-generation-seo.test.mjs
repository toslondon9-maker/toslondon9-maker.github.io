import assert from "node:assert/strict";
import test from "node:test";
import { homePage } from "../src/pages/home.mjs";
import { coachingPage } from "../src/pages/coaching.mjs";
import { startFreePage } from "../src/pages/start-free.mjs";

test("SEO metadata connects problem-aware searches to the free lead magnet and coaching offer", () => {
  const home = homePage();
  const coaching = coachingPage();
  const free = startFreePage();

  assert.match(home.title, /Focus & Mindset Coaching/);
  assert.match(home.description, /focus, concentration and mental discipline/i);
  assert.match(coaching.title, /Master Key System Coaching/);
  assert.match(coaching.description, /24-week personal coaching/i);
  assert.match(free.title, /Free 7-Day Focus & Mindset Experience/);
  assert.match(free.description, /seven guided lessons/i);

  for (const page of [home, coaching, free]) {
    assert.ok(page.description.length >= 80 && page.description.length <= 180);
    assert.ok(page.title.length <= 70);
  }
});

test("the lead-generation SEO plan documents the keyword-to-page map and all funnel stages", async () => {
  const { readFile } = await import("node:fs/promises");
  const plan = await readFile("docs/seo/organic-search-and-lead-conversion-plan.md", "utf8");

  for (const section of [
    "## Keyword-to-page map",
    "### Stage 1 — Search foundations",
    "### Stage 2 — Landing-page relevance and internal links",
    "### Stage 3 — Lead-magnet conversion",
    "### Stage 4 — Nurture and qualification",
    "### Stage 5 — Paid conversion",
    "### Stage 6 — Acquisition and iteration",
    "## Measurement dashboard requirements",
    "## Acceptance gates",
  ]) assert.ok(plan.includes(section), `Missing plan section: ${section}`);
});
