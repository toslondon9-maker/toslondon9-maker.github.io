import assert from "node:assert/strict";
import test from "node:test";
import { canSubmitLeadForm, formMessages } from "../assets/lead-capture-form.mjs";

test("the unconfigured form fails closed with a visible WhatsApp fallback", () => {
  assert.equal(canSubmitLeadForm(null), false);
  assert.match(formMessages.en.unavailable, /WhatsApp/i);
  assert.match(formMessages.es.unavailable, /WhatsApp/i);
});

test("form messages provide English and Spanish safe generic failures", () => {
  assert.match(formMessages.en.failure, /couldn't register/i);
  assert.match(formMessages.es.failure, /No hemos podido registrar/i);
});
