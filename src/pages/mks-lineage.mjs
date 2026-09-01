import { siteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";

const section = (eyebrow, heading, body, extra = "", portrait = null) => {
  const image = portrait ? `<figure class="mksLineage__portrait mksLineage__portrait--${portrait.side}"><img src="${portrait.src}" alt="${portrait.alt}" width="720" height="640" loading="lazy" decoding="async"></figure>` : "";
  const portraitClass = portrait ? ` mksLineage__section--portrait mksLineage__section--portrait-${portrait.side}` : "";
  return `<section class="mksLineage__section${portraitClass}"><div class="mksLineage__sectionText"><p class="eyebrow">${eyebrow}</p><h2>${heading}</h2><div class="mksLineage__copy"><p>${body}</p>${extra}</div></div>${image}</section>`;
};

export function mksLineagePage(data = siteData, language = "en") {
  const body = `<main class="mksLineagePage" id="main-content">
    <header class="mksLineageHero">
      <div class="mksLineageHero__inner">
        <p class="eyebrow">A TIMELESS LINEAGE OF STUDY</p>
        <h1 data-i18n="route.mksLineage.heading">From Original Wisdom to Practical Application</h1>
        <p class="mksLineageHero__lead">The Master Key System is a 24-part study of the World Within, concentration, mental imagery, harmony, purposeful thought and the relationship between cause and effect.</p>
        <p>At Unleash Your Power, Tariq guides students to study these principles carefully, practise the weekly exercises consistently and apply what they learn to everyday life.</p>
      </div>
    </header>
    <div class="mksLineage__content">
      ${section("THE ORIGINAL SOURCE", "Charles F. Haanel — The Original Author", "Charles F. Haanel wrote The Master Key System. The Unleash Your Power programme studies his original ideas and exercises as a structured 24-week journey, with respect for their historical source and meaning.", "", { src: "/images/lineage/charles-f-haanel.png", alt: "Charles F. Haanel", side: "right" })}
      ${section("THE STUDY TRADITION", "A Tradition of Study, Reflection and Practice", "Students have approached The Master Key System through careful reading, reflection, concentration, mental imagery, weekly exercises and practical application. This page describes a tradition of study without claiming an undocumented lineage or affiliation.")}
      ${section("MODERN STUDY & APPLICATION", "Helmar Rudolph — A Modern Student and Teacher of the System", "Helmar Rudolph is associated with modern study and teaching of The Master Key System. His work may provide context for students exploring the original material; it does not imply that he endorses, partners with or is formally affiliated with Unleash Your Power.", "", { src: "/images/lineage/helmar-rudolph.png", alt: "Helmar Rudolph", side: "left" })}
      ${section("YOUR GUIDE", "Tariq Saddique — Your Guide Through the 24-Week Journey", "Tariq guides students through the weekly lessons, exercises, reflection, practical application and accountability that support consistent study. He is not presenting himself as Charles F. Haanel or Helmar Rudolph; he offers his own independent Unleash Your Power study and coaching programme.", "", { src: "/images/lineage/tariq-lineage-guide.jpg", alt: "Tariq Saddique guiding students through the 24-week Master Key journey", side: "right" })}
      ${section("THE CORE MESSAGE", "Study It. Practise It. Live It.", "Reading creates understanding. The exercises develop ability. Consistent practice builds habits. Application brings the lessons into everyday life.")}
      <section class="mksLineage__cta" aria-labelledby="mks-lineage-continue">
        <p class="eyebrow">CONTINUE YOUR STUDY</p>
        <h2 id="mks-lineage-continue">Continue Your Master Key Journey</h2>
        <p>Choose the next step that fits where you are today.</p>
        <div class="mksLineage__actions"><a class="button--primary" href="${data.routes.masterKeySystem}">Explore the 24-Week Journey</a><a class="button--secondary" href="${data.routes.startFree}">Start Free</a><a class="button--text" href="${data.routes.coaching}">Explore Coaching</a><a class="button--text" href="${data.routes.resources}">Explore Resources</a></div>
      </section>
    </div>
  </main>`;

  return {
    route: data.routes.mksLineage,
    language,
    title: t("route.mksLineage.metaTitle", language),
    description: t("route.mksLineage.metaDescription", language),
    titleKey: "route.mksLineage.metaTitle",
    descriptionKey: "route.mksLineage.metaDescription",
    body,
    styles: [],
    scripts: [],
  };
}
