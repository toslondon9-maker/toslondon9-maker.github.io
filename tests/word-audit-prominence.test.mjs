import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the intact 3-Day Word Audit is a collapsed optional item", async () => {
  const rsc = await readFile("index.rsc", "utf8");
  const record = rsc.split(/\r?\n/).find((line) => line.startsWith("d:"));
  assert.ok(record, "word-audit record should exist");

  const element = JSON.parse(record.slice(2));
  assert.equal(element[1], "details");
  assert.equal(element[3].open, undefined);
  assert.equal(element[3].children[0][1], "summary");
  assert.equal(element[3].children[0][3].children, "Optional: 3-Day Word Audit");
  assert.deepEqual(
    element[3].children[1][3].children.map((item) => item[3].children),
    [
      "Notice recurring words and complaints.",
      "Write the thought beneath each phrase.",
      "Replace one limiting phrase with a truthful, constructive alternative.",
      "Support the new thought with one practical action.",
    ],
  );
});
