import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
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
