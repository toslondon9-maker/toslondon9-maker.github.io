const LEAD_COLUMNS = ["Submission date/time", "Submission ID", "First name", "Surname", "Email", "WhatsApp", "Main goal", "Current difficulty", "Consent", "Source page", "Language", "Lead status", "Notes", "Notification status", "Remaining email quota"];
function json(body) { return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON); }
function sanitizeSpreadsheetValue(value) { const text = String(value || "").trim(); return /^[=+\-@]/.test(text) ? "'" + text : text; }
function doPost(e) {
  const properties = PropertiesService.getScriptProperties(); let request;
  try { request = JSON.parse(e.postData.contents); } catch (_) { return json({ ok: false, code: "invalid" }); }
  if (!properties.getProperty("LEAD_CAPTURE_SHARED_SECRET") || request.gatewaySecret !== properties.getProperty("LEAD_CAPTURE_SHARED_SECRET")) return json({ ok: false, code: "unauthorized" });
  const lock = LockService.getScriptLock(); if (!lock.tryLock(5000)) return json({ ok: false, code: "unavailable" });
  try {
    const sheet = SpreadsheetApp.openById(properties.getProperty("LEAD_SHEET_ID")).getSheetByName(properties.getProperty("LEAD_SHEET_NAME"));
    if (!sheet) return json({ ok: false, code: "unavailable" });
    if (sheet.getLastRow() === 0) sheet.appendRow(LEAD_COLUMNS);
    const values = sheet.getDataRange().getValues(); const prior = values.slice(1).find((row) => row[1] === request.submissionId);
    if (prior) return json({ ok: true, stored: true, notification: prior[13] === "Sent" ? "sent" : "pending" });
    const row = [new Date(), request.submissionId, request.firstName, request.surname, request.email, request.whatsapp, request.goal, request.difficulty, request.consent, request.sourcePage, request.language, "New", "", "Pending", ""] .map(sanitizeSpreadsheetValue);
    sheet.appendRow(row); const rowNumber = sheet.getLastRow(); let status = "Pending"; let quota = "";
    try { quota = MailApp.getRemainingDailyQuota(); if (quota >= 1) { MailApp.sendEmail(properties.getProperty("LEAD_NOTIFICATION_EMAIL"), "New Unleash Your Power registration", "A new registration was stored."); status = "Sent"; } } catch (_) { status = "Failed"; }
    sheet.getRange(rowNumber, 14, 1, 2).setValues([[status, quota]]); return json({ ok: true, stored: true, notification: status === "Sent" ? "sent" : "pending" });
  } catch (_) { return json({ ok: false, code: "unavailable" }); } finally { lock.releaseLock(); }
}
