function deepFreeze(value) {
  for (const nestedValue of Object.values(value)) {
    if (nestedValue && typeof nestedValue === "object") deepFreeze(nestedValue);
  }
  return Object.freeze(value);
}

import canonical from "./seven-day-canonical.json" with { type: "json" };

function lessonContentKeys(prefix) {
  return {
    title: `${prefix}.title`,
    teaching: `${prefix}.teaching`,
    observation: `${prefix}.observation`,
    reflection: `${prefix}.reflection`,
    action: `${prefix}.action`,
    mksConnection: `${prefix}.mksConnection`,
    optionalPractice: `${prefix}.optionalPractice`,
    practiceTime: `${prefix}.practiceTime`,
    coreTime: `${prefix}.coreTime`,
    fullTime: `${prefix}.fullTime`,
    completion: `${prefix}.completion`,
    navigation: `${prefix}.navigation`,
    status: `${prefix}.status`,
  };
}

export const sevenDayExperience = deepFreeze({
  sharedKeys: {
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
      mksConnectionHeading: "sevenDay.lesson.mksConnectionHeading",
      optionalPracticeHeading: "sevenDay.lesson.optionalPracticeHeading",
    },
    time: {
      optional: "sevenDay.lesson.optionalTimeLabel",
      core: "sevenDay.lesson.coreTimeLabel",
      full: "sevenDay.lesson.fullTimeLabel",
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
      answerLabel: "sevenDay.workbook.answerLabel",
      answerHint: "sevenDay.workbook.answerHint",
      privacy: "sevenDay.workbook.privacy",
      saved: "sevenDay.workbook.saved",
      unavailable: "sevenDay.workbook.unavailable",
      clear: "sevenDay.workbook.clear",
      clearConfirm: "sevenDay.workbook.clearConfirm",
      cleared: "sevenDay.workbook.cleared",
    },
  },
  lessons: canonical.lessons.map((lesson) => ({
    ...lesson,
    title: lesson.en.title,
    translationKey: `sevenDay.lessons.day${lesson.sequence}`,
    contentKeys: lessonContentKeys(`sevenDay.lessons.day${lesson.sequence}`),
  })),
});
