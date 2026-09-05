export const formCopy = Object.freeze({
  en: Object.freeze({ heading: "Begin Your Free 7-Day Experience", helper: "Register once to open your private seven-day dashboard.", first: "First name", last: "Surname", email: "Email", whatsapp: "WhatsApp number including country code", goal: "What would you most like to change or improve right now?", difficulty: "What is currently holding you back most?", consent: "I agree that Tariq may contact me on WhatsApp about the Free 7-Day Experience.", marketing: "I would like occasional email updates.", privacy: "Privacy Policy", submit: "START MY FREE 7 DAYS", loading: "REGISTERING…", success: "You’re registered. Welcome to Unleash Your Power.", successAction: "START DAY 1", required: "Please complete every required field.", invalidEmail: "Enter a valid email address.", invalidWhatsapp: "Enter a WhatsApp number with its country code, for example +34611223345.", failure: "We couldn't register you just now. Please try again or contact Tariq on WhatsApp.", unavailable: "Registration is being prepared. Please contact Tariq on WhatsApp to begin your free experience.", placeholders: Object.freeze({ first: "Your first name", last: "Your surname", email: "you@example.com", whatsapp: "+34611223345", goal: "What would you like to improve?", difficulty: "What is making that difficult right now?" }) }),
  es: Object.freeze({ heading: "Comienza tu experiencia gratuita de 7 días", helper: "Regístrate una vez para abrir tu panel privado de siete días.", first: "Nombre", last: "Apellido", email: "Correo electrónico", whatsapp: "Número de WhatsApp con código de país", goal: "¿Qué te gustaría cambiar o mejorar ahora mismo?", difficulty: "¿Qué te está frenando más?", consent: "Acepto que Tariq me contacte por WhatsApp sobre la experiencia gratuita de 7 días.", marketing: "Me gustaría recibir novedades ocasionales por correo electrónico.", privacy: "Política de privacidad", submit: "COMENZAR MIS 7 DÍAS GRATIS", loading: "REGISTRANDO…", success: "Tu registro se ha completado.", successAction: "COMENZAR EL DÍA 1", required: "Completa todos los campos obligatorios.", invalidEmail: "Introduce una dirección de correo válida.", invalidWhatsapp: "Introduce un número de WhatsApp con código de país, por ejemplo +34611223345.", failure: "No hemos podido registrar tus datos ahora. Inténtalo de nuevo o contacta con Tariq por WhatsApp.", unavailable: "Estamos preparando el registro. Ponte en contacto con Tariq por WhatsApp para comenzar tu experiencia gratuita.", placeholders: Object.freeze({ first: "Tu nombre", last: "Tu apellido", email: "tu@ejemplo.com", whatsapp: "+34611223345", goal: "¿Qué te gustaría mejorar?", difficulty: "¿Qué lo está dificultando ahora?" }) }),
});

export const formMessages = Object.freeze({ en: { unavailable: formCopy.en.unavailable, failure: formCopy.en.failure }, es: { unavailable: formCopy.es.unavailable, failure: formCopy.es.failure } });
export const canSubmitLeadForm = (endpoint) => /^https:\/\/[^/?#]+(?:\/[^?#]*)?\/lead$/.test(endpoint ?? "");
export const formatLeadError = (message, requestId) => `${message} ${requestId ? `Reference: ${requestId}` : "Reference unavailable"}`;
const languageCopy = (language) => formCopy[language === "es" ? "es" : "en"];

function setText(root, selector, value) { const node = root?.querySelector?.(selector); if (node) node.textContent = value; }
function setState(form, state, message = "") { form.dataset.leadState = state; form.dataset.leadMessage = message; }
function renderState(form, copy) {
  const status = form.querySelector("[data-lead-capture-status]"); const state = form.dataset.leadState;
  if (status) status.textContent = state === "ready" ? "" : state === "loading" ? copy.loading : state === "error" || state === "validation" ? copy[form.dataset.leadMessage] : copy.unavailable;
}

export function localizeForm(form, language, documentRef = globalThis.document) {
  const copy = languageCopy(language);
  for (const node of form.querySelectorAll("[data-lead-label]")) node.textContent = copy[node.dataset.leadLabel];
  for (const input of form.querySelectorAll("[data-lead-placeholder]")) input.placeholder = copy.placeholders[input.dataset.leadPlaceholder];
  setText(form, "[data-lead-heading]", copy.heading); setText(form, "[data-lead-helper]", copy.helper); setText(form, "[data-lead-privacy-link]", copy.privacy);
  const button = form.querySelector("[data-lead-submit]"); if (button) button.textContent = form.dataset.leadState === "loading" ? copy.loading : copy.submit;
  renderState(form, copy);
  setText(documentRef, "[data-lead-capture-success] [data-lead-success]", copy.success);
  setText(documentRef, "[data-lead-capture-success] [data-lead-success-action]", copy.successAction);
}

function validateForm(form, copy) {
  const values = Object.fromEntries(new FormData(form));
  let invalidInput = [...form.querySelectorAll("[required]")].find((input) => input.type === "checkbox" ? !input.checked : !input.value.trim());
  let message = invalidInput ? "required" : "";
  if (!message && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email ?? "")) { message = "invalidEmail"; invalidInput = form.querySelector("[name=email]"); }
  if (!message && !/^\+[1-9]\d{7,30}$/.test(String(values.whatsapp ?? "").replace(/[\s()-]/g, ""))) { message = "invalidWhatsapp"; invalidInput = form.querySelector("[name=whatsapp]"); }
  for (const input of form.querySelectorAll("[required]")) input.setAttribute("aria-invalid", String(Boolean(message && input === invalidInput)));
  if (message) { setState(form, "validation", message); renderState(form, copy); invalidInput.focus(); return null; }
  return values;
}

if (typeof document !== "undefined") document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-lead-capture-form]"); if (!form) return;
  const applyLanguage = (language) => localizeForm(form, language, document);
  const endpoint = form.dataset.leadEndpoint;
  document.addEventListener("uyp:language-change", (event) => applyLanguage(event.detail?.language));
  const submitButton = form.querySelector("[data-lead-submit]");
  if (!canSubmitLeadForm(endpoint)) { setState(form, "unavailable"); submitButton.disabled = true; applyLanguage(document.documentElement.lang); return; }
  submitButton.type = "submit"; submitButton.disabled = false;
  setState(form, "ready"); applyLanguage(document.documentElement.lang);
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); const copy = languageCopy(document.documentElement.lang); const values = validateForm(form, copy); if (!values || !canSubmitLeadForm(endpoint)) return;
    form.dataset.submissionId ||= crypto.randomUUID(); setState(form, "loading"); submitButton.disabled = true; localizeForm(form, document.documentElement.lang, document);
    const payload = { ...values, consent: values.consent === "on", emailMarketing: values.emailMarketing === "on", submissionId: form.dataset.submissionId, submittedAtMs: Date.now() - 3_000, sourcePage: "/start-free/", language: document.documentElement.lang === "es" ? "es" : "en", website: "" };
    let response;
    try {
      response = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const requestId = response.headers.get("X-Request-ID") ?? "";
      const result = await response.json();
      if (!result.ok || !result.stored) { const error = new Error("unavailable"); error.requestId = requestId; throw error; }
      form.hidden = true; document.querySelector("[data-lead-capture-success]").hidden = false; document.querySelector("[data-lead-capture-dashboard]").hidden = false;
    } catch (error) {
      const reference = error?.requestId ?? response?.headers?.get("X-Request-ID") ?? "";
      setState(form, "error", "failure"); submitButton.disabled = false; localizeForm(form, document.documentElement.lang, document);
      const status = form.querySelector("[data-lead-capture-status]"); if (status) { status.textContent = formatLeadError(copy.failure, reference); status.focus(); }
    }
  });
});
