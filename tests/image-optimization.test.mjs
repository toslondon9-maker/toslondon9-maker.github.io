import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { siteData } from "../content/site-data.mjs";
import { renderHome } from "../src/pages/home.mjs";
import { routeRenderers } from "../src/routes.mjs";

const root = process.cwd();
const heroDisplay = "/images/tariq-happiness-harmony-720.webp";
const certificateDisplay = "/images/tariq-master-key-certificate-display.webp";
const certificateOriginal = "/images/tariq-master-key-certificate-restored.png";

test("homepage uses an optimised eager hero image with stable dimensions", () => {
  const html = renderHome({ language: "en" });

  assert.equal(existsSync(path.join(root, heroDisplay)), true);
  assert.match(html, new RegExp(`<source srcset="${heroDisplay.replaceAll("/", "\\/")}" type="image\\/webp">`));
  assert.match(html, /<img[^>]+src="\/images\/tariq-happiness-harmony\.png"[^>]+width="1088"[^>]+height="1445"[^>]+fetchpriority="high"[^>]+decoding="async"[^>]*>/);
  assert.doesNotMatch(html.match(/<div class="homeHero__visual">[\s\S]*?<\/div>/)?.[0] ?? "", /loading="lazy"/);
});

test("About Tariq uses an optimised display certificate while retaining the original viewer", () => {
  const html = routeRenderers[siteData.routes.aboutTariq](siteData).body;

  assert.equal(existsSync(path.join(root, certificateDisplay)), true);
  assert.equal(existsSync(path.join(root, certificateOriginal)), true);
  assert.match(html, new RegExp(`<source srcset="${certificateDisplay.replaceAll("/", "\\/")}" type="image\\/webp">`));
  assert.match(html, /<img[^>]+src="\/images\/tariq-master-key-certificate-restored\.png"[^>]+width="1027"[^>]+height="1532"[^>]+loading="lazy"[^>]+decoding="async"[^>]*>/);
  assert.equal((html.match(/href="\/images\/tariq-master-key-certificate-restored\.png"/g) ?? []).length, 2);
});

test("certificate display preserves its full aspect ratio without cropping", () => {
  const css = readFileSync(path.join(root, "assets", "platform.css"), "utf8");
  assert.match(css, /\.certificateSection__image img\s*\{[^}]*aspect-ratio:\s*1027\s*\/\s*1532[^}]*object-fit:\s*contain/s);
});


test("Master Key premium visuals use lightweight WebP display assets with stable dimensions", () => {
  const html = routeRenderers[siteData.routes.masterKeySystem](siteData).body;
  const files = [
    "master-key-24-week-hero.webp",
    "foundation-chapters-1-4.webp",
    "visualisation-chapters-5-11.webp",
    "concentration-chapters-12-18.webp",
    "contemplation-mastery-chapters-19-24.webp",
  ];

  for (const file of files) {
    const absolute = path.join(root, "images", "master-key-visuals", file);
    assert.equal(existsSync(absolute), true, file);
    assert.ok(readFileSync(absolute).byteLength < 160_000, `${file} should stay lightweight`);
  }

  assert.match(html, /master-key-24-week-hero\.webp[^>]+width="1440"[^>]+height="810"[^>]+fetchpriority="high"/);
  assert.equal((html.match(/master-key-visuals\/[^"]+\.webp/g) ?? []).length, 5);
  assert.equal((html.match(/width="1440" height="810"/g) ?? []).length, 5);
});

test("key landing-page hero images get a high-priority loading hint", () => {
  const startFree = routeRenderers[siteData.routes.startFree](siteData).body;
  const about = routeRenderers[siteData.routes.aboutTariq](siteData).body;

  assert.match(startFree, /free-7-day-taster\.jpeg[^>]+loading="eager"[^>]+fetchpriority="high"/);
  assert.match(about, /tariq-happiness-harmony\.png[^>]+loading="eager"[^>]+fetchpriority="high"/);
});
