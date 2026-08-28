import { siteData } from "../content/site-data.mjs";
import { t } from "../content/translations.mjs";

const headerNavigationItems = Object.freeze([
  { route: siteData.routes.home, key: "nav.home" },
  { route: siteData.routes.masterKeySystem, key: "nav.masterKeySystem" },
  { route: siteData.routes.startFree, key: "nav.startFree", className: "navStartFree" },
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

  return `<header class="siteHeader" data-site-navigation><a class="brand" href="${siteData.routes.home}" aria-label="${escapeHtml(t("brand.homeLabel", language))}" data-i18n-aria-label="brand.homeLabel"><img src="/images/the-secret-logo.png" alt=""><span>UNLEASH YOUR POWER</span></a><div class="siteHeader__actions"><nav class="siteNav" aria-label="${escapeHtml(t("nav.primaryLabel", language))}" data-i18n-aria-label="nav.primaryLabel"><ul>${desktopLinks}</ul></nav>${renderLanguageControls(language, "header")}<div class="mobileNav"><button class="mobileNav__toggle" type="button" aria-expanded="false" aria-controls="mobile-navigation-panel" aria-label="${escapeHtml(t("menu.open", language))}" data-i18n-aria-label="menu.open" data-navigation-toggle><span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span></button><div class="mobileNav__panel" id="mobile-navigation-panel" data-navigation-panel><nav aria-label="${escapeHtml(t("nav.mobileLabel", language))}" data-i18n-aria-label="nav.mobileLabel"><ul>${mobileLinks}</ul></nav>${renderLanguageControls(language, "mobile")}</div></div></div></header>`;
}

export function renderFooter({ language = "en", route = "" } = {}) {
  const links = renderRouteLinks(footerNavigationItems, route, language);

  return `<footer class="siteFooter"><div class="siteFooter__mission"><a class="siteFooter__brand" href="${siteData.routes.home}">Unleash Your Power</a><p data-i18n="footer.mission">${escapeHtml(t("footer.mission", language))}</p></div><nav class="siteFooter__nav" aria-label="${escapeHtml(t("nav.footerLabel", language))}" data-i18n-aria-label="nav.footerLabel"><ul>${links}</ul></nav><div class="siteFooter__meta">${renderLanguageControls(language, "footer")}<nav aria-label="${escapeHtml(t("nav.legalLabel", language))}" data-i18n-aria-label="nav.legalLabel"><a href="${siteData.routes.privacy}" data-i18n="footer.privacy">${escapeHtml(t("footer.privacy", language))}</a><a href="${siteData.routes.terms}" data-i18n="footer.terms">${escapeHtml(t("footer.terms", language))}</a></nav><p data-i18n="footer.copyright">${escapeHtml(t("footer.copyright", language))}</p></div></footer>`;
}
