import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import { resourcesPage } from "../src/pages/resources.mjs";
import { masterKeyCurriculumPage } from "../src/pages/master-key-curriculum.mjs";

const download = "/downloads/mks-end-result.pdf";

test("the 24-week end-result PDF is an available Resources download", async () => {
  const page = resourcesPage();
  await access(new URL(`../${download}`, import.meta.url));
  assert.match(page.body, new RegExp(`href="${download}"[^>]*download[^>]*>Download the 24-Week End Result`));
  assert.match(page.body, /“All life and all power is from within\.” <span>— Charles F\. Haanel/);
});

test("the curriculum completion area links students to the end-result PDF", () => {
  const page = masterKeyCurriculumPage();
  assert.match(page.body, new RegExp(`href="${download}"[^>]*download[^>]*>Download the 24-Week End Result`));
  assert.match(page.body, /“Thought is spiritual energy\.” <cite>— Charles F\. Haanel/);
  assert.match(page.body, /“Thought is the seed; it results in action, and action results in form\.” <cite>— Charles F\. Haanel/);
});
