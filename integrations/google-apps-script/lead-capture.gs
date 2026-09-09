const LEAD_COLUMNS = ["Submission date/time", "Submission ID", "First name", "Surname", "Email", "WhatsApp", "Main goal", "Current difficulty", "WhatsApp consent", "Email marketing consent", "Source page", "Language", "Lead status", "Notes", "Notification status", "Remaining email quota", "Dedupe key", "Welcome email status", "Welcome email sent at", "Welcome email error", "Sequence day sent", "Sequence email sent at", "Sequence email status", "Sequence email error", "Affiliate code"];
const LEAD_COLUMN_INDEX = { submissionId: 1, email: 4, whatsapp: 5, emailMarketing: 9, notification: 14, dedupe: 16, welcomeStatus: 17, welcomeSentAt: 18, welcomeError: 19, sequenceDay: 20, sequenceSentAt: 21, sequenceStatus: 22, sequenceError: 23 };
const SEQUENCE_LESSONS = [
  { day: 2, title: "Take Back Your Attention", titleEs: "Recupera tu atención", message: "Notice what most often captures your attention without permission, then return gently to what you chose to focus on.", messageEs: "Fíjate en qué capta tu atención sin que lo decidas y vuelve con suavidad a aquello en lo que elegiste enfocarte.", route: "/start-free/day-2-take-back-your-attention/" },
  { day: 3, title: "Recognise What Keeps Repeating", titleEs: "Reconoce lo que se repite", message: "When a familiar situation appears, look for the first thought and the response that usually follows it.", messageEs: "Cuando aparezca una situación conocida, observa el primer pensamiento y la respuesta que suele venir después.", route: "/start-free/day-3-recognise-what-keeps-repeating/" },
  { day: 4, title: "Give Your Mind a Direction", titleEs: "Dale una dirección a tu mente", message: "Choose one clear direction for your attention and write it in a sentence you can return to today.", messageEs: "Elige una dirección clara para tu atención y escríbela en una frase a la que puedas volver hoy.", route: "/start-free/day-4-give-your-mind-a-direction/" },
  { day: 5, title: "Become Someone You Can Rely On", titleEs: "Conviértete en alguien en quien puedas confiar", message: "Choose one small commitment you can keep today; a promise you follow through on helps build self-trust.", messageEs: "Elige hoy un pequeño compromiso que puedas cumplir; una promesa que mantienes ayuda a fortalecer la confianza en ti.", route: "/start-free/day-5-become-someone-you-can-rely-on/" },
  { day: 6, title: "Change From the Inside Out", titleEs: "Cambia de dentro hacia fuera", message: "Notice the meaning beneath one response today, then choose a useful direction and express it through one action.", messageEs: "Observa hoy el significado que hay detrás de una respuesta, elige una dirección útil y exprésala con una acción.", route: "/start-free/day-6-change-from-the-inside-out/" },
  { day: 7, title: "Make It Part of How You Live", titleEs: "Haz que forme parte de tu vida", message: "Look back across the week, notice which practice you would willingly repeat and choose a realistic time to return to it.", messageEs: "Repasa la semana, observa qué práctica repetirías de buen grado y elige un momento realista para retomarla.", route: "/start-free/day-7-make-it-part-of-how-you-live/" },
];
const LEAD_LIMITS = { name: 80, email: 254, whatsapp: 32, message: 1000 };
const LEAD_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const LEAD_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LEAD_WHATSAPP = /^\+[1-9]\d{7,30}$/;
function json(body) { return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON); }
function text(value) { return typeof value === "string" ? value.trim() : ""; }
function sanitizeSpreadsheetValue(value) { const safe = String(value === undefined || value === null ? "" : value).trim(); return /^[=+\-@]/.test(safe) ? "'" + safe : safe; }
function normaliseLead(request) { return { submissionId: text(request.submissionId), submittedAtMs: Number(request.submittedAtMs), firstName: text(request.firstName), surname: text(request.surname), email: text(request.email).toLowerCase(), whatsapp: text(request.whatsapp).replace(/[\s()-]/g, ""), goal: text(request.goal), difficulty: text(request.difficulty), consent: request.consent === true, emailMarketing: request.emailMarketing === true, sourcePage: text(request.sourcePage), language: text(request.language), website: text(request.website), affiliate_code: text(request.affiliate_code) }; }
function validLead(request, nowMs) {
  const lead = normaliseLead(request);
  if (!LEAD_UUID.test(lead.submissionId) || lead.website || lead.sourcePage !== "/start-free/" || ["en", "es"].indexOf(lead.language) === -1) return null;
  if (!lead.firstName || !lead.surname || lead.firstName.length > LEAD_LIMITS.name || lead.surname.length > LEAD_LIMITS.name) return null;
  if (!LEAD_EMAIL.test(lead.email) || lead.email.length > LEAD_LIMITS.email) return null;
  if (!LEAD_WHATSAPP.test(lead.whatsapp) || lead.whatsapp.length > LEAD_LIMITS.whatsapp) return null;
  if (!lead.goal || !lead.difficulty || lead.goal.length > LEAD_LIMITS.message || lead.difficulty.length > LEAD_LIMITS.message) return null;
  if (!lead.consent || typeof request.emailMarketing !== "boolean") return null;
  if (lead.affiliate_code && !/^[a-zA-Z0-9_-]{1,40}$/.test(lead.affiliate_code)) return null;
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
  const dayOne = "https://unleashyourpowerwithtariq.com/start-free/day-1-see-whats-running-your-life/";
  const body = "Hi " + lead.firstName + ",\n\nWelcome — I’m really glad you’re here.\n\nOver the next seven days, you’ll take a little time each day to slow down, observe your thinking, and take one simple action. There is nothing to catch up on and no need to rush.\n\nYour first step is ready:\n\nStart Day 1:\n" + dayOne + "\n\nGive yourself a few quiet minutes today. Read the lesson, complete the exercise, and simply notice what comes up.\n\nI’ll be with you throughout the experience.\n\nWith you on the journey,\nTariq Saddique\nUnleash Your Power";
  const html = "<p>Hi " + firstName + ",</p><p>Welcome — I’m really glad you’re here.</p><p>Over the next seven days, you’ll take a little time each day to slow down, observe your thinking, and take one simple action. There is nothing to catch up on and no need to rush.</p><p>Your first step is ready:</p><p><a href=\"" + dayOne + "\">Start Day 1</a></p><p>Give yourself a few quiet minutes today. Read the lesson, complete the exercise, and simply notice what comes up.</p><p>I’ll be with you throughout the experience.</p><p>With you on the journey,<br>Tariq Saddique<br>Unleash Your Power</p>";
  return { body: body, html: html };
}
function dayNumber(value) {
  const formatted = Utilities.formatDate(new Date(value), "Europe/Madrid", "yyyy-MM-dd");
  const parts = formatted.split("-").map(Number);
  return Date.UTC(parts[0], parts[1] - 1, parts[2]) / 86400000;
}
function sequenceEmail(firstName, lesson, language) {
  const name = escapeHtml(firstName);
  const url = "https://unleashyourpowerwithtariq.com" + lesson.route;
  const spanish = language === "es";
  const title = spanish ? lesson.titleEs : lesson.title;
  const message = spanish ? lesson.messageEs : lesson.message;
  const dayLabel = spanish ? "Día " + lesson.day + " de 7" : "Day " + lesson.day + " of 7";
  const ready = spanish ? "Tu experiencia gratuita de 7 días está lista" : "your Free 7-Day Experience is ready";
  const intro = spanish ? ready + ": " + title : dayLabel + " of " + ready + ": " + title;
  const quiet = spanish ? "Regálate unos minutos tranquilos hoy. Lee la lección, completa el ejercicio y observa qué aparece." : "Give yourself a few quiet minutes today. Read the lesson, complete the exercise and notice what comes up.";
  const start = spanish ? "Empezar el día " + lesson.day : "Start Day " + lesson.day;
  const signoff = spanish ? "Te acompaño en el camino" : "With you on the journey";
  let body = spanish
    ? "Hola " + firstName + ",\n\n" + intro + ".\n\n" + message + "\n\n" + quiet + "\n\n" + start + ":\n" + url
    : "Hi " + firstName + ",\n\n" + intro + ".\n\n" + message + "\n\n" + quiet + "\n\n" + start + ":\n" + url;
  let html = spanish
    ? "<p>Hola " + name + ",</p><p>" + escapeHtml(intro) + ".</p><p>" + escapeHtml(message) + "</p><p>" + quiet + "</p><p><a href=\"" + url + "\">" + start + "</a></p>"
    : "<p>Hi " + name + ",</p><p>" + escapeHtml(intro) + ".</p><p>" + escapeHtml(message) + "</p><p>" + quiet + "</p><p><a href=\"" + url + "\">" + start + "</a></p>";
  if (lesson.day === 7) {
    const foundationUrl = "https://www.paypal.com/ncp/payment/V5QYXZZS6KQE2";
    const journeyUrl = "https://unleashyourpowerwithtariq.com/master-key-system/";
    const next = spanish ? "Si quieres continuar, puedes explorar Foundation durante cuatro semanas por £97 o conocer el recorrido completo de 24 semanas." : "If you would like to continue, you can explore the four-week Foundation stage for £97 or the complete 24-week journey.";
    const caveat = spanish ? "Los resultados dependen de tus circunstancias, participación y práctica constante." : "Outcomes depend on your circumstances, participation and consistent practice.";
    const foundationLabel = spanish ? "Continuar con Foundation (£97)" : "Continue with Foundation (£97)";
    const journeyLabel = spanish ? "Explorar el recorrido completo de 24 semanas" : "Explore the complete 24-week journey";
    body += "\n\n" + next + "\n" + foundationLabel + ":\n" + foundationUrl + "\n" + journeyLabel + ":\n" + journeyUrl + "\n\n" + caveat;
    html += "<p>" + next + "</p><p><a href=\"" + foundationUrl + "\">" + foundationLabel + "</a><br><a href=\"" + journeyUrl + "\">" + journeyLabel + "</a></p><p>" + caveat + "</p>";
  }
  body += "\n\n" + signoff + ",\nTariq Saddique\nUnleash Your Power";
  html += "<p>" + signoff + ",<br>Tariq Saddique<br>Unleash Your Power</p>";
  return { body: body, html: html, subject: dayLabel + ": " + title };
}
function sendDueSequenceEmails(now) {
  const properties = PropertiesService.getScriptProperties();
  const liveMode = properties.getProperty("LEAD_SEQUENCE_MODE") === "live";
  const testRecipient = text(properties.getProperty("LEAD_SEQUENCE_TEST_EMAIL"));
  if (!liveMode && !testRecipient) return;
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return;
  try {
    const sheet = SpreadsheetApp.openById(properties.getProperty("LEAD_SHEET_ID")).getSheetByName(properties.getProperty("LEAD_SHEET_NAME"));
    if (!sheet) return;
    ensureColumns(sheet);
    const values = sheet.getDataRange().getValues();
    const current = now || new Date();
    values.slice(1).forEach(function(row, offset) {
      if (row[LEAD_COLUMN_INDEX.welcomeStatus] !== "sent" && row[LEAD_COLUMN_INDEX.welcomeStatus] !== "Sent") return;
      if (row[LEAD_COLUMN_INDEX.emailMarketing] !== true && row[LEAD_COLUMN_INDEX.emailMarketing] !== "true") return;
      const sentDay = Number(row[LEAD_COLUMN_INDEX.sequenceDay] || 1);
      const next = SEQUENCE_LESSONS.find(function(lesson) { return lesson.day === sentDay + 1; });
      if (!next || dayNumber(current) - dayNumber(row[0]) < next.day - 1) return;
      const rowNumber = offset + 2;
      try {
        const email = sequenceEmail(row[2], next, row[11]);
        MailApp.sendEmail(liveMode ? row[LEAD_COLUMN_INDEX.email] : testRecipient, email.subject, email.body, { htmlBody: email.html });
        sheet.getRange(rowNumber, LEAD_COLUMN_INDEX.sequenceDay + 1, 1, 4).setValues([[next.day, new Date().toISOString(), "sent", ""]]);
      } catch (_) {
        sheet.getRange(rowNumber, LEAD_COLUMN_INDEX.sequenceDay + 1, 1, 4).setValues([[sentDay, "", "failed", "Email delivery failed"]]);
      }
    });
  } finally { lock.releaseLock(); }
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
    const row = [new Date(), lead.submissionId, lead.firstName, lead.surname, lead.email, lead.whatsapp, lead.goal, lead.difficulty, lead.consent, lead.emailMarketing, lead.sourcePage, lead.language, "New", "", "Pending", "", key, "Pending", "", "", 0, "", "pending", "", lead.affiliate_code].map(sanitizeSpreadsheetValue);
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
    if (welcomeStatus === "sent") sheet.getRange(rowNumber, LEAD_COLUMN_INDEX.sequenceDay + 1, 1, 4).setValues([[1, welcomeSentAt, "sent", ""]]);
    return json({ ok: true, stored: true, notification: status === "Sent" ? "sent" : "pending" });
  } catch (_) { return json({ ok: false, code: "unavailable" }); } finally { lock.releaseLock(); }
}
