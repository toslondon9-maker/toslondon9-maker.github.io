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
