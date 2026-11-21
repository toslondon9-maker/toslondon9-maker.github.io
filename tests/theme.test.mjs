import assert from "node:assert/strict";
import test from "node:test";
import { getTheme, applyTheme, themeStorageKey } from "../assets/site-theme.mjs";
import { renderHeader } from "../src/shared-chrome.mjs";
import { renderPage } from "../src/page-shell.mjs";

function fixture() {
  const attrs = new Map();
  const listeners = new Map();
  const label = { textContent: "" };
  const icon = { textContent: "" };
  const control = {
    attrs,
    setAttribute(name, value) { attrs.set(name, value); },
    getAttribute(name) { return attrs.get(name); },
    querySelector(selector) { return selector === "[data-theme-label]" ? label : selector === ".themeSwitch__icon" ? icon : null; },
  };
  const root = { setAttribute(name, value) { attrs.set(name, value); }, getAttribute(name) { return attrs.get(name); } };
  const document = {
    documentElement: root,
    querySelectorAll(selector) { return selector === "[data-theme-toggle]" ? [control] : []; },
    dispatchEvent() {},
  };
  return { document, control, label, icon, attrs };
}

test("theme preference defaults to light and safely reads saved choices", () => {
  assert.equal(getTheme({ getItem: () => null }), "light");
  assert.equal(getTheme({ getItem: () => "dark" }), "dark");
  assert.equal(getTheme({ getItem: () => "invalid" }), "light");
  assert.equal(getTheme({ getItem: () => { throw new Error("blocked"); } }), "light");
  assert.equal(themeStorageKey, "uyp.theme");
});

test("applyTheme updates document state, accessible toggle labels and persistence", () => {
  const view = fixture();
  const writes = [];
  applyTheme("dark", view.document, { setItem: (...args) => writes.push(args) });
  assert.equal(view.document.documentElement.getAttribute("data-theme"), "dark");
  assert.equal(view.control.getAttribute("aria-pressed"), "true");
  assert.equal(view.control.getAttribute("aria-label"), "Switch to light mode");
  assert.equal(view.label.textContent, "Light mode");
  assert.equal(view.icon.textContent, "☀");
  assert.deepEqual(writes, [["uyp.theme", "dark"]]);
  assert.throws(() => applyTheme("sepia", view.document), /Unsupported theme/);
});

test("shared header offers a theme switch for desktop and mobile", () => {
  const html = renderHeader({ route: "/", language: "en" });
  assert.match(html, /themeSwitch--header/);
  assert.match(html, /themeSwitch--mobile/);
  assert.equal((html.match(/data-theme-toggle/g) ?? []).length, 2);
});

test("page shell loads theme module and applies saved preference before stylesheet paint", () => {
  const html = renderPage({ route: "/", language: "en", title: "Home", description: "Home.", body: "<main>Home</main>", scripts: [] });
  assert.match(html, /src="\/assets\/site-theme\.mjs\?v=20261121-global-theme-1"/);
  assert.ok(html.indexOf('localStorage.getItem("uyp.theme")') < html.indexOf('rel="stylesheet" href="/assets/platform.css'));
});
