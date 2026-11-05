import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the eight-principles PDF is a real downloadable PDF", async () => {
  const pdf = await readFile(new URL("../downloads/eight-principles-master-key-system.pdf", import.meta.url));
  assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
  assert.match(pdf.toString("latin1"), /The Eight Principles of the Master Key System/);
  assert.match(pdf.toString("latin1"), /2\. Tact/);
  assert.match(pdf.toString("latin1"), /start-free/);
});


test("the two previously missing article PDFs are real downloadable files", async () => {
  for (const [file, title] of [["when-life-feels-like-it-has-fallen-apart.pdf", "When Life Feels Like It Has Fallen Apart"], ["how-i-rebuilt-my-life-from-the-inside-out.pdf", "How I Rebuilt My Life from the Inside Out"]]) {
    const pdf = await readFile(new URL(`../downloads/${file}`, import.meta.url));
    assert.ok(pdf.length > 1000);
    assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
    assert.match(pdf.toString("latin1"), new RegExp(title));
    assert.match(pdf.toString("latin1"), /Unleash Your Power with Tariq/);
  }
});
