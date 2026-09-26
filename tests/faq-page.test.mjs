import assert from "node:assert/strict";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { routeRenderers } from "../src/routes.mjs";

test("FAQ payment answer links self-serve Foundation and questions separately", () => {
  for (const language of ["en", "es"]) {
    const html = routeRenderers[siteData.routes.faq](siteData, language).body;
    const answer = html.match(/<details><summary[^>]*>[^<]*(?:payment|pago)[\s\S]*?<\/details>/i)?.[0] ?? html;
    assert.match(answer, /href="\/start-free\/"/);
    assert.match(answer, /href="\/foundation\/"/);
    assert.match(answer, /href="\/contact\/"/);
  }
});
