function deepFreeze(value) {
  for (const nestedValue of Object.values(value)) {
    if (nestedValue && typeof nestedValue === "object") deepFreeze(nestedValue);
  }
  return Object.freeze(value);
}

export const sevenDayExperience = deepFreeze({
  lessons: [
    {
      id: "day-1",
      sequence: 1,
      slug: "see-whats-running-your-life",
      route: "/start-free/day-1-see-whats-running-your-life/",
      title: "See What's Running Your Life",
      translationKey: "sevenDay.lessons.day1",
    },
    {
      id: "day-2",
      sequence: 2,
      slug: "take-back-your-attention",
      route: "/start-free/day-2-take-back-your-attention/",
      title: "Take Back Your Attention",
      translationKey: "sevenDay.lessons.day2",
    },
    {
      id: "day-3",
      sequence: 3,
      slug: "recognise-what-keeps-repeating",
      route: "/start-free/day-3-recognise-what-keeps-repeating/",
      title: "Recognise What Keeps Repeating",
      translationKey: "sevenDay.lessons.day3",
    },
    {
      id: "day-4",
      sequence: 4,
      slug: "give-your-mind-a-direction",
      route: "/start-free/day-4-give-your-mind-a-direction/",
      title: "Give Your Mind a Direction",
      translationKey: "sevenDay.lessons.day4",
    },
    {
      id: "day-5",
      sequence: 5,
      slug: "become-someone-you-can-rely-on",
      route: "/start-free/day-5-become-someone-you-can-rely-on/",
      title: "Become Someone You Can Rely On",
      translationKey: "sevenDay.lessons.day5",
    },
    {
      id: "day-6",
      sequence: 6,
      slug: "change-from-the-inside-out",
      route: "/start-free/day-6-change-from-the-inside-out/",
      title: "Change From the Inside Out",
      translationKey: "sevenDay.lessons.day6",
    },
    {
      id: "day-7",
      sequence: 7,
      slug: "make-it-part-of-how-you-live",
      route: "/start-free/day-7-make-it-part-of-how-you-live/",
      title: "Make It Part of How You Live",
      translationKey: "sevenDay.lessons.day7",
    },
  ],
});
