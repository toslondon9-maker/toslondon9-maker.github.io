import { siteData } from "../content/site-data.mjs";
import { t } from "../content/translations.mjs";

const headerNavigationItems = Object.freeze([
  { route: siteData.routes.home, key: "nav.home" },
  { route: siteData.routes.masterKeySystem, key: "nav.masterKeySystem" },
  { route: siteData.routes.startFree, key: "nav.startFree", className: "navStartFree" },
  { route: siteData.routes.aiMentors, key: "nav.aiMentors" },
  { route: siteData.routes.coaching, key: "nav.coaching" },
  { route: siteData.routes.aboutTariq, key: "nav.aboutTariq" },
  { route: siteData.routes.resources, key: "nav.resources" },
  { route: siteData.routes.getTheBook, key: "nav.getTheBook", className: "navBook" },
]);

const footerNavigationItems = Object.freeze([
  ...headerNavigationItems,
  { route: siteData.routes.faq, key: "nav.faq" },
  { route: siteData.routes.contact, key: "nav.contact" },
  { route: siteData.routes.liveCoaching, key: "nav.liveCoaching", className: "studentUtilityLink" },
  { route: siteData.routes.referral, key: "nav.referral", className: "studentUtilityLink" },
  { route: siteData.routes.refundPolicy, key: "footer.refundPolicy" },
]);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderRouteLinks(items, route, language) {
  return items.map((item) => {
    const current = item.route === route ? ' aria-current="page"' : "";
    const className = item.className ? ` class="${item.className}"` : "";
    return `<li><a${className} href="${escapeHtml(item.route)}"${current} data-i18n="${item.key}">${escapeHtml(t(item.key, language))}</a></li>`;
  }).join("");
}

function renderLanguageControls(language, location) {
  return `<div class="languageSwitch languageSwitch--${location}" role="group" aria-label="${escapeHtml(t("language.label", language))}" data-i18n-aria-label="language.label"><button type="button" data-language="en" aria-pressed="${language === "en"}">EN</button><span aria-hidden="true">|</span><button type="button" data-language="es" aria-pressed="${language === "es"}">ES</button></div>`;
}

export function renderHeader({ route, language = "en" }) {
  const desktopLinks = renderRouteLinks(headerNavigationItems, route, language);
  const mobileLinks = renderRouteLinks(headerNavigationItems, route, language);

  return `<header class="siteHeader" data-site-navigation><a class="brand" href="${siteData.routes.home}" aria-label="${escapeHtml(t("brand.homeLabel", language))}" data-i18n-aria-label="brand.homeLabel"><img src="/images/digital-key-lockup.svg" alt="Unleash Your Power logo" width="900" height="150" decoding="async"></a><div class="siteHeader__actions"><nav class="siteNav" aria-label="${escapeHtml(t("nav.primaryLabel", language))}" data-i18n-aria-label="nav.primaryLabel"><ul>${desktopLinks}</ul></nav>${renderLanguageControls(language, "header")}<div class="mobileNav"><button class="mobileNav__toggle" type="button" aria-expanded="false" aria-controls="mobile-navigation-panel" aria-label="${escapeHtml(t("menu.open", language))}" data-i18n-aria-label="menu.open" data-navigation-toggle><span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span></button><div class="mobileNav__panel" id="mobile-navigation-panel" data-navigation-panel><nav aria-label="${escapeHtml(t("nav.mobileLabel", language))}" data-i18n-aria-label="nav.mobileLabel"><ul>${mobileLinks}</ul></nav>${renderLanguageControls(language, "mobile")}</div></div></div></header>`;
}

function renderBaseFooter({ language = "en", route = "" } = {}) {
  const links = renderRouteLinks(footerNavigationItems, route, language);
  return `<footer class="siteFooter"><div class="siteFooter__mission"><a class="siteFooter__brand" href="${siteData.routes.home}">Unleash Your Power</a><p data-i18n="footer.mission">${escapeHtml(t("footer.mission", language))}</p><a class="siteFooter__start" href="${siteData.routes.startFree}" data-i18n="cta.startFree">${escapeHtml(t("cta.startFree", language))} →</a></div><nav class="siteFooter__nav" aria-label="${escapeHtml(t("nav.footerLabel", language))}" data-i18n-aria-label="nav.footerLabel"><ul>${links}</ul></nav><div class="siteFooter__meta">${renderLanguageControls(language, "footer")}<nav aria-label="${escapeHtml(t("nav.legalLabel", language))}" data-i18n-aria-label="nav.legalLabel"><a href="${siteData.routes.privacy}" data-i18n="footer.privacy">${escapeHtml(t("footer.privacy", language))}</a><a href="${siteData.routes.terms}" data-i18n="footer.terms">${escapeHtml(t("footer.terms", language))}</a><a href="${siteData.routes.refundPolicy}" data-i18n="footer.refundPolicy">${escapeHtml(t("footer.refundPolicy", language))}</a></nav><button class="footerLink" type="button" data-analytics-preferences data-i18n="footer.analyticsPreferences">${escapeHtml(t("footer.analyticsPreferences", language))}</button><p data-i18n="footer.copyright">${escapeHtml(t("footer.copyright", language))}</p></div></footer><aside class="analyticsConsent" data-analytics-banner aria-labelledby="analytics-consent-heading"><div class="analyticsConsent__inner"><div><p class="eyebrow" data-i18n="analytics.banner.heading">${escapeHtml(t("analytics.banner.heading", language))}</p><p id="analytics-consent-heading" data-i18n="analytics.banner.body">${escapeHtml(t("analytics.banner.body", language))}</p></div><div class="analyticsConsent__actions"><button class="button--primary" type="button" data-analytics-accept data-i18n="analytics.banner.accept">${escapeHtml(t("analytics.banner.accept", language))}</button><button class="button--secondary" type="button" data-analytics-decline data-i18n="analytics.banner.decline">${escapeHtml(t("analytics.banner.decline", language))}</button><a href="${siteData.routes.privacy}" data-i18n="analytics.banner.privacy">${escapeHtml(t("analytics.banner.privacy", language))}</a></div></div></aside>`;
}

export function renderFooter(options = {}) {
  const language = options.language ?? "en";
  const social = `<section class="siteFooter__social" aria-labelledby="footer-social-heading"><p class="eyebrow" id="footer-social-heading" data-i18n="footer.socialHeading">${escapeHtml(t("footer.socialHeading", language))}</p><p data-i18n="footer.socialBody">${escapeHtml(t("footer.socialBody", language))}</p><div class="siteFooter__socialLinks"><a href="https://www.linkedin.com/in/tariq-saddique-0648bb436/" target="_blank" rel="noopener noreferrer" data-social-platform="linkedin" aria-label="LinkedIn"><svg aria-hidden="true" viewBox="0 0 24 24" style="color:#0A66C2"><path d="M5 8.5V19H2V8.5h3ZM3.5 3A1.8 1.8 0 1 1 3.5 6.6 1.8 1.8 0 0 1 3.5 3ZM8 8.5h2.9V10c.6-1 1.7-1.8 3.5-1.8 3.7 0 4.6 2.3 4.6 5.4V19h-3v-4.8c0-1.1 0-2.6-1.7-2.6s-2 1.2-2 2.5V19H8V8.5Z"/></svg>LinkedIn</a><a href="https://www.instagram.com/tariq_uyp/" target="_blank" rel="noopener noreferrer" data-social-platform="instagram" aria-label="Instagram"><svg aria-hidden="true" viewBox="0 0 24 24" style="color:#E4405F"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>Instagram</a><a href="https://www.tiktok.com/@tariq_uyp" target="_blank" rel="noopener noreferrer" data-social-platform="tiktok" aria-label="TikTok"><svg aria-hidden="true" viewBox="0 0 24 24" style="color:#25F4EE"><path d="M14 3h3c.3 2 1.4 3.3 3 4v3c-1.1-.1-2.1-.5-3-1v6.2a5.8 5.8 0 1 1-5.8-5.8h.8v3.1h-.8a2.7 2.7 0 1 0 2.7 2.7V3Z"/></svg>TikTok</a><a href="https://www.facebook.com/profile.php?id=61594378315784" target="_blank" rel="noopener noreferrer" data-social-platform="facebook" aria-label="Facebook"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14 8h3V4h-3c-3 0-5 2-5 5v2H6v4h3v5h4v-5h3.2l.8-4H13V9c0-.7.3-1 1-1Z"/></svg>Facebook</a><a href="https://www.youtube.com/channel/UCFO-egu-r2RCtqHywd4lU8A" target="_blank" rel="noopener noreferrer" data-social-platform="youtube" aria-label="YouTube"><svg aria-hidden="true" viewBox="0 0 24 24" style="color:#FF0000"><path d="M21 7.2a2.8 2.8 0 0 0-2-2C17.2 4.7 12 4.7 12 4.7s-5.2 0-7 .5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2.5 12 29 29 0 0 0 3 16.8a2.8 2.8 0 0 0 2 2c1.8.5 7 .5 7 .5s5.2 0 7-.5a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .5-4.8 29 29 0 0 0-.5-4.8ZM10 15.3V8.7l5.5 3.3-5.5 3.3Z"/></svg>YouTube</a></div></section>`;
  return renderBaseFooter(options).replace("</footer>", `${social}</footer>`);
}
