import assert from "node:assert/strict";
import test from "node:test";
import { sevenDayExperience } from "../content/seven-day-experience.mjs";
import { t, translations } from "../content/translations.mjs";

const canonicalTitles = {
  en: [
    "See What's Running Your Life",
    "Take Back Your Attention",
    "Recognise What Keeps Repeating",
    "Give Your Mind a Direction",
    "Become Someone You Can Rely On",
    "Change From the Inside Out",
    "Make It Part of How You Live",
  ],
  es: [
    "Observa qué dirige tu vida",
    "Recupera tu atención",
    "Reconoce lo que se repite",
    "Dale una dirección a tu mente",
    "Conviértete en alguien en quien puedas confiar",
    "Cambia de dentro hacia fuera",
    "Haz que forme parte de tu vida",
  ],
};

const lessonFields = [
  "title",
  "teaching",
  "observation",
  "reflection",
  "action",
  "completion",
  "navigation",
  "status",
];

test("every lesson exposes complete English and Spanish learning copy", () => {
  assert.deepEqual(
    sevenDayExperience.lessons.map((lesson) => Object.keys(lesson.contentKeys ?? {})),
    sevenDayExperience.lessons.map(() => lessonFields),
  );

  for (const [index, lesson] of sevenDayExperience.lessons.entries()) {
    for (const field of lessonFields) {
      const key = lesson.contentKeys[field];
      assert.equal(key, `${lesson.translationKey}.${field}`);
      for (const language of ["en", "es"]) {
        assert.ok(t(key, language).trim().length > 0, `${key} needs ${language} copy`);
      }
    }

    assert.equal(t(lesson.contentKeys.title, "en"), canonicalTitles.en[index]);
    assert.equal(t(lesson.contentKeys.title, "es"), canonicalTitles.es[index]);

    const spanishPractice = ["teaching", "observation", "reflection", "action"]
      .map((field) => t(lesson.contentKeys[field], "es"))
      .join(" ");
    assert.match(spanishPractice, /\b(?:te|tu|tus|ti)\b/i, `day ${index + 1} should address tú naturally`);
    assert.doesNotMatch(spanishPractice, /\b(?:usted|ustedes|vosotros|vosotras)\b/i);
  }
});

test("shared experience copy covers the complete dashboard and lesson interface", () => {
  const expectedSharedKeys = {
    independence: "sevenDay.independence",
    dashboard: {
      eyebrow: "sevenDay.dashboard.eyebrow",
      title: "sevenDay.dashboard.title",
      intro: "sevenDay.dashboard.intro",
      start: "sevenDay.dashboard.start",
      progressive: "sevenDay.dashboard.progressive",
      lessonsHeading: "sevenDay.dashboard.lessonsHeading",
    },
    lesson: {
      teachingHeading: "sevenDay.lesson.teachingHeading",
      observationHeading: "sevenDay.lesson.observationHeading",
      reflectionHeading: "sevenDay.lesson.reflectionHeading",
      actionHeading: "sevenDay.lesson.actionHeading",
    },
    navigation: {
      dashboard: "sevenDay.navigation.dashboard",
      previous: "sevenDay.navigation.previous",
      next: "sevenDay.navigation.next",
    },
    progress: {
      heading: "sevenDay.progress.heading",
      empty: "sevenDay.progress.empty",
      count: "sevenDay.progress.count",
      complete: "sevenDay.progress.complete",
      lessonComplete: "sevenDay.progress.lessonComplete",
      markIncomplete: "sevenDay.progress.markIncomplete",
      unavailable: "sevenDay.progress.unavailable",
    },
    privacy: {
      heading: "sevenDay.privacy.heading",
      body: "sevenDay.privacy.body",
    },
    reset: {
      label: "sevenDay.reset.label",
      confirm: "sevenDay.reset.confirm",
      success: "sevenDay.reset.success",
    },
    contact: {
      start: "sevenDay.contact.start",
      ask: "sevenDay.contact.ask",
      consent: "sevenDay.contact.consent",
    },
    workbook: {
      heading: "sevenDay.workbook.heading",
      intro: "sevenDay.workbook.intro",
      english: "sevenDay.workbook.english",
      spanish: "sevenDay.workbook.spanish",
    },
  };

  assert.deepEqual(sevenDayExperience.sharedKeys, expectedSharedKeys);
  for (const key of flattenValues(expectedSharedKeys)) {
    assert.ok(t(key, "en").trim(), `${key} needs English copy`);
    assert.ok(t(key, "es").trim(), `${key} needs Spanish copy`);
  }
  assert.equal(
    t(sevenDayExperience.sharedKeys.independence, "en"),
    "An independent coaching experience inspired by the Master Key System.",
  );
});

test("experience copy uses British English and grounds evocative language in practice", () => {
  const english = experienceCopy("en");
  assert.match(english, /\brecognise\b/);
  assert.match(english, /\bpractise\b/);
  assert.match(english, /\bprogramme\b/);
  assert.doesNotMatch(english, /\brecognize\b|\bprogram\b/);
  assert.match(
    t(sevenDayExperience.sharedKeys.dashboard.progressive, "en"),
    /an almost magical process begins to unfold[^.]*cumulative learning[^.]*consistent personal practice/i,
  );
});

test("experience copy makes no guarantees, invented authority claims or payment-plan offer", () => {
  const english = experienceCopy("en");
  const spanish = experienceCopy("es");

  assert.doesNotMatch(
    english,
    /\b(?:guaranteed?|certified|qualified|accredited|testimonial|students?|clients?|success rate|endorsed by|affiliated with|in partnership with|six payments?)\b|6\s*[x×]\s*£?169|£1,?014/i,
  );
  assert.doesNotMatch(
    spanish,
    /\b(?:garantiz\w*|certificad[oa]s?|acreditad[oa]s?|testimonios?|alumnos?|clientes?|tasa de éxito|respaldad[oa] por|afiliad[oa] con|en colaboración con|seis pagos?)\b|6\s*[x×]\s*£?169|£1[.,]?014/i,
  );
});

function flattenValues(value) {
  return Object.values(value).flatMap((nested) => (
    nested && typeof nested === "object" ? flattenValues(nested) : nested
  ));
}

function experienceCopy(language) {
  return Object.entries(translations)
    .filter(([key]) => key.startsWith("sevenDay."))
    .map(([, entry]) => entry[language])
    .join(" ");
}
