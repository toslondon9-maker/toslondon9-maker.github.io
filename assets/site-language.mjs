import { t } from "../content/translations.mjs?v=20260909-homepage-conversion";

const courseFallbacks = Object.freeze({
  "route.masterKeySystemOnlineCourse.heroWeeks": { en: "24 WEEKS", es: "24 SEMANAS" },
  "route.masterKeySystemOnlineCourse.heroStages": { en: "4 PROGRESSIVE STAGES", es: "4 ETAPAS PROGRESIVAS" },
  "route.masterKeySystemOnlineCourse.heroRhythm": { en: "Study · practise · apply", es: "Estudia · practica · aplica" },
  "route.masterKeySystemOnlineCourse.stageUnit": { en: "WEEKS", es: "SEMANAS" },
  "route.masterKeySystemOnlineCourse.journeyLabel": { en: "THE 24-WEEK JOURNEY", es: "EL RECORRIDO DE 24 SEMANAS" },
  "route.masterKeySystemOnlineCourse.stages.foundation": { en: "Foundation", es: "Fundamentos" },
  "route.masterKeySystemOnlineCourse.stages.visualisation": { en: "Visualisation", es: "Visualización" },
  "route.masterKeySystemOnlineCourse.stages.concentration": { en: "Concentration", es: "Concentración" },
  "route.masterKeySystemOnlineCourse.stages.mastery": { en: "Contemplation & Mastery", es: "Contemplación y dominio" },
  "route.masterKeySystemOnlineCourse.studyLabel": { en: "HOW YOU STUDY", es: "CÓMO ESTUDIAS" },
  "route.masterKeySystemOnlineCourse.nextLabel": { en: "YOUR NEXT STEP", es: "TU SIGUIENTE PASO" },
  "route.masterKeySystemOnlineCourse.nextHeading": { en: "Choose how you want to continue.", es: "Elige cómo quieres continuar." },
  "route.masterKeySystemOnlineCourse.heroStart": { en: "START FREE FOR 7 DAYS", es: "EMPEZAR GRATIS DURANTE 7 DÍAS" },
  "route.masterKeySystemOnlineCourse.heroCoaching": { en: "EXPLORE MASTER KEY COACHING", es: "EXPLORAR EL COACHING DEL MASTER KEY" },
});

function translate(key, language) {
  const value = t(key, language);
  return value === key ? (courseFallbacks[key]?.[language] ?? value) : value;
}

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
    element.textContent = translate(element.dataset.i18n, language);
  }
  for (const element of document.querySelectorAll?.("[data-i18n-placeholder]") ?? []) {
    element.placeholder = translate(element.dataset.i18nPlaceholder, language);
  }
  for (const element of document.querySelectorAll?.("[data-i18n-alt]") ?? []) {
    element.setAttribute("alt", translate(element.dataset.i18nAlt, language));
  }
  for (const element of document.querySelectorAll?.("[data-i18n-aria-label]") ?? []) {
    element.setAttribute("aria-label", translate(element.dataset.i18nAriaLabel, language));
  }

  const title = document.querySelector?.("title[data-i18n]");
  if (title) title.textContent = translate(title.dataset.i18n, language);
  const description = document.querySelector?.('meta[name="description"][data-i18n]');
  if (description) description.content = translate(description.dataset.i18n, language);

  for (const control of document.querySelectorAll?.("[data-language]") ?? []) {
    control.setAttribute("aria-pressed", String(control.dataset.language === language));
  }
  document.dispatchEvent?.(new CustomEvent("uyp:language-change", { detail: { language } }));
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
