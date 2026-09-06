import assert from "node:assert/strict";
import test from "node:test";
import { canSubmitLeadForm, formMessages, localizeForm, formCopy, formatLeadError, showRegistrationSuccess, submissionTimestamp } from "../assets/lead-capture-form.mjs";

test("browser submission timestamp keeps a seven-second safety margin", () => {
  const now = 1_770_000_000_000;
  assert.equal(now - submissionTimestamp(now), 10_000);
});

test("the unconfigured form fails closed with a visible WhatsApp fallback", () => {
  assert.equal(canSubmitLeadForm(null), false);
  assert.match(formMessages.en.unavailable, /WhatsApp/i);
  assert.match(formMessages.es.unavailable, /WhatsApp/i);
});

test("form messages provide English and Spanish safe generic failures", () => {
  assert.match(formMessages.en.failure, /couldn't register/i);
  assert.match(formMessages.es.failure, /No hemos podido registrar/i);
});

test("browser error copy appends the Worker reference ID", () => {
  assert.equal(formatLeadError(formCopy.en.failure, "abc-123"), `${formCopy.en.failure} Reference: abc-123`);
  assert.equal(formatLeadError(formCopy.en.failure, ""), `${formCopy.en.failure} Reference unavailable`);
});

test("visible registration labels and states change when the language runtime switches", () => {
  const first = { dataset: { leadLabel: "first" }, textContent: "" }; const consent = { dataset: { leadLabel: "consent" }, textContent: "" };
  const placeholder = { dataset: { leadPlaceholder: "first" }, placeholder: "" }; const status = { textContent: "" }; const button = { textContent: "" }; const success = { textContent: "" }; const successPrompt = { textContent: "" }; const successAction = { textContent: "" }; const successDownload = { textContent: "" }; const successNote = { textContent: "" };
  const form = { dataset: { leadState: "unavailable", leadMessage: "" }, querySelectorAll: (selector) => selector.includes("placeholder") ? [placeholder] : [first, consent], querySelector: (selector) => selector.includes("status") ? status : selector.includes("submit") ? button : null };
  localizeForm(form, "es", { querySelector: (selector) => selector.includes("success-prompt") ? successPrompt : selector.includes("success-action") ? successAction : selector.includes("success-download") ? successDownload : selector.includes("success-note") ? successNote : success });
  assert.equal(first.textContent, "Nombre"); assert.match(consent.textContent, /Acepto/); assert.equal(placeholder.placeholder, "Tu nombre"); assert.match(status.textContent, /WhatsApp/); assert.equal(button.textContent, "COMENZAR MIS 7 DÍAS GRATIS"); assert.equal(success.textContent, "Tu registro se ha completado.");
  assert.equal(successPrompt.textContent, "Elige cómo te gustaría continuar."); assert.equal(successAction.textContent, "COMPLETAR ONLINE"); assert.equal(successDownload.textContent, "DESCARGAR EL CUADERNO (PDF)"); assert.equal(successNote.textContent, "Puedes usar una opción, o ambas.");
});

test("ready registration state clears the unavailable fallback message", () => {
  const status = { textContent: "" }; const button = { textContent: "" };
  const form = {
    dataset: { leadState: "ready", leadMessage: "" },
    querySelectorAll: () => [],
    querySelector: (selector) => selector.includes("status") ? status : selector.includes("submit") ? button : null,
  };

  localizeForm(form, "en", { querySelector: () => null });

  assert.equal(status.textContent, "");
  assert.equal(button.textContent, formCopy.en.submit);
});

test("only an HTTPS Worker lead endpoint enables registration", () => {
  assert.equal(canSubmitLeadForm("https://unleash-your-power-leads.example.workers.dev/lead"), true);
  assert.equal(canSubmitLeadForm("http://worker.example/lead"), false);
  assert.equal(canSubmitLeadForm("https://worker.example/not-lead"), false);
  assert.equal(canSubmitLeadForm("https://worker.example/lead?test=1"), false);
});

test("English and Spanish copy includes all interactive registration states", () => {
  for (const language of ["en", "es"]) {
    for (const key of ["heading", "helper", "consent", "marketing", "privacy", "submit", "loading", "success", "successPrompt", "successAction", "successDownload", "successNote", "required", "invalidEmail", "invalidWhatsapp", "failure", "unavailable"]) {
      assert.equal(typeof formCopy[language][key], "string", `${language}.${key}`);
      assert.ok(formCopy[language][key].length > 3, `${language}.${key}`);
    }
  }
});

test("success state hides and disables the original registration form", () => {
  const button = { disabled: false, type: "submit" };
  const form = { hidden: false, setAttribute() {}, querySelector: () => button };
  const success = { hidden: true };
  const dashboard = { hidden: true };
  showRegistrationSuccess(form, { querySelector: (selector) => selector.includes("success") ? success : dashboard });
  assert.equal(form.hidden, true);
  assert.equal(button.disabled, true);
  assert.equal(success.hidden, false);
  assert.equal(dashboard.hidden, false);
});

test("success choices use the online Day 1 and downloadable workbook actions", () => {
  assert.equal(formCopy.en.successAction, "COMPLETE ONLINE");
  assert.equal(formCopy.en.successDownload, "DOWNLOAD WORKBOOK (PDF)");
  assert.equal(formCopy.es.successAction, "COMPLETAR ONLINE");
  assert.equal(formCopy.es.successDownload, "DESCARGAR EL CUADERNO (PDF)");
});
