import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../integrations/google-apps-script/lead-capture.gs", import.meta.url), "utf8");
const fixedNow = new Date("2026-09-04T10:00:00Z").getTime();
const bookingUrl = `https://wa.me/34611223345?text=${encodeURIComponent("Hi Tariq, I’d like to book a free 15-minute call to discuss Unleash Your Power.")}`;
const dashboardUrl = "https://unleashyourpowerwithtariq.com/start-free/";
const lead = (overrides = {}) => ({
  gatewaySecret: "shared-secret", submissionId: "9d5e99a1-8280-4e41-89ac-4e2e051569d2", submittedAtMs: fixedNow - 5_000,
  firstName: "Ada", surname: "Lovelace", email: "ADA@example.test", whatsapp: "+34 611 223 345", goal: "Build a calmer daily practice.", difficulty: "I lose focus when busy.", consent: true, emailMarketing: false, sourcePage: "/start-free/", language: "en", website: "", ...overrides,
});

function receiver({ now = new Date("2026-09-04T10:00:00Z"), emailFailure = false, failAfter = null, sequenceMode, sequenceTestEmail } = {}) {
  const rows = []; const propertyValues = { LEAD_CAPTURE_SHARED_SECRET: "shared-secret", LEAD_SHEET_ID: "sheet", LEAD_SHEET_NAME: "Leads", LEAD_NOTIFICATION_EMAIL: "tariq@unleashyourpowerwithtariq.com", LEAD_DUPLICATE_WINDOW_MINUTES: "60" };
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
  assert.match(welcome[2], new RegExp(dashboardUrl));
  assert.match(welcome[2], new RegExp(bookingUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(welcome[3].htmlBody, new RegExp(bookingUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal(app.rows[1][17], "sent");
  assert.ok(app.rows[1][18]);
});

test("Spanish registration receives a complete Spanish welcome with Day 1, dashboard, and optional WhatsApp links", () => {
  const app = receiver();
  app.submit(lead({ language: "es" }));
  const welcome = app.sentEmails[1];

  assert.equal(welcome[1], "Bienvenido a tu experiencia gratuita de 7 días");
  assert.match(welcome[2], /Hola Ada/);
  assert.match(welcome[2], /Tu registro se ha completado/);
  assert.match(welcome[2], /Empieza el Día 1/);
  assert.match(welcome[2], new RegExp(dashboardUrl));
  assert.match(welcome[2], new RegExp(bookingUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(welcome[3].htmlBody, /habla con Tariq por WhatsApp/i);
  assert.doesNotMatch(`${welcome[1]} ${welcome[2]} ${welcome[3].htmlBody}`, /\b(?:leadCapture|phase2|route|sequence)\.[A-Za-z]/);
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
  app.submit(lead({ emailMarketing: true }));
  app.runSequence(new Date("2026-09-05T09:00:00+02:00"));
  assert.equal(app.sentEmails.length, 3);
  assert.equal(app.sentEmails[2][1], "Day 2 of 7: Take Back Your Attention");
  assert.equal(app.rows[1][20], 2);
});

test("repeated scheduler runs do not send the same sequence day twice", () => {
  const app = receiver({ sequenceMode: "live" });
  app.submit(lead({ emailMarketing: true }));
  const nextDay = new Date("2026-09-05T09:00:00+02:00");
  app.runSequence(nextDay);
  app.runSequence(nextDay);
  assert.equal(app.sentEmails.length, 3);
  assert.equal(app.rows[1][20], 2);
});

test("sequence does not send before the Day 1 welcome is marked sent", () => {
  const app = receiver({ emailFailure: true });
  app.submit(lead({ emailMarketing: true }));
  app.runSequence(new Date("2026-09-05T09:00:00+02:00"));
  assert.equal(app.sentEmails.length, 0);
  assert.equal(app.rows[1][20], "0");
});

test("failed sequence email records failure and retries the same day later", () => {
  const app = receiver({ sequenceMode: "live", failAfter: 2 });
  app.submit(lead({ emailMarketing: true }));
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
  app.submit(lead({ emailMarketing: true }));
  app.runSequence(new Date("2026-09-05T09:00:00+02:00"));
  assert.equal(app.sentEmails[2][0], "test-recipient@example.test");
});

test("test mode never sends to a lead address", () => {
  const app = receiver({ sequenceMode: "test", sequenceTestEmail: "test-recipient@example.test" });
  app.submit(lead({ emailMarketing: true }));
  app.runSequence(new Date("2026-09-05T09:00:00+02:00"));
  assert.equal(app.sentEmails[2][0], "test-recipient@example.test");
  assert.equal(app.sentEmails.some((email) => email[0] === "ada@example.test" && email[1].startsWith("Day ")), false);
});

test("test mode without a recipient sends no sequence email", () => {
  const app = receiver({ sequenceMode: "test" });
  app.submit(lead({ emailMarketing: true }));
  app.runSequence(new Date("2026-09-05T09:00:00+02:00"));
  assert.equal(app.sentEmails.length, 2);
  assert.equal(app.rows[1][20], 1);
});

test("live mode retains normal sequence delivery", () => {
  const app = receiver({ sequenceMode: "live" });
  app.submit(lead({ emailMarketing: true }));
  app.runSequence(new Date("2026-09-05T09:00:00+02:00"));
  assert.equal(app.sentEmails[2][0], "ada@example.test");
  assert.equal(app.rows[1][20], 2);
});

test("sequence emails use every canonical Day 2 through Day 7 route and subject", () => {
  const app = receiver({ sequenceMode: "live" });
  app.submit(lead({ emailMarketing: true }));
  const expected = [
    [2, "Take Back Your Attention", "/start-free/day-2-take-back-your-attention/"],
    [3, "Recognise What Keeps Repeating", "/start-free/day-3-recognise-what-keeps-repeating/"],
    [4, "Give Your Mind a Direction", "/start-free/day-4-give-your-mind-a-direction/"],
    [5, "Become Someone You Can Rely On", "/start-free/day-5-become-someone-you-can-rely-on/"],
    [6, "Change From the Inside Out", "/start-free/day-6-change-from-the-inside-out/"],
    [7, "Make It Part of How You Live", "/start-free/day-7-make-it-part-of-how-you-live/"],
  ];
  expected.forEach(([day, title, route], index) => {
    app.runSequence(new Date(`2026-09-${String(4 + day).padStart(2, "0")}T09:00:00+02:00`));
    const email = app.sentEmails[index + 2];
    assert.equal(email[1], `Day ${day} of 7: ${title}`);
    assert.match(email[2], new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(email[3].htmlBody, new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
  assert.equal(app.rows[1][20], 7);
});

test("Days 2 through 6 carry the approved engagement purpose in English and Spanish", () => {
  const english = receiver({ sequenceMode: "live" });
  const spanish = receiver({ sequenceMode: "live" });
  english.submit(lead({ emailMarketing: true }));
  spanish.submit(lead({ emailMarketing: true, language: "es" }));
  const expected = [
    [2, /observe and reflect/i, /observa y reflexiona/i],
    [3, /supportive check-in.+continue.+no purchase/i, /mensaje de apoyo.+continúa.+comprar/i],
    [4, /consistent practice/i, /práctica constante/i],
    [5, /review what you are noticing/i, /repasa lo que estás observando/i],
    [6, /decide what you would like to do next/i, /decidir qué te gustaría hacer después/i],
  ];

  expected.forEach(([day, englishCopy, spanishCopy], index) => {
    const due = new Date(`2026-09-${String(4 + day).padStart(2, "0")}T09:00:00+02:00`);
    english.runSequence(due);
    spanish.runSequence(due);
    assert.match(english.sentEmails[index + 2][2], englishCopy);
    assert.match(spanish.sentEmails[index + 2][2], spanishCopy);
  });
});

test("Day 7 sequence email includes the existing Foundation and complete-journey links", () => {
  const app = receiver({ sequenceMode: "live" });
  app.submit(lead({ emailMarketing: true }));
  for (let day = 2; day <= 7; day += 1) app.runSequence(new Date(`2026-09-${String(3 + day).padStart(2, "0")}T09:00:00+02:00`));
  assert.equal(app.sentEmails.length, 8);
  const email = app.sentEmails[7];
  assert.match(email[2], /https:\/\/www\.paypal\.com\/ncp\/payment\/V5QYXZZS6KQE2/);
  assert.match(email[2], /https:\/\/unleashyourpowerwithtariq\.com\/master-key-system\//);
  assert.match(email[3].htmlBody, /V5QYXZZS6KQE2/);
  assert.match(email[3].htmlBody, /master-key-system/);
  assert.match(email[2], /Congratulations.+reached the end of your Free 7-Day Experience/);
  assert.match(email[2], /free 15-minute WhatsApp conversation/);
  assert.match(email[2], new RegExp(bookingUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(email[3].htmlBody, new RegExp(bookingUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(email[2], /There is no pressure/);
  assert.match(email[2], /circumstances, participation and consistent practice/);
});

test("Spanish Day 7 congratulates the participant and offers every optional next step without pressure", () => {
  const app = receiver({ sequenceMode: "live" });
  app.submit(lead({ emailMarketing: true, language: "es" }));
  for (let day = 2; day <= 7; day += 1) app.runSequence(new Date(`2026-09-${String(3 + day).padStart(2, "0")}T09:00:00+02:00`));
  const email = app.sentEmails[7];

  assert.match(email[2], /Enhorabuena.+has llegado al final de tu experiencia gratuita de 7 días/);
  assert.match(email[2], /conversación gratuita de 15 minutos por WhatsApp/);
  assert.match(email[2], new RegExp(bookingUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(email[2], /Foundation de cuatro semanas por £97/);
  assert.match(email[2], /recorrido completo de 24 semanas/);
  assert.match(email[2], /No hay presión/);
  assert.match(email[3].htmlBody, /Enhorabuena/);
  assert.doesNotMatch(`${email[1]} ${email[2]} ${email[3].htmlBody}`, /\b(?:leadCapture|phase2|route|sequence)\.[A-Za-z]/);
});

test("Spanish sequence email uses the existing Spanish lesson title and supportive copy", () => {
  const app = receiver({ sequenceMode: "live" });
  app.submit(lead({ emailMarketing: true, language: "es" }));
  app.runSequence(new Date("2026-09-05T09:00:00+02:00"));
  const email = app.sentEmails[2];
  assert.equal(email[1], "Día 2 de 7: Recupera tu atención");
  assert.match(email[2], /Tu experiencia gratuita de 7 días está lista/);
  assert.match(email[3].htmlBody, /Recupera tu atención/);
});
