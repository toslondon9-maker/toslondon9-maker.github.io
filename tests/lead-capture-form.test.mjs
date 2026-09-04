import assert from "node:assert/strict";
import test from "node:test";
import { canSubmitLeadForm, formMessages, localizeForm } from "../assets/lead-capture-form.mjs";

test("the unconfigured form fails closed with a visible WhatsApp fallback", () => {
  assert.equal(canSubmitLeadForm(null), false);
  assert.match(formMessages.en.unavailable, /WhatsApp/i);
  assert.match(formMessages.es.unavailable, /WhatsApp/i);
});

test("form messages provide English and Spanish safe generic failures", () => {
  assert.match(formMessages.en.failure, /couldn't register/i);
  assert.match(formMessages.es.failure, /No hemos podido registrar/i);
});

test("visible registration labels and states change when the language runtime switches", () => {
  const first = { dataset: { leadLabel: "first" }, firstChild: { textContent: "First name " }, querySelector: () => ({}) };
  const status = { textContent: "" }; const button = { textContent: "" }; const success = { textContent: "" };
  const form = { querySelectorAll: () => [first], querySelector: (selector) => selector.includes("status") ? status : button };
  localizeForm(form, "es", { querySelector: () => success });
  assert.equal(first.firstChild.textContent, "Nombre "); assert.match(status.textContent, /WhatsApp/); assert.equal(button.textContent, "COMENZAR MIS 7 DÍAS GRATIS"); assert.equal(success.textContent, "Tu registro se ha completado.");
});
