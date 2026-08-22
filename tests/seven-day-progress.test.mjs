import assert from "node:assert/strict";
import test from "node:test";
import {
  PROGRESS_STORAGE_KEY,
  countCompleted,
  createProgressState,
  mountSevenDayProgress,
  parseProgress,
  readProgress,
  resetProgress,
  serializeProgress,
  toggleCompletion,
  writeProgress,
} from "../assets/seven-day-progress.mjs";

const lessonIds = ["day-1", "day-2", "day-3", "day-4", "day-5", "day-6", "day-7"];

test("progress state keeps only boolean flags for the seven canonical lessons", () => {
  const state = createProgressState({
    version: 1,
    completed: {
      "day-1": true,
      "day-2": "yes",
      "day-7": true,
      "day-99": true,
    },
    name: "Private visitor",
    email: "visitor@example.test",
    reflection: "This must never be saved",
  });

  assert.deepEqual(Object.keys(state), ["version", "completed"]);
  assert.equal(state.version, 1);
  assert.deepEqual(Object.keys(state.completed), lessonIds);
  assert.deepEqual(state.completed, {
    "day-1": true,
    "day-2": false,
    "day-3": false,
    "day-4": false,
    "day-5": false,
    "day-6": false,
    "day-7": true,
  });
});

test("missing, malformed and unsupported stored data becomes empty progress", () => {
  const empty = createProgressState();

  assert.deepEqual(parseProgress(null), empty);
  assert.deepEqual(parseProgress("not json"), empty);
  assert.deepEqual(parseProgress('{"version":2,"completed":{"day-1":true}}'), empty);
  assert.deepEqual(parseProgress('{"version":1,"completed":{"unknown":true}}'), empty);
});

test("completion toggles reversibly, rejects unknown lessons and counts true flags", () => {
  const empty = createProgressState();
  const completed = toggleCompletion(empty, "day-3");

  assert.equal(completed.completed["day-3"], true);
  assert.equal(countCompleted(completed), 1);
  assert.deepEqual(toggleCompletion(completed, "day-3"), empty);
  assert.deepEqual(toggleCompletion(completed, "day-99"), completed);
});

test("storage reads fail closed without throwing or inventing saved progress", () => {
  assert.deepEqual(readProgress(), { state: createProgressState(), persistent: false });
  assert.deepEqual(readProgress({ getItem() { throw new Error("blocked"); } }), {
    state: createProgressState(),
    persistent: false,
  });
});

test("storage writes use one namespaced key and exclude personal or reflection content", () => {
  const writes = [];
  const storage = { setItem: (...arguments_) => writes.push(arguments_) };
  const unsafeInput = {
    version: 1,
    completed: { "day-1": true, unknown: true },
    name: "Private visitor",
    email: "visitor@example.test",
    reflection: "This must never be saved",
  };

  assert.equal(writeProgress(storage, unsafeInput), true);
  assert.equal(writes.length, 1);
  assert.equal(writes[0][0], "uyp.sevenDayProgress.v1");
  assert.equal(writes[0][0], PROGRESS_STORAGE_KEY);
  assert.deepEqual(JSON.parse(writes[0][1]), JSON.parse(serializeProgress(unsafeInput)));
  assert.deepEqual(Object.keys(JSON.parse(writes[0][1])), ["version", "completed"]);
  assert.doesNotMatch(writes[0][1], /Private visitor|visitor@example|reflection|This must never be saved|unknown/);
  assert.equal(writeProgress({ setItem() { throw new Error("blocked"); } }, unsafeInput), false);
});

test("reset removes only seven-day progress and reports blocked storage honestly", () => {
  const removals = [];
  const storage = { removeItem: (key) => removals.push(key) };

  assert.equal(resetProgress(storage), true);
  assert.deepEqual(removals, ["uyp.sevenDayProgress.v1"]);
  assert.equal(resetProgress({ removeItem() { throw new Error("blocked"); } }), false);
  assert.equal(resetProgress(), false);
});

test("lesson enhancement enables reversible completion and persists only progress", () => {
  const writes = [];
  const storage = {
    getItem: (key) => key === PROGRESS_STORAGE_KEY ? null : "es",
    setItem: (...arguments_) => writes.push(arguments_),
  };
  const button = fakeElement({ progressComplete: "day-2", i18n: "sevenDay.lessons.day2.completion" });
  const status = fakeElement({ i18n: "sevenDay.progress.empty" });
  const document = fakeDocument({ buttons: [button], status });

  mountSevenDayProgress(document, { storage, translate: translateForTest });
  assert.equal(button.disabled, false);
  assert.equal(button.attributes.get("aria-pressed"), "false");
  assert.equal(status.textContent, "No days completed yet");

  button.click();
  assert.equal(button.attributes.get("aria-pressed"), "true");
  assert.equal(button.textContent, "Mark this day incomplete");
  assert.equal(status.textContent, "1 of 7 days complete");
  assert.equal(writes.length, 1);
  assert.equal(JSON.parse(writes[0][1]).completed["day-2"], true);

  button.click();
  assert.equal(button.attributes.get("aria-pressed"), "false");
  assert.equal(button.textContent, "Mark Day 2 complete");
  assert.equal(status.textContent, "No days completed yet");
  assert.equal(JSON.parse(writes[1][1]).completed["day-2"], false);
});

test("blocked storage keeps controls and lesson access usable with an honest status", () => {
  const button = fakeElement({ progressComplete: "day-1", i18n: "sevenDay.lessons.day1.completion" });
  const status = fakeElement({ i18n: "sevenDay.progress.empty" });
  const document = fakeDocument({ buttons: [button], status });
  const blockedStorage = {
    getItem() { throw new Error("read blocked"); },
    setItem() { throw new Error("write blocked"); },
  };

  assert.doesNotThrow(() => mountSevenDayProgress(document, {
    storage: blockedStorage,
    translate: translateForTest,
  }));
  assert.equal(button.disabled, false);
  assert.equal(status.textContent, "Lessons available; progress cannot be saved.");
  assert.doesNotThrow(() => button.click());
  assert.equal(button.attributes.get("aria-pressed"), "true");
  assert.equal(status.textContent, "Lessons available; progress cannot be saved.");
});

test("a blocked localStorage property cannot interrupt lesson access", () => {
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const button = fakeElement({ progressComplete: "day-1", i18n: "sevenDay.lessons.day1.completion" });
  const status = fakeElement({ i18n: "sevenDay.progress.empty" });
  const document = fakeDocument({ buttons: [button], status });

  try {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      get() { throw new Error("property blocked"); },
    });
    assert.doesNotThrow(() => mountSevenDayProgress(document, { translate: translateForTest }));
    assert.equal(button.disabled, false);
    assert.equal(status.textContent, "Lessons available; progress cannot be saved.");
  } finally {
    if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
    else delete globalThis.localStorage;
  }
});

test("dashboard reset requires confirmation, preserves unrelated storage and focuses its result", () => {
  const stored = new Map([
    [PROGRESS_STORAGE_KEY, serializeProgress(toggleCompletion(createProgressState(), "day-1"))],
    ["uyp.language", "es"],
    ["unrelated", "keep"],
  ]);
  const storage = {
    getItem: (key) => stored.get(key) ?? null,
    removeItem: (key) => stored.delete(key),
  };
  const status = fakeElement({ i18n: "sevenDay.progress.empty" });
  const reset = fakeElement({ i18n: "sevenDay.reset.label" });
  const card = fakeElement({ progressLesson: "day-1" });
  const decisions = [false, true];
  const document = fakeDocument({ status, reset, cards: [card] });

  mountSevenDayProgress(document, {
    storage,
    confirmReset: () => decisions.shift(),
    translate: translateForTest,
  });
  assert.equal(reset.disabled, false);
  assert.equal(card.dataset.progressCompleted, "true");

  reset.click();
  assert.equal(stored.has(PROGRESS_STORAGE_KEY), true);
  assert.equal(status.focused, false);

  reset.click();
  assert.equal(stored.has(PROGRESS_STORAGE_KEY), false);
  assert.equal(stored.get("uyp.language"), "es");
  assert.equal(stored.get("unrelated"), "keep");
  assert.equal(card.dataset.progressCompleted, "false");
  assert.equal(reset.disabled, true);
  assert.equal(status.textContent, "Your saved progress has been reset.");
  assert.equal(status.focused, true);
});

function fakeElement(dataset = {}) {
  const listeners = new Map();
  const classes = new Set();
  return {
    dataset: { ...dataset },
    attributes: new Map(),
    disabled: true,
    focused: false,
    textContent: "",
    addEventListener(type, listener) { listeners.set(type, listener); },
    removeEventListener(type) { listeners.delete(type); },
    setAttribute(name, value) { this.attributes.set(name, value); },
    click() { listeners.get("click")?.(); },
    focus() { this.focused = true; },
    classList: {
      toggle(name, force) {
        if (force) classes.add(name);
        else classes.delete(name);
      },
      contains: (name) => classes.has(name),
    },
  };
}

function fakeDocument({ buttons = [], status, reset = null, cards = [], languages = [] }) {
  return {
    documentElement: { lang: "en" },
    querySelector(selector) {
      if (selector === "[data-progress-status]") return status;
      if (selector === "[data-progress-reset]") return reset;
      return null;
    },
    querySelectorAll(selector) {
      if (selector === "[data-progress-complete]") return buttons;
      if (selector === "[data-progress-lesson]") return cards;
      if (selector === "[data-language]") return languages;
      return [];
    },
  };
}

function translateForTest(key) {
  return {
    "sevenDay.progress.empty": "No days completed yet",
    "sevenDay.progress.count": "{completed} of 7 days complete",
    "sevenDay.progress.complete": "All seven days complete",
    "sevenDay.progress.unavailable": "Lessons available; progress cannot be saved.",
    "sevenDay.progress.markIncomplete": "Mark this day incomplete",
    "sevenDay.reset.confirm": "Reset?",
    "sevenDay.reset.success": "Your saved progress has been reset.",
    "sevenDay.lessons.day1.completion": "Mark Day 1 complete",
    "sevenDay.lessons.day2.completion": "Mark Day 2 complete",
  }[key] ?? key;
}
