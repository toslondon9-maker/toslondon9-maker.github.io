const programmeSummary = "A progressive 24-week Master Key practice with guided coaching from Tariq Saddique.";

function page(route, title, description, heading, content) {
  return () => ({
    route,
    language: "en",
    title,
    description,
    body: `<main><article><p class="eyebrow">UNLEASH YOUR POWER</p><h1>${heading}</h1>${content}</article></main>`,
    scripts: [],
  });
}

function programmePage(data) {
  const stages = data.stages.map(({ id, name, weeks, price, msrp }) => (
    `<li data-stage="${id}"><strong>${name}</strong> — Weeks ${weeks}: <s>£${msrp}</s> £${price}</li>`
  )).join("");

  return {
    route: "/master-key-system/",
    language: "en",
    title: "The Master Key System | Unleash Your Power",
    description: programmeSummary,
    body: `<main><article><p class="eyebrow">THE MASTER KEY SYSTEM</p><h1>Charles F. Haanel's Master Key System</h1><p>Discover a practical path from inner mastery to purposeful action with Tariq Saddique.</p><ol>${stages}</ol></article></main>`,
    scripts: [],
  };
}

function coachingPage(data) {
  return {
    route: "/coaching/",
    language: "en",
    title: "Coaching | Unleash Your Power",
    description: "Explore the complete 24-week Master Key coaching programme.",
    body: `<main><article><p class="eyebrow">COACHING</p><h1>Coaching for practical inner mastery</h1><p>Complete 24-Week Programme: <strong>£${data.offer.completePrice}</strong>.</p><p>Four stages separately: £${data.offer.separateTotal}. Save £${data.offer.foundingSaving} when you enrol for the full programme.</p></article></main>`,
    scripts: [],
  };
}

export const routeRenderers = {
  "/": page("/", "Unleash Your Power | Tariq Saddique", programmeSummary, "Unleash Your Power", "<p>Charles F. Haanel revealed the Master Key; Tariq helps you turn its ideas into clarity, focus, discipline and aligned action.</p>"),
  "/master-key-system/": programmePage,
  "/start-free/": page("/start-free/", "Start Free | Unleash Your Power", "Begin with a free seven-day Master Key taster.", "Start free", "<p>Begin your free seven-day taster and discover a focused daily practice.</p>"),
  "/coaching/": coachingPage,
  "/about-tariq/": page("/about-tariq/", "About Tariq Saddique | Unleash Your Power", "Meet Tariq Saddique, your Master Key coach.", "Meet Tariq Saddique", "<p>Tariq helps you apply timeless wisdom to your work, relationships and daily life.</p>"),
  "/resources/": page("/resources/", "Resources | Unleash Your Power", "Resources to support your weekly Master Key practice.", "Resources for your practice", "<p>Use practical prompts, study notes and preparation guidance to support consistent action.</p>"),
  "/ai-mentors/": page("/ai-mentors/", "AI Mentors | Unleash Your Power", "Reflect on the Master Key ideas with practical AI-guided prompts.", "AI mentors for reflection", "<p>Use clear questions to turn your understanding into an honest, useful next step.</p>"),
  "/contact/": page("/contact/", "Contact Tariq Saddique | Unleash Your Power", "Contact Tariq to discuss coaching and the Master Key programme.", "Start a conversation", "<p>Contact Tariq to ask a question or arrange a discovery conversation.</p>"),
  "/faq/": page("/faq/", "Frequently Asked Questions | Unleash Your Power", "Answers to common questions about the Master Key programme.", "Frequently asked questions", "<p>Find straightforward answers before you begin the Master Key journey.</p>"),
  "/referral/": page("/referral/", "Referral | Unleash Your Power", "Introduce someone to the Master Key programme with care and clarity.", "Share the journey responsibly", "<p>Make a thoughtful introduction to someone who may benefit from this work.</p>"),
  "/privacy/": page("/privacy/", "Privacy | Unleash Your Power", "How Unleash Your Power handles personal information.", "Privacy", "<p>Read how enquiries and programme information are handled responsibly.</p>"),
  "/terms/": page("/terms/", "Terms | Unleash Your Power", "Terms for using Unleash Your Power resources and coaching.", "Terms", "<p>Read the terms that apply to this educational coaching programme.</p>"),
  "/live-coaching/": page("/live-coaching/", "Live Coaching | Unleash Your Power", "Prepare for a live Master Key coaching session with Tariq.", "Live coaching", "<p>Prepare to practise, ask questions and apply the weekly principle with Tariq.</p>"),
};
