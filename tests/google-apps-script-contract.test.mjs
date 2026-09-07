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

function receiver({ now = new Date("2026-09-04T10:00:00Z"), emailFailure = false, failAfter = null, sequenceMode, sequenceTestEmail } = {}) {
  const rows = []; const propertyValues = { LEAD_CAPTURE_SHARED_SECRET: "shared-secret", LEAD_SHEET_ID: "sheet", LEAD_SHEET_NAME: "Leads", LEAD_NOTIFICATION_EMAIL: "toslondon9@gmail.com", LEAD_DUPLICATE_WINDOW_MINUTES: "60" };
  if (sequenceMode !== undefined) propertyValues.LEAD_SEQUENCE_MODE = sequenceMode;
  if (sequenceTestEmail !== undefined) propertyValues.LEAD_SEQUENCE_TEST_EMAIL = sequenceTestEmail;
  const properties = new Map(Object.entries(propertyValues));
  const sentEmails = [];
  const mailState = { emailFailure, failAfter };
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
    MailApp: { getRemainingDailyQuota: () => 5, sendEmail(...args) { if (mailState.emailFailure || (mailState.failAfter !== null && sentEmails.length >= mailState.failAfter)) throw new Error("provider failure"); sentEmails.push(args); } },
    Utilities: { DigestAlgorithm: { SHA_256: "sha256" }, computeDigest: (_algorithm, value) => [...Buffer.from(value)], formatDate: (date) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(date) },
    Buffer,
  };
  vm.runInNewContext(source, context);
  return { submit: (payload) => JSON.parse(context.doPost({ postData: { contents: JSON.stringify(payload) } }).text), runSequence: (date) => context.sendDueSequenceEmails(date), rows, sentEmails, mailState };
}

test("Apps Script receiver rejects direct malformed input after secret validation", () => {
  const app = receiver({ sequenceMode: "live" });
  assert.deepEqual(app.submit(lead({ goal: "", consent: false })), { ok: false, code: "invalid" });
  assert.deepEqual(app.submit(lead({ email: "not-an-email" })), { ok: false, code: "invalid" });
  assert.deepEqual(app.submit(lead({ whatsapp: "611223345" })), { ok: false, code: "invalid" });
  assert.deepEqual(app.submit(lead({ sourcePage: "/other/" })), { ok: false, code: "invalid" });
  assert.deepEqual(app.submit(lead({ language: "fr" })), { ok: false, code: "invalid" });
  assert.equal(app.rows.length, 0);
});

test("Apps Script receiver rejects a blank goal after secret validation", () => {
  const app = receiver();
  assert.deepEqual(app.submit(lead({ goal: "" })), { ok: false, code: "invalid" });
  assert.equal(app.rows.length, 0);
  assert.equal(app.sentEmails.length, 0);
});

test("Apps Script receiver rejects a whitespace-only goal after secret validation", () => {
  const app = receiver();
  assert.deepEqual(app.submit(lead({ goal: "   " })), { ok: false, code: "invalid" });
  assert.equal(app.rows.length, 0);
  assert.equal(app.sentEmails.length, 0);
});

test("Apps Script receiver rejects a blank difficulty after secret validation", () => {
  const app = receiver();
  assert.deepEqual(app.submit(lead({ difficulty: "" })), { ok: false, code: "invalid" });
  assert.equal(app.rows.length, 0);
  assert.equal(app.sentEmails.length, 0);
});

test("Apps Script receiver rejects a whitespace-only difficulty after secret validation", () => {
  const app = receiver();
  assert.deepEqual(app.submit(lead({ difficulty: "\t  " })), { ok: false, code: "invalid" });
  assert.equal(app.rows.length, 0);
  assert.equal(app.sentEmails.length, 0);
});

test("Apps Script receiver stores explicit marketing choice and idempotently deduplicates same contact within the configured window", () => {
  const app = receiver({ sequenceMode: "live" });
  assert.deepEqual(app.submit(lead()), { ok: true, stored: true, notification: "sent" });
  assert.equal(app.rows.length, 2);
  assert.equal(app.rows[1].includes("false"), true);
  const duplicate = app.submit(lead({ submissionId: "4d5e99a1-8280-4e41-89ac-4e2e051569d2", email: "ada@example.test", whatsapp: "+34611223345" }));
  assert.deepEqual(duplicate, { ok: true, stored: true, notification: "sent" });
  assert.equal(app.rows.length, 2);
});

test("Apps Script receiver preserves an optional affiliate code in the lead row", () => {
  const app = receiver();
  app.submit(lead({ affiliate_code: "englishbookshop" }));
  assert.equal(app.rows[1][24], "englishbookshop");
  assert.deepEqual(app.submit(lead({ submissionId: "4d5e99a1-8280-4e41-89ac-4e2e051569d2", affiliate_code: "bad code!" })), { ok: false, code: "invalid" });
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

test("new lead is saved before one personalised welcome email is sent", () => {
  const app = receiver();
  assert.deepEqual(app.submit(lead()), { ok: true, stored: true, notification: "sent" });
  assert.equal(app.rows.length, 2);
  assert.equal(app.sentEmails.length, 2);
  const welcome = app.sentEmails[1];
  assert.equal(welcome[0], "ADA@example.test".toLowerCase());
  assert.equal(welcome[1], "Welcome to your Free 7-Day Experience");
  assert.match(welcome[2], /Hi Ada/);
  assert.match(welcome[2], /day-1-see-whats-running-your-life/);
  assert.equal(app.rows[1][17], "sent");
  assert.ok(app.rows[1][18]);
});

test("duplicate submission does not send a second welcome email", () => {
  const app = receiver();
  app.submit(lead());
  app.submit(lead({ submissionId: "4d5e99a1-8280-4e41-89ac-4e2e051569d2" }));
  assert.equal(app.sentEmails.length, 2);
});

test("welcome email failure keeps the saved row and records a safe failure", () => {
  const app = receiver({ emailFailure: true });
  assert.deepEqual(app.submit(lead()), { ok: true, stored: true, notification: "pending" });
  assert.equal(app.rows.length, 2);
  assert.equal(app.rows[1][17], "failed");
  assert.equal(app.rows[1][18], "");
  assert.equal(app.rows[1][19], "Email delivery failed");
});

test("Day 2 becomes due on the calendar day after registration", () => {
  const app = receiver({ sequenceMode: "live" });
  app.submit(lead());
  app.runSequence(new Date("2026-09-05T09:00:00+02:00"));
  assert.equal(app.sentEmails.length, 3);
  assert.equal(app.sentEmails[2][1], "Day 2 of 7: Take Back Your Attention");
  assert.equal(app.rows[1][20], 2);
});

test("repeated scheduler runs do not send the same sequence day twice", () => {
  const app = receiver({ sequenceMode: "live" });
  app.submit(lead());
  const nextDay = new Date("2026-09-05T09:00:00+02:00");
  app.runSequence(nextDay);
  app.runSequence(nextDay);
  assert.equal(app.sentEmails.length, 3);
  assert.equal(app.rows[1][20], 2);
});

test("sequence does not send before the Day 1 welcome is marked sent", () => {
  const app = receiver({ emailFailure: true });
  app.submit(lead());
  app.runSequence(new Date("2026-09-05T09:00:00+02:00"));
  assert.equal(app.sentEmails.length, 0);
  assert.equal(app.rows[1][20], "0");
});

test("failed sequence email records failure and retries the same day later", () => {
  const app = receiver({ sequenceMode: "live", failAfter: 2 });
  app.submit(lead());
  app.runSequence(new Date("2026-09-05T09:00:00+02:00"));
  assert.equal(app.rows[1][20], 1);
  assert.equal(app.rows[1][22], "failed");
  app.mailState.failAfter = null;
  app.runSequence(new Date("2026-09-05T10:00:00+02:00"));
  assert.equal(app.sentEmails.length, 3);
  assert.equal(app.rows[1][20], 2);
  assert.equal(app.rows[1][22], "sent");
});

test("scheduler source contains no logging of lead data", () => {
  assert.doesNotMatch(source, /Logger\.|console\.(log|error)/);
});

test("missing sequence mode is safely test-only", () => {
  const app = receiver({ sequenceTestEmail: "test-recipient@example.test" });
  app.submit(lead());
  app.runSequence(new Date("2026-09-05T09:00:00+02:00"));
  assert.equal(app.sentEmails[2][0], "test-recipient@example.test");
});

test("test mode never sends to a lead address", () => {
  const app = receiver({ sequenceMode: "test", sequenceTestEmail: "test-recipient@example.test" });
  app.submit(lead());
  app.runSequence(new Date("2026-09-05T09:00:00+02:00"));
  assert.equal(app.sentEmails[2][0], "test-recipient@example.test");
  assert.equal(app.sentEmails.some((email) => email[0] === "ada@example.test" && email[1].startsWith("Day ")), false);
});

test("test mode without a recipient sends no sequence email", () => {
  const app = receiver({ sequenceMode: "test" });
  app.submit(lead());
  app.runSequence(new Date("2026-09-05T09:00:00+02:00"));
  assert.equal(app.sentEmails.length, 2);
  assert.equal(app.rows[1][20], 1);
});

test("live mode retains normal sequence delivery", () => {
  const app = receiver({ sequenceMode: "live" });
  app.submit(lead());
  app.runSequence(new Date("2026-09-05T09:00:00+02:00"));
  assert.equal(app.sentEmails[2][0], "ada@example.test");
  assert.equal(app.rows[1][20], 2);
});
