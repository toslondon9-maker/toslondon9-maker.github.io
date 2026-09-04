
export const formMessages = Object.freeze({
  en: { unavailable: "Registration is being prepared. Please contact Tariq on WhatsApp to begin your free experience.", failure: "We couldn't register you just now. Please try again or contact Tariq on WhatsApp." },
  es: { unavailable: "Estamos preparando el registro. Ponte en contacto con Tariq por WhatsApp para comenzar tu experiencia gratuita.", failure: "No hemos podido registrar tus datos ahora. Inténtalo de nuevo o contacta con Tariq por WhatsApp." },
});
export const canSubmitLeadForm = (endpoint) => /^https:\/\/.+\/lead$/.test(endpoint ?? "");
const labels = { en: { first: "First name", last: "Surname", email: "Email", whatsapp: "WhatsApp number including country code", goal: "What would you most like to change or improve right now?", difficulty: "What is currently holding you back most?", consent: "I agree that Tariq may contact me on WhatsApp about the Free 7-Day Experience.", marketing: "I would like occasional email updates.", submit: "START MY FREE 7 DAYS", unavailable: formMessages.en.unavailable, success: "You’re registered. Welcome to Unleash Your Power." }, es: { first: "Nombre", last: "Apellido", email: "Correo electrónico", whatsapp: "Número de WhatsApp con código de país", goal: "¿Qué te gustaría cambiar o mejorar ahora mismo?", difficulty: "¿Qué te está frenando más?", consent: "Acepto que Tariq me contacte por WhatsApp sobre la experiencia gratuita de 7 días.", marketing: "Me gustaría recibir novedades ocasionales por correo electrónico.", submit: "COMENZAR MIS 7 DÍAS GRATIS", unavailable: formMessages.es.unavailable, success: "Tu registro se ha completado." } };
function localizeForm(form, language) { const copy = labels[language === "es" ? "es" : "en"]; for (const label of form.querySelectorAll("[data-lead-label]")) { const input = label.querySelector("input, textarea"); if (input) label.firstChild.textContent = `${copy[label.dataset.leadLabel]} `; else label.textContent = copy[label.dataset.leadLabel]; } form.querySelector("[data-lead-capture-status]").textContent = copy.unavailable; form.querySelector("button[type=submit]").textContent = copy.submit; const success = document.querySelector("[data-lead-capture-success] p"); if (success) success.textContent = copy.success; }
if (typeof document !== "undefined") document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-lead-capture-form]"); if (!form) return;
  localizeForm(form, document.documentElement.lang);
  document.addEventListener("uyp:language-change", (event) => localizeForm(form, event.detail?.language));
  const status = document.querySelector("[data-lead-capture-status]"); const endpoint = form.dataset.leadEndpoint;
  if (!endpoint) { form.querySelector("button[type=submit]").disabled = true; status.textContent = formMessages[document.documentElement.lang === "es" ? "es" : "en"].unavailable; return; }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form));
    const payload = { ...values, consent: values.consent === "on", emailMarketing: values.emailMarketing === "on", submissionId: crypto.randomUUID(), submittedAtMs: Date.now() - 3_000, sourcePage: "/start-free/", language: document.documentElement.lang === "es" ? "es" : "en", website: "" };
    try {
      const response = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!result.ok || !result.stored) throw new Error("unavailable");
      form.hidden = true; document.querySelector("[data-lead-capture-success]").hidden = false; document.querySelector("[data-lead-capture-dashboard]").hidden = false;
    } catch { status.textContent = formMessages[document.documentElement.lang === "es" ? "es" : "en"].failure; status.focus(); }
  });
});
