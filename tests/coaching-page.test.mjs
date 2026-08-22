import assert from "node:assert/strict";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { renderCoaching } from "../src/pages/coaching.mjs";
import { mountTabs } from "../assets/tabs.mjs";

test("coaching is the accurate canonical offer", () => {
  const html = renderCoaching({ language: "en", siteData });
  for (const text of [
    "Weeks 1–4", "Weeks 5–11", "Weeks 12–18", "Weeks 19–24",
    "£97", "£197", "£397", "£497", "£1,188", "£997",
    "Save £191", "£1,788", "Save £791", "44% off full MSRP",
  ]) assert.ok(html.includes(text), text);
  assert.doesNotMatch(html, /6\s*[×x]\s*£169|£1,014/);
  assert.equal((html.match(/role="tab"/g) ?? []).length, 7);
  assert.equal((html.match(/role="tabpanel"/g) ?? []).length, 7);
  assert.match(html, /href="\/contact\/"/);
  assert.doesNotMatch(html, /paypal/i);
});

test("Spanish coaching copy is complete and natural", () => {
  const html = renderCoaching({ language: "es", siteData });
  for (const text of [
    "Resumen", "Fundamentos", "Visualización", "Concentración",
    "Contemplación y dominio", "Recorrido completo", "Preguntas frecuentes",
    "Semanas 1–4", "Ahorra £191", "44% de descuento sobre el PVP completo",
    "Habla con Tariq sobre tu inscripción",
  ]) assert.ok(html.includes(text), text);
  assert.doesNotMatch(html, /Overview|Full Journey|Frequently Asked Questions/);
});

test("every coaching detail has an in-place language-switch hook", () => {
  const html = renderCoaching({ language: "en", siteData });
  for (const stage of ["foundation", "visualisation", "concentration", "mastery"]) {
    assert.match(html, new RegExp(`data-i18n="coaching\\.stage\\.${stage}\\.name"`));
    assert.match(html, new RegExp(`data-i18n="coaching\\.stage\\.${stage}\\.outcome"`));
    for (let item = 1; item <= 3; item++) assert.match(html, new RegExp(`data-i18n="coaching\\.stage\\.${stage}\\.inclusion${item}"`));
  }
  for (let item = 1; item <= 6; item++) {
    assert.match(html, new RegExp(`data-i18n="coaching\\.faq\\.${item}\\.question"`));
    assert.match(html, new RegExp(`data-i18n="coaching\\.faq\\.${item}\\.answer"`));
  }
  for (const tab of ["overview", "foundation", "visualisation", "concentration", "mastery", "full", "faq"]) {
    assert.match(html, new RegExp(`data-i18n="coaching\\.tab\\.${tab}"`));
  }
});

function tabFixture() {
  const listeners = new Map();
  const tabs = Array.from({ length: 3 }, (_, index) => ({
    attributes: new Map([
      ["aria-selected", index === 0 ? "true" : "false"],
      ["tabindex", index === 0 ? "0" : "-1"],
    ]),
    addEventListener(type, listener) { listeners.set(`${index}:${type}`, listener); },
    removeEventListener() {},
    getAttribute(name) { return this.attributes.get(name); },
    setAttribute(name, value) { this.attributes.set(name, value); },
    focus() { fixture.focused = index; },
  }));
  const panels = tabs.map((_, index) => ({ hidden: index !== 0 }));
  const root = {
    classList: { add() {}, remove() {} },
    querySelectorAll(selector) {
      if (selector === '[role="tab"]') return tabs;
      if (selector === '[role="tabpanel"]') return panels;
      return [];
    },
  };
  const fixture = { root, tabs, panels, listeners, focused: -1 };
  return fixture;
}

test("enhanced tabs support arrows, Home, End, click and one visible panel", () => {
  const fixture = tabFixture();
  const unmount = mountTabs(fixture.root);

  fixture.listeners.get("0:keydown")({ key: "ArrowRight", preventDefault() {} });
  assert.equal(fixture.focused, 1);
  assert.equal(fixture.tabs[1].getAttribute("aria-selected"), "true");
  assert.deepEqual(fixture.panels.map((panel) => panel.hidden), [true, false, true]);

  fixture.listeners.get("1:keydown")({ key: "End", preventDefault() {} });
  assert.equal(fixture.focused, 2);
  fixture.listeners.get("2:keydown")({ key: "Home", preventDefault() {} });
  assert.equal(fixture.focused, 0);
  fixture.listeners.get("2:click")({ preventDefault() {} });
  assert.equal(fixture.tabs[2].getAttribute("aria-selected"), "true");
  assert.deepEqual(fixture.panels.map((panel) => panel.hidden), [true, true, false]);
  assert.equal(typeof unmount, "function");
});

test("tab enhancement is a safe no-op when the component is absent", () => {
  assert.doesNotThrow(() => mountTabs(null));
});
