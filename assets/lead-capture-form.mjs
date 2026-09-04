
export const formMessages = Object.freeze({
  en: { unavailable: "Registration is being prepared. Please contact Tariq on WhatsApp to begin your free experience.", failure: "We couldn't register you just now. Please try again or contact Tariq on WhatsApp." },
  es: { unavailable: "Estamos preparando el registro. Ponte en contacto con Tariq por WhatsApp para comenzar tu experiencia gratuita.", failure: "No hemos podido registrar tus datos ahora. Inténtalo de nuevo o contacta con Tariq por WhatsApp." },
});
export const canSubmitLeadForm = (endpoint) => /^https:\/\/.+\/lead$/.test(endpoint ?? "");
if (typeof document !== "undefined") document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-lead-capture-form]"); if (!form) return;
  const status = document.querySelector("[data-lead-capture-status]"); const endpoint = form.dataset.leadEndpoint;
  if (!endpoint) { form.querySelector("button[type=submit]").disabled = true; status.textContent = formMessages[document.documentElement.lang === "es" ? "es" : "en"].unavailable; return; }
  form.addEventListener("submit", async (event) => { event.preventDefault(); status.textContent = formMessages[document.documentElement.lang === "es" ? "es" : "en"].failure; });
});
