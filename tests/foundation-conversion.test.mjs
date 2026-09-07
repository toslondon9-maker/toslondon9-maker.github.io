import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { t } from "../content/translations.mjs";
import { renderFoundationNextStep, renderWhatHappensNext } from "../src/conversion-components.mjs";

const translationExpectations = {
  "conversion.next.heading": ["WHAT HAPPENS NEXT?", "¿QUÉ OCURRE DESPUÉS?"],
  "conversion.next.step1Title": ["START FREE", "EMPIEZA GRATIS"],
  "conversion.next.step1Body": ["Experience seven days of guided Master Key System study, reflection and practical exercises.", "Vive siete días de estudio guiado del Sistema de la Llave Maestra, reflexión y ejercicios prácticos."],
  "conversion.next.step2Title": ["BUILD YOUR FOUNDATION", "CONSTRUYE TUS FUNDAMENTOS"],
  "conversion.next.step2Body": ["If the journey feels right for you, continue with the four-week Foundation stage for £97.", "Si sientes que este camino es adecuado para ti, continúa con la etapa de Fundamentos de cuatro semanas por £97."],
  "conversion.next.step3Title": ["GO DEEPER, AT YOUR PACE", "PROFUNDIZA, A TU RITMO"],
  "conversion.next.step3Body": ["Continue through Visualisation, Concentration and Contemplation & Mastery—or join the complete 24-week journey.", "Continúa con Visualización, Concentración y Contemplación y Maestría, o únete al recorrido completo de 24 semanas."],
  "conversion.next.cta": ["START FREE FOR 7 DAYS", "EMPIEZA GRATIS DURANTE 7 DÍAS"],
  "conversion.foundation.eyebrow": ["YOUR NEXT STEP", "TU SIGUIENTE PASO"],
  "conversion.foundation.heading": ["Continue with Foundation", "Continúa con Fundamentos"],
  "conversion.foundation.body": ["You have begun to explore the principles. Foundation gives you four guided weeks to establish the practice: greater calm, self-awareness and a stronger mental base for the journey ahead.", "Has comenzado a explorar los principios. Fundamentos te ofrece cuatro semanas guiadas para establecer la práctica: mayor calma, autoconocimiento y una base mental más sólida para el camino que tienes por delante."],
  "conversion.foundation.qualification": ["Individual outcomes depend on your circumstances, participation and consistent practice.", "Los resultados individuales dependen de tus circunstancias, participación y práctica constante."],
  "conversion.foundation.cta": ["CONTINUE WITH FOUNDATION", "CONTINUAR CON FUNDAMENTOS"],
  "conversion.foundation.secondary": ["Explore the complete 24-week journey", "Explora el recorrido completo de 24 semanas"],
};

test("conversion copy is complete in English and Spanish", () => {
  for (const [key, [english, spanish]] of Object.entries(translationExpectations)) {
    assert.equal(t(key, "en"), english);
    assert.equal(t(key, "es"), spanish);
  }
});

test("renderWhatHappensNext renders three ordered translated steps and the supplied start link", () => {
  const html = renderWhatHappensNext({ startHref: "/custom-start/" });
  assert.match(html, /^<section[^>]+class="conversionJourney"[^>]+aria-labelledby="conversion-next-heading"/);
  assert.match(html, /<h2 id="conversion-next-heading" data-i18n="conversion.next.heading">WHAT HAPPENS NEXT\?<\/h2>/);
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
  assert.match(html, /<p class="eyebrow" data-i18n="conversion.foundation.eyebrow">YOUR NEXT STEP<\/p>/);
  assert.match(html, /<h2 id="foundation-next-heading" data-i18n="conversion.foundation.heading">Continue with Foundation<\/h2>/);
  assert.match(html, /£123/);
  assert.match(html, /href="https:\/\/payments\.example\.test\/foundation\?x=1&amp;y=2"[^>]+target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /href="\/custom-coaching\/"/);
  for (const key of ["conversion.foundation.eyebrow", "conversion.foundation.heading", "conversion.foundation.body", "conversion.foundation.qualification", "conversion.foundation.cta", "conversion.foundation.secondary"]) assert.match(html, new RegExp(`data-i18n="${key}"`));
});

test("conversion renderers expose each visible Spanish string through its translation hook", () => {
  const data = { routes: { startFree: "/start-free/", coaching: "/coaching/" }, stages: [{ id: "foundation", price: 97, paymentUrl: "https://payments.example.test/foundation" }] };
  const html = `${renderWhatHappensNext({ language: "es", data })}${renderFoundationNextStep({ language: "es", data })}`;
  for (const [key, [, spanish]] of Object.entries(translationExpectations)) {
    assert.match(html, new RegExp(`data-i18n="${key}">`));
    assert.match(html, new RegExp(spanish.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("conversion presentation keeps cards safe and responsive", async () => {
  const css = await readFile(new URL("../assets/platform.css", import.meta.url), "utf8");
  assert.match(css, /\.conversionJourney,\s*\.foundationNextStep\s*\{[^}]*scroll-margin-top:/s);
  assert.match(css, /\.conversionJourney__inner\s*\{[^}]*width:\s*min\(100% - \(2 \* var\(--space-gutter\)\), var\(--content-max\)\)[^}]*margin-inline:\s*auto/s);
  assert.match(css, /\.conversionJourney__steps\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/s);
  assert.match(css, /\.foundationNextStep\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1\.2fr\) minmax\(0, 0\.8fr\)[^}]*background:\s*linear-gradient\(145deg, var\(--night\), var\(--night-soft\)\)/s);
  assert.match(css, /\.conversionJourney__steps li,\s*\.foundationNextStep__copy,\s*\.foundationNextStep__offer\s*\{[^}]*min-width:\s*0/s);
  assert.match(css, /\.conversionJourney__steps p,\s*\.foundationNextStep p,\s*\.foundationNextStep a\s*\{[^}]*overflow-wrap:\s*anywhere/s);
  assert.match(css, /@media \(max-width: 720px\)\s*\{[\s\S]*\.conversionJourney__steps,\s*\.foundationNextStep\s*\{[\s\S]*grid-template-columns:\s*minmax\(0, 1fr\)[\s\S]*\.conversionJourney \.button--primary,\s*\.foundationNextStep \.button--primary,\s*\.foundationNextStep \.button--text\s*\{[\s\S]*width:\s*100%[\s\S]*box-sizing:\s*border-box[\s\S]*justify-content:\s*center/s);
});

test("renderFoundationNextStep requires the foundation stage", () => {
  assert.throws(() => renderFoundationNextStep({ data: { routes: { coaching: "/coaching/" }, stages: [] } }), /Foundation stage is required/);
});
