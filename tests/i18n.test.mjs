import assert from "node:assert/strict";
import test from "node:test";
import { getLanguage, localizeDocument, setLanguage } from "../assets/site-language.mjs";
import { mountNavigation } from "../assets/site-navigation.mjs";
import { hasTranslation, t } from "../content/translations.mjs";
import { renderFooter, renderHeader } from "../src/shared-chrome.mjs";
import { renderPage } from "../src/page-shell.mjs";

test("core conversion copy has natural Spanish", () => {
  assert.equal(t("cta.startFree", "es"), "Empieza gratis durante 7 días");
  assert.equal(t("cta.exploreJourney", "es"), "Descubre el recorrido de 24 semanas");
  assert.equal(t("cta.bookSession", "es"), "Reserva una sesión");
  assert.notEqual(t("home.hero.title", "en"), t("home.hero.title", "es"));
  assert.equal(hasTranslation("cta.startFree"), true);
  assert.equal(hasTranslation("missing.key"), false);
  assert.throws(() => t("missing.key", "es"), /Missing translation/);
  assert.throws(() => t("cta.startFree", "fr"), /Unsupported language/);
});

test("language storage defaults safely and accepts only supported languages", () => {
  assert.equal(getLanguage(), "en");
  assert.equal(getLanguage({ getItem: () => "es" }), "es");
  assert.equal(getLanguage({ getItem: () => "fr" }), "en");
  assert.equal(getLanguage({ getItem: () => { throw new Error("blocked"); } }), "en");
});

function translatable(key, initial = "") {
  return { dataset: { i18n: key }, textContent: initial };
}

test("localizeDocument updates copy, placeholders, metadata and switch state in place", () => {
  const heading = translatable("home.hero.title", "English");
  const input = { dataset: { i18nPlaceholder: "form.emailPlaceholder" }, placeholder: "Email" };
  const title = { dataset: { i18n: "meta.home.title" }, textContent: "English title" };
  const description = { dataset: { i18n: "meta.home.description" }, content: "English description" };
  const en = { dataset: { language: "en" }, attributes: new Map(), setAttribute(name, value) { this.attributes.set(name, value); } };
  const es = { dataset: { language: "es" }, attributes: new Map(), setAttribute(name, value) { this.attributes.set(name, value); } };
  const document = {
    documentElement: { lang: "en" },
    querySelectorAll(selector) {
      if (selector === "[data-i18n]") return [heading];
      if (selector === "[data-i18n-placeholder]") return [input];
      if (selector === "[data-language]") return [en, es];
      return [];
    },
    querySelector(selector) {
      if (selector === "title[data-i18n]") return title;
      if (selector === 'meta[name="description"][data-i18n]') return description;
      return null;
    },
  };

  localizeDocument(document, "es");

  assert.equal(document.documentElement.lang, "es");
  assert.equal(heading.textContent, t("home.hero.title", "es"));
  assert.equal(input.placeholder, t("form.emailPlaceholder", "es"));
  assert.equal(title.textContent, t("meta.home.title", "es"));
  assert.equal(description.content, t("meta.home.description", "es"));
  assert.equal(en.attributes.get("aria-pressed"), "false");
  assert.equal(es.attributes.get("aria-pressed"), "true");
});

test("setLanguage persists without changing the current route and tolerates blocked storage", () => {
  const writes = [];
  const document = {
    location: { pathname: "/coaching/" },
    documentElement: { lang: "en" },
    querySelectorAll: () => [],
    querySelector: () => null,
  };

  assert.equal(setLanguage("es", { setItem: (...args) => writes.push(args) }, document), "es");
  assert.deepEqual(writes, [["uyp.language", "es"]]);
  assert.equal(document.location.pathname, "/coaching/");
  assert.equal(document.documentElement.lang, "es");
  assert.doesNotThrow(() => setLanguage("en", { setItem: () => { throw new Error("blocked"); } }, document));
  assert.throws(() => setLanguage("fr", undefined, document), /Unsupported language/);
});

test("shared chrome renders complete localized labels and runtime hooks", () => {
  const header = renderHeader({ route: "/start-free/", language: "es" });
  const footer = renderFooter({ language: "es" });
  const html = `${header}${footer}`;

  for (const key of [
    "nav.home", "nav.startFree", "nav.masterKeySystem", "nav.aiMentors", "nav.coaching",
    "nav.resources", "nav.aboutTariq", "nav.faq", "nav.contact", "footer.mission",
    "footer.privacy", "footer.terms", "language.label", "menu.open",
  ]) assert.match(html, new RegExp(`data-i18n(?:-aria-label)?="${key}"`));
  assert.match(header, />Reto gratuito de 7 días</);
  assert.match(footer, /Una experiencia de coaching independiente inspirada en el Master Key System\./);
  assert.match(html, /aria-label="Idioma"/);
});

test("mobile menu state labels follow the active Spanish language", () => {
  const buttonListeners = new Map();
  const button = {
    dataset: { i18nAriaLabel: "menu.open" },
    attributes: new Map([["aria-expanded", "false"]]),
    addEventListener(type, listener) { buttonListeners.set(type, listener); },
    removeEventListener() {},
    getAttribute(name) { return this.attributes.get(name); },
    setAttribute(name, value) { this.attributes.set(name, value); },
    focus() {},
  };
  const panel = { hidden: false, addEventListener() {}, removeEventListener() {} };
  const root = {
    classList: { add() {}, remove() {} },
    querySelector(selector) { return selector.includes("toggle") ? button : panel; },
    contains: () => true,
  };
  const document = {
    documentElement: { lang: "es" },
    body: { classList: { toggle() {} } },
    defaultView: { matchMedia: () => ({ addEventListener() {}, removeEventListener() {} }) },
    querySelector: () => root,
    addEventListener() {},
    removeEventListener() {},
  };

  mountNavigation(document);
  assert.equal(button.attributes.get("aria-label"), "Abrir menú");
  buttonListeners.get("click")();
  assert.equal(button.attributes.get("aria-label"), "Cerrar menú");
  assert.equal(button.dataset.i18nAriaLabel, "menu.close");
});

test("page shell loads language enhancement once", () => {
  const html = renderPage({
    route: "/",
    language: "en",
    title: "Home",
    description: "Home.",
    titleKey: "meta.home.title",
    descriptionKey: "meta.home.description",
    body: '<main><h1 data-i18n="home.hero.title">Home</h1></main>',
    scripts: ["/assets/site-language.mjs"],
  });
  assert.equal((html.match(/src="\/assets\/site-language\.mjs"/g) ?? []).length, 1);
  assert.match(html, /<title data-i18n="meta\.home\.title">/);
  assert.match(html, /<meta name="description"[^>]+data-i18n="meta\.home\.description">/);
});
