import assert from "node:assert/strict";
import test from "node:test";
import { canSubmitLeadForm, formMessages, localizeForm, formCopy, formatLeadError, showRegistrationSuccess, submissionTimestamp } from "../assets/lead-capture-form.mjs";
import { bookingCallHref } from "../src/whatsapp.mjs";

let runtimeId = 0;

async function createRuntimeHarness(language) {
  const goal = createControl("goal", "");
  const difficulty = createControl("difficulty", "A real obstacle");
  const firstName = createControl("firstName", "Ada");
  const surname = createControl("surname", "Lovelace");
  const email = createControl("email", "ada@example.test");
  const whatsapp = createControl("whatsapp", "+34611223345");
  const consent = createControl("consent", "on", { type: "checkbox", checked: true });
  const marketing = createControl("emailMarketing", "on", { type: "checkbox", checked: true });
  const required = [firstName, surname, email, whatsapp, goal, difficulty, consent];
  const labels = ["first", "last", "email", "whatsapp", "goal", "difficulty", "consent", "marketing"].map((leadLabel) => ({ dataset: { leadLabel }, textContent: "" }));
  const placeholders = [firstName, surname, email, whatsapp, goal, difficulty].map((input) => ({ ...input, dataset: { leadPlaceholder: input.name }, placeholder: "" }));
  const status = { textContent: "", focus() { this.focused += 1; }, focused: 0 };
  const button = { disabled: true, type: "button", textContent: "" };
  const listeners = new Map();
  const controls = new Map([["goal", goal], ["difficulty", difficulty], ["firstName", firstName], ["surname", surname], ["email", email], ["whatsapp", whatsapp], ["consent", consent], ["emailMarketing", marketing]]);
  const form = {
    dataset: { leadEndpoint: "https://leads.example.test/lead", leadState: "", leadMessage: "" },
    addEventListener(type, listener) { listeners.set(type, listener); },
    querySelector(selector) {
      if (selector === "[data-lead-capture-status]") return status;
      if (selector === "[data-lead-submit]") return button;
      if (selector === '[name="emailMarketing"]') return controls.get("emailMarketing");
      if (selector.startsWith("[name=")) return controls.get(selector.slice(6, -1)) ?? null;
      return null;
    },
    querySelectorAll(selector) {
      if (selector === "[required]") return required;
      if (selector === "[data-lead-label]") return labels;
      if (selector === "[data-lead-placeholder]") return placeholders;
      return [];
    },
  };
  const documentListeners = new Map();
  const documentRef = {
    documentElement: { lang: language },
    addEventListener(type, listener) { documentListeners.set(type, listener); },
    querySelector(selector) { return selector === "[data-lead-capture-form]" ? form : null; },
  };
  const originalDocument = globalThis.document;
  const originalFormData = globalThis.FormData;
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;

  globalThis.document = documentRef;
  globalThis.FormData = class HarnessFormData {
    constructor() {}
    *entries() {
      for (const control of controls.values()) {
        if (control.type !== "checkbox" || control.checked) yield [control.name, control.value];
      }
    }
    [Symbol.iterator]() { return this.entries(); }
  };
  globalThis.fetch = async () => { fetchCalls += 1; throw new Error("fetch must not run for invalid input"); };

  try {
    await import(new URL(`../assets/lead-capture-form.mjs?runtime=${runtimeId += 1}`, import.meta.url));
    documentListeners.get("DOMContentLoaded")();
  } catch (error) {
    globalThis.document = originalDocument;
    globalThis.FormData = originalFormData;
    globalThis.fetch = originalFetch;
    throw error;
  }

  return {
    button,
    difficulty,
    marketing,
    fetchCalls: () => fetchCalls,
    form,
    goal,
    labels,
    status,
    async submit() { await listeners.get("submit")({ preventDefault() {} }); },
    switchLanguage(nextLanguage) {
      documentRef.documentElement.lang = nextLanguage;
      documentListeners.get("uyp:language-change")({ detail: { language: nextLanguage } });
    },
    restore() {
      globalThis.document = originalDocument;
      globalThis.FormData = originalFormData;
      globalThis.fetch = originalFetch;
    },
  };
}

function createControl(name, value, { type = "text", checked = false } = {}) {
  return {
    attributes: new Map(),
    checked,
    focus() { this.focused += 1; },
    focused: 0,
    name,
    setAttribute(attribute, attributeValue) { this.attributes.set(attribute, attributeValue); },
    type,
    value,
  };
}

test("browser submission timestamp keeps a seven-second safety margin", () => {
  const now = 1_770_000_000_000;
  assert.equal(now - submissionTimestamp(now), 10_000);
});

test("the unconfigured form fails closed with a visible WhatsApp fallback", () => {
  assert.equal(canSubmitLeadForm(null), false);
  assert.match(formMessages.en.unavailable, /WhatsApp/i);
  assert.match(formMessages.es.unavailable, /WhatsApp/i);
});

test("optional email marketing is reset to unchecked when the form initializes", async () => {
  const runtime = await createRuntimeHarness("en");
  try {
    assert.equal(runtime.marketing.checked, false);
  } finally {
    runtime.restore();
  }
});

test("form messages provide English and Spanish safe generic failures", () => {
  assert.match(formMessages.en.failure, /couldn't register/i);
  assert.match(formMessages.es.failure, /No hemos podido registrar/i);
});

test("browser error copy appends the Worker reference ID", () => {
  assert.equal(formatLeadError(formCopy.en.failure, "abc-123"), `${formCopy.en.failure} Reference: abc-123`);
  assert.equal(formatLeadError(formCopy.en.failure, ""), `${formCopy.en.failure} Reference unavailable`);
});

test("visible registration labels and success choices change when the language runtime switches", () => {
  const first = { dataset: { leadLabel: "first" }, textContent: "" }; const consent = { dataset: { leadLabel: "consent" }, textContent: "" };
  const placeholder = { dataset: { leadPlaceholder: "first" }, placeholder: "" }; const status = { textContent: "" }; const button = { textContent: "" }; const success = { textContent: "" }; const successFree = { textContent: "" }; const successPrompt = { textContent: "" }; const successNextSteps = { textContent: "" }; const successAction = { textContent: "" }; const successDownload = { textContent: "" }; const successWhatsapp = { textContent: "", href: bookingCallHref("34611223345") }; const successNote = { textContent: "" };
  const form = { dataset: { leadState: "unavailable", leadMessage: "" }, querySelectorAll: (selector) => selector.includes("placeholder") ? [placeholder] : [first, consent], querySelector: (selector) => selector.includes("status") ? status : selector.includes("submit") ? button : null };
  localizeForm(form, "es", { querySelector: (selector) => selector.includes("success-free") ? successFree : selector.includes("success-prompt") ? successPrompt : selector.includes("success-next-steps") ? successNextSteps : selector.includes("success-action") ? successAction : selector.includes("success-download") ? successDownload : selector.includes("success-whatsapp") ? successWhatsapp : selector.includes("success-note") ? successNote : success });
  assert.equal(first.textContent, "Nombre"); assert.match(consent.textContent, /Acepto/); assert.equal(placeholder.placeholder, "Tu nombre"); assert.match(status.textContent, /WhatsApp/); assert.equal(button.textContent, "COMENZAR MIS 7 DÍAS GRATIS"); assert.match(success.textContent, /Bienvenido/);
  assert.match(successFree.textContent, /No es necesario comprar/); assert.equal(successPrompt.textContent, "Elige cómo te gustaría continuar."); assert.match(successNextSteps.textContent, /Qué ocurre después/); assert.equal(successAction.textContent, "COMPLETAR ONLINE"); assert.equal(successDownload.textContent, "DESCARGAR EL CUADERNO (PDF)"); assert.match(successWhatsapp.textContent, /WHATSAPP/); assert.equal(successWhatsapp.href, bookingCallHref("34611223345")); assert.equal(successNote.textContent, "Puedes usar una opción, o ambas.");
});

test("browser validation blocks fetch and focuses each blank qualifying answer", async () => {
  const runtime = await createRuntimeHarness("en");

  try {
    assert.equal(runtime.labels.find((label) => label.dataset.leadLabel === "goal").textContent.includes("(optional)"), false);
    await runtime.submit();
    assert.equal(runtime.fetchCalls(), 0);
    assert.equal(runtime.goal.focused, 1);
    assert.equal(runtime.status.textContent, formCopy.en.required);

    runtime.goal.value = "Build a calmer daily practice.";
    runtime.difficulty.value = "   ";
    runtime.switchLanguage("es");
    assert.equal(runtime.labels.find((label) => label.dataset.leadLabel === "difficulty").textContent.includes("(opcional)"), false);
    await runtime.submit();
    assert.equal(runtime.fetchCalls(), 0);
    assert.equal(runtime.difficulty.focused, 1);
    assert.equal(runtime.status.textContent, formCopy.es.required);
  } finally {
    runtime.restore();
  }
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
    for (const key of ["heading", "helper", "consent", "marketing", "privacy", "submit", "loading", "success", "successFree", "successPrompt", "successNextSteps", "successAction", "successDownload", "successWhatsapp", "successNote", "required", "invalidEmail", "invalidWhatsapp", "failure", "unavailable"]) {
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
