const LEAD_COLUMNS = ["Submission date/time", "Submission ID", "First name", "Surname", "Email", "WhatsApp", "Main goal", "Current difficulty", "WhatsApp consent", "Email marketing consent", "Source page", "Language", "Lead status", "Notes", "Notification status", "Remaining email quota", "Dedupe key"];
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
function priorNotification(row) { return row[14] === "Sent" ? "sent" : "pending"; }
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
    if (sheet.getLastRow() === 0) sheet.appendRow(LEAD_COLUMNS);
    const values = sheet.getDataRange().getValues(); const prior = values.slice(1).find(function(row) { return row[1] === lead.submissionId; });
    if (prior) return json({ ok: true, stored: true, notification: priorNotification(prior) });
    const minutes = Number(properties.getProperty("LEAD_DUPLICATE_WINDOW_MINUTES")); const key = dedupeKey(lead); const since = Date.now() - (minutes * 60 * 1000);
    const duplicate = isFinite(minutes) && minutes > 0 && values.slice(1).find(function(row) { return row[16] === key && new Date(row[0]).getTime() >= since; });
    if (duplicate) return json({ ok: true, stored: true, notification: priorNotification(duplicate) });
    const row = [new Date(), lead.submissionId, lead.firstName, lead.surname, lead.email, lead.whatsapp, lead.goal, lead.difficulty, lead.consent, lead.emailMarketing, lead.sourcePage, lead.language, "New", "", "Pending", "", key].map(sanitizeSpreadsheetValue);
    sheet.appendRow(row); const rowNumber = sheet.getLastRow(); let status = "Pending"; let quota = "";
    try { quota = MailApp.getRemainingDailyQuota(); if (quota >= 1) { MailApp.sendEmail(properties.getProperty("LEAD_NOTIFICATION_EMAIL"), "New Unleash Your Power registration", "A new registration was stored."); status = "Sent"; } } catch (_) { status = "Failed"; }
    sheet.getRange(rowNumber, 15, 1, 2).setValues([[status, quota]]); return json({ ok: true, stored: true, notification: status === "Sent" ? "sent" : "pending" });
  } catch (_) { return json({ ok: false, code: "unavailable" }); } finally { lock.releaseLock(); }
}
