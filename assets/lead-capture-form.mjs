
export const formMessages = Object.freeze({
  en: { unavailable: "Registration is being prepared. Please contact Tariq on WhatsApp to begin your free experience.", failure: "We couldn't register you just now. Please try again or contact Tariq on WhatsApp." },
  es: { unavailable: "Estamos preparando el registro. Ponte en contacto con Tariq por WhatsApp para comenzar tu experiencia gratuita.", failure: "No hemos podido registrar tus datos ahora. Inténtalo de nuevo o contacta con Tariq por WhatsApp." },
});
export const canSubmitLeadForm = (endpoint) => /^https:\/\/.+\/lead$/.test(endpoint ?? "");
if (typeof document !== "undefined") document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-lead-capture-form]"); if (!form) return;
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
