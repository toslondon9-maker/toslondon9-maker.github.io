function xmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function indexableRoutes(siteData) {
  const routes = [
    ...Object.values(siteData.routes).filter((route) => route !== siteData.routes.liveCoaching),
    ...siteData.experienceRoutes,
  ];

  if (new Set(routes).size !== routes.length) throw new Error("Sitemap routes must be unique");
  return routes;
}

export function renderSitemap(siteData) {
  const baseUrl = new URL(siteData.sitemap.baseUrl);
  const lastModified = siteData.sitemap.lastModified;

  if (baseUrl.protocol !== "https:") throw new Error("Sitemap base URL must use HTTPS");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(lastModified)) throw new Error("Sitemap lastmod must be an ISO date");

  const entries = indexableRoutes(siteData).map((route) => {
    const location = new URL(route, baseUrl).href;
    return `  <url>\n    <loc>${xmlEscape(location)}</loc>\n    <lastmod>${lastModified}</lastmod>\n  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
}
