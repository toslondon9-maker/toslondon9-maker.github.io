import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../integrations/google-apps-script/lead-capture.gs", import.meta.url), "utf8");
const registrationTime = new Date("2026-09-04T10:00:00Z").getTime();

function sampleLead(overrides = {}) {
  return {
    gatewaySecret: "test-secret", submissionId: "9d5e99a1-8280-4e41-89ac-4e2e051569d2", submittedAtMs: registrationTime - 5_000,
    firstName: "Sample", surname: "Visitor", email: "visitor@example.test", whatsapp: "+34611223345",
    goal: "Build a steady practice.", difficulty: "I lose focus when busy.", consent: true,
    emailMarketing: false, sourcePage: "/start-free/", language: "en", website: "", ...overrides,
  };
}

function makeApp({ emailFailure = false, failAfter = null } = {}) {
  const rows = [];
  const properties = new Map(Object.entries({
    LEAD_CAPTURE_SHARED_SECRET: "test-secret", LEAD_SHEET_ID: "sheet", LEAD_SHEET_NAME: "Leads",
    LEAD_NOTIFICATION_EMAIL: "owner@example.test", LEAD_DUPLICATE_WINDOW_MINUTES: "60", LEAD_SEQUENCE_MODE: "live",
  }));
  const sentEmails = [];
  const mailState = { emailFailure, failAfter };
  const sheet = {
    getLastRow: () => rows.length,
    appendRow: (row) => rows.push(row),
    getDataRange: () => ({ getValues: () => rows }),
    getRange: (row, column) => ({ setValues: (values) => rows[row - 1].splice(column - 1, values[0].length, ...values[0]) }),
  };
  const context = {
    JSON, Buffer,
    Date: class extends Date { constructor(...args) { super(args.length ? args[0] : registrationTime); } static now() { return registrationTime; } },
    ContentService: { MimeType: { JSON: "json" }, createTextOutput: (text) => ({ text, setMimeType() { return this; } }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (key) => properties.get(key) }) },
    LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock() {} }) },
    SpreadsheetApp: { openById: () => ({ getSheetByName: () => sheet }) },
    MailApp: {
      getRemainingDailyQuota: () => 5,
      sendEmail(...args) {
        if (mailState.emailFailure || (mailState.failAfter !== null && sentEmails.length >= mailState.failAfter)) throw new Error("provider failure");
        sentEmails.push(args);
      },
    },
    Utilities: {
      DigestAlgorithm: { SHA_256: "sha256" }, computeDigest: (_algorithm, value) => [...Buffer.from(value)],
      formatDate: (date) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(date),
    },
  };
  vm.runInNewContext(source, context);
  return {
    submit: (lead) => JSON.parse(context.doPost({ postData: { contents: JSON.stringify(lead) } }).text),
    runSequence: (date) => context.sendDueSequenceEmails(date), rows, sentEmails, mailState,
  };
}

test("immediate service welcome remains available while non-marketing leads receive no Day 2 through Day 7 messages", () => {
  const app = makeApp();

  assert.deepEqual(app.submit(sampleLead()), { ok: true, stored: true, notification: "sent" });
  assert.equal(app.sentEmails.length, 2, "notification and immediate service welcome are sent");
  assert.equal(app.sentEmails[1][1], "Welcome to your Free 7-Day Experience");
  app.runSequence(new Date("2026-09-05T09:00:00+02:00"));

  assert.equal(app.sentEmails.length, 2);
  assert.equal(app.rows[1][20], 1);
});

test("eligible sequence messages progress one day, prevent duplicates, and record safe send failures", () => {
  const app = makeApp({ failAfter: 2 });
  const optedIn = sampleLead({ emailMarketing: true });

  app.submit(optedIn);
  app.submit({ ...optedIn, submissionId: "4d5e99a1-8280-4e41-89ac-4e2e051569d2" });
  assert.equal(app.sentEmails.length, 2, "a duplicate row cannot resend the service welcome");

  app.runSequence(new Date("2026-09-05T09:00:00+02:00"));
  assert.equal(app.rows[1][20], 1);
  assert.equal(app.rows[1][22], "failed");
  assert.equal(app.rows[1][23], "Email delivery failed");
  assert.doesNotMatch(app.rows[1][23], /visitor@example\.test|\+34611223345/);

  app.mailState.failAfter = null;
  app.runSequence(new Date("2026-09-05T10:00:00+02:00"));
  app.runSequence(new Date("2026-09-05T11:00:00+02:00"));
  assert.equal(app.sentEmails.length, 3, "one retry sends only the next due day once");
  assert.equal(app.rows[1][20], 2);
  assert.equal(app.rows[1][22], "sent");
});
