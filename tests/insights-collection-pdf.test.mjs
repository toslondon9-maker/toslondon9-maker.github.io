import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("all three branded Insights PDFs exist and contain their article identity", async () => {
  const files = {
    "charles-haanel-master-key-system-introduction.pdf": "An Introduction to Charles F. Haanel",
    "eight-principles-master-key-system.pdf": "The Eight Principles of the Master Key System",
    "world-within-and-world-without.pdf": "The World Within and the World Without",
  };
  for (const [file, title] of Object.entries(files)) {
    const pdf = await readFile(new URL(`../downloads/${file}`, import.meta.url));
    assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
    assert.match(pdf.toString("latin1"), new RegExp(title));
    assert.match(pdf.toString("latin1"), /start-free/);
    assert.match(pdf.toString("latin1"), /Reflection for the reader/);
    assert.match(pdf.toString("latin1"), /not an original Haanel lesson/);
    assert.doesNotMatch(pdf.toString("latin1"), /Lesson\s+[0-9]+/);
    assert.ok((pdf.toString("latin1").match(/\/Type \/Page\b/g) ?? []).length >= 1, `${file} has no page objects`);
  }
});
