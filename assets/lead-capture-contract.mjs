export const MAX_LEAD_REQUEST_BYTES = 8_192;

const LIMITS = Object.freeze({ name: 80, email: 254, whatsapp: 32, message: 1_000 });
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const whatsappPattern = /^\+[1-9]\d{7,30}$/;

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normaliseLeadPayload(payload = {}) {
  return {
    submissionId: text(payload.submissionId),
    submittedAtMs: Number(payload.submittedAtMs),
    firstName: text(payload.firstName),
    surname: text(payload.surname),
    email: text(payload.email).toLowerCase(),
    whatsapp: text(payload.whatsapp).replace(/[\s()-]/g, ""),
    goal: text(payload.goal),
    difficulty: text(payload.difficulty),
    consent: payload.consent === true,
    emailMarketing: payload.emailMarketing === true,
    sourcePage: text(payload.sourcePage),
    language: text(payload.language),
    website: text(payload.website),
  };
}

export function isValidInternationalWhatsApp(value) {
  return whatsappPattern.test(value);
}

export function sanitizeSpreadsheetValue(value) {
  const safe = String(value ?? "").trim();
  return /^[=+\-@]/.test(safe) ? `'${safe}` : safe;
}

export function validateLeadPayload(payload, nowMs = Date.now()) {
  const lead = normaliseLeadPayload(payload);
  if (!uuidPattern.test(lead.submissionId) || lead.website || lead.sourcePage !== "/start-free/" || !["en", "es"].includes(lead.language)) return { ok: false, code: "invalid-request" };
  if (!lead.firstName || !lead.surname || lead.firstName.length > LIMITS.name || lead.surname.length > LIMITS.name) return { ok: false, code: "invalid-name" };
  if (!emailPattern.test(lead.email) || lead.email.length > LIMITS.email) return { ok: false, code: "invalid-email" };
  if (!isValidInternationalWhatsApp(lead.whatsapp) || lead.whatsapp.length > LIMITS.whatsapp) return { ok: false, code: "invalid-whatsapp" };
  if (!lead.goal || !lead.difficulty || lead.goal.length > LIMITS.message || lead.difficulty.length > LIMITS.message) return { ok: false, code: "invalid-message" };
  if (!lead.consent || typeof payload.emailMarketing !== "boolean") return { ok: false, code: "consent-required" };
  if (!Number.isFinite(lead.submittedAtMs) || lead.submittedAtMs > nowMs || nowMs - lead.submittedAtMs < 3_000) return { ok: false, code: "invalid-request" };
  return { ok: true };
}

export function resolveLeadEndpoint(config = {}) {
  const endpoint = typeof config.endpoint === "string" ? config.endpoint : "";
  try {
    const url = new URL(endpoint);
    return url.protocol === "https:" && url.pathname === "/lead" ? url.toString() : null;
  } catch {
    return null;
  }
}
