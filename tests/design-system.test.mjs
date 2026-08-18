import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const cssUrl = new URL("../assets/platform.css", import.meta.url);

function hexToRgb(value) {
  const [, red, green, blue] = value.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i) ?? [];
  assert.ok(red && green && blue, `${value} must be a six-digit hex colour`);
  return [red, green, blue].map((channel) => Number.parseInt(channel, 16) / 255);
}

function luminance(value) {
  const [red, green, blue] = hexToRgb(value).map((channel) => (
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  ));
  return (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
}

function contrast(first, second) {
  const [lighter, darker] = [luminance(first), luminance(second)].sort((left, right) => right - left);
  return (lighter + 0.05) / (darker + 0.05);
}

function token(css, name) {
  const value = css.match(new RegExp(`${name}:\\s*(#[\\da-f]{6})`, "i"))?.[1];
  assert.ok(value, `missing six-digit ${name} token`);
  return value;
}

test("the design system exposes required tokens and focus treatment", () => {
  const css = readFileSync(cssUrl, "utf8");
  for (const tokenName of ["--ink", "--night", "--gold", "--cream", "--focus-ring", "--space-section", "--radius-card"]) {
    assert.ok(css.includes(tokenName), `missing ${tokenName}`);
  }
  assert.match(css, /:focus-visible\s*\{[^}]*outline:\s*3px solid var\(--focus-ring\)/s);
  const focusRing = token(css, "--focus-ring");
  assert.ok(contrast(focusRing, token(css, "--cream")) >= 3, "focus ring must contrast with cream by at least 3:1");
  assert.ok(contrast(focusRing, token(css, "--night")) >= 3, "focus ring must contrast with navy by at least 3:1");
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
});

test("the design system provides every shared layout and component primitive", () => {
  const css = readFileSync(cssUrl, "utf8");
  for (const className of [
    "siteHeader",
    "siteNav",
    "mobileNav",
    "siteFooter",
    "section",
    "card",
    "button--primary",
    "button--secondary",
    "button--text",
    "tabs",
    "accordion",
  ]) {
    assert.match(css, new RegExp(`\\.${className}(?:[\\s,{.:#\\[])`), `missing .${className}`);
  }

  assert.match(css, /--content-max:\s*1200px/);
  assert.match(css, /--space-section:\s*clamp\(/);
  assert.match(css, /font-family:\s*Georgia\b/);
  assert.match(css, /min-(?:block-size|height):\s*44px/);
  assert.match(css, /overflow-wrap:\s*anywhere/);
  assert.match(css, /max-width:\s*100%/);
  assert.match(css, /height:\s*auto/);
});

test("responsive rules cover every required breakpoint without hiding overflow globally", () => {
  const css = readFileSync(cssUrl, "utf8");
  for (const breakpoint of [1080, 768, 480]) {
    assert.match(css, new RegExp(`@media\\s*\\(max-width:\\s*${breakpoint}px\\)`));
  }
  const desktopMenuSwitch = css.slice(
    css.indexOf("@media (max-width: 1080px)"),
    css.indexOf("@media (max-width: 768px)"),
  );
  assert.match(desktopMenuSwitch, /\.siteNav[\s\S]*?\{[^}]*display:\s*none/s);
  assert.match(desktopMenuSwitch, /\.mobileNav\s*\{[^}]*display:\s*block/s);
  assert.doesNotMatch(css, /(?:html|body|\*)[^{}]*\{[^{}]*overflow-x:\s*hidden/s);
});
