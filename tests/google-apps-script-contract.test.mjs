import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const source = readFileSync(new URL("../integrations/google-apps-script/lead-capture.gs", import.meta.url), "utf8");
test("Apps Script receiver uses doPost, LockService, Script Properties and no Logger calls", () => {
  assert.match(source, /function doPost\(e\)/); assert.match(source, /LockService\.getScriptLock/); assert.match(source, /PropertiesService\.getScriptProperties/); assert.doesNotMatch(source, /Logger\.|console\.log|console\.error/);
});
test("Apps Script source stores notification status and spreadsheet-safe values", () => {
  assert.match(source, /Notification status/); assert.match(source, /MailApp\.getRemainingDailyQuota/); assert.match(source, /sanitizeSpreadsheetValue/);
});
