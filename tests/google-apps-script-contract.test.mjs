import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../integrations/google-apps-script/lead-capture.gs", import.meta.url), "utf8");
const fixedNow = new Date("2026-09-04T10:00:00Z").getTime();
const lead = (overrides = {}) => ({
  gatewaySecret: "shared-secret", submissionId: "9d5e99a1-8280-4e41-89ac-4e2e051569d2", submittedAtMs: fixedNow - 5_000,
  firstName: "Ada", surname: "Lovelace", email: "ADA@example.test", whatsapp: "+34 611 223 345", goal: "Build a calmer daily practice.", difficulty: "I lose focus when busy.", consent: true, emailMarketing: false, sourcePage: "/start-free/", language: "en", website: "", ...overrides,
});

function receiver({ now = new Date("2026-09-04T10:00:00Z") } = {}) {
  const rows = []; const properties = new Map(Object.entries({ LEAD_CAPTURE_SHARED_SECRET: "shared-secret", LEAD_SHEET_ID: "sheet", LEAD_SHEET_NAME: "Leads", LEAD_NOTIFICATION_EMAIL: "toslondon9@gmail.com", LEAD_DUPLICATE_WINDOW_MINUTES: "60" }));
  const sheet = {
    getLastRow: () => rows.length,
    appendRow: (row) => rows.push(row),
    getDataRange: () => ({ getValues: () => rows }),
    getRange: (row, column) => ({ setValues: (values) => { rows[row - 1].splice(column - 1, values[0].length, ...values[0]); } }),
  };
  const context = {
    JSON, Date: class extends Date { constructor(...args) { super(args.length ? args[0] : now); } static now() { return now.getTime(); } },
    ContentService: { MimeType: { JSON: "json" }, createTextOutput: (text) => ({ text, setMimeType() { return this; } }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (key) => properties.get(key) }) },
    LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock() {} }) },
    SpreadsheetApp: { openById: () => ({ getSheetByName: () => sheet }) },
    MailApp: { getRemainingDailyQuota: () => 5, sendEmail() {} },
    Utilities: { DigestAlgorithm: { SHA_256: "sha256" }, computeDigest: (_algorithm, value) => [...Buffer.from(value)] },
    Buffer,
  };
  vm.runInNewContext(source, context);
  return { submit: (payload) => JSON.parse(context.doPost({ postData: { contents: JSON.stringify(payload) } }).text), rows };
}

test("Apps Script receiver rejects direct malformed input after secret validation", () => {
  const app = receiver();
  assert.deepEqual(app.submit(lead({ goal: "", consent: false })), { ok: false, code: "invalid" });
  assert.deepEqual(app.submit(lead({ email: "not-an-email" })), { ok: false, code: "invalid" });
  assert.deepEqual(app.submit(lead({ whatsapp: "611223345" })), { ok: false, code: "invalid" });
  assert.deepEqual(app.submit(lead({ sourcePage: "/other/" })), { ok: false, code: "invalid" });
  assert.deepEqual(app.submit(lead({ language: "fr" })), { ok: false, code: "invalid" });
  assert.equal(app.rows.length, 0);
});

test("Apps Script receiver stores explicit marketing choice and idempotently deduplicates same contact within the configured window", () => {
  const app = receiver();
  assert.deepEqual(app.submit(lead()), { ok: true, stored: true, notification: "sent" });
  assert.equal(app.rows.length, 2);
  assert.equal(app.rows[1].includes("false"), true);
  const duplicate = app.submit(lead({ submissionId: "4d5e99a1-8280-4e41-89ac-4e2e051569d2", email: "ada@example.test", whatsapp: "+34611223345" }));
  assert.deepEqual(duplicate, { ok: true, stored: true, notification: "sent" });
  assert.equal(app.rows.length, 2);
});

test("Apps Script receiver keeps submission-ID retries idempotent without another row", () => {
  const app = receiver(); app.submit(lead());
  assert.deepEqual(app.submit(lead()), { ok: true, stored: true, notification: "sent" });
  assert.equal(app.rows.length, 2);
});

test("Apps Script receiver stores user-supplied spreadsheet formulas as literal text", () => {
  const app = receiver();
  app.submit(lead({ firstName: "=SUM(A1:A2)" }));
  assert.equal(app.rows[1][2], "'=SUM(A1:A2)");
});
