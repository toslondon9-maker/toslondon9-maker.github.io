import { siteData } from "../content/site-data.mjs";

const navigationItems = Object.freeze([
  { route: siteData.routes.home, label: "Home" },
  { route: siteData.routes.startFree, label: "Free 7-Day Challenge" },
  { route: siteData.routes.masterKeySystem, label: "24-Week MKS" },
  { route: siteData.routes.aiMentors, label: "AI Mentors" },
  { route: siteData.routes.coaching, label: "Coaching" },
  { route: siteData.routes.resources, label: "Resources" },
  { route: siteData.routes.aboutTariq, label: "About Tariq" },
  { route: siteData.routes.faq, label: "FAQ" },
  { route: siteData.routes.contact, label: "Contact / Book" },
]);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderRouteLinks(route) {
  return navigationItems.map((item) => {
    const current = item.route === route ? ' aria-current="page"' : "";
    return `<li><a href="${escapeHtml(item.route)}"${current}>${escapeHtml(item.label)}</a></li>`;
  }).join("");
}

function renderLanguageControls(language, location) {
  return `<div class="languageSwitch languageSwitch--${location}" role="group" aria-label="Language"><button type="button" data-language="en" aria-pressed="${language === "en"}">EN</button><span aria-hidden="true">|</span><button type="button" data-language="es" aria-pressed="${language === "es"}">ES</button></div>`;
}

export function renderHeader({ route, language = "en" }) {
  const desktopLinks = renderRouteLinks(route);
  const mobileLinks = renderRouteLinks(route);

  return `<header class="siteHeader" data-site-navigation><a class="brand" href="${siteData.routes.home}" aria-label="Unleash Your Power home"><img src="/images/the-secret-logo.png" alt=""><span>UNLEASH YOUR POWER</span></a><div class="siteHeader__actions"><nav class="siteNav" aria-label="Primary navigation"><ul>${desktopLinks}</ul></nav>${renderLanguageControls(language, "header")}<div class="mobileNav"><button class="mobileNav__toggle" type="button" aria-expanded="false" aria-controls="mobile-navigation-panel" aria-label="Open menu" data-navigation-toggle><span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span></button><div class="mobileNav__panel" id="mobile-navigation-panel" data-navigation-panel><nav aria-label="Mobile navigation"><ul>${mobileLinks}</ul></nav>${renderLanguageControls(language, "mobile")}</div></div></div></header>`;
}

export function renderFooter({ language = "en" } = {}) {
  const links = renderRouteLinks("");

  return `<footer class="siteFooter"><div class="siteFooter__mission"><a class="siteFooter__brand" href="${siteData.routes.home}">Unleash Your Power</a><p>An independent coaching experience inspired by the Master Key System.</p></div><nav class="siteFooter__nav" aria-label="Footer navigation"><ul>${links}</ul></nav><div class="siteFooter__meta">${renderLanguageControls(language, "footer")}<nav aria-label="Legal"><a href="${siteData.routes.privacy}">Privacy</a><a href="${siteData.routes.terms}">Terms</a></nav><p>© 2026 Unleash Your Power. All rights reserved.</p></div></footer>`;
}
