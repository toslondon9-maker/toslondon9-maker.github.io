import assert from "node:assert/strict";
import test from "node:test";
import { canSubmitLeadForm, formMessages, localizeForm, formCopy } from "../assets/lead-capture-form.mjs";

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
  const first = { dataset: { leadLabel: "first" }, textContent: "" }; const consent = { dataset: { leadLabel: "consent" }, textContent: "" };
  const placeholder = { dataset: { leadPlaceholder: "first" }, placeholder: "" }; const status = { textContent: "" }; const button = { textContent: "" }; const success = { textContent: "" }; const successAction = { textContent: "" };
  const form = { dataset: { leadState: "unavailable", leadMessage: "" }, querySelectorAll: (selector) => selector.includes("placeholder") ? [placeholder] : [first, consent], querySelector: (selector) => selector.includes("status") ? status : selector.includes("submit") ? button : null };
  localizeForm(form, "es", { querySelector: (selector) => selector.includes("success-action") ? successAction : success });
  assert.equal(first.textContent, "Nombre"); assert.match(consent.textContent, /Acepto/); assert.equal(placeholder.placeholder, "Tu nombre"); assert.match(status.textContent, /WhatsApp/); assert.equal(button.textContent, "COMENZAR MIS 7 DÍAS GRATIS"); assert.equal(success.textContent, "Tu registro se ha completado.");
});

test("only an HTTPS Worker lead endpoint enables registration", () => {
  assert.equal(canSubmitLeadForm("https://unleash-your-power-leads.example.workers.dev/lead"), true);
  assert.equal(canSubmitLeadForm("http://worker.example/lead"), false);
  assert.equal(canSubmitLeadForm("https://worker.example/not-lead"), false);
  assert.equal(canSubmitLeadForm("https://worker.example/lead?test=1"), false);
});

test("English and Spanish copy includes all interactive registration states", () => {
  for (const language of ["en", "es"]) {
    for (const key of ["heading", "helper", "consent", "marketing", "privacy", "submit", "loading", "success", "successAction", "required", "invalidEmail", "invalidWhatsapp", "failure", "unavailable"]) {
      assert.equal(typeof formCopy[language][key], "string", `${language}.${key}`);
      assert.ok(formCopy[language][key].length > 3, `${language}.${key}`);
    }
  }
});
