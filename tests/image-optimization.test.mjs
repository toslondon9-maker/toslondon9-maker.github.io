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
