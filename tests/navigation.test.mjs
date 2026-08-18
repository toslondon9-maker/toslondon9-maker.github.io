import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { renderPage } from "../src/page-shell.mjs";
import { renderFooter, renderHeader } from "../src/shared-chrome.mjs";
import { mountNavigation } from "../assets/site-navigation.mjs";

const requiredDestinations = [
  "/",
  "/start-free/",
  "/master-key-system/",
  "/ai-mentors/",
  "/coaching/",
  "/resources/",
  "/about-tariq/",
  "/faq/",
  "/contact/",
];

test("global navigation exposes every required destination", () => {
  const html = renderHeader({ route: "/", language: "en" });
  for (const href of requiredDestinations) {
    assert.match(html, new RegExp(`href="${href}"`));
  }
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, />EN<.*>ES</s);
  assert.equal((html.match(/class="siteNav"/g) ?? []).length, 1);
  assert.match(html, /href="\/" aria-current="page"/);
  assert.doesNotMatch(html, /<div[^>]+(?:onclick|role="button")/);
});

test("footer includes mission, primary routes, policies, language and copyright", () => {
  const html = renderFooter({ language: "en" });
  assert.match(html, /independent coaching experience inspired by the Master Key System/i);
  for (const href of requiredDestinations) {
    assert.match(html, new RegExp(`href="${href}"`));
  }
  assert.match(html, /href="\/privacy\/"/);
  assert.match(html, /href="\/terms\/"/);
  assert.match(html, />EN<.*>ES</s);
  assert.match(html, /© \d{4} Unleash Your Power/);
});

test("page shell mounts shared chrome and the navigation module once", () => {
  const html = renderPage({
    route: "/faq/",
    language: "en",
    title: "FAQ",
    description: "Answers.",
    body: '<main id="main-content"><h1>FAQ</h1></main>',
    scripts: ["/assets/app.mjs"],
  });

  assert.match(html, /data-site-navigation/);
  assert.match(html, /href="\/faq\/" aria-current="page"/);
  assert.equal((html.match(/src="\/assets\/site-navigation\.mjs"/g) ?? []).length, 1);
  assert.equal((html.match(/src="\/assets\/app\.mjs"/g) ?? []).length, 1);
});

test("mobile destinations remain usable before JavaScript enhancement", () => {
  const html = renderHeader({ route: "/", language: "en" });
  const panel = html.match(/<div class="mobileNav__panel"[\s\S]*?<\/div><\/div><\/div><\/header>/)?.[0] ?? "";
  const css = readFileSync(new URL("../assets/platform.css", import.meta.url), "utf8");

  assert.ok(panel, "mobile navigation panel should be present in the response HTML");
  assert.doesNotMatch(panel, /data-navigation-panel hidden/);
  for (const href of requiredDestinations) {
    assert.match(panel, new RegExp(`href="${href}"`));
  }
  assert.match(css, /\.mobileNav__toggle\s*\{[^}]*display:\s*none/s);
  assert.match(css, /\.navigationEnhanced\s+\.mobileNav__toggle\s*\{[^}]*display:\s*grid/s);
  assert.match(css, /\.siteHeader:not\(\.navigationEnhanced\)[^{]*\.mobileNav__panel/);
});

function createNavigationFixture() {
  const listeners = new Map();
  const buttonListeners = new Map();
  const panelListeners = new Map();
  const classes = new Set();
  const rootClasses = new Set();
  const outside = {};
  const link = {};
  let focused = 0;
  let breakpointListener;

  const button = {
    attributes: new Map([["aria-expanded", "false"]]),
    addEventListener(type, listener) { buttonListeners.set(type, listener); },
    removeEventListener(type) { buttonListeners.delete(type); },
    getAttribute(name) { return this.attributes.get(name); },
    setAttribute(name, value) { this.attributes.set(name, value); },
    focus() { focused += 1; },
  };
  const panel = {
    hidden: false,
    addEventListener(type, listener) { panelListeners.set(type, listener); },
    removeEventListener(type) { panelListeners.delete(type); },
  };
  const root = {
    classList: {
      add(name) { rootClasses.add(name); },
      remove(name) { rootClasses.delete(name); },
    },
    querySelector(selector) {
      if (selector === "[data-navigation-toggle]") return button;
      if (selector === "[data-navigation-panel]") return panel;
      return null;
    },
    contains(target) { return target === button || target === panel || target === link; },
  };
  const document = {
    defaultView: {
      matchMedia(query) {
        assert.equal(query, "(min-width: 1081px)");
        return {
          matches: false,
          addEventListener(type, listener) {
            assert.equal(type, "change");
            breakpointListener = listener;
          },
          removeEventListener(type, listener) {
            assert.equal(type, "change");
            if (breakpointListener === listener) breakpointListener = undefined;
          },
        };
      },
    },
    body: {
      classList: {
        toggle(name, force) { force ? classes.add(name) : classes.delete(name); },
        remove(name) { classes.delete(name); },
      },
    },
    querySelector(selector) { return selector === "[data-site-navigation]" ? root : null; },
    addEventListener(type, listener) { listeners.set(type, listener); },
    removeEventListener(type) { listeners.delete(type); },
  };

  return {
    button,
    panel,
    link,
    outside,
    classes,
    rootClasses,
    focused: () => focused,
    clickButton: () => buttonListeners.get("click")?.({ target: button }),
    clickPanelLink: () => panelListeners.get("click")?.({ target: { closest: () => link } }),
    clickOutside: () => listeners.get("click")?.({ target: outside }),
    pressEscape: () => listeners.get("keydown")?.({ key: "Escape" }),
    crossToDesktop: () => breakpointListener?.({ matches: true }),
    document,
  };
}

test("mobile navigation toggles and closes accessibly", () => {
  const fixture = createNavigationFixture();
  const unmount = mountNavigation(fixture.document);

  assert.ok(fixture.rootClasses.has("navigationEnhanced"));
  assert.equal(fixture.panel.hidden, true);

  fixture.clickButton();
  assert.equal(fixture.button.getAttribute("aria-expanded"), "true");
  assert.equal(fixture.panel.hidden, false);
  assert.ok(fixture.classes.has("navigationOpen"));

  fixture.pressEscape();
  assert.equal(fixture.button.getAttribute("aria-expanded"), "false");
  assert.equal(fixture.panel.hidden, true);
  assert.equal(fixture.focused(), 1);
  assert.equal(fixture.classes.has("navigationOpen"), false);

  fixture.clickButton();
  fixture.clickOutside();
  assert.equal(fixture.panel.hidden, true);
  assert.equal(fixture.focused(), 2);

  fixture.clickButton();
  fixture.clickPanelLink();
  assert.equal(fixture.panel.hidden, true);
  assert.equal(fixture.focused(), 3);

  unmount();
  assert.equal(fixture.classes.has("navigationOpen"), false);
  assert.equal(fixture.rootClasses.has("navigationEnhanced"), false);
});

test("crossing to the desktop breakpoint resets an open mobile menu", () => {
  const fixture = createNavigationFixture();
  mountNavigation(fixture.document);

  fixture.clickButton();
  assert.equal(fixture.panel.hidden, false);
  assert.ok(fixture.classes.has("navigationOpen"));

  fixture.crossToDesktop();
  assert.equal(fixture.button.getAttribute("aria-expanded"), "false");
  assert.equal(fixture.panel.hidden, true);
  assert.equal(fixture.classes.has("navigationOpen"), false);
});

test("mountNavigation is a safe no-op when chrome is absent", () => {
  assert.doesNotThrow(() => mountNavigation({ querySelector: () => null }));
});
