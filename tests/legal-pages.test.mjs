import assert from "node:assert/strict";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { routeRenderers } from "../src/routes.mjs";

test("Privacy page gives visitors the dated, practical privacy information they need", () => {
  const page = routeRenderers[siteData.routes.privacy](siteData);

  assert.match(page.body, /<h1[^>]*>PRIVACY POLICY<\/h1>/);
  assert.match(page.body, /Last updated: 1 September 2026/);
  for (const heading of ["Who We Are", "Information You Provide", "Cookies and Analytics", "AI Mentor and AI Services", "Your Privacy Rights", "Contact Us"]) {
    assert.match(page.body, new RegExp(`<h2>${heading}<\\/h2>`));
  }
  assert.match(page.body, /do not currently use website analytics or advertising tracking cookies/i);
  assert.match(page.body, /toslondon9@gmail\.com/);
  assert.match(page.body, /first name, surname, email address, WhatsApp number/i);
  assert.match(page.body, /private Google Sheet/i);
  assert.match(page.body, /email marketing/i);
  assert.match(page.body, /yes-or-no choice about optional email marketing/i);
  assert.match(page.body, /access, correction or deletion/i);
  assert.doesNotMatch(page.body, /100% GDPR compliant/i);
});

test("Terms page makes the educational boundaries and independent status clear", () => {
  const page = routeRenderers[siteData.routes.terms](siteData);

  assert.match(page.body, /<h1[^>]*>TERMS OF USE<\/h1>/);
  assert.match(page.body, /Last updated: 1 September 2026/);
  for (const heading of ["Educational and Coaching Purpose", "No Guaranteed Results", "AI Mentor and AI-Generated Information", "Charles F\. Haanel and Third-Party Materials", "Governing Law", "Contact Us"]) {
    assert.match(page.body, new RegExp(`<h2>${heading}<\\/h2>`));
  }
  assert.match(page.body, /Individual experiences and outcomes will vary\./);
  assert.match(page.body, /not an official product of, or endorsed by, Charles F\. Haanel/i);
  assert.match(page.body, /Helmar Rudolph created, approved, endorsed or is affiliated with Unleash Your Power/i);
  assert.match(page.body, /not professional medical, legal, financial or mental-health advice/i);
});
