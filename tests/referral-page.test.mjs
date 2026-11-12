import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { referralPage } from "../src/pages/referral.mjs";
import { siteData } from "../content/site-data.mjs";
import { translations } from "../content/translations.mjs";

test("the UYP partner page presents one simple KISS package for every partner type", () => {
  const page = referralPage(siteData);
  assert.match(page.body, /THE UYP PARTNER PROGRAMME/);
  assert.match(page.body, /KISS: Keep It Simple, Stupid\./);
  assert.match(page.body, /One package\. Different ways to collaborate\./);
  assert.match(page.body, /Affiliates/);
  assert.match(page.body, /Collaborators/);
  assert.match(page.body, /Community &amp; strategic partners/);
  assert.match(page.body, /25% commission on eligible referred sales/);
  assert.match(page.body, /£997 sale/);
  assert.match(page.body, /£249\.25 commission/);
  assert.match(page.body, /No earnings are guaranteed/);
  assert.deepEqual(page.scripts, ["/assets/referral.mjs"]);
  assert.deepEqual(page.styles, ["/assets/referral-page.css?v=20261112-kiss-partner-package"]);
});

test("the package keeps one clear referral link builder and share message", () => {
  const page = referralPage(siteData);
  assert.match(page.body, /data-affiliate-code/);
  assert.match(page.body, /data-affiliate-build/);
  assert.match(page.body, /data-affiliate-copy-link/);
  assert.match(page.body, /data-affiliate-whatsapp|data-referral-whatsapp/);
  assert.match(page.body, /data-referral-copy-button/);
  assert.match(page.body, /data-referral-copy/);
  assert.match(page.body, /https:\/\/unleashyourpowerwithtariq\.com\/start-free\//);
});

test("the partner enquiry stays lightweight and supports all three partner types", () => {
  const page = referralPage(siteData);
  assert.match(page.body, /data-affiliate-application/);
  assert.match(page.body, /name="partnerType"/);
  assert.match(page.body, /value="Affiliate"/);
  assert.match(page.body, /value="Collaborator"/);
  assert.match(page.body, /value="Community or strategic partner"/);
  assert.match(page.body, /SEND PARTNER ENQUIRY/);
  assert.match(page.body, /Bespoke campaigns, paid advertising or custom marketing work are discussed separately/);
});

test("existing referral tracking keeps sanitised personal codes", async () => {
  const source = await import("../assets/referral.mjs");
  assert.equal(source.sanitiseAffiliateCode("John Smith"), "john-smith");
  assert.equal(source.buildAffiliateLink("Tariq"), "https://unleashyourpowerwithtariq.com/start-free/?ref=tariq");
  assert.match(decodeURIComponent(source.buildReferralShareUrl(source.buildAffiliateLink("Tariq"))), /start-free\/\?ref=tariq/);
});

test("partner page retains the existing navigation label", () => {
  assert.equal(translations["nav.referral"].en, "Refer & Earn");
});

test("the Master Key article PDF is generated, included in the static build and published for connected hosts", async () => {
  const { buildSite } = await import("../tools/build-site.mjs");
  const { mkdtemp, rm, readFile: read } = await import("node:fs/promises");
  const os = await import("node:os");
  const path = await import("node:path");
  const workflow = await readFile(new URL("../.github/workflows/static-site-build.yml", import.meta.url), "utf8");
  const outputRoot = await mkdtemp(path.join(os.tmpdir(), "uyp-article-pdf-"));
  try {
    const build = await buildSite({ outputRoot });
    const pdfPath = path.join(outputRoot, "downloads/master-key-system-24-week-deep-dive.pdf");
    const pdf = await read(pdfPath);
    assert.ok(pdf.length > 5000);
    assert.equal(pdf.subarray(0, 8).toString(), "%PDF-1.4");
    assert.ok(build.files.includes("downloads/master-key-system-24-week-deep-dive.pdf"));
    assert.match(workflow, /Publish generated Master Key article PDF for connected static hosts/);
    assert.match(workflow, /contents: write/);
    assert.match(workflow, /git add downloads\/master-key-system-24-week-deep-dive\.pdf/);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});
