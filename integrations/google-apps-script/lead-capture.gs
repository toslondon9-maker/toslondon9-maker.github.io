const LEAD_COLUMNS = ["Submission date/time", "Submission ID", "First name", "Surname", "Email", "WhatsApp", "Main goal", "Current difficulty", "WhatsApp consent", "Email marketing consent", "Source page", "Language", "Lead status", "Notes", "Notification status", "Remaining email quota", "Dedupe key", "Welcome email status", "Welcome email sent at", "Welcome email error"];
const LEAD_COLUMN_INDEX = { submissionId: 1, email: 4, whatsapp: 5, notification: 14, dedupe: 16, welcomeStatus: 17, welcomeSentAt: 18, welcomeError: 19 };
const LEAD_LIMITS = { name: 80, email: 254, whatsapp: 32, message: 1000 };
const LEAD_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const LEAD_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LEAD_WHATSAPP = /^\+[1-9]\d{7,30}$/;
function json(body) { return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON); }
function text(value) { return typeof value === "string" ? value.trim() : ""; }
function sanitizeSpreadsheetValue(value) { const safe = String(value === undefined || value === null ? "" : value).trim(); return /^[=+\-@]/.test(safe) ? "'" + safe : safe; }
function normaliseLead(request) { return { submissionId: text(request.submissionId), submittedAtMs: Number(request.submittedAtMs), firstName: text(request.firstName), surname: text(request.surname), email: text(request.email).toLowerCase(), whatsapp: text(request.whatsapp).replace(/[\s()-]/g, ""), goal: text(request.goal), difficulty: text(request.difficulty), consent: request.consent === true, emailMarketing: request.emailMarketing === true, sourcePage: text(request.sourcePage), language: text(request.language), website: text(request.website) }; }
function validLead(request, nowMs) {
  const lead = normaliseLead(request);
  if (!LEAD_UUID.test(lead.submissionId) || lead.website || lead.sourcePage !== "/start-free/" || ["en", "es"].indexOf(lead.language) === -1) return null;
  if (!lead.firstName || !lead.surname || lead.firstName.length > LEAD_LIMITS.name || lead.surname.length > LEAD_LIMITS.name) return null;
  if (!LEAD_EMAIL.test(lead.email) || lead.email.length > LEAD_LIMITS.email) return null;
  if (!LEAD_WHATSAPP.test(lead.whatsapp) || lead.whatsapp.length > LEAD_LIMITS.whatsapp) return null;
  if (!lead.goal || !lead.difficulty || lead.goal.length > LEAD_LIMITS.message || lead.difficulty.length > LEAD_LIMITS.message) return null;
  if (!lead.consent || typeof request.emailMarketing !== "boolean") return null;
  if (!isFinite(lead.submittedAtMs) || lead.submittedAtMs > nowMs || nowMs - lead.submittedAtMs < 3000) return null;
  return lead;
}
function dedupeKey(lead) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, lead.email + "\n" + lead.whatsapp);
  return bytes.map(function(byte) { const value = byte < 0 ? byte + 256 : byte; return ("0" + value.toString(16)).slice(-2); }).join("");
}
function priorNotification(row) { return row[LEAD_COLUMN_INDEX.welcomeStatus] === "sent" || row[LEAD_COLUMN_INDEX.welcomeStatus] === "Sent" || row[LEAD_COLUMN_INDEX.notification] === "Sent" ? "sent" : "pending"; }
function ensureColumns(sheet) {
  const values = sheet.getDataRange().getValues();
  if (!values.length) { sheet.appendRow(LEAD_COLUMNS); return; }
  const headers = values[0].map(String);
  const missing = LEAD_COLUMNS.filter(function(column) { return headers.indexOf(column) === -1; });
  if (missing.length) sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]);
}
function escapeHtml(value) { return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;"); }
function welcomeEmail(lead) {
  const firstName = escapeHtml(lead.firstName);
  const dayOne = "https://toslondon9-maker.github.io/start-free/day-1-see-whats-running-your-life/";
  const body = "Hi " + lead.firstName + ",\n\nWelcome — I’m really glad you’re here.\n\nOver the next seven days, you’ll take a little time each day to slow down, observe your thinking, and take one simple action. There is nothing to catch up on and no need to rush.\n\nYour first step is ready:\n\nStart Day 1:\n" + dayOne + "\n\nGive yourself a few quiet minutes today. Read the lesson, complete the exercise, and simply notice what comes up.\n\nI’ll be with you throughout the experience.\n\nWith you on the journey,\nTariq Saddique\nUnleash Your Power";
  const html = "<p>Hi " + firstName + ",</p><p>Welcome — I’m really glad you’re here.</p><p>Over the next seven days, you’ll take a little time each day to slow down, observe your thinking, and take one simple action. There is nothing to catch up on and no need to rush.</p><p>Your first step is ready:</p><p><a href=\"" + dayOne + "\">Start Day 1</a></p><p>Give yourself a few quiet minutes today. Read the lesson, complete the exercise, and simply notice what comes up.</p><p>I’ll be with you throughout the experience.</p><p>With you on the journey,<br>Tariq Saddique<br>Unleash Your Power</p>";
  return { body: body, html: html };
}
function doPost(e) {
  const properties = PropertiesService.getScriptProperties(); let request;
  try { request = JSON.parse(e.postData.contents); } catch (_) { return json({ ok: false, code: "invalid" }); }
  const secret = properties.getProperty("LEAD_CAPTURE_SHARED_SECRET");
  if (!secret || request.gatewaySecret !== secret) return json({ ok: false, code: "unauthorized" });
  const lead = validLead(request, Date.now()); if (!lead) return json({ ok: false, code: "invalid" });
  const lock = LockService.getScriptLock(); if (!lock.tryLock(5000)) return json({ ok: false, code: "unavailable" });
  try {
    const sheet = SpreadsheetApp.openById(properties.getProperty("LEAD_SHEET_ID")).getSheetByName(properties.getProperty("LEAD_SHEET_NAME"));
    if (!sheet) return json({ ok: false, code: "unavailable" });
    ensureColumns(sheet);
    const values = sheet.getDataRange().getValues(); const prior = values.slice(1).find(function(row) { return row[LEAD_COLUMN_INDEX.submissionId] === lead.submissionId; });
    if (prior) return json({ ok: true, stored: true, notification: priorNotification(prior) });
    const minutes = Number(properties.getProperty("LEAD_DUPLICATE_WINDOW_MINUTES")); const key = dedupeKey(lead); const since = Date.now() - (minutes * 60 * 1000);
    const duplicate = isFinite(minutes) && minutes > 0 && values.slice(1).find(function(row) { return row[LEAD_COLUMN_INDEX.dedupe] === key && new Date(row[0]).getTime() >= since; });
    if (duplicate) return json({ ok: true, stored: true, notification: priorNotification(duplicate) });
    const row = [new Date(), lead.submissionId, lead.firstName, lead.surname, lead.email, lead.whatsapp, lead.goal, lead.difficulty, lead.consent, lead.emailMarketing, lead.sourcePage, lead.language, "New", "", "Pending", "", key, "Pending", "", ""].map(sanitizeSpreadsheetValue);
    sheet.appendRow(row); const rowNumber = sheet.getLastRow(); let status = "Pending"; let quota = "";
    try { quota = MailApp.getRemainingDailyQuota(); if (quota >= 1) { MailApp.sendEmail(properties.getProperty("LEAD_NOTIFICATION_EMAIL"), "New Unleash Your Power registration", "A new registration was stored."); status = "Sent"; } } catch (_) { status = "Failed"; }
    sheet.getRange(rowNumber, 15, 1, 2).setValues([[status, quota]]);
    let welcomeStatus = "failed"; let welcomeSentAt = ""; let welcomeError = "";
    try {
      const email = welcomeEmail(lead);
      MailApp.sendEmail(lead.email, "Welcome to your Free 7-Day Experience", email.body, { htmlBody: email.html });
      welcomeStatus = "sent"; welcomeSentAt = new Date().toISOString();
    } catch (_) { welcomeError = "Email delivery failed"; }
    sheet.getRange(rowNumber, 18, 1, 3).setValues([[welcomeStatus, welcomeSentAt, welcomeError]]);
    return json({ ok: true, stored: true, notification: status === "Sent" ? "sent" : "pending" });
  } catch (_) { return json({ ok: false, code: "unavailable" }); } finally { lock.releaseLock(); }
}
