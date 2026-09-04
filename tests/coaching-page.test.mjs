import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { localizeDocument } from "../assets/site-language.mjs";
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
  const payments = {
    foundation: "https://www.paypal.com/ncp/payment/V5QYXZZS6KQE2",
    visualisation: "https://www.paypal.com/ncp/payment/NWD3VU5VUTKCL",
    concentration: "https://www.paypal.com/ncp/payment/A7KJBWNCJARJC",
    mastery: "https://www.paypal.com/ncp/payment/N45ETXRZ9E3LQ",
    complete: "https://www.paypal.com/ncp/payment/JW7JRY5GTRTA6",
  };
  for (const url of Object.values(payments)) {
    assert.equal((html.match(new RegExp(url, "g")) ?? []).length, url === payments.complete ? 1 : 2);
    assert.match(html, new RegExp(`href="${url.replaceAll("/", "\\/")}" target="_blank" rel="noopener noreferrer"`));
  }
  assert.match(html, /Complete 24-Week Programme/);
});

test("English coaching page leads with Master Key coaching and keeps professional services secondary", async () => {
  const html = renderCoaching({ language: "en", siteData });
  const css = await readFile("assets/platform.css", "utf8");
  const flagshipIndex = html.indexOf('data-coaching-section="flagship"');
  const investmentIndex = html.indexOf('class="coachingExperience section--night"');
  const servicesIndex = html.indexOf('data-coaching-section="professional-services"');

  assert.match(html, /^<main class="coachingPage"/);
  assert.match(html, /<h1[^>]*>Personal Coaching with Tariq<\/h1>/);
  assert.ok(flagshipIndex > 0 && flagshipIndex < investmentIndex && investmentIndex < servicesIndex);
  for (const text of [
    "Personal Master Key Coaching",
    "accountability",
    "reflection",
    "practical application",
    "How coaching works:",
    "OTHER PROFESSIONAL SERVICES",
    "Sales &amp; Partnership Growth",
    "Leadership Workshops",
    "AI-Enabled Performance",
  ]) assert.ok(html.includes(text), text);
  for (const price of ["£97", "£197", "£397", "£497", "£1,188", "£997", "Save £191", "£1,788", "Save £791", "44% off full MSRP"]) {
    assert.ok(html.includes(price), price);
  }
  assert.doesNotMatch(html, /6\s*[×x]\s*£169|£1,014/);
  assert.match(html, /href="\/contact\/"[^>]*>Enquire About Coaching<\/a>/);
  assert.equal((html.match(/class="coachingProfessionalService card"/g) ?? []).length, 3);
  assert.match(css, /\.coachingProfessionalServices__grid[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(css, /@media[^}]*max-width:\s*768px[\s\S]*?\.coachingProfessionalServices__grid[^{]*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);

  const spanish = renderCoaching({ language: "es", siteData });
  assert.match(spanish, /Coaching para un dominio interior práctico/);
  assert.doesNotMatch(spanish, /Personal Coaching with Tariq|Other Professional Services/);
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

test("language switching updates the coaching tablist accessible name", () => {
  const html = renderCoaching({ language: "en", siteData });
  const tablist = html.match(/<div class="tabs coachingTabs"[^>]+>/)?.[0] ?? "";
  assert.match(tablist, /aria-label="Coaching programme sections"/);
  assert.match(tablist, /data-i18n-aria-label="coaching\.tabsLabel"/);

  const element = {
    dataset: { i18nAriaLabel: "coaching.tabsLabel" },
    attributes: new Map([["aria-label", "Coaching programme sections"]]),
    setAttribute(name, value) { this.attributes.set(name, value); },
  };
  localizeDocument({
    documentElement: { lang: "en" },
    querySelectorAll(selector) { return selector === "[data-i18n-aria-label]" ? [element] : []; },
    querySelector: () => null,
  }, "es");
  assert.equal(element.attributes.get("aria-label"), "Secciones del programa de coaching");
});

test("server-rendered coaching panels remain stacked and visible without JavaScript", () => {
  const html = renderCoaching({ language: "en", siteData });
  const panels = [...html.matchAll(/<section[^>]+role="tabpanel"[^>]*>/g)].map((match) => match[0]);
  assert.equal(panels.length, 7);
  for (const panel of panels) assert.doesNotMatch(panel, /\shidden(?:[\s=>]|$)/);
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

  fixture.listeners.get("1:keydown")({ key: "Enter", preventDefault() {} });
  assert.equal(fixture.focused, 1);
  assert.deepEqual(fixture.panels.map((panel) => panel.hidden), [true, false, true]);
  fixture.listeners.get("0:keydown")({ key: " ", preventDefault() {} });
  assert.equal(fixture.focused, 0);
  assert.deepEqual(fixture.panels.map((panel) => panel.hidden), [false, true, true]);
  assert.equal(typeof unmount, "function");
});

test("tab enhancement is a safe no-op when the component is absent", () => {
  assert.doesNotThrow(() => mountTabs(null));
});
