import assert from "node:assert/strict";
import test from "node:test";
import {
  WORKBOOK_STORAGE_KEY,
  clearWorkbookAnswer,
  createWorkbookState,
  mountSevenDayWorkbook,
  parseWorkbook,
  readWorkbook,
  setWorkbookAnswer,
  writeWorkbook,
} from "../assets/seven-day-workbook.mjs";

test("workbook state stores only canonical lesson answers and limits text", () => {
  const first = setWorkbookAnswer(createWorkbookState(), "day-2", "A useful reflection");
  const limited = setWorkbookAnswer(first, "day-2", "x".repeat(4001));

  assert.equal(WORKBOOK_STORAGE_KEY, "uyp.sevenDayWorkbook.v1");
  assert.equal(first.answers["day-2"], "A useful reflection");
  assert.equal(first.answers["day-99"], undefined);
  assert.equal(limited.answers["day-2"].length, 4000);
  assert.deepEqual(setWorkbookAnswer(first, "day-99", "Ignore this"), first);
});

test("malformed or unsupported persisted workbook data becomes an empty workbook", () => {
  const empty = createWorkbookState();

  assert.deepEqual(parseWorkbook("not json"), empty);
  assert.deepEqual(parseWorkbook('{"version":2,"answers":{"day-1":"text"}}'), empty);
  assert.deepEqual(parseWorkbook('{"version":1,"answers":{"day-99":"text"}}'), empty);
});

test("storage writes only the namespaced workbook key and errors remain non-throwing", () => {
  const writes = [];
  const state = setWorkbookAnswer(createWorkbookState(), "day-4", "I choose to act deliberately.");

  assert.equal(writeWorkbook({ setItem: (...args) => writes.push(args) }, state), true);
  assert.deepEqual(writes[0][0], WORKBOOK_STORAGE_KEY);
  assert.equal(JSON.parse(writes[0][1]).answers["day-4"], "I choose to act deliberately.");
  assert.equal(writeWorkbook({ setItem() { throw new Error("blocked"); } }, state), false);
  assert.deepEqual(readWorkbook({ getItem: () => "not json" }), { state: createWorkbookState(), persistent: false });
});

test("clearing one answer preserves every other day", () => {
  const state = setWorkbookAnswer(
    setWorkbookAnswer(createWorkbookState(), "day-1", "First"),
    "day-7",
    "Seventh",
  );

  assert.deepEqual(clearWorkbookAnswer(state, "day-1").answers, { "day-7": "Seventh" });
});

test("workbook enhancement restores, saves and clears an answer on the current device", () => {
  const textarea = fakeElement({ workbookLesson: "day-1" });
  const status = fakeElement({});
  const clear = fakeElement({ workbookLesson: "day-1" });
  const writes = [];
  const storage = {
    getItem: () => '{"version":1,"answers":{"day-1":"Saved answer"}}',
    setItem: (...args) => writes.push(args),
  };
  const document = fakeDocument({ textarea, status, clear });

  mountSevenDayWorkbook(document, {
    storage,
    translate: (key) => ({
      "sevenDay.workbook.saved": "Saved on this device only.",
      "sevenDay.workbook.cleared": "Your reflection has been cleared from this device.",
      "sevenDay.workbook.unavailable": "Your reflection cannot be saved on this device.",
      "sevenDay.workbook.clearConfirm": "Clear this reflection?",
    })[key],
    confirmClear: () => true,
  });

  assert.equal(textarea.value, "Saved answer");
  textarea.input("New answer");
  assert.equal(status.textContent, "Saved on this device only.");
  assert.equal(JSON.parse(writes.at(-1)[1]).answers["day-1"], "New answer");
  clear.click();
  assert.equal(textarea.value, "");
  assert.equal(status.textContent, "Your reflection has been cleared from this device.");
  assert.equal(status.focused, true);
});

test("blocked browser storage leaves the writing area usable with an honest status", () => {
  const textarea = fakeElement({ workbookLesson: "day-2" });
  const status = fakeElement({});
  const document = fakeDocument({ textarea, status, clear: fakeElement({ workbookLesson: "day-2" }) });

  assert.doesNotThrow(() => mountSevenDayWorkbook(document, {
    storage: { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); } },
    translate: (key) => key === "sevenDay.workbook.unavailable" ? "Your reflection cannot be saved on this device." : key,
  }));
  textarea.input("Still usable");
  assert.equal(status.textContent, "Your reflection cannot be saved on this device.");
});

function fakeElement(dataset) {
  const listeners = new Map();
  return {
    dataset,
    value: "",
    textContent: "",
    focused: false,
    addEventListener(type, listener) { listeners.set(type, listener); },
    removeEventListener(type) { listeners.delete(type); },
    focus() { this.focused = true; },
    input(value) { this.value = value; listeners.get("input")?.({ currentTarget: this }); },
    click() { listeners.get("click")?.({ currentTarget: this }); },
  };
}

function fakeDocument({ textarea, status, clear }) {
  return {
    documentElement: { lang: "en" },
    querySelector(selector) {
      if (selector === "[data-workbook-status]") return status;
      return null;
    },
    querySelectorAll(selector) {
      if (selector === "[data-workbook-answer]") return [textarea];
      if (selector === "[data-workbook-clear]") return [clear];
      if (selector === "[data-language]") return [];
      return [];
    },
  };
}
