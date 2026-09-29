import { siteData as canonicalSiteData } from "../../content/site-data.mjs";
import { sessionHubPage } from "./session-hub.mjs";

export const unlistedSessionHubRoute = "/members-study-room-7f3k/";

export function unlistedSessionHubPage(data = canonicalSiteData, language = "en") {
  const page = sessionHubPage(data, language);
  const notice = language === "es"
    ? "Enlace de acceso no listado. Esta ruta no es autenticación segura; compártela solo con las personas autorizadas."
    : "Unlisted access link. This route is not secure authentication; share it only with authorised people.";

  return {
    ...page,
    route: unlistedSessionHubRoute,
    body: page.body.replace('<main class="sessionHub"', `<main class="sessionHub unlistedSessionHub" data-unlisted-access="true"`).replace("</main>", `<aside class="sessionHub__note unlistedSessionHub__notice"><strong>${language === "es" ? "Acceso no listado" : "Unlisted access"}</strong> ${notice}</aside></main>`),
  };
}
