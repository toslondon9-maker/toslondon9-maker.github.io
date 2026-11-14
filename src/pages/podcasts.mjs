import { siteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

export function podcastsPage(data = siteData, language = "en") {
  const key = "podcasts";
  const interviewUrl = "https://lnkd.in/p/eprSyrbV";
  const body = `
    <main id="main-content" class="podcastsPage">
      <section class="podcastsHero">
        <div class="podcastsHero__copy">
          <p class="eyebrow" data-i18n="${key}.eyebrow">${escapeHtml(t(`${key}.eyebrow`, language))}</p>
          <h1 data-i18n="${key}.heading">${escapeHtml(t(`${key}.heading`, language))}</h1>
          <p class="podcastsHero__lead" data-i18n="${key}.intro">${escapeHtml(t(`${key}.intro`, language))}</p>
          <a class="button--primary" href="${data.routes.startFree}" data-i18n="${key}.heroCta">${escapeHtml(t(`${key}.heroCta`, language))}</a>
        </div>
        <figure class="podcastsHero__portrait">
          <img src="/images/tariq-happiness-harmony.png" alt="Tariq Saddique, founder of Unleash Your Power" width="900" height="1100" loading="lazy">
        </figure>
      </section>
      <section class="podcastsFeatured">
        <div class="podcastsSectionIntro">
          <p class="eyebrow" data-i18n="${key}.featuredEyebrow">${escapeHtml(t(`${key}.featuredEyebrow`, language))}</p>
          <h2 data-i18n="${key}.featuredHeading">${escapeHtml(t(`${key}.featuredHeading`, language))}</h2>
        </div>
        <article class="podcastCard">
          <div class="podcastCard__art" aria-hidden="true"><span>UYP</span><strong>THE INTEGRATED<br>SUCCESS FORMULA</strong><small> PODCAST CONVERSATION · 01</small></div>
          <div class="podcastCard__copy">
            <p class="eyebrow" data-i18n="${key}.firstLabel">${escapeHtml(t(`${key}.firstLabel`, language))}</p>
            <h3 data-i18n="${key}.firstTitle">${escapeHtml(t(`${key}.firstTitle`, language))}</h3>
            <p data-i18n="${key}.firstDescription">${escapeHtml(t(`${key}.firstDescription`, language))}</p>
            <p class="podcastCard__host" data-i18n="${key}.host">${escapeHtml(t(`${key}.host`, language))}</p>
            <a class="button--primary" href="${interviewUrl}" target="_blank" rel="noopener noreferrer" data-i18n="${key}.watchCta">${escapeHtml(t(`${key}.watchCta`, language))}</a>
          </div>
        </article>
      </section>
      <section class="podcastsTopics">
        <p class="eyebrow" data-i18n="${key}.topicsEyebrow">${escapeHtml(t(`${key}.topicsEyebrow`, language))}</p>
        <h2 data-i18n="${key}.topicsHeading">${escapeHtml(t(`${key}.topicsHeading`, language))}</h2>
        <div class="podcastsTopics__grid">
          <article><span>01</span><h3 data-i18n="${key}.topic1Title">${escapeHtml(t(`${key}.topic1Title`, language))}</h3><p data-i18n="${key}.topic1Body">${escapeHtml(t(`${key}.topic1Body`, language))}</p></article>
          <article><span>02</span><h3 data-i18n="${key}.topic2Title">${escapeHtml(t(`${key}.topic2Title`, language))}</h3><p data-i18n="${key}.topic2Body">${escapeHtml(t(`${key}.topic2Body`, language))}</p></article>
          <article><span>03</span><h3 data-i18n="${key}.topic3Title">${escapeHtml(t(`${key}.topic3Title`, language))}</h3><p data-i18n="${key}.topic3Body">${escapeHtml(t(`${key}.topic3Body`, language))}</p></article>
        </div>
      </section>
      <section class="podcastsCta">
        <div><p class="eyebrow" data-i18n="${key}.ctaEyebrow">${escapeHtml(t(`${key}.ctaEyebrow`, language))}</p><h2 data-i18n="${key}.ctaHeading">${escapeHtml(t(`${key}.ctaHeading`, language))}</h2><p data-i18n="${key}.ctaBody">${escapeHtml(t(`${key}.ctaBody`, language))}</p></div>
        <a class="button--primary" href="${data.routes.startFree}" data-i18n="${key}.ctaButton">${escapeHtml(t(`${key}.ctaButton`, language))}</a>
      </section>
    </main>`;
  return {
    route: data.routes.podcasts,
    language,
    title: t(`${key}.metaTitle`, language),
    description: t(`${key}.metaDescription`, language),
    titleKey: `${key}.metaTitle`,
    descriptionKey: `${key}.metaDescription`,
    body,
    socialImage: "/images/tariq-happiness-harmony.png",
    socialImageAlt: "Tariq Saddique, founder of Unleash Your Power",
    scripts: [],
  };
}
