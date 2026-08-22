# Platform Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the maintainable static-site foundation, global design system, shared navigation/footer and bilingual runtime used by every redesigned Unleash Your Power page.

**Architecture:** Add a dependency-free source and build layer beside the existing generated export. Shared templates render complete static HTML so essential content does not rely on hydration; small browser modules add progressive enhancement for navigation and language persistence.

**Tech Stack:** Node.js built-ins, static HTML5, CSS, browser-native ES modules, JSON, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-08-18-premium-platform-redesign-design.md`

## Global Constraints

- Preserve the public site while the replacement is built and tested.
- Remain compatible with GitHub Pages and require no paid service, API, database or package installation.
- Tariq is always spelled **Tariq**.
- Preserve the cream, navy and gold brand palette and approved imagery.
- English is default; Spanish uses natural European Spanish and `tú`.
- Keep all commercial values in shared locked data; the removed payment plan must not reappear.
- Use test-first development and one focused commit per task.

---

### Task 1: Capture the Existing Public Contract and Content Map

**Files:**
- Create: `tests/site-contract.test.mjs`
- Create: `content/content-map.json`
- Create: `content/site-data.mjs`

**Interfaces:**
- Produces: `siteData`, the locked names, prices, week ranges, contacts and route definitions consumed by all build tasks.
- Produces: a content map with `{ source, destination, disposition, description }` records.

- [ ] **Step 1: Write the failing contract test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { siteData } from "../content/site-data.mjs";

test("commercial and identity values are locked", () => {
  assert.equal(siteData.founder.firstName, "Tariq");
  assert.deepEqual(siteData.stages.map(({ weeks, price }) => [weeks, price]), [
    ["1–4", 97], ["5–11", 197], ["12–18", 397], ["19–24", 497]
  ]);
  assert.deepEqual(siteData.offer, {
    separateTotal: 1188, completePrice: 997, foundingSaving: 191,
    msrpTotal: 1788, msrpSaving: 791, msrpDiscount: 44
  });
  assert.equal(JSON.stringify(siteData).includes("169"), false);
  assert.equal(JSON.stringify(siteData).includes("1,014"), false);
});
```

- [ ] **Step 2: Run the test and verify the missing-module failure**

Run: `node --test --test-isolation=none tests/site-contract.test.mjs`
Expected: FAIL because `content/site-data.mjs` does not exist.

- [ ] **Step 3: Add the locked shared data**

```js
export const siteData = Object.freeze({
  founder: { firstName: "Tariq", fullName: "Tariq Saddique" },
  contact: { email: "toslondon9@gmail.com", whatsapp: "+34 611 223 345" },
  stages: [
    { id: "foundation", name: "Foundation", weeks: "1–4", price: 97, msrp: 147 },
    { id: "visualisation", name: "Visualisation", weeks: "5–11", price: 197, msrp: 297 },
    { id: "concentration", name: "Concentration", weeks: "12–18", price: 397, msrp: 597 },
    { id: "mastery", name: "Contemplation & Mastery", weeks: "19–24", price: 497, msrp: 747 }
  ],
  offer: { separateTotal: 1188, completePrice: 997, foundingSaving: 191, msrpTotal: 1788, msrpSaving: 791, msrpDiscount: 44 }
});
```

- [ ] **Step 4: Record every substantial existing section**

Create `content/content-map.json` with one record for each homepage, coaching, live-coaching, referral and privacy section. Use only these dispositions: `move`, `shorten`, `retain`, `replace`. Map Master Key material to `/master-key-system/`, taster material to `/start-free/`, commercial material to `/coaching/`, founder material to `/about-tariq/`, assets to `/resources/`, mentor prompts to `/ai-mentors/` and contact workflows to `/contact/`.

- [ ] **Step 5: Add and run a content-map completeness test**

```js
test("every mapped section has one canonical destination", () => {
  const map = JSON.parse(readFileSync(new URL("../content/content-map.json", import.meta.url)));
  assert.ok(map.length >= 20);
  for (const item of map) {
    assert.match(item.source, /^\//);
    assert.match(item.destination, /^\//);
    assert.ok(["move", "shorten", "retain", "replace"].includes(item.disposition));
  }
});
```

- [ ] **Step 6: Run the tests and commit**

Run: `node --test --test-isolation=none tests/site-contract.test.mjs`
Expected: PASS.

```bash
git add content/site-data.mjs content/content-map.json tests/site-contract.test.mjs
git commit -m "Add canonical site data and content map"
```

### Task 2: Build the Static Page Generator

**Files:**
- Create: `src/page-shell.mjs`
- Create: `src/routes.mjs`
- Create: `tools/build-site.mjs`
- Create: `tests/build-site.test.mjs`
- Create: `.build-preview/.gitkeep`

**Interfaces:**
- Produces: `renderPage({ route, language, title, description, body, scripts }) -> string`.
- Produces: `buildSite({ outputRoot, check }) -> { files: string[] }`.
- Consumes: `siteData` and route renderers exported from `src/routes.mjs`.

- [ ] **Step 1: Write failing generator tests**

```js
test("renderPage emits semantic standalone HTML", () => {
  const html = renderPage({ route: "/start-free/", language: "en", title: "Start Free", description: "Begin the free experience.", body: "<main><h1>Start Free</h1></main>", scripts: [] });
  assert.match(html, /^<!doctype html>/i);
  assert.match(html, /<html lang="en">/);
  assert.equal((html.match(/<h1/g) ?? []).length, 1);
  assert.doesNotMatch(html, /__VINEXT_RSC_CHUNKS__/);
});
```

- [ ] **Step 2: Run and confirm missing exports**

Run: `node --test --test-isolation=none tests/build-site.test.mjs`
Expected: FAIL because the generator modules do not exist.

- [ ] **Step 3: Implement the page shell**

`renderPage` must escape title/description attribute content, add `/assets/platform.css`, preload only the logo, include shared navigation/footer renderers, add module scripts with `defer` semantics, and return a complete document. Essential copy must exist in the HTML response.

- [ ] **Step 4: Implement route-to-file generation**

Map `/` to `index.html` and `/name/` to `name/index.html`. Build into `.build-preview/` by default. `--write-public` may target the repository only after tests pass. `--check` builds twice into separate temporary directories and exits non-zero if file lists or hashes differ.

- [ ] **Step 5: Run generator tests and idempotence**

Run: `node --test --test-isolation=none tests/build-site.test.mjs`
Run: `node tools/build-site.mjs --check`
Expected: PASS and `Build is deterministic`.

- [ ] **Step 6: Commit**

```bash
git add src/page-shell.mjs src/routes.mjs tools/build-site.mjs tests/build-site.test.mjs .build-preview/.gitkeep
git commit -m "Add deterministic static page generator"
```

### Task 3: Create the Shared Premium Design System

**Files:**
- Create: `assets/platform.css`
- Create: `tests/design-system.test.mjs`

**Interfaces:**
- Produces: CSS tokens and shared classes `.siteHeader`, `.siteNav`, `.mobileNav`, `.siteFooter`, `.section`, `.card`, `.button--primary`, `.button--secondary`, `.button--text`, `.tabs`, `.accordion`.

- [ ] **Step 1: Write failing design-contract tests**

```js
test("the design system exposes required tokens and focus treatment", () => {
  const css = readFileSync(new URL("../assets/platform.css", import.meta.url), "utf8");
  for (const token of ["--ink", "--night", "--gold", "--cream", "--space-section", "--radius-card"]) assert.ok(css.includes(token));
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
});
```

- [ ] **Step 2: Run and observe missing-file failure**

Run: `node --test --test-isolation=none tests/design-system.test.mjs`
Expected: FAIL because `assets/platform.css` does not exist.

- [ ] **Step 3: Implement tokens and primitives**

Define a maximum content width of `1200px`, responsive section spacing with `clamp()`, Georgia display typography, system sans body typography, 44-pixel control minimums, consistent card radii/shadows and three CTA variants. Add `overflow-wrap:anywhere` to card copy and `max-width:100%;height:auto` to media.

- [ ] **Step 4: Add responsive and reduced-motion rules**

Use breakpoints at 1080, 768 and 480 pixels. Prevent horizontal overflow without applying `overflow-x:hidden` as a blanket bug mask. Disable non-essential transitions when reduced motion is requested.

- [ ] **Step 5: Run tests and commit**

Run: `node --test --test-isolation=none tests/design-system.test.mjs`
Expected: PASS.

```bash
git add assets/platform.css tests/design-system.test.mjs
git commit -m "Add premium responsive design system"
```

### Task 4: Add Shared Navigation and Footer

**Files:**
- Create: `src/shared-chrome.mjs`
- Create: `assets/site-navigation.mjs`
- Create: `tests/navigation.test.mjs`
- Modify: `src/page-shell.mjs`

**Interfaces:**
- Produces: `renderHeader({ route, language })` and `renderFooter({ language })`.
- Produces browser behavior `mountNavigation(document)`.

- [ ] **Step 1: Write failing navigation tests**

```js
test("global navigation exposes every required destination", () => {
  const html = renderHeader({ route: "/", language: "en" });
  for (const href of ["/", "/start-free/", "/master-key-system/", "/ai-mentors/", "/coaching/", "/resources/", "/about-tariq/", "/faq/", "/contact/"]) assert.match(html, new RegExp(`href="${href}"`));
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, />EN<.*>ES</s);
});
```

- [ ] **Step 2: Run and verify missing-export failure**

Run: `node --test --test-isolation=none tests/navigation.test.mjs`
Expected: FAIL because `src/shared-chrome.mjs` does not exist.

- [ ] **Step 3: Implement shared semantic chrome**

Render one desktop navigation list, one menu button and one mobile panel from the same route array. Mark the current route with `aria-current="page"`. Render a compact footer containing mission, primary routes, language controls, privacy, terms and copyright.

- [ ] **Step 4: Implement mobile behavior**

`mountNavigation` toggles `aria-expanded`, the `hidden` attribute and body scroll lock; closes on Escape, outside click and link activation; restores focus to the menu button. Do not use clickable `div` elements.

- [ ] **Step 5: Run tests and commit**

Run: `node --test --test-isolation=none tests/navigation.test.mjs tests/build-site.test.mjs`
Expected: PASS.

```bash
git add src/shared-chrome.mjs src/page-shell.mjs assets/site-navigation.mjs tests/navigation.test.mjs
git commit -m "Add accessible global navigation and footer"
```

### Task 5: Add the English/Spanish Content and Language Runtime

**Files:**
- Create: `content/translations.mjs`
- Create: `assets/site-language.mjs`
- Create: `tests/i18n.test.mjs`
- Modify: `src/page-shell.mjs`
- Modify: `src/shared-chrome.mjs`

**Interfaces:**
- Produces: `t(key, language)`, `hasTranslation(key)`, `getLanguage(storage)`, `setLanguage(language, storage, document)` and `localizeDocument(document, language)`.

- [ ] **Step 1: Write failing translation tests**

```js
test("core conversion copy has natural Spanish", () => {
  assert.equal(t("cta.startFree", "es"), "Empieza gratis durante 7 días");
  assert.equal(t("cta.exploreJourney", "es"), "Descubre el recorrido de 24 semanas");
  assert.equal(t("cta.bookSession", "es"), "Reserva una sesión");
  assert.notEqual(t("home.hero.title", "en"), t("home.hero.title", "es"));
});
```

- [ ] **Step 2: Run and confirm missing-module failure**

Run: `node --test --test-isolation=none tests/i18n.test.mjs`
Expected: FAIL because the translation module does not exist.

- [ ] **Step 3: Implement the central registry**

Store entries as `{ en, es }`. Keep names, prices, URLs and numeric ranges in `siteData`, not translations. `t` throws in build/test mode for a missing key and falls back to English in the browser only after logging one concise warning.

- [ ] **Step 4: Implement persistence and DOM updates**

Use storage key `uyp.language`. Accept only `en` or `es`; default to `en` when storage is absent, corrupt or blocked. Update `document.documentElement.lang`, `[data-i18n]`, `[data-i18n-placeholder]`, title, meta description and selected switch state. Preserve the current route.

- [ ] **Step 5: Add complete shared chrome translations**

Translate all navigation, footer, language-control and shared CTA strings. Spanish uses `tú` consistently and keeps “Master Key System”, “Charles F. Haanel”, “Helmar Rudolph” and “Tariq Saddique” unchanged.

- [ ] **Step 6: Run tests and commit**

Run: `node --test --test-isolation=none tests/i18n.test.mjs tests/navigation.test.mjs tests/build-site.test.mjs`
Expected: PASS.

```bash
git add content/translations.mjs assets/site-language.mjs src/page-shell.mjs src/shared-chrome.mjs tests/i18n.test.mjs
git commit -m "Add persistent English and Spanish foundation"
```

### Task 6: Generate and Inspect the Route Shells

**Files:**
- Modify: `src/routes.mjs`
- Modify: `tools/build-site.mjs`
- Modify: `tests/build-site.test.mjs`

**Interfaces:**
- Produces: complete route shells for all public destinations, each with unique title, description and H1.

- [ ] **Step 1: Add failing route-coverage tests**

```js
test("every public route builds with unique metadata and one H1", async () => {
  const result = await buildSite({ outputRoot: tempRoot });
  assert.equal(result.files.filter(file => file.endsWith("index.html")).length, 13);
  const pages = result.files.filter(file => file.endsWith("index.html")).map(file => readFileSync(file, "utf8"));
  assert.equal(new Set(pages.map(page => page.match(/<title>(.*?)<\/title>/)?.[1])).size, pages.length);
  for (const page of pages) assert.equal((page.match(/<h1[ >]/g) ?? []).length, 1);
});
```

- [ ] **Step 2: Run and verify route-count failure**

Run: `node --test --test-isolation=none tests/build-site.test.mjs`
Expected: FAIL until every route renderer exists.

- [ ] **Step 3: Add purposeful route shells**

Each shell includes its final H1, one-sentence purpose and canonical next action, not generic placeholder text. Keep shells in preview output only until the Core Journey Pages plan fills and approves them.

- [ ] **Step 4: Build twice and compare hashes**

Run: `node tools/build-site.mjs --check`
Expected: deterministic output and no modification to public files.

- [ ] **Step 5: Perform responsive shell inspection**

Serve `.build-preview/` and inspect 390 × 844 and 1440 × 1000. Confirm the header, menu, language switch and footer fit without horizontal overflow; keyboard focus reaches and exits the mobile menu correctly.

- [ ] **Step 6: Commit**

```bash
git add src/routes.mjs tools/build-site.mjs tests/build-site.test.mjs
git commit -m "Generate complete bilingual route shells"
```

## Foundation completion gate

Run:

```bash
node --test --test-isolation=none tests/site-contract.test.mjs tests/build-site.test.mjs tests/design-system.test.mjs tests/navigation.test.mjs tests/i18n.test.mjs
node tools/build-site.mjs --check
git diff --check
```

Expected: zero failures, deterministic preview output and no public-site replacement yet.
