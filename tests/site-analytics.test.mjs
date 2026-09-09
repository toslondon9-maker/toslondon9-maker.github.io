import assert from "node:assert/strict";
import test from "node:test";
import { analyticsConsentStorageKey, createAnalyticsController } from "../assets/site-analytics.mjs";
import { renderFooter } from "../src/shared-chrome.mjs";
import { renderPage } from "../src/page-shell.mjs";

function makeDom() {
  const documentListeners = new Map();
  const elementListeners = new Map();
  const banner = { hidden: false, setAttribute() {}, removeAttribute() {} };
  const accept = { addEventListener(type, listener) { elementListeners.set("accept:" + type, listener); } };
  const decline = { addEventListener(type, listener) { elementListeners.set("decline:" + type, listener); } };
  const preferences = { addEventListener(type, listener) { elementListeners.set("preferences:" + type, listener); } };
  const scripts = [];
  return {
    document: {
      querySelector(selector) {
        if (selector === "[data-analytics-banner]") return banner;
        if (selector === "[data-analytics-accept]") return accept;
        if (selector === "[data-analytics-decline]") return decline;
        if (selector === "[data-analytics-preferences]") return preferences;
        return null;
      },
      createElement() {
        return { set async(value) { this.asyncValue = value; }, set src(value) { this.srcValue = value; } };
      },
      head: { appendChild(script) { scripts.push(script); } },
      location: { pathname: "/" },
      addEventListener(type, listener) { documentListeners.set(type, listener); },
      removeEventListener() {},
    },
    window: { dataLayer: [], gtag(...args) { this.calls.push(args); }, calls: [] },
    storage: new MapStorage(),
    banner,
    elementListeners,
    documentListeners,
    scripts,
  };
}

class MapStorage {
  constructor() { this.values = new Map(); }
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}

test("GA does not load or emit events before analytics acceptance", () => {
  const dom = makeDom();
  const controller = createAnalyticsController({ documentRef: dom.document, windowRef: dom.window, storage: dom.storage });
  assert.equal(dom.scripts.length, 0);
  assert.deepEqual(dom.window.calls, []);
  controller.accept();
  assert.equal(dom.scripts.length, 1);
  assert.equal(dom.scripts[0].srcValue, "https://www.googletagmanager.com/gtag/js?id=G-7TSSP2WYHJ");
  assert.equal(dom.window.calls.some(([kind, name]) => kind === "event" && name === "page_view"), true);
  const consent = dom.window.calls.find(([kind, name]) => kind === "consent" && name === "default");
  assert.deepEqual(consent[2], { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
});

test("decline prevents tracking, withdrawal stops events, and re-accept restores it", () => {
  const dom = makeDom();
  const controller = createAnalyticsController({ documentRef: dom.document, windowRef: dom.window, storage: dom.storage });
  controller.decline();
  assert.equal(dom.scripts.length, 0);
  assert.equal(controller.trackEvent("generate_lead", { method: "website" }), false);
  controller.withdraw();
  controller.accept();
  assert.equal(controller.trackEvent("generate_lead", { method: "website" }), true);
  assert.equal(dom.window.calls.filter(([kind, name]) => kind === "event" && name === "generate_lead").length, 1);
});

test("blocked storage does not break consent controls", () => {
  const dom = makeDom();
  const blocked = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); }, removeItem() { throw new Error("blocked"); } };
  assert.doesNotThrow(() => createAnalyticsController({ documentRef: dom.document, windowRef: dom.window, storage: blocked }).accept());
  assert.equal(dom.scripts.length, 1);
});

test("a browser that throws while reading localStorage still keeps controls usable", () => {
  const dom = makeDom();
  const previousStorage = globalThis.localStorage;
  Object.defineProperty(globalThis, "localStorage", { configurable: true, get() { throw new Error("blocked"); } });
  try {
    const controller = createAnalyticsController({ documentRef: dom.document, windowRef: dom.window });
    dom.elementListeners.get("accept:click")();
    assert.equal(controller.getChoice(), "accepted");
    assert.equal(dom.scripts.length, 1);
  } finally {
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: previousStorage, writable: true });
  }
});

test("analytics events keep personal lead fields out of GA parameters", () => {
  const dom = makeDom();
  const controller = createAnalyticsController({ documentRef: dom.document, windowRef: dom.window, storage: dom.storage });
  controller.accept();
  controller.trackEvent("generate_lead", { method: "website", email: "ada@example.test", firstName: "Ada", whatsapp: "+34611223345" });
  const event = dom.window.calls.find(([kind, name]) => kind === "event" && name === "generate_lead");
  assert.deepEqual(event[2], { method: "website" });
  assert.equal(dom.storage.getItem(analyticsConsentStorageKey), "accepted");
});

test("PayPal clicks and confirmed registration emit only anonymous conversion events", () => {
  const dom = makeDom();
  const controller = createAnalyticsController({ documentRef: dom.document, windowRef: dom.window, storage: dom.storage });
  controller.accept();
  dom.documentListeners.get("click")({ target: { closest: () => ({ href: "https://www.paypal.com/ncp/payment/V5QYXZZS6KQE2" }) } });
  dom.documentListeners.get("uyp:registration-success")();
  const conversionEvents = dom.window.calls.filter(([kind, name]) => kind === "event" && ["begin_checkout", "generate_lead", "start_free_registration_confirmed"].includes(name));
  assert.deepEqual(conversionEvents.map(([, name, params]) => [name, params]), [
    ["begin_checkout", { currency: "GBP" }],
    ["generate_lead", { method: "website" }],
    ["start_free_registration_confirmed", {}],
  ]);
});

test("route loads stay informational while explicit conversion actions emit anonymous Phase 2 events", () => {
  const dayOne = makeDom();
  dayOne.document.location.pathname = "/start-free/day-1-see-whats-running-your-life/";
  createAnalyticsController({ documentRef: dayOne.document, windowRef: dayOne.window, storage: dayOne.storage }).accept();

  const daySeven = makeDom();
  daySeven.document.location.pathname = "/start-free/day-7-make-it-part-of-how-you-live/";
  const controller = createAnalyticsController({ documentRef: daySeven.document, windowRef: daySeven.window, storage: daySeven.storage });
  controller.accept();
  const click = daySeven.documentListeners.get("click");
  click({ target: { closest: (selector) => selector === "[data-progress-complete]" ? { dataset: { progressComplete: "day-7" } } : null } });
  click({ target: { closest: (selector) => selector === "a[href]" ? ({ href: "https://wa.me/34611223345?text=Hello", dataset: {} }) : null } });
  click({ target: { closest: (selector) => selector === "a[href]" ? ({ href: "/master-key-system/", dataset: {} }) : null } });
  click({ target: { closest: (selector) => selector === "a[href]" ? ({ href: "/start-free/", dataset: { i18n: "nav.startFree" } }) : null } });
  click({ target: { closest: (selector) => selector === "a[href]" ? ({ href: "/start-free/", dataset: { i18n: "insights.cta.start" } }) : null } });
  click({ target: { closest: (selector) => selector === "a[href]" ? ({ href: "https://www.paypal.com/ncp/payment/JW7JRY5GTRTA6", dataset: {} }) : null } });
  click({ target: { closest: (selector) => selector === "a[href]" ? ({ href: "https://www.paypal.com/ncp/payment/V5QYXZZS6KQE2", dataset: {} }) : null } });

  const eventNames = daySeven.window.calls.filter(([kind]) => kind === "event").map(([, name]) => name);
  assert.ok(dayOne.window.calls.some(([kind, name, parameters]) => kind === "event" && name === "day_1_open" && Object.keys(parameters).length === 0));
  for (const name of ["day_7_completion", "whatsapp_call_click", "complete_journey_begin_checkout", "begin_checkout", "foundation_begin_checkout"]) assert.ok(eventNames.includes(name));
  assert.equal(eventNames.filter((name) => name === "article_cta_click").length, 1);
  assert.equal(eventNames.filter((name) => name === "complete_journey_begin_checkout").length, 1);
  assert.equal(daySeven.window.calls.slice(0, 4).some(([kind, name]) => kind === "event" && name === "day_7_completion"), false);
  assert.equal(daySeven.window.calls.filter(([kind, name]) => kind === "event" && name === "foundation_begin_checkout")[0][2].email, undefined);
});

test("Phase 2 conversion events allow only named anonymous events", () => {
  const dom = makeDom();
  const controller = createAnalyticsController({ documentRef: dom.document, windowRef: dom.window, storage: dom.storage });
  controller.accept();
  const phaseTwoEvents = [
    "article_cta_click", "start_free_view", "start_free_registration_confirmed", "day_1_open",
    "day_7_completion", "whatsapp_call_click", "foundation_begin_checkout", "complete_journey_begin_checkout",
  ];

  for (const name of phaseTwoEvents) assert.equal(controller.trackEvent(name, { email: "visitor@example.test", firstName: "Visitor", whatsapp: "+34611223345" }), true);
  assert.equal(controller.trackEvent("unapproved_conversion", { email: "visitor@example.test" }), false);

  const events = dom.window.calls.filter(([kind, name]) => kind === "event" && phaseTwoEvents.includes(name));
  assert.deepEqual(events.map(([, name, parameters]) => [name, parameters]), phaseTwoEvents.map((name) => [name, {}]));
  assert.equal(dom.window.calls.some(([kind, name]) => kind === "event" && name === "unapproved_conversion"), false);
});

test("shared chrome exposes bilingual consent controls and preferences", () => {
  const footer = renderFooter({ language: "es" });
  assert.match(footer, /data-analytics-preferences/);
  assert.match(footer, /Preferencias de analítica/);
  const page = renderPage({ route: "/", language: "en", title: "Home", description: "Home.", body: "<main></main>" });
  assert.match(page, /data-analytics-banner/);
  assert.match(page, /data-analytics-accept/);
  assert.match(page, /data-analytics-decline/);
  assert.match(page, /site-analytics\.mjs/);
});
