import { siteData } from "../../content/site-data.mjs";
import { t } from "../../content/translations.mjs";

const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

export function resourcesPage(data = siteData, language = "en") {
  const groups = [
    ["STUDY", "Master Key supporting material.", `<a href="${data.routes.masterKeySystem}">Explore the 24-week Master Key curriculum</a><a href="${data.routes.getTheBook}">Get your Master Key System book</a>`],
    ["PRACTISE", "Exercises and workbooks.", `<a href="${data.routes.startFree}">Start the free 7-day experience</a><a href="/downloads/seven-day-experience-workbook-en.pdf" download>Download the English workbook</a>`],
    ["LISTEN", "Audio, meditation and focus material.", `<a href="${data.routes.startFree}">Use the guided daily practice</a>`],
    ["REFLECT", "Reflection tools.", `<a href="${data.routes.masterKeySystem}">Reflect with the weekly questions</a><a href="/downloads/mks-end-result.pdf" download>Download the 24-Week End Result</a><p class="resourcesPage__quote">“All life and all power is from within.” <span>— Charles F. Haanel, <em>The Master Key System</em>, Part Five</span></p>`],
    ["EXPLORE", "Supporting external resources.", `<a href="${data.routes.aiMentors}">Open the free AI Mentor prompt builder</a>`],
  ];
  const cards = groups.map(([title, intro, links]) => `<section class="resourcesPage__group"><h2>${title}</h2><p>${intro}</p><div class="resourcesPage__links">${links}</div></section>`).join("");
  return { route: data.routes.resources, language, title: t("route.resources.metaTitle", language), description: t("route.resources.metaDescription", language), titleKey: "route.resources.metaTitle", descriptionKey: "route.resources.metaDescription", body: `<main><article class="resourcesPage"><p class="eyebrow">UNLEASH YOUR POWER</p><h1>${esc(t("route.resources.heading", language))}</h1><p class="routeShell__purpose">${esc(t("route.resources.purpose", language))}</p><div class="resourcesPage__grid">${cards}</div><details class="resourcesPage__optional"><summary>Optional: 3-Day Word Audit</summary><p>This optional resource is currently being prepared. The free 7-day experience remains available above.</p></details></article></main>`, scripts: [] };
}
