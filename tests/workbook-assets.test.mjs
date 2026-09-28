import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import canonical from "../content/seven-day-canonical.json" with { type: "json" };
import { routeRenderers } from "../src/routes.mjs";
import { buildSite } from "../tools/build-site.mjs";

const workbookFile = "downloads/seven-day-experience-workbook-en.pdf";

test("the English workbook is a real downloadable PDF linked from the free dashboard", async () => {
  const workbook = await readFile(workbookFile);
  const workbookStats = await stat(workbookFile);
  const html = routeRenderers[siteData.routes.startFree](siteData).body;

  assert.equal(workbook.subarray(0, 5).toString(), "%PDF-");
  assert.ok(workbookStats.size > 10_000, "workbook should contain meaningful designed content");
  assert.match(html, /href="\/downloads\/seven-day-experience-workbook-en\.pdf"[^>]+download/);
  assert.match(html, /data-i18n="sevenDay\.workbook\.english"/);
  assert.doesNotMatch(html, /experiencia-siete-dias-cuaderno-es\.pdf/);
});

test("the deterministic site build publishes the English workbook", async () => {
  const outputRoot = await mkdtemp(path.join(os.tmpdir(), "unleash-workbook-"));

  try {
    const result = await buildSite({ outputRoot, check: true });
    assert.ok(result.files.includes(workbookFile));
    const built = await readFile(path.join(outputRoot, ...workbookFile.split("/")));
    assert.equal(built.subarray(0, 5).toString(), "%PDF-");
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test("the workbook generator consumes canonical lesson content and embeds fonts", async () => {
  const builder = await readFile("tools/build-seven-day-workbook.py", "utf8");
  const workbook = await readFile(workbookFile);
  assert.match(builder, /seven-day-canonical\.json/);
  assert.doesNotMatch(builder, /LESSONS\s*=\s*\[/);
  assert.match(builder, /copy\["mksConnection"\]/);
  assert.match(builder, /copy\["optionalPractice"\]/);
  assert.ok(canonical.lessons.every((lesson) => lesson.en.mksConnection && lesson.en.optionalPractice));
  assert.match(workbook.toString("latin1"), /FontFile/);
  assert.match(workbook.toString("latin1"), /Arial|Georgia/);
});
