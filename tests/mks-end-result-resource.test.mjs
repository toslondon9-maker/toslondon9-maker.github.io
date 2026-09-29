import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { resourcesPage } from "../src/pages/resources.mjs";
import { masterKeyCurriculumPage } from "../src/pages/master-key-curriculum.mjs";

const download = "/downloads/mks-end-result.pdf";

test("the 24-week end-result PDF is an available Resources download", async () => {
  const page = resourcesPage();
  await access(new URL(`../${download}`, import.meta.url));
  assert.match(page.body, new RegExp(`href="${download}"[^>]*download[^>]*>Download the 24-Week End Result`));
  assert.match(page.body, /“All life and all power is from within\.” <span>— Charles F\. Haanel/);
});

test("the Study Room keeps completion controls focused on study progress", () => {
  const page = masterKeyCurriculumPage(siteData);
  assert.equal((page.body.match(/data-complete-week="\d+"/g) ?? []).length, 24);
  assert.doesNotMatch(page.body, /READY TO GO DEEPER\?|EXPLORE THE 24-WEEK PROGRAMME/);
});
