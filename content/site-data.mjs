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
  contact: { email: "toslondon9@gmail.com", whatsapp: "+34 611 223 345" },
  routes: {
    home: "/",
    masterKeySystem: "/master-key-system/",
    startFree: "/start-free/",
    coaching: "/coaching/",
    aboutTariq: "/about-tariq/",
    resources: "/resources/",
    aiMentors: "/ai-mentors/",
    contact: "/contact/",
    referral: "/referral/",
    privacy: "/privacy/",
    liveCoaching: "/live-coaching/"
  },
  stages: [
    { id: "foundation", name: "Foundation", weeks: "1–4", price: 97, msrp: 147 },
    { id: "visualisation", name: "Visualisation", weeks: "5–11", price: 197, msrp: 297 },
    { id: "concentration", name: "Concentration", weeks: "12–18", price: 397, msrp: 597 },
    { id: "mastery", name: "Contemplation & Mastery", weeks: "19–24", price: 497, msrp: 747 }
  ],
  offer: {
    separateTotal: 1188,
    completePrice: 997,
    foundingSaving: 191,
    msrpTotal: 1788,
    msrpSaving: 791,
    msrpDiscount: 44
  }
});
