import { t } from "../content/translations.mjs?v=20260822-phase1";

export const PROGRESS_STORAGE_KEY = "uyp.sevenDayProgress.v1";

const PROGRESS_VERSION = 1;
const lessonIds = Object.freeze([
  "day-1",
  "day-2",
  "day-3",
  "day-4",
  "day-5",
  "day-6",
  "day-7",
]);
const lessonIdSet = new Set(lessonIds);

function getDefaultStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

export function createProgressState(value) {
  const validVersion = value?.version === PROGRESS_VERSION;
  const suppliedFlags = validVersion && value.completed && typeof value.completed === "object"
    ? value.completed
    : {};
  const completed = Object.fromEntries(lessonIds.map((lessonId) => [
    lessonId,
    suppliedFlags[lessonId] === true,
  ]));

  return { version: PROGRESS_VERSION, completed };
}

export function parseProgress(serialized) {
  return decodeProgress(serialized).state;
}

function decodeProgress(serialized) {
  if (serialized === null) return { state: createProgressState(), valid: true };
  if (typeof serialized !== "string") return { state: createProgressState(), valid: false };
  try {
    const value = JSON.parse(serialized);
    const supported = value !== null
      && typeof value === "object"
      && !Array.isArray(value)
      && value.version === PROGRESS_VERSION
      && value.completed !== null
      && typeof value.completed === "object"
      && !Array.isArray(value.completed);
    return { state: createProgressState(value), valid: supported };
  } catch {
    return { state: createProgressState(), valid: false };
  }
}

export function serializeProgress(state) {
  return JSON.stringify(createProgressState(state));
}

export function toggleCompletion(state, lessonId) {
  const current = createProgressState(state);
  if (!lessonIdSet.has(lessonId)) return current;
  return {
    ...current,
    completed: {
      ...current.completed,
      [lessonId]: !current.completed[lessonId],
    },
  };
}

export function countCompleted(state) {
  const current = createProgressState(state);
  return lessonIds.reduce((count, lessonId) => count + Number(current.completed[lessonId]), 0);
}

export function readProgress(storage = getDefaultStorage()) {
  try {
    if (typeof storage?.getItem !== "function") throw new TypeError("Progress storage is unavailable");
    const decoded = decodeProgress(storage.getItem(PROGRESS_STORAGE_KEY));
    return { state: decoded.state, persistent: decoded.valid };
  } catch {
    return { state: createProgressState(), persistent: false };
  }
}

export function writeProgress(storage = getDefaultStorage(), state) {
  try {
    if (typeof storage?.setItem !== "function") throw new TypeError("Progress storage is unavailable");
    storage.setItem(PROGRESS_STORAGE_KEY, serializeProgress(state));
    return true;
  } catch {
    return false;
  }
}

export function resetProgress(storage = getDefaultStorage()) {
  try {
    if (typeof storage?.removeItem !== "function") throw new TypeError("Progress storage is unavailable");
    storage.removeItem(PROGRESS_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function mountSevenDayProgress(document = globalThis.document, options = {}) {
  if (!document?.querySelectorAll) return () => {};

  const storage = Object.hasOwn(options, "storage") ? options.storage : getDefaultStorage();
  const translate = options.translate ?? t;
  const confirmReset = options.confirmReset ?? ((message) => globalThis.confirm?.(message) === true);
  const status = document.querySelector?.("[data-progress-status]");
  const reset = document.querySelector?.("[data-progress-reset]");
  const buttons = [...document.querySelectorAll("[data-progress-complete]")];
  const cards = [...document.querySelectorAll("[data-progress-lesson]")];
  const languageControls = [...document.querySelectorAll("[data-language]")];
  const completionKeys = new Map(buttons.map((button) => [
    button,
    button.dataset.progressCompleteKey ?? button.dataset.i18n,
  ]));
  const listeners = [];
  const loaded = readProgress(storage);
  let state = loaded.state;
  let persistent = loaded.persistent;
  let announcementKey = null;

  function language() {
    return document.documentElement?.lang === "es" ? "es" : "en";
  }

  function message(key, values = {}) {
    let localized = translate(key, language());
    for (const [name, value] of Object.entries(values)) {
      localized = localized.replaceAll(`{${name}}`, String(value));
    }
    return localized;
  }

  function render() {
    const completedCount = countCompleted(state);
    let statusKey = announcementKey;
    if (!statusKey) {
      if (!persistent) statusKey = "sevenDay.progress.unavailable";
      else if (completedCount === 0) statusKey = "sevenDay.progress.empty";
      else if (completedCount === lessonIds.length) statusKey = "sevenDay.progress.complete";
      else statusKey = "sevenDay.progress.count";
    }

    if (status) {
      status.dataset.i18n = statusKey;
      status.textContent = message(statusKey, { completed: completedCount });
    }

    for (const button of buttons) {
      const completed = state.completed[button.dataset.progressComplete] === true;
      const labelKey = completed ? "sevenDay.progress.markIncomplete" : completionKeys.get(button);
      button.disabled = false;
      button.dataset.i18n = labelKey;
      button.setAttribute?.("aria-pressed", String(completed));
      button.textContent = message(labelKey);
    }

    for (const card of cards) {
      const completed = state.completed[card.dataset.progressLesson] === true;
      card.dataset.progressCompleted = String(completed);
      card.classList?.toggle("is-complete", completed);
      const marker = card.querySelector?.("[data-progress-marker]");
      if (marker) {
        marker.hidden = !completed;
        marker.textContent = message("sevenDay.progress.lessonComplete");
      }
    }

    if (reset) reset.disabled = completedCount === 0;
  }

  for (const button of buttons) {
    const onClick = () => {
      announcementKey = null;
      state = toggleCompletion(state, button.dataset.progressComplete);
      persistent = writeProgress(storage, state);
      render();
    };
    button.addEventListener?.("click", onClick);
    listeners.push([button, onClick]);
  }

  if (reset) {
    const onReset = () => {
      let confirmed = false;
      try {
        confirmed = confirmReset(message("sevenDay.reset.confirm")) === true;
      } catch {
        confirmed = false;
      }
      if (!confirmed) return;

      if (resetProgress(storage)) {
        state = createProgressState();
        announcementKey = "sevenDay.reset.success";
      } else {
        persistent = false;
        announcementKey = "sevenDay.progress.unavailable";
      }
      render();
      status?.focus?.();
    };
    reset.addEventListener?.("click", onReset);
    listeners.push([reset, onReset]);
  }

  for (const control of languageControls) {
    const onLanguage = () => queueMicrotask(render);
    control.addEventListener?.("click", onLanguage);
    listeners.push([control, onLanguage]);
  }

  render();
  return () => {
    for (const [element, listener] of listeners) element.removeEventListener?.("click", listener);
  };
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => mountSevenDayProgress(document), { once: true });
  } else {
    mountSevenDayProgress(document);
  }
}
