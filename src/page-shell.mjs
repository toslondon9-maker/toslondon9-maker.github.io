function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderNavigation(route) {
  const links = [
    ["/master-key-system/", "The System"],
    ["/start-free/", "Start Free"],
    ["/coaching/", "Coaching"],
    ["/resources/", "Resources"],
    ["/contact/", "Contact"],
  ];
  const items = links.map(([href, label]) => {
    const current = href === route ? ' aria-current="page"' : "";
    return `<a href="${href}"${current}>${label}</a>`;
  }).join("");

  return `<header class="site-header"><a class="brand" href="/" aria-label="Unleash Your Power home"><img src="/images/the-secret-logo.png" alt="">UNLEASH YOUR POWER</a><nav aria-label="Primary navigation">${items}</nav></header>`;
}

function renderFooter() {
  return `<footer class="site-footer"><p>Unleash Your Power with Tariq Saddique.</p><nav aria-label="Footer navigation"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="/faq/">FAQ</a></nav></footer>`;
}

export function renderPage({ route, language, title, description, body, scripts = [] }) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeLanguage = escapeHtml(language);
  const scriptTags = scripts.map((script) => (
    `<script type="module" src="${escapeHtml(script)}" defer></script>`
  )).join("");

  return `<!doctype html><html lang="${safeLanguage}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${safeTitle}</title><meta name="description" content="${safeDescription}"><link rel="preload" href="/images/the-secret-logo.png" as="image"><link rel="stylesheet" href="/assets/platform.css"></head><body>${renderNavigation(route)}${body}${renderFooter()}${scriptTags}</body></html>`;
}
