const key = "unleashYourPower.sessionHub.reflection";
const input = document.querySelector("[data-session-reflection-input]");
const save = document.querySelector("[data-session-reflection-save]");
const status = document.querySelector("[data-session-reflection-status]");
if (input && save && status) {
  const spanish = document.documentElement.lang.toLowerCase().startsWith("es");
  const savedMessage = spanish ? "Guardado solo en este dispositivo." : "Saved on this device only.";
  const unavailableMessage = spanish ? "Guardar no está disponible en este navegador." : "Saving is unavailable in this browser.";
  try { input.value = localStorage.getItem(key) || ""; save.addEventListener("click", () => { try { localStorage.setItem(key, input.value); status.textContent = savedMessage; } catch { status.textContent = unavailableMessage; } }); } catch { status.textContent = unavailableMessage; }
}
