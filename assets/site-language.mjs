import { t } from "../content/translations.mjs";

export const languageStorageKey = "uyp.language";

function requireLanguage(language) {
  if (language !== "en" && language !== "es") {
    throw new RangeError(`Unsupported language: ${language}`);
  }
  return language;
}

export function getLanguage(storage) {
  try {
    const targetStorage = storage ?? globalThis.localStorage;
    const stored = targetStorage?.getItem?.(languageStorageKey);
    return stored === "en" || stored === "es" ? stored : "en";
  } catch {
    return "en";
  }
}

export function localizeDocument(document, language) {
  requireLanguage(language);
  if (!document) return language;

  if (document.documentElement) document.documentElement.lang = language;

  for (const element of document.querySelectorAll?.("[data-i18n]") ?? []) {
    element.textContent = t(element.dataset.i18n, language);
  }
  for (const element of document.querySelectorAll?.("[data-i18n-placeholder]") ?? []) {
    element.placeholder = t(element.dataset.i18nPlaceholder, language);
  }
  for (const element of document.querySelectorAll?.("[data-i18n-aria-label]") ?? []) {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel, language));
  }

  const title = document.querySelector?.("title[data-i18n]");
  if (title) title.textContent = t(title.dataset.i18n, language);
  const description = document.querySelector?.('meta[name="description"][data-i18n]');
  if (description) description.content = t(description.dataset.i18n, language);

  for (const control of document.querySelectorAll?.("[data-language]") ?? []) {
    control.setAttribute("aria-pressed", String(control.dataset.language === language));
  }
  return language;
}

export function setLanguage(language, storage, document = globalThis.document) {
  requireLanguage(language);
  try {
    const targetStorage = storage ?? globalThis.localStorage;
    targetStorage?.setItem?.(languageStorageKey, language);
  } catch {
    // The page remains usable when privacy settings block local storage.
  }
  return localizeDocument(document, language);
}

export function mountLanguage(document = globalThis.document, storage) {
  if (!document?.querySelectorAll) return () => {};

  const controls = [...document.querySelectorAll("[data-language]")];
  const listeners = controls.map((control) => {
    const onClick = () => setLanguage(control.dataset.language, storage, document);
    control.addEventListener?.("click", onClick);
    return [control, onClick];
  });
  localizeDocument(document, getLanguage(storage));

  return () => {
    for (const [control, onClick] of listeners) control.removeEventListener?.("click", onClick);
  };
}

if (typeof document !== "undefined") mountLanguage(document);
