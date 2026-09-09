import { sevenDayExperience } from "./seven-day-experience.mjs";

function deepFreeze(value) {
  for (const nestedValue of Object.values(value)) {
    if (nestedValue && typeof nestedValue === "object") {
      deepFreeze(nestedValue);
    }
  }
  return Object.freeze(value);
}

export const siteData = deepFreeze({
  founder: { firstName: "Tariq", fullName: "Tariq Saddique" },
  contact: { email: "tariq@unleashyourpowerwithtariq.com", whatsapp: "+34 611 223 345" },
  sitemap: {
    baseUrl: "https://unleashyourpowerwithtariq.com/",
    lastModified: "2026-09-08",
    lastModifiedByRoute: {
      "/": "2026-09-07",
      "/master-key-system/": "2026-09-07",
      "/mks-lineage/": "2026-09-07",
      "/coaching/": "2026-09-07",
      "/about-tariq/": "2026-09-07",
      "/resources/": "2026-09-07",
      "/faq/": "2026-09-07",
      "/master-key-system-online-course/": "2026-09-07",
      "/insights/": "2026-09-09",
      "/insights/how-the-24-week-master-key-system-course-works/": "2026-09-08",
      "/insights/eight-principles-master-key-system/": "2026-09-09",
      "/insights/introduction-charles-haanel-master-key-system/": "2026-09-09",
      "/insights/world-within-and-world-without/": "2026-09-09",
    }
  },
  routes: {
    home: "/",
    masterKeySystem: "/master-key-system/",
    masterKeySystemOnlineCourse: "/master-key-system-online-course/",
    mksLineage: "/mks-lineage/",
    startFree: "/start-free/",
    coaching: "/coaching/",
    aboutTariq: "/about-tariq/",
    resources: "/resources/",
    resourcesAudio: "/resources/audio/",
    insightsCourse: "/insights/how-the-24-week-master-key-system-course-works/",
    insights: "/insights/",
    insightsPrinciples: "/insights/eight-principles-master-key-system/",
    insightsIntroduction: "/insights/introduction-charles-haanel-master-key-system/",
    insightsWorldWithin: "/insights/world-within-and-world-without/",
    getTheBook: "/get-the-book/",
    aiMentors: "/ai-mentors/",
    contact: "/contact/",
    faq: "/faq/",
    referral: "/referral/",
    privacy: "/privacy/",
    terms: "/terms/",
    liveCoaching: "/live-coaching/"
  },
  experienceRoutes: sevenDayExperience.lessons.map(({ route }) => route),
  stages: [
    { id: "foundation", name: "Foundation", weeks: "1–4", price: 97, msrp: 147, paymentUrl: "https://www.paypal.com/ncp/payment/V5QYXZZS6KQE2" },
    { id: "visualisation", name: "Visualisation", weeks: "5–11", price: 197, msrp: 297, paymentUrl: "https://www.paypal.com/ncp/payment/NWD3VU5VUTKCL" },
    { id: "concentration", name: "Concentration", weeks: "12–18", price: 397, msrp: 597, paymentUrl: "https://www.paypal.com/ncp/payment/A7KJBWNCJARJC" },
    { id: "mastery", name: "Contemplation & Mastery", weeks: "19–24", price: 497, msrp: 747, paymentUrl: "https://www.paypal.com/ncp/payment/N45ETXRZ9E3LQ" }
  ],
  offer: {
    separateTotal: 1188,
    completePrice: 997,
    foundingSaving: 191,
    msrpTotal: 1788,
    msrpSaving: 791,
    msrpDiscount: 44,
    paymentUrl: "https://www.paypal.com/ncp/payment/JW7JRY5GTRTA6"
  }
});
