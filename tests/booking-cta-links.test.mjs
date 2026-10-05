import assert from "node:assert/strict";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { routeRenderers } from "../src/routes.mjs";

const calendly = "https://calendly.com/tariq-unleashyourpowerwithtariq";

test("booking CTAs use Calendly while the Questions WhatsApp CTA remains WhatsApp", () => {
  const coaching = routeRenderers[siteData.routes.coaching](siteData).body;
  const contact = routeRenderers[siteData.routes.contact](siteData).body;
  const home = routeRenderers["/"](siteData).body;

  for (const html of [coaching, contact]) {
    assert.match(html, new RegExp(`href="${calendly}"[^>]+target="_blank" rel="noopener noreferrer"[^>]+data-i18n="cta\\.bookCall"`));
  }
  assert.doesNotMatch(`${coaching}${contact}`, /data-i18n="cta\.bookCall"[^>]*href="https:\/\/wa\.me/);
  assert.match(home, /href="https:\/\/wa\.me\/[^>]+data-i18n="home\.cta\.whatsappQuestion"/);
});
