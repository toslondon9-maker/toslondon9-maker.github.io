# Consolidation, QA and Publication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate duplicate content, prove the complete bilingual platform against the approved specification, replace the public static export safely and verify the GitHub Pages deployment.

**Architecture:** Automated audits validate content ownership, assets, internal/external destinations, accessibility contracts, SEO metadata and deterministic output. Browser QA then verifies real interactions at representative viewports before the generated preview replaces public files in one reviewed release.

**Tech Stack:** Node.js built-ins, static HTML/CSS/ES modules, local HTTP server, browser automation, Git, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-08-18-premium-platform-redesign-design.md`

## Global Constraints

- Complete the Platform Foundation, Core Journey Pages and Guided Mentors plans first.
- Preserve approved content, imagery, pricing and contact destinations.
- Do not publish until Tariq receives and approves the exact final diff summary.
- Do not silently remove unique old content or publish broken resource links.
- No payment-plan copy, paid AI dependency, API key or impersonation language may exist.
- All public pages must work at 320, 375, 390, 768, 1024 and 1440 pixels.
- Use test-first development for every defect found during audit.

---

### Task 1: Enforce Canonical Content Ownership and Remove Duplicates

**Files:**
- Create: `tests/content-consolidation.test.mjs`
- Modify: `content/content-map.json`
- Modify as indicated: `src/pages/*.mjs`, `content/pages/*.mjs`

**Interfaces:**
- Consumes generated preview HTML and `content/content-map.json`.
- Produces a verified one-to-one canonical content map.

- [ ] **Step 1: Write failing ownership tests**

```js
test("detailed content appears only on its canonical page", () => {
  assert.equal(countAcrossPages("Four stages separately:"), 1);
  assert.equal(countAcrossPages("Tariq’s Story"), 1);
  assert.equal(countAcrossPages("Delete My Saved Progress"), 1);
  assert.equal(countAcrossPages("Day 1 — See What’s Running Your Life", { fullBody:true }), 1);
});

test("every mapped old section has a completed disposition", () => {
  for (const item of contentMap) assert.ok(item.verified === true, `${item.source}: ${item.description}`);
});
```

- [ ] **Step 2: Run and capture each duplicate/unverified mapping**

Run: `node --test --test-isolation=none tests/content-consolidation.test.mjs`
Expected: FAIL with the exact duplicate or unverified records.

- [ ] **Step 3: Relocate or shorten each failing item**

Keep the full version only at its canonical destination. Replace secondary copies with a maximum two-sentence teaser and canonical link. Mark the mapping `verified:true` only after the destination contains the unique meaning.

- [ ] **Step 4: Run the test and inspect homepage length**

Run: `node --test --test-isolation=none tests/content-consolidation.test.mjs tests/home-page.test.mjs`
Expected: PASS and homepage contains only the eight designed sections.

- [ ] **Step 5: Commit**

```bash
git add content/content-map.json src/pages content/pages tests/content-consolidation.test.mjs
git commit -m "Consolidate content into canonical pages"
```

### Task 2: Audit Every Link, Asset and Workflow

**Files:**
- Create: `tools/audit-site.mjs`
- Create: `tests/links-and-assets.test.mjs`
- Modify as findings require: `content/resources.json`, `src/pages/*.mjs`, `content/site-data.mjs`

**Interfaces:**
- Produces: `auditSite(root) -> { brokenInternal, missingAssets, invalidContacts, duplicateIds }`.

- [ ] **Step 1: Write failing audit tests**

```js
test("generated site has no broken internal link or missing asset", () => {
  const result = auditSite(previewRoot);
  assert.deepEqual(result.brokenInternal, []);
  assert.deepEqual(result.missingAssets, []);
  assert.deepEqual(result.duplicateIds, []);
});

test("approved contact workflows are preserved", () => {
  const links = collectLinks(previewRoot);
  assert.ok(links.includes("mailto:toslondon9@gmail.com"));
  assert.ok(links.some(link => link.startsWith("https://wa.me/34611223345")));
  assert.equal(links.some(link => /zoom\.us\/j\//.test(link)), false);
});

test("payment actions are valid or use the approved enrolment fallback", () => {
  const paymentActions = collectPaymentActions(previewRoot);
  assert.ok(paymentActions.length >= 1);
  for (const action of paymentActions) assert.ok(action.validPayPal || action.approvedContactFallback, action.href);
});
```

- [ ] **Step 2: Run and observe known audio failure first**

Run: `node --test --test-isolation=none tests/links-and-assets.test.mjs`
Expected: FAIL if any legacy `.m4a` reference or missing route remains.

- [ ] **Step 3: Implement the static auditor**

Resolve root-relative paths against preview output, strip query/hash for file checks, validate fragment targets, enumerate duplicate IDs and compare mail/WhatsApp destinations to `siteData`. Audit any PayPal action for target, amount/currency metadata and return path when present; when those cannot be proven, require the approved contact/enrolment fallback instead of a payment button. Treat other external HTTP links as syntax-valid here; browser QA checks important live destinations.

- [ ] **Step 4: Repair every reported local issue**

Correct audio extensions, route paths, anchors, image references and unavailable resource status. Do not invent a missing file or replace a payment destination without owner evidence.

- [ ] **Step 5: Run tests and commit**

Run: `node tools/audit-site.mjs .build-preview`
Run: `node --test --test-isolation=none tests/links-and-assets.test.mjs`
Expected: empty error arrays and PASS.

```bash
git add tools/audit-site.mjs tests/links-and-assets.test.mjs content/resources.json content/site-data.mjs src/pages
git commit -m "Repair and audit site links and assets"
```

### Task 3: Audit SEO, Semantics and Accessible Interaction Contracts

**Files:**
- Create: `tests/seo-and-accessibility.test.mjs`
- Modify: `src/page-shell.mjs`
- Modify: `src/shared-chrome.mjs`
- Modify as findings require: `src/pages/*.mjs`, `assets/*.mjs`, `assets/*.css`
- Modify: `sitemap.xml`
- Modify: `robots.txt`
- Modify: `404.html`

**Interfaces:**
- Consumes all generated HTML.
- Produces validated metadata, headings, landmarks, alt text and ARIA relationships.

- [ ] **Step 1: Write failing page-level tests**

```js
for (const page of publicPages) test(`${page.route} has a trustworthy document structure`, () => {
  assert.equal(count(page.html, /<h1[ >]/g), 1);
  assert.equal(count(page.html, /<title>/g), 1);
  assert.match(page.html, /<meta name="description" content="[^"]{50,160}"/);
  assert.match(page.html, /<link rel="canonical" href="https:\/\/toslondon9-maker\.github\.io\//);
  assert.match(page.html, /<main[ >]/);
});
```

- [ ] **Step 2: Add relationship tests for controls**

For every `aria-controls`, assert one matching ID. For every tab, assert matching tabpanel. For every non-decorative image, assert meaningful alt text. For every form input, assert a label or accessible name.

- [ ] **Step 3: Run and record exact failures**

Run: `node --test --test-isolation=none tests/seo-and-accessibility.test.mjs`
Expected: FAIL until metadata and relationships are complete.

- [ ] **Step 4: Repair structure and regenerate discovery files**

Give every route a unique English/Spanish title and description, update canonical URLs, sitemap routes, robots reference and 404 navigation. Fix heading skips, missing labels, duplicate IDs and decorative-image alt handling.

- [ ] **Step 5: Run tests and commit**

Run: `node --test --test-isolation=none tests/seo-and-accessibility.test.mjs`
Expected: PASS.

```bash
git add tests/seo-and-accessibility.test.mjs src assets sitemap.xml robots.txt 404.html
git commit -m "Complete SEO and accessibility contracts"
```

### Task 4: Audit Performance and Static Output Hygiene

**Files:**
- Create: `tests/performance-contract.test.mjs`
- Modify: `tools/build-site.mjs`
- Modify as findings require: `src/page-shell.mjs`, `src/pages/*.mjs`, `assets/*.css`, `assets/*.mjs`

**Interfaces:**
- Produces performance budgets enforced against generated output.

- [ ] **Step 1: Write failing static budgets**

```js
test("pages load only shared bounded assets", () => {
  for (const page of publicPages) {
    assert.ok((page.html.match(/<script /g) ?? []).length <= 4, page.route);
    assert.equal((page.html.match(/__VINEXT_RSC_CHUNKS__/g) ?? []).length, 0, page.route);
    for (const image of extractImages(page.html).filter(image => image.belowFold)) assert.equal(image.loading, "lazy");
  }
});
```

- [ ] **Step 2: Run and identify budget failures**

Run: `node --test --test-isolation=none tests/performance-contract.test.mjs`
Expected: FAIL on any duplicated/bundled script or eager below-fold image.

- [ ] **Step 3: Remove redundant runtime output**

Do not copy obsolete Vinext client bundles or RSC payloads into redesigned preview pages. Deduplicate shared module imports, lazy-load below-fold imagery, retain explicit dimensions to prevent layout shift and avoid autoplay media.

- [ ] **Step 4: Run tests, compare output sizes and commit**

Run: `node --test --test-isolation=none tests/performance-contract.test.mjs`
Run: `node tools/build-site.mjs --check`
Expected: PASS and deterministic output.

```bash
git add tests/performance-contract.test.mjs tools/build-site.mjs src assets
git commit -m "Optimize static output and media loading"
```

### Task 5: Run the Complete Automated Release Audit

**Files:**
- Modify as defects require: production files and the narrow regression test that reproduces each defect

**Interfaces:**
- Produces a complete green automated release candidate.

- [ ] **Step 1: Run every test from a fresh process**

Run: `node --test --test-isolation=none tests/*.test.mjs`
Expected: zero failures.

- [ ] **Step 2: Run deterministic build and site audit**

Run: `node tools/build-site.mjs --check`
Run: `node tools/audit-site.mjs .build-preview`
Expected: deterministic output; zero broken links, missing available assets, duplicate IDs or invalid contacts.

- [ ] **Step 3: Run prohibited-content scans**

Run:

```bash
rg -n "6\s*[×x]\s*£169|£1,014|Weeks 5–9|Weeks 10–18|OPENAI_API_KEY|sk-[A-Za-z0-9_-]{20,}|live AI|I am Charles|I am Helmar" .build-preview assets content src
```

Expected: no matches.

- [ ] **Step 4: Run spelling and route scans**

Assert no misspelling variants of Tariq and that all navigation/footer routes appear on every public page.

- [ ] **Step 5: Fix each failure with red-green discipline**

For every defect, add or narrow a test that fails for that exact defect, fix the production source, rerun the focused test, then rerun the complete suite.

- [ ] **Step 6: Commit only if defects required changes**

```bash
git add tests src assets content tools
git commit -m "Resolve full release audit findings"
```

### Task 6: Complete Browser QA at Every Required Viewport

**Files:**
- Create: `docs/qa/2026-08-18-browser-qa.md`
- Modify as defects require: affected production source and tests

**Interfaces:**
- Produces a signed-off matrix recording route, viewport, language, interaction and result.

- [ ] **Step 1: Serve the preview**

Run: `python -m http.server 8765 --directory .build-preview`.

- [ ] **Step 2: Verify global behavior at 320, 360, 375, 390, 412, 768, 1024 and 1440 pixels**

For every width, record header/menu, footer, horizontal overflow, text clipping, image proportions, CTA spacing and focus visibility. Test both English and Spanish on Home, Start Free, Master Key System, Coaching, AI Mentors and Contact.

- [ ] **Step 3: Verify interactive behavior**

Use keyboard and pointer for menu, language switch, seven-day accordions, 24-week accordions, coaching tabs, resource tabs and all three mentor flows. Confirm Escape, focus restoration, body scroll recovery, 44-pixel targets and no keyboard-obscured action on 390 × 844.

- [ ] **Step 4: Verify failure behavior**

Exercise empty and 600-character mentor inputs, clipboard denial, localStorage denial/corruption, progress deletion and direct/back navigation. Confirm bilingual customer-facing messages and no raw technical error.

- [ ] **Step 5: Verify public destinations without mutating external state**

Open WhatsApp, email, approved source links and any existing payment destination only far enough to verify the destination; do not send messages or complete payment. Confirm Zoom wording contains no public fixed meeting promise.

- [ ] **Step 6: Record console and network results**

Record no missing local assets, uncaught exceptions, failed module loads or unintended external API requests.

- [ ] **Step 7: Fix defects and commit the completed matrix**

For each defect use a focused failing test before production changes. When all rows pass:

```bash
git add docs/qa/2026-08-18-browser-qa.md tests src assets content
git commit -m "Complete responsive browser QA"
```

### Task 7: Prepare the Owner Review Package

**Files:**
- Create: `docs/qa/2026-08-18-final-release-report.md`

**Interfaces:**
- Produces the requested Completed, Moved, Duplicates Removed, New Pages, Fixed, Needs My Input and Warnings report.

- [ ] **Step 1: Generate the final preview into a clean directory**

Run: `node tools/build-site.mjs --output .build-preview-final`.

- [ ] **Step 2: Run fresh verification against final preview**

Run: `node --test --test-isolation=none tests/*.test.mjs`
Run: `node tools/audit-site.mjs .build-preview-final`
Run: `git diff --check`
Expected: zero failures/errors.

- [ ] **Step 3: Write the concise final report**

Populate all seven requested headings from Git diff, content map, tests and browser QA. `Needs My Input` lists only genuine unresolved owner data. `Warnings` lists only limitations that remain true, including that mentors are deterministic £0 guidance rather than live generative AI.

- [ ] **Step 4: Present exact diff before public replacement**

Provide changed-file list, `git diff --stat`, test totals, browser matrix summary, screenshots/local preview and known limitations. Stop and obtain Tariq’s explicit publication approval.

- [ ] **Step 5: Commit the reviewed report after approval**

```bash
git add docs/qa/2026-08-18-final-release-report.md
git commit -m "Add final platform redesign QA report"
```

### Task 8: Replace Public Output and Publish GitHub Pages

**Files:**
- Modify generated public routes/assets according to `tools/build-site.mjs --write-public`

**Interfaces:**
- Consumes approved final preview.
- Produces the public GitHub Pages release.

- [ ] **Step 1: Verify exact repository and target paths**

Run: `git rev-parse --show-toplevel` and `git status --short`. Confirm the public target is the repository root and unrelated owner files are not staged.

- [ ] **Step 2: Generate reviewed output into public paths**

Run: `node tools/build-site.mjs --write-public`. The builder replaces only its declared manifest of routes/assets; it must not recursively delete the repository or untracked owner files.

- [ ] **Step 3: Re-run the complete verification on public paths**

Run: `node --test --test-isolation=none tests/*.test.mjs`
Run: `node tools/audit-site.mjs .`
Run: `node tools/build-site.mjs --check-public`
Run: `git diff --check`
Expected: zero failures and public hashes match the approved preview.

- [ ] **Step 4: Stage only declared release files and inspect**

Run: `git add -- <explicit manifest paths>` followed by `git diff --cached --check` and `git diff --cached --stat`. Confirm no old draft plan, secret, local preview or unrelated file is staged.

- [ ] **Step 5: Commit and push the approved release**

```bash
git commit -m "Launch premium bilingual transformation platform"
git push origin main
```

- [ ] **Step 6: Wait for the exact GitHub Pages run**

Identify the workflow run whose `head_sha` equals the release commit. Require build, deploy and report jobs to complete successfully.

- [ ] **Step 7: Verify the public site with cache-busting URLs**

Check every route returns 200, EN/ES works, the three CTAs resolve, approved pricing is present only on Coaching, prohibited payment-plan/legacy-week text is absent, images/audio load and mentor tools make no external API request.

- [ ] **Step 8: Deliver the final QA report and live link**

Report the commit ID, deployment result, test total, route list and public URL. Do not mark the objective complete until every approved specification requirement is evidenced.

## Final completion gate

Completion requires all automated tests, deterministic build checks, static audits, browser matrix rows, owner diff approval, GitHub Pages jobs and public route checks to pass. Only then may the active goal be marked complete.
