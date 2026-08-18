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
  "home.hero.eyebrow": { en: "AN INNER MASTERY JOURNEY", es: "UN RECORRIDO DE DOMINIO INTERIOR" },
  "home.hero.lead": {
    en: "A practical path from timeless principles to purposeful action.",
    es: "Un camino práctico que convierte principios atemporales en acciones con propósito.",
  },
  "home.hero.line1": { en: "Change how you think.", es: "Cambia tu forma de pensar." },
  "home.hero.line2": { en: "Change how you act.", es: "Cambia tu forma de actuar." },
  "home.hero.line3": { en: "Change the results you create.", es: "Cambia los resultados que creas." },
  "home.hero.change": {
    en: "Change how you think. Change how you act. Change the results you create.",
    es: "Cambia tu forma de pensar. Cambia tu forma de actuar. Cambia los resultados que creas.",
  },
  "home.hero.alt": {
    en: "Tariq Saddique, Master Key System coach",
    es: "Tariq Saddique, coach del Master Key System",
  },
  "home.cta.startFree": { en: "Start Free for 7 Days", es: "Empieza gratis durante 7 días" },
  "home.cta.exploreJourney": { en: "Explore the 24-Week Journey", es: "Descubre el recorrido de 24 semanas" },
  "home.cta.book": { en: "Book a Session", es: "Reserva una sesión" },
  "home.journey.eyebrow": { en: "YOUR PATHWAY", es: "TU RECORRIDO" },
  "home.journey.title": { en: "A clear path from curiosity to mastery", es: "Un camino claro de la curiosidad al dominio" },
  "home.journey.intro": {
    en: "Begin with a simple experience, then build understanding and practice one step at a time.",
    es: "Empieza con una experiencia sencilla y desarrolla tu comprensión y tu práctica paso a paso.",
  },
  "home.journey.discover.title": { en: "Discover", es: "Descubre" },
  "home.journey.discover.body": { en: "See the ideas behind deliberate thought and purposeful action.", es: "Conoce las ideas que sostienen el pensamiento deliberado y la acción con propósito." },
  "home.journey.experience.title": { en: "Experience", es: "Experimenta" },
  "home.journey.experience.body": { en: "Try seven focused days and notice how you direct your attention.", es: "Prueba siete días de enfoque y observa cómo diriges tu atención." },
  "home.journey.learn.title": { en: "Learn", es: "Aprende" },
  "home.journey.learn.body": { en: "Explore the progressive 24-week Master Key sequence.", es: "Descubre la secuencia progresiva de 24 semanas del Master Key System." },
  "home.journey.transform.title": { en: "Transform", es: "Transfórmate" },
  "home.journey.transform.body": { en: "Turn weekly insight into consistent, purposeful practice.", es: "Convierte cada aprendizaje semanal en una práctica constante y con propósito." },
  "home.journey.master.title": { en: "Master", es: "Domina" },
  "home.journey.master.body": { en: "Integrate what works into the way you think, choose and act.", es: "Integra lo que te funciona en tu forma de pensar, elegir y actuar." },
  "home.taster.eyebrow": { en: "YOUR FREE START", es: "TU PRIMER PASO GRATUITO" },
  "home.taster.title": { en: "7 Days to Change the Way You Use Your Mind", es: "7 días para cambiar la forma en que utilizas tu mente" },
  "home.taster.intro": { en: "Seven short sessions. One useful focus each day.", es: "Siete sesiones breves. Un enfoque útil cada día." },
  "home.taster.day1": { en: "See What’s Running Your Life", es: "Observa qué dirige tu vida" },
  "home.taster.day2": { en: "Take Back Your Attention", es: "Recupera tu atención" },
  "home.taster.day3": { en: "Recognize What Keeps Repeating", es: "Reconoce lo que se repite" },
  "home.taster.day4": { en: "Give Your Mind a Direction", es: "Dale una dirección a tu mente" },
  "home.taster.day5": { en: "Become Someone You Can Rely On", es: "Conviértete en alguien en quien puedas confiar" },
  "home.taster.day6": { en: "Strengthen the New Pattern", es: "Refuerza el nuevo patrón" },
  "home.taster.day7": { en: "Choose What Happens Next", es: "Elige qué viene después" },
  "home.masterKey.eyebrow": { en: "THE MASTER KEY SYSTEM", es: "EL MASTER KEY SYSTEM" },
  "home.masterKey.title": { en: "Transformation through progressive weekly lessons", es: "Transformación mediante lecciones semanales progresivas" },
  "home.masterKey.body": {
    en: "The 24-week structure brings study, reflection and application together so that each lesson prepares you for the next.",
    es: "La estructura de 24 semanas reúne estudio, reflexión y aplicación para que cada lección te prepare para la siguiente.",
  },
  "home.masterKey.progressive": {
    en: "As you go deeper, an almost magical process can begin to unfold: earlier ideas take on new meaning through practice.",
    es: "A medida que profundizas, puede empezar a desplegarse un proceso casi mágico: la práctica da un nuevo sentido a las ideas anteriores.",
  },
  "home.masterKey.cta": { en: "Learn How the System Works", es: "Descubre cómo funciona el sistema" },
  "home.origins.eyebrow": { en: "TIMELESS WISDOM, MODERN GUIDANCE", es: "SABIDURÍA ATEMPORAL, GUÍA ACTUAL" },
  "home.origins.preludeTitle": { en: "Where timeless wisdom meets modern transformation.", es: "Donde la sabiduría atemporal se une a la transformación moderna." },
  "home.origins.preludeBody": {
    en: "Inspired by the Master Key System and guided for today’s world, this journey helps you build clarity, focus, discipline and aligned action.",
    es: "Inspirado en el Master Key System y guiado para el mundo actual, este recorrido te ayuda a desarrollar claridad, enfoque, disciplina y una acción coherente.",
  },
  "home.origins.alt": {
    en: "Charles F. Haanel and Tariq Saddique — Master Key System inspired coaching journey",
    es: "Charles F. Haanel y Tariq Saddique — recorrido de coaching inspirado en el Master Key System",
  },
  "home.origins.statementTitle": { en: "From inner mastery to purposeful action.", es: "Del dominio interior a la acción con propósito." },
  "home.origins.statementBody": {
    en: "Timeless wisdom. Focused practice. Modern coaching. Step into a journey that helps you think clearly, act deliberately and live with purpose.",
    es: "Sabiduría atemporal. Práctica enfocada. Coaching actual. Entra en un recorrido que te ayuda a pensar con claridad, actuar de forma deliberada y vivir con propósito.",
  },
  "home.origins.disclaimer": {
    en: "An independent coaching experience inspired by the Master Key System.",
    es: "Una experiencia de coaching independiente inspirada en el Master Key System.",
  },
  "home.coaching.eyebrow": { en: "COACHING WITH TARIQ", es: "COACHING CON TARIQ" },
  "home.coaching.title": { en: "Turn insight into consistent practice", es: "Convierte el aprendizaje en una práctica constante" },
  "home.coaching.intro": {
    en: "Move through four structured stages with practical guidance, reflection and accountability.",
    es: "Avanza por cuatro etapas estructuradas con guía práctica, reflexión y acompañamiento.",
  },
  "home.coaching.weeks": { en: "Weeks", es: "Semanas" },
  "home.coaching.foundation": { en: "Foundation", es: "Fundamentos" },
  "home.coaching.visualisation": { en: "Visualisation", es: "Visualización" },
  "home.coaching.concentration": { en: "Concentration", es: "Concentración" },
  "home.coaching.mastery": { en: "Contemplation & Mastery", es: "Contemplación y dominio" },
  "home.coaching.complete": { en: "Complete 24-week journey", es: "Recorrido completo de 24 semanas" },
  "home.coaching.cta": { en: "Explore Coaching", es: "Descubre el coaching" },
  "home.mentors.eyebrow": { en: "GUIDED REFLECTION", es: "REFLEXIÓN GUIADA" },
  "home.mentors.title": { en: "Three perspectives for your next step", es: "Tres perspectivas para tu siguiente paso" },
  "home.mentors.intro": { en: "Choose a perspective, reflect on a focused prompt and leave with a practical next action.", es: "Elige una perspectiva, reflexiona con una pregunta concreta y termina con un siguiente paso práctico." },
  "home.mentors.haanel.name": { en: "Charles F. Haanel", es: "Charles F. Haanel" },
  "home.mentors.haanel.role": { en: "Principles and perspective", es: "Principios y perspectiva" },
  "home.mentors.helmar.name": { en: "Helmar Rudolph", es: "Helmar Rudolph" },
  "home.mentors.helmar.role": { en: "Study and practical application", es: "Estudio y aplicación práctica" },
  "home.mentors.tariq.name": { en: "Tariq Saddique", es: "Tariq Saddique" },
  "home.mentors.tariq.role": { en: "Responsibility and purposeful action", es: "Responsabilidad y acción con propósito" },
  "home.mentors.disclosure": {
    en: "£0 automated educational guidance — not live human or generative-AI conversations.",
    es: "Orientación educativa automatizada a £0; no son conversaciones en directo con personas ni con IA generativa.",
  },
  "home.mentors.cta": { en: "Explore the AI Mentors", es: "Descubre los mentores de IA" },
  "home.next.eyebrow": { en: "CHOOSE YOUR NEXT STEP", es: "ELIGE TU SIGUIENTE PASO" },
  "home.next.title": { en: "Begin with experience, not pressure", es: "Empieza desde la experiencia, sin presión" },
  "home.next.body": { en: "Try the free seven-day journey, or speak with Tariq if you want to explore the right path for you.", es: "Prueba el recorrido gratuito de siete días o habla con Tariq si quieres descubrir qué camino encaja contigo." },
  "form.emailPlaceholder": { en: "Your email address", es: "Tu correo electrónico" },
  "meta.home.title": { en: "Unleash Your Power | Master Key coaching", es: "Unleash Your Power | Coaching del Master Key System" },
  "meta.home.description": {
    en: "An independent coaching experience inspired by the Master Key System.",
    es: "Una experiencia de coaching independiente inspirada en el Master Key System.",
  },
  "route.home.metaTitle": { en: "Unleash Your Power | Tariq Saddique", es: "Unleash Your Power | Tariq Saddique" },
  "route.home.metaDescription": {
    en: "Where timeless Master Key wisdom meets practical modern coaching.",
    es: "Donde la sabiduría atemporal del Master Key System se une al coaching práctico actual.",
  },
  "route.home.heading": { en: "Unleash Your Power", es: "Libera tu poder" },
  "route.home.purpose": {
    en: "A practical path from timeless principles to purposeful action.",
    es: "Un camino práctico que convierte principios atemporales en acciones con propósito.",
  },
  "route.home.action": { en: "Start Free for 7 Days", es: "Empieza gratis durante 7 días" },
  "route.masterKeySystem.metaTitle": { en: "The Master Key System | Unleash Your Power", es: "El Master Key System | Unleash Your Power" },
  "route.masterKeySystem.metaDescription": {
    en: "Explore the progressive 24-week Master Key practice and its four phases.",
    es: "Descubre la práctica progresiva de 24 semanas del Master Key System y sus cuatro fases.",
  },
  "route.masterKeySystem.heading": { en: "Charles F. Haanel's Master Key System", es: "El Master Key System de Charles F. Haanel" },
  "route.masterKeySystem.purpose": {
    en: "Discover how progressive weekly lessons develop awareness, control, application and lasting mastery.",
    es: "Descubre cómo las lecciones semanales progresivas desarrollan la conciencia, el control, la aplicación y un dominio duradero.",
  },
  "route.masterKeySystem.action": { en: "Explore the coaching programme", es: "Descubre el programa de coaching" },
  "route.startFree.metaTitle": { en: "Free 7-Day Challenge | Unleash Your Power", es: "Reto gratuito de 7 días | Unleash Your Power" },
  "route.startFree.metaDescription": {
    en: "Begin a free seven-day introduction to deliberate thought and focused action.",
    es: "Empieza una introducción gratuita de siete días al pensamiento deliberado y la acción enfocada.",
  },
  "route.startFree.heading": { en: "Change the way you use your mind", es: "Cambia la forma en que utilizas tu mente" },
  "route.startFree.purpose": {
    en: "Experience one focused practice each day and notice what changes when you direct your attention with intention.",
    es: "Practica un ejercicio de enfoque cada día y observa qué cambia cuando diriges tu atención con intención.",
  },
  "route.startFree.action": { en: "See the 24-week journey", es: "Descubre el recorrido de 24 semanas" },
  "route.coaching.metaTitle": { en: "24-Week Coaching | Unleash Your Power", es: "Coaching de 24 semanas | Unleash Your Power" },
  "route.coaching.metaDescription": {
    en: "Explore Tariq Saddique's complete 24-week Master Key coaching programme.",
    es: "Descubre el programa completo de coaching de 24 semanas de Tariq Saddique inspirado en el Master Key System.",
  },
  "route.coaching.heading": { en: "Coaching for practical inner mastery", es: "Coaching para un dominio interior práctico" },
  "route.coaching.purpose": {
    en: "Move through four structured stages with guidance that turns weekly insight into consistent practice.",
    es: "Avanza por cuatro etapas estructuradas con una guía que convierte cada aprendizaje semanal en una práctica constante.",
  },
  "route.coaching.priceLead": { en: "Complete 24-Week Programme:", es: "Programa completo de 24 semanas:" },
  "route.coaching.action": { en: "Contact Tariq about enrolling", es: "Habla con Tariq sobre tu inscripción" },
  "route.aboutTariq.metaTitle": { en: "About Tariq Saddique | Unleash Your Power", es: "Sobre Tariq Saddique | Unleash Your Power" },
  "route.aboutTariq.metaDescription": {
    en: "Meet Tariq Saddique and learn how he guides practical Master Key study.",
    es: "Conoce a Tariq Saddique y descubre cómo guía el estudio práctico del Master Key System.",
  },
  "route.aboutTariq.heading": { en: "Meet Tariq Saddique", es: "Conoce a Tariq Saddique" },
  "route.aboutTariq.purpose": {
    en: "Learn why Tariq combines timeless principles, personal responsibility and modern coaching to help students create meaningful change.",
    es: "Descubre por qué Tariq combina principios atemporales, responsabilidad personal y coaching actual para ayudarte a crear un cambio con sentido.",
  },
  "route.aboutTariq.action": { en: "Start a conversation with Tariq", es: "Habla con Tariq" },
  "route.resources.metaTitle": { en: "Master Key Resources | Unleash Your Power", es: "Recursos del Master Key System | Unleash Your Power" },
  "route.resources.metaDescription": {
    en: "Find practical resources to support focused weekly Master Key practice.",
    es: "Encuentra recursos prácticos para apoyar tu práctica semanal del Master Key System.",
  },
  "route.resources.heading": { en: "Resources for your practice", es: "Recursos para tu práctica" },
  "route.resources.purpose": {
    en: "Use clear prompts, study notes and preparation guidance to deepen understanding and support consistent action.",
    es: "Utiliza preguntas, notas de estudio y orientaciones claras para profundizar en tu comprensión y actuar con constancia.",
  },
  "route.resources.action": { en: "Begin with the free challenge", es: "Empieza con el reto gratuito" },
  "route.aiMentors.metaTitle": { en: "AI Mentors | Unleash Your Power", es: "Mentores de IA | Unleash Your Power" },
  "route.aiMentors.metaDescription": {
    en: "Use transparent educational simulations for guided Master Key reflection.",
    es: "Utiliza simulaciones educativas transparentes para guiar tu reflexión sobre el Master Key System.",
  },
  "route.aiMentors.heading": { en: "AI-guided mentors for reflection", es: "Mentores guiados por IA para reflexionar" },
  "route.aiMentors.purpose": {
    en: "Choose a clearly labelled educational guide inspired by Haanel, Helmar or Tariq and turn reflection into a useful next step.",
    es: "Elige una guía educativa claramente identificada e inspirada en Haanel, Helmar o Tariq para convertir tu reflexión en un siguiente paso útil.",
  },
  "route.aiMentors.action": { en: "Ask about AI-guided mentors", es: "Pregunta por los mentores guiados por IA" },
  "route.contact.metaTitle": { en: "Contact and Book | Unleash Your Power", es: "Contacto y reservas | Unleash Your Power" },
  "route.contact.metaDescription": {
    en: "Contact Tariq Saddique to ask a question or discuss a coaching session.",
    es: "Contacta con Tariq Saddique para hacer una pregunta o hablar sobre una sesión de coaching.",
  },
  "route.contact.heading": { en: "Start a conversation", es: "Empieza una conversación" },
  "route.contact.purpose": {
    en: "Ask a question, discuss the programme or arrange a clear, no-pressure conversation with Tariq.",
    es: "Haz una pregunta, habla sobre el programa o concierta una conversación clara y sin presión con Tariq.",
  },
  "route.contact.action": { en: "Email Tariq", es: "Escribe a Tariq" },
  "route.faq.metaTitle": { en: "Frequently Asked Questions | Unleash Your Power", es: "Preguntas frecuentes | Unleash Your Power" },
  "route.faq.metaDescription": {
    en: "Get clear answers about the free challenge, 24-week journey and coaching.",
    es: "Resuelve tus dudas sobre el reto gratuito, el recorrido de 24 semanas y el coaching.",
  },
  "route.faq.heading": { en: "Frequently asked questions", es: "Preguntas frecuentes" },
  "route.faq.purpose": {
    en: "Find straightforward answers about how the experience works, what it includes and how to begin.",
    es: "Encuentra respuestas claras sobre cómo funciona la experiencia, qué incluye y cómo empezar.",
  },
  "route.faq.action": { en: "Ask Tariq a question", es: "Hazle una pregunta a Tariq" },
  "route.referral.metaTitle": { en: "Referral | Unleash Your Power", es: "Recomendaciones | Unleash Your Power" },
  "route.referral.metaDescription": {
    en: "Make a thoughtful introduction to someone who may value the Master Key journey.",
    es: "Presenta con atención este recorrido a alguien que pueda valorar el Master Key System.",
  },
  "route.referral.heading": { en: "Share the journey responsibly", es: "Comparte el recorrido con responsabilidad" },
  "route.referral.purpose": {
    en: "Introduce someone with clarity and care, without pressure or exaggerated promises.",
    es: "Presenta la experiencia con claridad y cuidado, sin presión ni promesas exageradas.",
  },
  "route.referral.action": { en: "Discuss a referral with Tariq", es: "Habla con Tariq sobre una recomendación" },
  "route.privacy.metaTitle": { en: "Privacy | Unleash Your Power", es: "Privacidad | Unleash Your Power" },
  "route.privacy.metaDescription": {
    en: "Read how Unleash Your Power handles enquiries and personal information.",
    es: "Consulta cómo gestiona Unleash Your Power las consultas y la información personal.",
  },
  "route.privacy.heading": { en: "Privacy", es: "Privacidad" },
  "route.privacy.purpose": {
    en: "Understand how information connected with enquiries, resources and coaching is handled responsibly.",
    es: "Comprende cómo se gestiona de forma responsable la información vinculada a consultas, recursos y coaching.",
  },
  "route.privacy.action": { en: "Ask a privacy question", es: "Haz una pregunta sobre privacidad" },
  "route.terms.metaTitle": { en: "Terms | Unleash Your Power", es: "Condiciones | Unleash Your Power" },
  "route.terms.metaDescription": {
    en: "Read the terms for Unleash Your Power educational resources and coaching.",
    es: "Consulta las condiciones de los recursos educativos y el coaching de Unleash Your Power.",
  },
  "route.terms.heading": { en: "Terms", es: "Condiciones" },
  "route.terms.purpose": {
    en: "Review the terms that support a clear and responsible educational coaching relationship.",
    es: "Revisa las condiciones que favorecen una relación de coaching educativo clara y responsable.",
  },
  "route.terms.action": { en: "Ask about these terms", es: "Pregunta sobre estas condiciones" },
  "route.liveCoaching.metaTitle": { en: "Live Coaching | Unleash Your Power", es: "Coaching en directo | Unleash Your Power" },
  "route.liveCoaching.metaDescription": {
    en: "Prepare for a focused live Master Key coaching session with Tariq.",
    es: "Prepárate para una sesión de coaching en directo y enfocada sobre el Master Key System con Tariq.",
  },
  "route.liveCoaching.heading": { en: "Live coaching", es: "Coaching en directo" },
  "route.liveCoaching.purpose": {
    en: "Prepare to practise, ask useful questions and apply the current weekly principle with Tariq.",
    es: "Prepárate para practicar, plantear preguntas útiles y aplicar con Tariq el principio de la semana.",
  },
  "route.liveCoaching.action": { en: "Arrange a live session", es: "Organiza una sesión en directo" },
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
