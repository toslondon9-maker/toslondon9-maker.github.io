import assert from "node:assert/strict";
import test from "node:test";
import {
  isValidInternationalWhatsApp,
  normaliseLeadPayload,
  resolveLeadEndpoint,
  sanitizeSpreadsheetValue,
  validateLeadPayload,
} from "../assets/lead-capture-contract.mjs";
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

test("unconfigured endpoint fails closed and is never emitted as a fake URL", () => {
  assert.equal(leadCaptureConfig.endpoint, null);
  assert.equal(resolveLeadEndpoint(leadCaptureConfig), null);
  assert.equal(resolveLeadEndpoint({ endpoint: "http://example.test/lead" }), null);
  assert.equal(resolveLeadEndpoint({ endpoint: "https://leads.example.test/lead" }), "https://leads.example.test/lead");
});
