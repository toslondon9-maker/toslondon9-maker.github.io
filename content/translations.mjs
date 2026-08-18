function deepFreeze(value) {
  for (const nested of Object.values(value)) {
    if (nested && typeof nested === "object") deepFreeze(nested);
  }
  return Object.freeze(value);
}

const translations = deepFreeze({
  "nav.home": { en: "Home", es: "Inicio" },
  "nav.startFree": { en: "Free 7-Day Challenge", es: "Reto gratuito de 7 días" },
  "nav.masterKeySystem": { en: "24-Week MKS", es: "MKS de 24 semanas" },
  "nav.aiMentors": { en: "AI Mentors", es: "Mentores de IA" },
  "nav.coaching": { en: "Coaching", es: "Coaching" },
  "nav.resources": { en: "Resources", es: "Recursos" },
  "nav.aboutTariq": { en: "About Tariq", es: "Sobre Tariq" },
  "nav.faq": { en: "FAQ", es: "Preguntas frecuentes" },
  "nav.contact": { en: "Contact / Book", es: "Contacto / Reserva" },
  "footer.mission": {
    en: "An independent coaching experience inspired by the Master Key System.",
    es: "Una experiencia de coaching independiente inspirada en el Master Key System.",
  },
  "footer.privacy": { en: "Privacy", es: "Privacidad" },
  "footer.terms": { en: "Terms", es: "Condiciones" },
  "footer.copyright": { en: "© 2026 Unleash Your Power. All rights reserved.", es: "© 2026 Unleash Your Power. Todos los derechos reservados." },
  "language.label": { en: "Language", es: "Idioma" },
  "menu.open": { en: "Open menu", es: "Abrir menú" },
  "menu.close": { en: "Close menu", es: "Cerrar menú" },
  "brand.homeLabel": { en: "Unleash Your Power home", es: "Inicio de Unleash Your Power" },
  "nav.primaryLabel": { en: "Primary navigation", es: "Navegación principal" },
  "nav.mobileLabel": { en: "Mobile navigation", es: "Navegación móvil" },
  "nav.footerLabel": { en: "Footer navigation", es: "Navegación del pie de página" },
  "nav.legalLabel": { en: "Legal", es: "Información legal" },
  "cta.startFree": { en: "Start free for 7 days", es: "Empieza gratis durante 7 días" },
  "cta.exploreJourney": { en: "Explore the 24-week journey", es: "Descubre el recorrido de 24 semanas" },
  "cta.bookSession": { en: "Book a session", es: "Reserva una sesión" },
  "home.hero.title": { en: "Where timeless wisdom meets modern transformation.", es: "Donde la sabiduría atemporal se une a la transformación moderna." },
  "form.emailPlaceholder": { en: "Your email address", es: "Tu correo electrónico" },
  "meta.home.title": { en: "Unleash Your Power | Master Key coaching", es: "Unleash Your Power | Coaching del Master Key System" },
  "meta.home.description": {
    en: "An independent coaching experience inspired by the Master Key System.",
    es: "Una experiencia de coaching independiente inspirada en el Master Key System.",
  },
});

const warnedKeys = new Set();

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function warnOnce(key) {
  if (warnedKeys.has(key)) return;
  warnedKeys.add(key);
  console.warn(`[i18n] Missing translation: ${key}; using English.`);
}

export function hasTranslation(key) {
  const entry = translations[key];
  return Boolean(entry?.en && entry?.es);
}

export function t(key, language = "en") {
  if (language !== "en" && language !== "es") {
    throw new RangeError(`Unsupported language: ${language}`);
  }

  const entry = translations[key];
  if (entry?.[language]) return entry[language];

  if (!isBrowser()) throw new Error(`Missing translation: ${key} (${language})`);
  warnOnce(key);
  return entry?.en ?? key;
}

export { translations };
