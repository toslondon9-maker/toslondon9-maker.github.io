# Core Journey Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the shorter conversion-focused homepage and the canonical Start Free, Master Key System, Coaching, About Tariq, Resources and Book / Contact pages in English and Spanish.

**Architecture:** Each page renderer consumes shared locked data and translation content from the Platform Foundation. Long material lives in structured records and renders through progressively enhanced accordions or tabs while remaining usable without JavaScript.

**Tech Stack:** Node.js built-ins, static HTML5, shared CSS, browser-native ES modules, JSON, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-08-18-premium-platform-redesign-design.md`

## Global Constraints

- Complete `docs/superpowers/plans/2026-08-18-platform-foundation.md` first.
- Preserve the approved Haanel/Tariq portrait asset and cream/portrait/navy message sequence exactly once.
- Preserve all locked prices and week ranges; do not restore the payment plan.
- Move unique material before removing it from an old location.
- English and Spanish must be complete before a page is publishable.
- Essential page content must work without JavaScript.
- Use test-first development and one focused commit per task.

---

### Task 1: Build the Concise Homepage

**Files:**
- Create: `src/pages/home.mjs`
- Create: `content/pages/home.mjs`
- Create: `tests/home-page.test.mjs`
- Modify: `src/routes.mjs`
- Modify: `assets/platform.css`

**Interfaces:**
- Produces: `renderHome({ language }) -> string`.
- Consumes: shared `siteData`, `t`, `renderPage`, approved `/images/haanel-tariq-portraits.jpeg` and existing brand assets.

- [ ] **Step 1: Write the failing homepage structure test**

```js
test("homepage follows the approved concise journey", () => {
  const html = renderHome({ language: "en" });
  const sections = [...html.matchAll(/<section[^>]+data-home-section="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(sections, ["hero", "journey", "start-free", "master-key", "origins", "coaching", "mentors", "next-step"]);
  assert.equal((html.match(/haanel-tariq-portraits\.jpeg/g) ?? []).length, 2);
  assert.match(html, /Start Free for 7 Days/);
  assert.match(html, /Explore the 24-Week Journey/);
});
```

- [ ] **Step 2: Run and confirm missing-renderer failure**

Run: `node --test --test-isolation=none tests/home-page.test.mjs`
Expected: FAIL because the renderer does not exist.

- [ ] **Step 3: Implement the eight concise sections**

Use the final H1 “Unleash Your Power” and the three-line supporting idea: change how you think, act and create results. Journey labels use one sentence each. Taster shows titles only. The origins section renders cream prelude, portrait pair and navy statement once. Coaching and mentor sections are teasers, not full detail.

- [ ] **Step 4: Add full Spanish homepage content**

Use concise natural copy such as “Cambia tu forma de pensar. Cambia tu forma de actuar. Cambia los resultados que creas.” Keep the independent-coaching disclaimer equivalent in meaning.

- [ ] **Step 5: Run tests and responsive inspection**

Run: `node --test --test-isolation=none tests/home-page.test.mjs tests/i18n.test.mjs`
Inspect: 390 × 844 and 1440 × 1000; no clipped names, faces, CTAs or overflow.

- [ ] **Step 6: Commit**

```bash
git add src/pages/home.mjs content/pages/home.mjs src/routes.mjs assets/platform.css tests/home-page.test.mjs
git commit -m "Build concise transformation homepage"
```

### Task 2: Build the Seven-Day Start Free Experience

**Files:**
- Create: `content/taster/day-01.json` through `content/taster/day-07.json`
- Create: `src/pages/start-free.mjs`
- Create: `assets/accordions.mjs`
- Create: `tests/start-free.test.mjs`
- Modify: `src/routes.mjs`
- Modify: `assets/platform.css`

**Interfaces:**
- Produces seven records with `{ day, title, introduction, reflection, action, es }`.
- Produces: `renderStartFree({ language })` and `mountAccordions(root)`.

- [ ] **Step 1: Write failing data and markup tests**

```js
const titles = ["See What’s Running Your Life", "Take Back Your Attention", "Recognize What Keeps Repeating", "Give Your Mind a Direction", "Become Someone You Can Rely On", "Turn Understanding into Action", "Decide What Happens Next"];
for (let day = 1; day <= 7; day++) test(`taster day ${day} is complete`, () => {
  const item = JSON.parse(readFileSync(new URL(`../content/taster/day-${String(day).padStart(2, "0")}.json`, import.meta.url)));
  assert.equal(item.title, titles[day - 1]);
  assert.ok(item.es.title && item.es.reflection && item.es.action);
});
```

- [ ] **Step 2: Run and observe seven missing-file failures**

Run: `node --test --test-isolation=none tests/start-free.test.mjs`
Expected: FAIL for all absent records.

- [ ] **Step 3: Create records from the approved flyer and existing copy**

Retain approved meaning, use three short reflection prompts maximum and one achievable action per day. Do not invent scientific or therapeutic claims. Day 7 contains the review and “Ready to Go Deeper?” transition.

- [ ] **Step 4: Render accessible accordions**

Each trigger is a `<button>` with `aria-expanded`, `aria-controls` and a stable panel ID. Day titles remain visible when collapsed. With JavaScript disabled, all `<details>` content remains accessible; enhancement may convert behavior without replacing semantics.

- [ ] **Step 5: Run tests and keyboard QA**

Run: `node --test --test-isolation=none tests/start-free.test.mjs tests/navigation.test.mjs`
Verify Enter/Space toggle, visible focus and no repeated sales CTA inside days 1–6.

- [ ] **Step 6: Commit**

```bash
git add content/taster src/pages/start-free.mjs assets/accordions.mjs assets/platform.css src/routes.mjs tests/start-free.test.mjs
git commit -m "Build guided seven-day start experience"
```

### Task 3: Extract the 24-Week Master Key Records

**Files:**
- Create: `tools/extract-master-key-content.mjs`
- Create: `content/master-key/week-01.json` through `content/master-key/week-24.json`
- Create: `tests/master-key-data.test.mjs`

**Interfaces:**
- Produces records with `{ week, title, introduction, lesson, exercise, principles, questions, es }`.
- Consumes only existing repository lesson content; no missing lesson claim may be fabricated.

- [ ] **Step 1: Write failing completeness tests**

```js
for (let week = 1; week <= 24; week++) test(`week ${week} has bilingual approved content`, () => {
  const record = JSON.parse(readFileSync(new URL(`../content/master-key/week-${String(week).padStart(2, "0")}.json`, import.meta.url)));
  assert.equal(record.week, week);
  for (const key of ["title", "introduction", "lesson", "exercise"]) assert.ok(record[key].trim(), `${week}.${key}`);
  for (const key of ["title", "introduction", "lesson", "exercise"]) assert.ok(record.es[key].trim(), `${week}.es.${key}`);
});
```

- [ ] **Step 2: Run and confirm 24 missing-file failures**

Run: `node --test --test-isolation=none tests/master-key-data.test.mjs`
Expected: FAIL for absent records.

- [ ] **Step 3: Implement deterministic extraction**

Parse the existing homepage/RSC curriculum and any available detailed lesson material. The extractor writes English source fields and reports a clear error listing missing weeks/fields. It never generates replacement prose for missing source content.

- [ ] **Step 4: Add reviewed European Spanish fields**

Translate source meaning conservatively. Attribute metaphysical or purported scientific ideas to Haanel/the text. Preserve proper names and chapter numbering.

- [ ] **Step 5: Run source comparison and completeness tests**

Run: `node tools/extract-master-key-content.mjs --check`
Run: `node --test --test-isolation=none tests/master-key-data.test.mjs`
Expected: all 24 records pass and extraction check reports no divergence.

- [ ] **Step 6: Commit**

```bash
git add tools/extract-master-key-content.mjs content/master-key tests/master-key-data.test.mjs
git commit -m "Extract bilingual Master Key week records"
```

### Task 4: Build the Master Key System Education Page

**Files:**
- Create: `src/pages/master-key-system.mjs`
- Create: `content/pages/master-key-system.mjs`
- Create: `tests/master-key-page.test.mjs`
- Modify: `src/routes.mjs`
- Modify: `assets/platform.css`

**Interfaces:**
- Produces: `renderMasterKeySystem({ language, weeks }) -> string`.

- [ ] **Step 1: Write failing page tests**

```js
test("education page exposes 24 compact weeks and practical FAQ", () => {
  const html = renderMasterKeySystem({ language: "en", weeks });
  assert.equal((html.match(/data-master-key-week=/g) ?? []).length, 24);
  assert.match(html, /What Is the Master Key System?/);
  assert.match(html, /How the System Works/);
  assert.match(html, /Can I work at my own pace?/);
  assert.match(html, /independent coaching experience/i);
});
```

- [ ] **Step 2: Run and confirm missing-renderer failure**

Run: `node --test --test-isolation=none tests/master-key-page.test.mjs`
Expected: FAIL because the renderer does not exist.

- [ ] **Step 3: Implement education sections and FAQ**

Explain weekly study, exercise, reflection, application, repetition and progression simply. Render 24 `<details>` cards with title, lesson, exercise, principles and questions; only titles are visible by default. Include the seven specified FAQs and conservative result expectations.

- [ ] **Step 4: Run tests and inspect long-content behavior**

Run: `node --test --test-isolation=none tests/master-key-page.test.mjs tests/master-key-data.test.mjs`
Inspect one open week at 390px and 1440px; no content clipping or giant simultaneous blocks.

- [ ] **Step 5: Commit**

```bash
git add src/pages/master-key-system.mjs content/pages/master-key-system.mjs src/routes.mjs assets/platform.css tests/master-key-page.test.mjs
git commit -m "Build Master Key education page"
```

### Task 5: Build the Canonical Coaching and Pricing Page

**Files:**
- Create: `src/pages/coaching.mjs`
- Create: `content/pages/coaching.mjs`
- Create: `assets/tabs.mjs`
- Create: `tests/coaching-page.test.mjs`
- Modify: `src/routes.mjs`
- Modify: `assets/platform.css`

**Interfaces:**
- Produces: `renderCoaching({ language, siteData })` and `mountTabs(root)`.

- [ ] **Step 1: Write failing commercial and tabs tests**

```js
test("coaching is the accurate canonical offer", () => {
  const html = renderCoaching({ language: "en", siteData });
  for (const text of ["Weeks 1–4", "Weeks 5–11", "Weeks 12–18", "Weeks 19–24", "£97", "£197", "£397", "£497", "£1,188", "£997", "Save £191", "£1,788", "Save £791", "44% off full MSRP"]) assert.ok(html.includes(text), text);
  assert.doesNotMatch(html, /6\s*[×x]\s*£169|£1,014/);
  assert.equal((html.match(/role="tab"/g) ?? []).length, 7);
});
```

- [ ] **Step 2: Run and confirm missing-renderer failure**

Run: `node --test --test-isolation=none tests/coaching-page.test.mjs`
Expected: FAIL.

- [ ] **Step 3: Implement summary cards and seven tab panels**

Collapsed cards show only name, weeks, outcome, founding price and CTA. Full Journey explains both comparisons without misleading urgency. FAQ includes delivery, time, missed weeks, pace, independence and payment workflow.

- [ ] **Step 4: Implement accessible tabs**

Use `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls` and `role="tabpanel"`. Arrow keys move tabs, Home/End jump, Enter/Space activates, and no-JS rendering displays panels as stacked sections.

- [ ] **Step 5: Run arithmetic, interaction and Spanish tests**

Run: `node --test --test-isolation=none tests/coaching-page.test.mjs tests/site-contract.test.mjs tests/i18n.test.mjs`
Expected: PASS and no payment-plan string in preview output.

- [ ] **Step 6: Commit**

```bash
git add src/pages/coaching.mjs content/pages/coaching.mjs assets/tabs.mjs assets/platform.css src/routes.mjs tests/coaching-page.test.mjs
git commit -m "Build canonical coaching and pricing page"
```

### Task 6: Build About Tariq, Resources and Book / Contact

**Files:**
- Create: `src/pages/about-tariq.mjs`
- Create: `src/pages/resources.mjs`
- Create: `src/pages/contact.mjs`
- Create: `content/pages/about-tariq.mjs`
- Create: `content/pages/contact.mjs`
- Create: `content/resources.json`
- Create: `tests/supporting-pages.test.mjs`
- Modify: `src/routes.mjs`
- Modify: `assets/platform.css`

**Interfaces:**
- Produces: `renderAboutTariq`, `renderResources`, `renderContact`.

- [ ] **Step 1: Write failing page and asset tests**

```js
test("contact page uses the real coordination workflow", () => {
  const html = renderContact({ language: "en" });
  assert.match(html, /\+34 611 223 345/);
  assert.match(html, /toslondon9@gmail\.com/);
  assert.match(html, /Zoom.*arranged.*confirmed/is);
  assert.doesNotMatch(html, /instant booking|automatically confirmed/i);
});

test("every available local resource exists", () => {
  for (const item of resources.filter(item => item.status === "available" && item.href.startsWith("/"))) assert.ok(existsSync(new URL(`..${item.href}`, import.meta.url)), item.href);
});

test("resources use five accessible category tabs", () => {
  const html = renderResources({ language: "en", resources });
  for (const label of ["Workbooks", "Audio", "Exercises", "Downloads", "AI Tools"]) assert.ok(html.includes(label));
  assert.equal((html.match(/role="tab"/g) ?? []).length, 5);
});
```

- [ ] **Step 2: Run and confirm missing-renderer/data failures**

Run: `node --test --test-isolation=none tests/supporting-pages.test.mjs`
Expected: FAIL.

- [ ] **Step 3: Build About Tariq from existing supported copy**

Use the six approved sections and existing owner-authored material. Do not add credentials, awards, customer outcomes or qualifications. Add approved Tariq imagery with responsive sizes and descriptive alt text.

- [ ] **Step 4: Build the resource registry and accessible tabbed page**

Correct `/audio/my-story-theme.m4a` to `/audio/my-story-theme.mp3`. Categorise workbooks, audio, exercises, downloads and guided tools. Render the five categories with the same keyboard-accessible tab behavior defined for Coaching. Mark a missing resource with `status:"unavailable"` and render “Currently unavailable” without a broken link.

- [ ] **Step 5: Build the honest contact workflow**

Separate Book a Session, WhatsApp, Email, Zoom and Payment. Use `https://wa.me/34611223345` and the approved mail address. State that session time and private Zoom access are coordinated after confirmation and payment is arranged through the existing approved process.

- [ ] **Step 6: Run tests, click every action and commit**

Run: `node --test --test-isolation=none tests/supporting-pages.test.mjs tests/i18n.test.mjs`
Expected: PASS.

```bash
git add src/pages/about-tariq.mjs src/pages/resources.mjs src/pages/contact.mjs content/pages/about-tariq.mjs content/pages/contact.mjs content/resources.json assets/platform.css src/routes.mjs tests/supporting-pages.test.mjs
git commit -m "Build founder resources and contact pages"
```

### Task 7: Complete Legal, Student and Referral Integration

**Files:**
- Create: `src/pages/privacy.mjs`
- Create: `src/pages/terms.mjs`
- Modify: `src/routes.mjs`
- Modify: `content/translations.mjs`
- Modify: `tests/supporting-pages.test.mjs`

**Interfaces:**
- Produces canonical privacy and terms renderers and preserved route entries for `/live-coaching/` and `/referral/`.

- [ ] **Step 1: Add failing legal and preserved-route tests**

```js
test("legal and existing specialist routes remain reachable", async () => {
  const result = await buildSite({ outputRoot: tempRoot });
  for (const route of ["privacy/index.html", "terms/index.html", "live-coaching/index.html", "referral/index.html"]) assert.ok(result.files.some(file => file.endsWith(route)), route);
});
```

- [ ] **Step 2: Run and verify missing terms-route failure**

Run: `node --test --test-isolation=none tests/supporting-pages.test.mjs`
Expected: FAIL because terms is absent.

- [ ] **Step 3: Add bilingual legal pages and shared chrome**

Preserve existing privacy meaning, educational disclaimer, independent status and contact rights. Terms cover educational scope, purchasing workflow, external services and no guaranteed outcomes. Do not draft jurisdiction-specific promises beyond existing supported wording.

- [ ] **Step 4: Preserve specialist routes**

Retain the enrolled-student session hub and referral content during this release. Add shared navigation/footer without exposing private Zoom details or changing referral terms.

- [ ] **Step 5: Run route tests and commit**

Run: `node --test --test-isolation=none tests/supporting-pages.test.mjs tests/build-site.test.mjs`
Expected: PASS.

```bash
git add src/pages/privacy.mjs src/pages/terms.mjs src/routes.mjs content/translations.mjs tests/supporting-pages.test.mjs
git commit -m "Integrate legal student and referral routes"
```

## Core pages completion gate

Run:

```bash
node --test --test-isolation=none tests/*.test.mjs
node tools/build-site.mjs --check
rg -n "6\s*[×x]\s*£169|£1,014|Weeks 5–9|Weeks 10–18" .build-preview
git diff --check
```

Expected: all tests pass, the prohibited search returns no matches and every preview route is complete in English and Spanish.
