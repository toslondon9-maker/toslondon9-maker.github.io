const siteUrl = "https://unleashyourpowerwithtariq.com";

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Unleash Your Power",
    url: `${siteUrl}/`,
    founder: { "@type": "Person", name: "Tariq Saddique" },
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Unleash Your Power",
    url: `${siteUrl}/`,
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

export function breadcrumbSchema(route, label) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: label, item: `${siteUrl}${route}` },
    ],
  };
}

export function renderStructuredData({ route, title, structuredData = [] }) {
  const graph = [organizationSchema(), websiteSchema(), ...structuredData];
  if (route === "/about-tariq/") graph.push({ "@type": "Person", name: "Tariq Saddique", jobTitle: "Master Key System coach", url: `${siteUrl}/about-tariq/` });
  if (route === "/master-key-system/" || route === "/coaching/") graph.push({ "@type": "Course", name: "Master Key System 24 Week Course", description: "A progressive 24-week study journey with practical exercises and coaching support.", provider: { "@id": `${siteUrl}/#organization` } });
  if (route === "/faq/") {
    const questions = [
      ["How is the coaching delivered?", "The journey combines progressive weekly study, practical exercises, reflection and guidance from Tariq."],
      ["How much time should I allow?", "Set aside consistent time each week for the lesson, its exercise and your own reflection."],
      ["What if I miss a week?", "Return to the current lesson without judging yourself. The emphasis is on steady application, not rushing to catch up."],
      ["Can I work at my own pace?", "The sequence is designed to unfold progressively."],
      ["Is this programme independent?", "Yes. This is an independent coaching experience inspired by the Master Key System."],
      ["How do enrolment and payment work?", "Contact Tariq to discuss the right option."],
    ];
    graph.push({ "@type": "FAQPage", mainEntity: questions.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) });
  }
  if (route !== "/") graph.push(breadcrumbSchema(route, title.split("|")[0].trim()));
  return `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>`;
}
