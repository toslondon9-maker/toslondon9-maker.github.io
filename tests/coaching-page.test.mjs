import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { renderCoaching } from "../src/pages/coaching.mjs";
import { siteData } from "../content/site-data.mjs";
import { mountTabs } from "../assets/tabs.mjs";

test("coaching follows the concise Start Free to pricing journey", () => {
  const html = renderCoaching({ language: "en", siteData });
  const hero = html.indexOf('class="coachingHero section"');
  const programme = html.indexOf('data-coaching-section="programme"');
  const build = html.indexOf('data-coaching-section="what-you-can-build"');
  const pricing = html.indexOf('data-coaching-section="pricing"');
  const services = html.indexOf('data-coaching-section="professional-services"');
  const faq = html.indexOf('data-coaching-section="faq"');
  const finalStep = html.indexOf('data-coaching-section="final-step"');

  assert.ok(hero >= 0 && hero < programme);
  assert.ok(programme < build && build < pricing && pricing < services && services < faq && faq < finalStep);
  assert.match(html.slice(0, programme), /href="\/start-free\/"[^>]*data-i18n="coaching\.hero\.startFree"/);
  assert.match(html.slice(programme, pricing), /data-i18n="phase2\.coaching\.benefit1Title"/);
  assert.match(html.slice(build, pricing), /WHAT YOU CAN BUILD/);
  assert.match(html.slice(pricing, services), /£97[\s\S]*£197[\s\S]*£397[\s\S]*£497/);
  assert.match(html.slice(pricing, services), /foundation\.compact\.(weeks|lessons|calls|totalCalls|access|support)/);
  assert.match(html.slice(pricing, services), /href="\/foundation\/"/);
  assert.doesNotMatch(html.slice(pricing, services), /paypal\.com\/ncp\/payment\/V5QYXZZS6KQE2/);
  assert.match(html.slice(pricing, services), /£997[\s\S]*PAY NOW/);
  assert.match(html.slice(pricing, services), /£900/);
  assert.doesNotMatch(html.slice(pricing, services), /£1,188|£191|saving|ahorra/);
  assert.equal((html.match(/data-coaching-section="pricing"/g) ?? []).length, 1);
  assert.equal((html.match(/data-coaching-section="what-you-can-build"/g) ?? []).length, 1);
  assert.equal((html.match(/class="coachingRateCard section"/g) ?? []).length, 0);
  assert.equal((html.match(/class="coachingExperience section--night"/g) ?? []).length, 0);
  assert.equal((html.match(/class="conversionJourney"/g) ?? []).length, 0);
  assert.match(html.slice(services, faq), /Alumni Practice Membership/);
  assert.match(html.slice(services, faq), /Mastery Circle/);
  assert.doesNotMatch(html.slice(services, faq), /Private Mentoring|Corporate Programmes/);
  assert.equal((html.match(/class="coachingProfessionalService card/g) ?? []).length, 2);
  assert.equal((html.match(/coachingProfessionalService--secondary/g) ?? []).length, 0);
  assert.doesNotMatch(html, /Distinct secondary services|Sales &amp; Partnership Growth|Leadership Workshops|AI-Enabled Performance/);
  assert.match(html.slice(faq, finalStep), /data-i18n="coaching\.faq\.title"/);
  assert.match(html.slice(finalStep), /href="\/start-free\/"/);
});

test("coaching keeps the canonical prices and every purchase destination", () => {
  const html = renderCoaching({ language: "en", siteData });
  for (const text of ["£97", "£197", "£397", "£497", "£997", "£900"]) assert.ok(html.includes(text), text);
  for (const url of [
    "https://www.paypal.com/ncp/payment/NWD3VU5VUTKCL",
    "https://www.paypal.com/ncp/payment/A7KJBWNCJARJC",
    "https://www.paypal.com/ncp/payment/N45ETXRZ9E3LQ",
    "https://www.paypal.com/ncp/payment/JW7JRY5GTRTA6",
  ]) assert.match(html, new RegExp(`href="${url.replaceAll("/", "\\/")}" target="_blank" rel="noopener noreferrer"`));
  assert.match(html, /href="\/foundation\/"[^>]*data-i18n="coaching\.pricing\.foundationAction"/);
  assert.match(html, /href="\/start-free\/"[^>]*data-i18n="coaching\.hero\.startFree"/);
});

test("coaching keeps bilingual stage, FAQ and professional-service hooks", () => {
  for (const language of ["en", "es"]) {
    const html = renderCoaching({ language, siteData });
    for (const stage of ["foundation", "visualisation", "concentration", "mastery"]) {
      assert.match(html, new RegExp(`data-i18n="coaching\\.stage\\.${stage}\\.name"`));
      assert.match(html, new RegExp(`data-i18n="coaching\\.stage\\.${stage}\\.outcome"`));
    }
    for (let item = 1; item <= 6; item++) {
      assert.match(html, new RegExp(`data-i18n="coaching\\.faq\\.${item}\\.question"`));
      assert.match(html, new RegExp(`data-i18n="coaching\\.faq\\.${item}\\.answer"`));
    }
    for (const offer of ["mastery", "alumni"]) {
      assert.match(html, new RegExp(`data-i18n="coaching\\.rate\\.${offer}\\.description"`));
      assert.match(html, new RegExp(`data-i18n="coaching\\.rate\\.${offer}\\.action"`));
    }
    assert.doesNotMatch(html, /data-i18n="coaching\.rate\.(mentoring|corporate)\./);
  }
  const english = renderCoaching({ language: "en", siteData });
  assert.match(english, /OTHER PROFESSIONAL SERVICES/);
});

test("coaching keeps the complete purchase clear and the Foundation balance secondary", () => {
  const english = renderCoaching({ language: "en", siteData });
  const spanish = renderCoaching({ language: "es", siteData });
  for (const html of [english, spanish]) {
    assert.match(html, /class="coachingPricing__price"><strong><span data-i18n="pricing\.complete">£997 \/ €1,167<\/span><\/strong><\/p><a class="button--primary"[^>]*>\s*<span data-i18n="coaching\.pricing\.completePurchase">(?:PAY NOW|PAGAR AHORA)<\/span>/);
    assert.match(html, /data-i18n="coaching\.pricing\.completePurchase"/);
    assert.doesNotMatch(html, /£191 \/ €223|saving £191|ahorro £191/);
    assert.doesNotMatch(html, /£1,188 \/ €1,390|£1\.188 \/ €1\.390/);
    assert.match(html, /class="coachingPricing__balanceCallout"/);
    assert.match(html, /£900 \/ €1,053/);
    assert.match(html, /GBP is the payment currency|El pago se realiza en GBP/);
  }
  assert.match(english, /href="https:\/\/www\.paypal\.com\/ncp\/payment\/JW7JRY5GTRTA6"/);
  assert.match(english, /data-i18n="coaching\.pricing\.completePurchase"/);
  assert.match(english, /href="https:\/\/www\.paypal\.com\/ncp\/payment\/JW7JRY5GTRTA6"[^>]*>\s*<span data-i18n="coaching\.pricing\.completePurchase">PAY NOW/);
});

test("coaching stage cards keep their facts compact and expose closed accessible details", () => {
  const english = renderCoaching({ language: "en", siteData });
  const spanish = renderCoaching({ language: "es", siteData });

  assert.equal((english.match(/class="coachingPricing__stage card"/g) ?? []).length, 4);
  const expectedFirstLessonHooks = [
    "foundation.compact.lessons",
    "coaching.stage.visualisation.inclusion1",
    "coaching.stage.concentration.inclusion1",
    "coaching.stage.mastery.inclusion1",
  ];
  for (const [html, learnMoreLabel] of [[english, "LEARN MORE"], [spanish, "MÁS INFORMACIÓN"]]) {
    const cards = [...html.matchAll(/<article class="coachingPricing__stage card">([\s\S]*?)<\/article>/g)].map((match) => match[1]);
    assert.equal(cards.length, 4);
    for (const [index, card] of cards.entries()) {
      assert.equal((card.match(/<details class="coachingStage__details"/g) ?? []).length, 1);
      assert.equal((card.match(/<details[^>]+open/g) ?? []).length, 0);
      assert.match(card, new RegExp(`data-i18n="${expectedFirstLessonHooks[index]}"`));
      assert.ok(card.indexOf(`data-i18n="${expectedFirstLessonHooks[index]}"`) < card.indexOf('<details class="coachingStage__details"'));
      assert.doesNotMatch(card.slice(0, card.indexOf('<details class="coachingStage__details"')), /<ul/);
    }
    assert.match(html, new RegExp(`<summary[^>]*data-i18n="coaching\\.stage\\.foundation\\.learnMore">${learnMoreLabel}<\\/summary>`));
    assert.match(html, /data-i18n="coaching\.foundation\.format"/);
    assert.match(html, /data-i18n="coaching\.foundation\.call"/);
    assert.match(html, /data-i18n="coaching\.foundation\.whatsapp"/);
    assert.match(html, /data-i18n="coaching\.foundation\.access"/);
    assert.match(html, /data-i18n="coaching\.stage\.visualisation\.inclusion2"/);
    assert.match(html, /data-i18n="coaching\.stage\.concentration\.inclusion2"/);
    assert.match(html, /data-i18n="coaching\.stage\.mastery\.inclusion2"/);
  }
  assert.match(english, /data-i18n="coaching\.stage\.visualisation\.learnMore"/);
  assert.match(english, /data-i18n="coaching\.stage\.concentration\.learnMore"/);
  assert.match(english, /data-i18n="coaching\.stage\.mastery\.learnMore"/);
});

test("coaching call links use the scoped compact bevelled treatment without changing their destination", () => {
  const html = renderCoaching({ language: "en", siteData });
  assert.equal((html.match(/coaching-call-button--compact/g) ?? []).length, 1);
  assert.match(html, /<a class="button--secondary coaching-call-button--compact" href="https:\/\/wa\.me\/34611223345\?text=/);
  assert.doesNotMatch(html, /<a class="button--primary coaching-call-button--compact"/);
  const css = readFileSync(new URL("../assets/platform.css", import.meta.url), "utf8");
  assert.match(css, /\.coaching-call-button--compact\s*\{[^}]*background:\s*var\(--night\)[^}]*color:\s*#fff/s);
  assert.match(css, /\.coaching-call-button--compact:hover\s*\{[^}]*transform:\s*translateY\(-2px\)/s);
  assert.match(css, /\.coaching-call-button--compact:focus-visible\s*\{[^}]*outline:/s);
});

test("professional services use a two-column desktop grid and one-column mobile grid", () => {
  const css = readFileSync(new URL("../assets/platform.css", import.meta.url), "utf8");
  assert.match(css, /\.coachingProfessionalServices__grid\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width: 700px\)[\s\S]*?\.coachingProfessionalServices__grid\s*\{\s*grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.doesNotMatch(css, /\.coachingFlagship,\s*\.coachingProfessionalServices,\s*\.coachingProfessionalServices__grid\s*\{\s*grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(css, /\/\* Final coaching responsive grid guard \*\/\s*\.coachingProfessionalServices__grid\s*\{\s*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)\s*;\s*\}\s*@media \(max-width: 700px\)\s*\{\s*\.coachingProfessionalServices__grid\s*\{\s*grid-template-columns:\s*minmax\(0, 1fr\)/);
});

function tabFixture() {
  const listeners = new Map();
  const tabs = Array.from({ length: 3 }, (_, index) => ({
    attributes: new Map([["aria-selected", index === 0 ? "true" : "false"], ["tabindex", index === 0 ? "0" : "-1"]]),
    addEventListener(type, listener) { listeners.set(`${index}:${type}`, listener); },
    removeEventListener() {},
    getAttribute(name) { return this.attributes.get(name); },
    setAttribute(name, value) { this.attributes.set(name, value); },
    focus() { fixture.focused = index; },
  }));
  const panels = tabs.map((_, index) => ({ hidden: index !== 0 }));
  const fixture = { root: { classList: { add() {}, remove() {} }, querySelectorAll(selector) { if (selector === '[role="tab"]') return tabs; if (selector === '[role="tabpanel"]') return panels; return []; } }, tabs, panels, listeners, focused: -1 };
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
