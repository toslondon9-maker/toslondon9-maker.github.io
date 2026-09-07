import test from "node:test";
import assert from "node:assert/strict";

import { renderFoundationNextStep, renderWhatHappensNext } from "../src/conversion-components.mjs";

test("renderWhatHappensNext renders three ordered translated steps and the supplied start link", () => {
  const html = renderWhatHappensNext({ startHref: "/custom-start/" });
  assert.match(html, /^<section[^>]+class="conversionJourney"[^>]+aria-labelledby="conversion-next-heading"/);
  assert.equal((html.match(/<li\b/g) ?? []).length, 3);
  assert.equal((html.match(/<span aria-hidden="true">0[1-3]<\/span>/g) ?? []).length, 3);
  assert.ok(html.indexOf('data-i18n="conversion.next.step1Title"') < html.indexOf('data-i18n="conversion.next.step2Title"'));
  assert.ok(html.indexOf('data-i18n="conversion.next.step2Title"') < html.indexOf('data-i18n="conversion.next.step3Title"'));
  for (const key of ["conversion.next.heading", "conversion.next.step1Title", "conversion.next.step1Body", "conversion.next.step2Title", "conversion.next.step2Body", "conversion.next.step3Title", "conversion.next.step3Body", "conversion.next.cta"]) assert.match(html, new RegExp(`data-i18n="${key}"`));
  assert.match(html, /href="\/custom-start\/"/);
});

test("renderFoundationNextStep renders the supplied canonical offer and safe external payment link", () => {
  const data = { routes: { startFree: "/start-free/", coaching: "/custom-coaching/" }, stages: [{ id: "foundation", name: "Foundation", weeks: "1–4", price: 123, paymentUrl: "https://payments.example.test/foundation?x=1&y=2" }] };
  const html = renderFoundationNextStep({ data });
  assert.match(html, /^<section[^>]+class="foundationNextStep"[^>]+aria-labelledby="foundation-next-heading"/);
  assert.match(html, /£123/);
  assert.match(html, /href="https:\/\/payments\.example\.test\/foundation\?x=1&amp;y=2"[^>]+target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /href="\/custom-coaching\/"/);
  for (const key of ["conversion.foundation.eyebrow", "conversion.foundation.heading", "conversion.foundation.body", "conversion.foundation.qualification", "conversion.foundation.cta", "conversion.foundation.secondary"]) assert.match(html, new RegExp(`data-i18n="${key}"`));
});

test("renderFoundationNextStep requires the foundation stage", () => {
  assert.throws(() => renderFoundationNextStep({ data: { routes: { coaching: "/coaching/" }, stages: [] } }), /Foundation stage is required/);
});
