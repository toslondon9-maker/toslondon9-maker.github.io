export const WORKBOOK_STORAGE_KEY = "uyp.sevenDayWorkbook.v1";

const WORKBOOK_VERSION = 1;
const MAX_ANSWER_LENGTH = 4000;
const lessonIds = new Set([
  "day-1",
  "day-2",
  "day-3",
  "day-4",
  "day-5",
  "day-6",
  "day-7",
]);

function defaultStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

function validAnswer(value) {
  return typeof value === "string" ? value.slice(0, MAX_ANSWER_LENGTH) : undefined;
}

export function createWorkbookState(value) {
  const answers = {};
  if (value?.version === WORKBOOK_VERSION && value.answers && typeof value.answers === "object" && !Array.isArray(value.answers)) {
    for (const [lessonId, answer] of Object.entries(value.answers)) {
      const cleaned = validAnswer(answer);
      if (lessonIds.has(lessonId) && cleaned) answers[lessonId] = cleaned;
    }
  }
  return { version: WORKBOOK_VERSION, answers };
}

export function parseWorkbook(serialized) {
  if (typeof serialized !== "string") return createWorkbookState();
  try {
    const value = JSON.parse(serialized);
    if (!value || typeof value !== "object" || Array.isArray(value) || value.version !== WORKBOOK_VERSION || !value.answers || typeof value.answers !== "object" || Array.isArray(value.answers)) return createWorkbookState();
    if (Object.keys(value.answers).some((lessonId) => !lessonIds.has(lessonId) || typeof value.answers[lessonId] !== "string")) return createWorkbookState();
    return createWorkbookState(value);
  } catch {
    return createWorkbookState();
  }
}

export function setWorkbookAnswer(state, lessonId, value) {
  const current = createWorkbookState(state);
  if (!lessonIds.has(lessonId)) return current;
  const answer = String(value ?? "").slice(0, MAX_ANSWER_LENGTH);
  return {
    ...current,
    answers: answer ? { ...current.answers, [lessonId]: answer } : Object.fromEntries(Object.entries(current.answers).filter(([id]) => id !== lessonId)),
  };
}

export function clearWorkbookAnswer(state, lessonId) {
  return setWorkbookAnswer(state, lessonId, "");
}

export function readWorkbook(storage = defaultStorage()) {
  try {
    if (typeof storage?.getItem !== "function") throw new TypeError("Workbook storage is unavailable");
    const stored = storage.getItem(WORKBOOK_STORAGE_KEY);
    if (stored === null) return { state: createWorkbookState(), persistent: true };
    const state = parseWorkbook(stored);
    return { state, persistent: JSON.stringify(state) === stored };
  } catch {
    return { state: createWorkbookState(), persistent: false };
  }
}

export function writeWorkbook(storage = defaultStorage(), state) {
  try {
    if (typeof storage?.setItem !== "function") throw new TypeError("Workbook storage is unavailable");
    storage.setItem(WORKBOOK_STORAGE_KEY, JSON.stringify(createWorkbookState(state)));
    return true;
  } catch {
    return false;
  }
}

export function mountSevenDayWorkbook(document = globalThis.document, options = {}) {
  if (!document?.querySelectorAll) return () => {};

  const storage = Object.hasOwn(options, "storage") ? options.storage : defaultStorage();
  const translate = options.translate ?? ((key) => key);
  const confirmClear = options.confirmClear ?? ((message) => globalThis.confirm?.(message) === true);
  const textareas = [...document.querySelectorAll("[data-workbook-answer]")];
  const clearButtons = [...document.querySelectorAll("[data-workbook-clear]")];
  const languageControls = [...document.querySelectorAll("[data-language]")];
  const status = document.querySelector("[data-workbook-status]");
  const listeners = [];
  let { state, persistent } = readWorkbook(storage);
  let announcementKey = null;

  function language() {
    return document.documentElement?.lang === "es" ? "es" : "en";
  }

  function message(key) {
    return translate(key, language());
  }

  function render() {
    for (const textarea of textareas) {
      const answer = state.answers[textarea.dataset.workbookLesson] ?? "";
      if (textarea.value !== answer) textarea.value = answer;
    }
    if (status) {
      const key = announcementKey ?? (persistent ? null : "sevenDay.workbook.unavailable");
      status.dataset.i18n = key ?? "";
      status.textContent = key ? message(key) : "";
    }
  }

  for (const textarea of textareas) {
    const onInput = () => {
      state = setWorkbookAnswer(state, textarea.dataset.workbookLesson, textarea.value);
      persistent = writeWorkbook(storage, state);
      announcementKey = persistent ? "sevenDay.workbook.saved" : "sevenDay.workbook.unavailable";
      render();
    };
    textarea.addEventListener("input", onInput);
    listeners.push([textarea, "input", onInput]);
  }

  for (const button of clearButtons) {
    const onClick = () => {
      let approved = false;
      try {
        approved = confirmClear(message("sevenDay.workbook.clearConfirm")) === true;
      } catch {
        approved = false;
      }
      if (!approved) return;
      state = clearWorkbookAnswer(state, button.dataset.workbookLesson);
      persistent = writeWorkbook(storage, state);
      announcementKey = persistent ? "sevenDay.workbook.cleared" : "sevenDay.workbook.unavailable";
      render();
      status?.focus?.();
    };
    button.addEventListener("click", onClick);
    listeners.push([button, "click", onClick]);
  }

  for (const control of languageControls) {
    const onLanguage = () => queueMicrotask(render);
    control.addEventListener("click", onLanguage);
    listeners.push([control, "click", onLanguage]);
  }

  render();
  return () => {
    for (const [element, type, listener] of listeners) element.removeEventListener?.(type, listener);
  };
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => mountSevenDayWorkbook(document), { once: true });
  } else {
    mountSevenDayWorkbook(document);
  }
}
