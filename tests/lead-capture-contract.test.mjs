import assert from "node:assert/strict";
import test from "node:test";
import {
  isValidInternationalWhatsApp,
  normaliseLeadPayload,
  resolveLeadEndpoint,
  sanitizeSpreadsheetValue,
  validateLeadPayload,
} from "../assets/lead-capture-contract.mjs";
import { submissionTimestamp } from "../assets/lead-capture-form.mjs";
import { leadCaptureConfig } from "../content/lead-capture-config.mjs";

const now = 1_770_000_000_000;
const validLead = Object.freeze({
  submissionId: "9d5e99a1-8280-4e41-89ac-4e2e051569d2",
  submittedAtMs: now - 3_000,
  firstName: "Ada",
  surname: "Lovelace",
  email: "ada@example.test",
  whatsapp: "+34611223345",
  goal: "Build a calmer daily practice.",
  difficulty: "I lose focus when I am busy.",
  consent: true,
  emailMarketing: false,
  sourcePage: "/start-free/",
  language: "en",
  website: "",
});

test("lead contract accepts the approved shape and rejects unsafe input", () => {
  assert.deepEqual(validateLeadPayload(validLead, now), { ok: true });
  assert.equal(validateLeadPayload({ ...validLead, consent: false }, now).code, "consent-required");
  assert.equal(validateLeadPayload({ ...validLead, whatsapp: "611223345" }, now).code, "invalid-whatsapp");
  assert.equal(validateLeadPayload({ ...validLead, website: "bot" }, now).code, "invalid-request");
  assert.equal(sanitizeSpreadsheetValue("=SUM(A1:A2)"), "'=SUM(A1:A2)");
  assert.equal(isValidInternationalWhatsApp("+34611223345"), true);
});

test("normalisation trims user fields without changing the request contract", () => {
  const result = normaliseLeadPayload({ ...validLead, firstName: " Ada ", email: " ADA@EXAMPLE.TEST " });
  assert.equal(result.firstName, "Ada");
  assert.equal(result.email, "ada@example.test");
  assert.equal(result.submissionId, validLead.submissionId);
});

test("lead contract retains the explicit optional email-marketing choice", () => {
  const accepted = normaliseLeadPayload({ ...validLead, emailMarketing: true });
  const declined = normaliseLeadPayload({ ...validLead, emailMarketing: false });
  assert.equal(accepted.emailMarketing, true);
  assert.equal(declined.emailMarketing, false);
});

test("browser submission timestamp clears the server completion-time threshold", () => {
  const submittedAtMs = submissionTimestamp(now);
  assert.equal(validateLeadPayload({ ...validLead, submittedAtMs }, now).ok, true);
  assert.ok(now - submittedAtMs > 3_000);
});

test("configured endpoint passes strict HTTPS validation", () => {
  assert.equal(leadCaptureConfig.endpoint, "https://unleash-your-power-leads.toslondon9.workers.dev/lead");
  assert.equal(resolveLeadEndpoint(leadCaptureConfig), leadCaptureConfig.endpoint);
  assert.equal(resolveLeadEndpoint({ endpoint: "http://example.test/lead" }), null);
  assert.equal(resolveLeadEndpoint({ endpoint: "https://leads.example.test/lead" }), "https://leads.example.test/lead");
});
