import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const cssUrl = new URL("../assets/platform.css", import.meta.url);

test("the design system exposes required tokens and focus treatment", () => {
  const css = readFileSync(cssUrl, "utf8");
  for (const token of ["--ink", "--night", "--gold", "--cream", "--space-section", "--radius-card"]) {
    assert.ok(css.includes(token), `missing ${token}`);
  }
  assert.match(css, /:focus-visible/);
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
  assert.doesNotMatch(css, /(?:html|body|\*)[^{}]*\{[^{}]*overflow-x:\s*hidden/s);
});
