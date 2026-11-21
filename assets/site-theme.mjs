export const themeStorageKey = "uyp.theme";
export const defaultTheme = "light";

function validTheme(theme) {
  return theme === "light" || theme === "dark";
}

export function getTheme(storage) {
  try {
    const target = storage ?? globalThis.localStorage;
    const stored = target?.getItem?.(themeStorageKey);
    return validTheme(stored) ? stored : defaultTheme;
  } catch {
    return defaultTheme;
  }
}

export function applyTheme(theme, document = globalThis.document, storage) {
  if (!validTheme(theme)) throw new RangeError(`Unsupported theme: ${theme}`);
  const root = document?.documentElement;
  if (!root) return theme;
  root.setAttribute("data-theme", theme);
  for (const control of document.querySelectorAll?.("[data-theme-toggle]") ?? []) {
    const nextTheme = theme === "dark" ? "light" : "dark";
    const label = nextTheme === "dark" ? "Dark mode" : "Light mode";
    const icon = nextTheme === "dark" ? "☾" : "☀";
    control.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
    control.setAttribute("aria-pressed", String(theme === "dark"));
    const labelElement = control.querySelector?.("[data-theme-label]");
    if (labelElement) labelElement.textContent = label;
    const iconElement = control.querySelector?.(".themeSwitch__icon");
    if (iconElement) iconElement.textContent = icon;
  }
  try { (storage ?? globalThis.localStorage)?.setItem?.(themeStorageKey, theme); } catch { /* Storage may be blocked. */ }
  document.dispatchEvent?.(new CustomEvent("uyp:theme-change", { detail: { theme } }));
  return theme;
}

export function mountTheme(document = globalThis.document, storage) {
  if (!document?.querySelectorAll) return () => {};
  const theme = getTheme(storage);
  applyTheme(theme, document, storage);
  const controls = [...document.querySelectorAll("[data-theme-toggle]")];
  const listeners = controls.map((control) => {
    const onClick = () => applyTheme(document.documentElement?.getAttribute?.("data-theme") === "dark" ? "light" : "dark", document, storage);
    control.addEventListener?.("click", onClick);
    return [control, onClick];
  });
  return () => listeners.forEach(([control, listener]) => control.removeEventListener?.("click", listener));
}

if (typeof document !== "undefined") mountTheme(document);
