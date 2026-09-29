import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { t } from "../content/translations.mjs";
import { renderCoaching } from "../src/pages/coaching.mjs";

test("the approved Day 6 and Day 7 titles are used in every text source", async () => {
  const workbookSource = await readFile("tools/build-seven-day-workbook.py", "utf8");
  const canonical = JSON.parse(await readFile("content/seven-day-canonical.json", "utf8"));
  assert.equal(t("sevenDay.lessons.day6.title", "en"), "Strengthen the New Pattern");
  assert.equal(t("sevenDay.lessons.day7.title", "en"), "Choose What Happens Next");
  assert.equal(t("sevenDay.lessons.day6.title", "es"), "Refuerza el nuevo patrón");
  assert.equal(t("sevenDay.lessons.day7.title", "es"), "Elige qué viene después");
  assert.match(workbookSource, /seven-day-canonical\.json/);
  assert.equal(canonical.lessons[5].en.title, "Strengthen the New Pattern");
  assert.equal(canonical.lessons[6].en.title, "Choose What Happens Next");
  assert.equal(canonical.lessons[5].es.title, "Refuerza el nuevo patrón");
  assert.equal(canonical.lessons[6].es.title, "Elige qué viene después");
});

test("Foundation explains the confirmed four-week experience without changing the payment flow", () => {
  const english = renderCoaching({ language: "en", siteData });
  const spanish = renderCoaching({ language: "es", siteData });
  for (const text of [
    "Weeks 1–4", "£97", "Four progressive lessons across four weeks", "Two 45-minute Zoom coaching calls each week throughout the four-week Foundation stage",
    "WhatsApp support", "Workbook and lesson access", "What happens after payment",
    "Who Foundation is for", "Who Foundation is not for", "What to expect in Week 1",
    "How payment and refunds work", "Start with the free seven-day experience",
    "Mark Smith",
  ]) assert.match(english, new RegExp(text.replace(/[£–]/g, "\\$&")), text);
  for (const text of [
    "Semanas 1–4", "£97", "Cuatro lecciones progresivas durante cuatro semanas", "Dos llamadas de coaching por Zoom de 45 minutos cada semana durante las cuatro semanas",
    "Apoyo por WhatsApp", "Acceso al cuaderno y a las lecciones", "Qué ocurre después del pago",
    "Para quién es Foundation", "Para quién no es Foundation", "Qué esperar en la Semana 1",
    "Cómo funcionan el pago y los reembolsos", "Empieza con la experiencia gratuita de siete días",
  ]) assert.match(spanish, new RegExp(text.replace(/[£–]/g, "\\$&")), text);
});
