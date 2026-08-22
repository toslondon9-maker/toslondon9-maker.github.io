function deepFreeze(value) {
  for (const nestedValue of Object.values(value)) {
    if (nestedValue && typeof nestedValue === "object") deepFreeze(nestedValue);
  }
  return Object.freeze(value);
}

function lessonContentKeys(prefix) {
  return {
    title: `${prefix}.title`,
    teaching: `${prefix}.teaching`,
    observation: `${prefix}.observation`,
    reflection: `${prefix}.reflection`,
    action: `${prefix}.action`,
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
  },
  lessons: [
    {
      id: "day-1",
      sequence: 1,
      slug: "see-whats-running-your-life",
      route: "/start-free/day-1-see-whats-running-your-life/",
      title: "See What's Running Your Life",
      translationKey: "sevenDay.lessons.day1",
      contentKeys: lessonContentKeys("sevenDay.lessons.day1"),
    },
    {
      id: "day-2",
      sequence: 2,
      slug: "take-back-your-attention",
      route: "/start-free/day-2-take-back-your-attention/",
      title: "Take Back Your Attention",
      translationKey: "sevenDay.lessons.day2",
      contentKeys: lessonContentKeys("sevenDay.lessons.day2"),
    },
    {
      id: "day-3",
      sequence: 3,
      slug: "recognise-what-keeps-repeating",
      route: "/start-free/day-3-recognise-what-keeps-repeating/",
      title: "Recognise What Keeps Repeating",
      translationKey: "sevenDay.lessons.day3",
      contentKeys: lessonContentKeys("sevenDay.lessons.day3"),
    },
    {
      id: "day-4",
      sequence: 4,
      slug: "give-your-mind-a-direction",
      route: "/start-free/day-4-give-your-mind-a-direction/",
      title: "Give Your Mind a Direction",
      translationKey: "sevenDay.lessons.day4",
      contentKeys: lessonContentKeys("sevenDay.lessons.day4"),
    },
    {
      id: "day-5",
      sequence: 5,
      slug: "become-someone-you-can-rely-on",
      route: "/start-free/day-5-become-someone-you-can-rely-on/",
      title: "Become Someone You Can Rely On",
      translationKey: "sevenDay.lessons.day5",
      contentKeys: lessonContentKeys("sevenDay.lessons.day5"),
    },
    {
      id: "day-6",
      sequence: 6,
      slug: "change-from-the-inside-out",
      route: "/start-free/day-6-change-from-the-inside-out/",
      title: "Change From the Inside Out",
      translationKey: "sevenDay.lessons.day6",
      contentKeys: lessonContentKeys("sevenDay.lessons.day6"),
    },
    {
      id: "day-7",
      sequence: 7,
      slug: "make-it-part-of-how-you-live",
      route: "/start-free/day-7-make-it-part-of-how-you-live/",
      title: "Make It Part of How You Live",
      translationKey: "sevenDay.lessons.day7",
      contentKeys: lessonContentKeys("sevenDay.lessons.day7"),
    },
  ],
});
