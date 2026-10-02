import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { t } from "../content/translations.mjs";
import { renderFoundationNextStep, renderWhatHappensNext } from "../src/conversion-components.mjs";

const translationExpectations = {
  "conversion.next.heading": ["WHAT HAPPENS NEXT?", "¿QUÉ OCURRE DESPUÉS?"],
  "conversion.next.step1Title": ["START FREE", "EMPIEZA GRATIS"],
  "conversion.next.step1Body": ["Experience 7 Days to Change the Way You Use Your Mind through guided Master Key System study, reflection and practical exercises.", "Vive 7 días para cambiar la forma en que usas tu mente mediante el estudio guiado del Sistema de la Llave Maestra, la reflexión y ejercicios prácticos."],
  "conversion.next.step2Title": ["BUILD YOUR FOUNDATION", "CONSTRUYE TUS FUNDAMENTOS"],
  "conversion.next.step2Body": ["If the journey feels right for you, continue with Foundation for £97 / €114: four progressive lessons across four weeks, two 45-minute Zoom coaching calls each week, eight calls total, workbook and online lesson access, and WhatsApp support.", "Si sientes que este camino es adecuado para ti, continúa con Fundamentos por £97 / €114: cuatro lecciones progresivas durante cuatro semanas, dos llamadas de coaching por Zoom de 45 minutos cada semana, ocho llamadas en total, acceso al cuaderno y a las lecciones online, y apoyo por WhatsApp."],
  "conversion.next.step3Title": ["GO DEEPER, AT YOUR PACE", "PROFUNDIZA, A TU RITMO"],
  "conversion.next.step3Body": ["Continue through Visualisation, Concentration and Integration & Mastery—or join the complete 24-week journey.", "Continúa con Visualización, Concentración e Integración y dominio, o únete al recorrido completo de 24 semanas."],
  "conversion.next.cta": ["START YOUR 7 DAYS", "EMPIEZA TUS 7 DÍAS"],
  "conversion.foundation.eyebrow": ["YOUR NEXT STEP", "TU SIGUIENTE PASO"],
  "conversion.foundation.heading": ["You completed 7 Days to Change the Way You Use Your Mind.", "Has completado 7 días para cambiar la forma en que usas tu mente."],
  "conversion.foundation.body": ["If the journey feels right, continue with Foundation for £97 / €114: four progressive lessons across four weeks, two 45-minute Zoom coaching calls each week, eight calls total, workbook and online lesson access, and WhatsApp support.", "Si el recorrido encaja contigo, continúa con Fundamentos por £97 / €114: cuatro lecciones progresivas durante cuatro semanas, dos llamadas de coaching por Zoom de 45 minutos cada semana, ocho llamadas en total, acceso al cuaderno y a las lecciones online, y apoyo por WhatsApp."],
  "conversion.foundation.qualification": ["Individual outcomes depend on your circumstances, participation and consistent practice.", "Los resultados individuales dependen de tus circunstancias, participación y práctica constante."],
  "conversion.foundation.cta": ["CONTINUE TO FOUNDATION — £97 / €114", "CONTINÚA CON FUNDAMENTOS — £97 / €114"],
  "conversion.foundation.secondary": ["KEEP EXPLORING", "SEGUIR EXPLORANDO"],
};

test("Foundation summaries keep the approved short offer facts", () => {
  const expected = [
    "One Consciousness – One Power",
    "One Method of Finding the Truth",
    "Thoughts Become Things",
    "The True “Self”",
  ];
  for (const title of expected) assert.equal(t(`foundation.week${expected.indexOf(title) + 1}`, "en").includes(title), true);
  for (const key of ["home.offers.foundationBody", "coaching.foundation.summary", "conversion.next.step2Body", "conversion.foundation.body"]) {
    assert.match(t(key, "en"), /(?:four weeks, four progressive lessons|four progressive lessons across four weeks)/i);
    assert.match(t(key, "en"), /two 45-minute Zoom coaching calls each week/i);
    assert.match(t(key, "en"), /eight calls total/i);
    assert.match(t(key, "en"), /workbook and online lesson access/i);
    assert.match(t(key, "en"), /WhatsApp support/i);
    assert.doesNotMatch(t(key, "en"), /approximately 45 minutes|approximately 21 hours|approximately 41 hours/i);
  }
});


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
  assert.equal((html.match(/<span aria-hidden="true">0[1-3]<\/span>/g) ?? []).length, 3);
  assert.ok(html.indexOf('data-i18n="conversion.next.step1Title"') < html.indexOf('data-i18n="conversion.next.step2Title"'));
  assert.ok(html.indexOf('data-i18n="conversion.next.step2Title"') < html.indexOf('data-i18n="conversion.next.step3Title"'));
  for (const key of ["conversion.next.heading", "conversion.next.step1Title", "conversion.next.step1Body", "conversion.next.step2Title", "conversion.next.step2Body", "conversion.next.step2Link", "conversion.next.step3Title", "conversion.next.step3Body", "conversion.next.cta"]) assert.match(html, new RegExp(`data-i18n="${key}"`));
  assert.match(html, /href="\/custom-start\/"/);
});

test("renderFoundationNextStep renders the gated Foundation route offer", () => {
  const data = { routes: { startFree: "/start-free/", foundation: "/foundation/", coaching: "/custom-coaching/" }, stages: [{ id: "foundation", name: "Foundation", weeks: "1–4", price: 97, paymentUrl: "https://payments.example.test/foundation?x=1&y=2" }] };
  const html = renderFoundationNextStep({ data });
  assert.match(html, /^<section[^>]+class="foundationNextStep"[^>]+aria-labelledby="foundation-next-heading"/);
  assert.match(html, /<p class="eyebrow" data-i18n="conversion.foundation.eyebrow">YOUR NEXT STEP<\/p>/);
  assert.match(html, /<h2 id="foundation-next-heading" data-i18n="conversion.foundation.heading">You completed 7 Days to Change the Way You Use Your Mind\.<\/h2>/);
  assert.match(html, /£97 \/ €114/);
  assert.match(html, /href="\/foundation\/"/);
  assert.match(html, /href="\/start-free\/"/);
  for (const key of ["conversion.foundation.eyebrow", "conversion.foundation.heading", "conversion.foundation.body", "conversion.foundation.qualification", "conversion.foundation.cta", "conversion.foundation.secondary"]) assert.match(html, new RegExp(`data-i18n="${key}"`));
});

test("conversion renderers expose each visible Spanish string through its translation hook", () => {
  const data = { routes: { startFree: "/start-free/", foundation: "/foundation/", coaching: "/coaching/" }, stages: [{ id: "foundation", price: 97, paymentUrl: "https://payments.example.test/foundation" }] };
  const html = `${renderWhatHappensNext({ language: "es", data })}${renderFoundationNextStep({ language: "es", data })}`;
  for (const [key, [, spanish]] of Object.entries(translationExpectations)) {
    assert.match(html, new RegExp(`data-i18n="${key}">`));
    assert.match(html, new RegExp(spanish.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("renderWhatHappensNext exposes the same hook contract in both supported languages", () => {
  const keys = ["conversion.next.heading", "conversion.next.step1Title", "conversion.next.step1Body", "conversion.next.step2Title", "conversion.next.step2Body", "conversion.next.step2Link", "conversion.next.step3Title", "conversion.next.step3Body", "conversion.next.cta"];
  for (const language of ["en", "es"]) {
    const html = renderWhatHappensNext({ language });
    for (const key of keys) assert.match(html, new RegExp(`data-i18n="${key}"`));
  }
});

test("Foundation conversion handoffs use the closed shared compact offer disclosure", () => {
  for (const language of ["en", "es"]) {
    const html = `${renderWhatHappensNext({ language })}${renderFoundationNextStep({ language })}`;
    assert.equal((html.match(/class="compactFoundationOffer__details"/g) ?? []).length, 0);
    assert.doesNotMatch(html, /foundation\.compact\.(seeIncluded|chapterDay|meditationDay|chapterTotal|meditationTotal|commitment)/);
    for (const key of ["weeks", "lessons", "calls", "totalCalls", "access", "support"]) {
      assert.match(html, new RegExp(`data-i18n="foundation\\.compact\\.${key}"`));
    }
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
  assert.doesNotMatch(css, /rgba\(247,\s*241,\s*229,\s*0\.84\)/);
  assert.match(css, /\.foundationNextStep__copy > p:not\(\.eyebrow\),\s*\.foundationNextStep__qualification\s*\{[^}]*color:\s*color-mix\(in srgb, var\(--cream\) 84%, transparent\)/s);
  assert.match(css, /@media \(max-width: 720px\)\s*\{[\s\S]*\.conversionJourney__steps,\s*\.foundationNextStep\s*\{[\s\S]*grid-template-columns:\s*minmax\(0, 1fr\)[\s\S]*\.conversionJourney \.button--primary,\s*\.foundationNextStep \.button--primary,\s*\.foundationNextStep \.button--text\s*\{[\s\S]*width:\s*100%[\s\S]*box-sizing:\s*border-box[\s\S]*justify-content:\s*center/s);
});

test("renderFoundationNextStep requires the foundation stage", () => {
  assert.throws(() => renderFoundationNextStep({ data: { routes: { coaching: "/coaching/" }, stages: [] } }), /Foundation stage is required/);
});
