import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const expectedRanges = ["Weeks 1–4", "Weeks 5–11", "Weeks 12–18", "Weeks 19–24"];

function visibleText(content) {
  return content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
}

test("visitor-facing programme phase ranges use the approved four ranges", async () => {
  const files = await Promise.all([
    readFile("index.html", "utf8"),
    readFile("coaching/index.html", "utf8"),
    readFile("tools/update-offers.ps1", "utf8"),
  ]);

  for (const source of files) {
    const content = visibleText(source);
    for (const range of expectedRanges) assert.match(content, new RegExp(range));
    assert.doesNotMatch(content, /Weeks (?:5–9|10–18|18–24)/);
  }
});
