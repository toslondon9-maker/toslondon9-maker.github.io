# Master Key Premium Study Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the public Master Key page an accessible premium 24-chapter reading experience without altering its course content.

**Architecture:** `src/pages/master-key-curriculum.mjs` keeps the existing source file as the single curriculum authority and adds only semantic navigation and wrappers. `assets/curriculum.mjs` progressively synchronises selected chapter state. `assets/platform.css` scopes the visual system to `.curriculumPage`.

**Tech Stack:** Static Node.js site generator, HTML details elements, vanilla browser JavaScript, CSS.

**Spec:** `docs/superpowers/specs/2026-08-29-master-key-premium-study-design.md`

## Global Constraints

- Do not edit `content/master-key-curriculum.html` or rewrite approved chapter content.
- Preserve existing navigation, videos, links, Q&A and AI prompt copying.
- Keep the page responsive and accessible without JavaScript.
- Do not alter pricing, homepage, coaching content or other routes.

---

### Task 1: Lock the premium curriculum contract

**Files:**
- Modify: `tests/master-key-curriculum.test.mjs`
- Create: `tests/master-key-study-experience.test.mjs`

**Interfaces:**
- Consumes: `routeRenderers[siteData.routes.masterKeySystem](siteData)`.
- Produces: tests for the header, navigator groups, 24 chapters, practice cards and source integrity.

- [ ] **Step 1: Write failing tests**

```js
assert.match(html, /24 Weeks to Master the Way You Use Your Mind/);
assert.match(html, /FOUNDATION.*Chapters 1–4/s);
assert.equal((html.match(/class="curriculumPractice"/g) ?? []).length, 24);
```

- [ ] **Step 2: Run the focused tests and confirm the assertions fail.**

Run: `node --test --test-isolation=none tests/master-key-study-experience.test.mjs`

- [ ] **Step 3: Add only the renderer markup required by the tests.**

- [ ] **Step 4: Re-run the focused tests and confirm they pass.**

- [ ] **Step 5: Commit the contract and renderer change.**

### Task 2: Add progressive selected-chapter behaviour

**Files:**
- Modify: `assets/curriculum.mjs`
- Modify: `tests/master-key-study-experience.test.mjs`

**Interfaces:**
- Consumes: `data-curriculum-chapter`, navigator links and the current chapter status element rendered in Task 1.
- Produces: opening, active-state synchronisation and local completion toggle without changing curriculum text.

- [ ] **Step 1: Write failing DOM-contract assertions for selected and completion controls.**

```js
assert.match(html, /data-curriculum-status/);
assert.equal((html.match(/data-curriculum-complete/g) ?? []).length, 24);
```

- [ ] **Step 2: Run the focused test and confirm it fails.**

- [ ] **Step 3: Implement the smallest event handlers for links, details toggles and completion buttons.**

- [ ] **Step 4: Re-run the focused tests and confirm they pass.**

- [ ] **Step 5: Commit the enhancement.**

### Task 3: Apply the scoped premium reading system

**Files:**
- Modify: `assets/platform.css`
- Modify: `tests/master-key-study-experience.test.mjs`

**Interfaces:**
- Consumes: classes emitted in Tasks 1–2.
- Produces: high-contrast reading cards, sticky responsive navigator, practice card, polished navigation controls and mobile overflow safeguards.

- [ ] **Step 1: Write failing CSS contract tests for reading measure, contrast surfaces, sticky navigation and mobile horizontal navigation.**

- [ ] **Step 2: Run the focused test and confirm it fails.**

- [ ] **Step 3: Add curriculum-scoped CSS only.**

- [ ] **Step 4: Re-run focused curriculum tests and confirm they pass.**

- [ ] **Step 5: Commit the visual implementation.**

### Task 4: Build, inspect and publish

**Files:**
- Generated: `master-key-system/index.html`

- [ ] **Step 1: Run the focused curriculum tests and the full suite.**
- [ ] **Step 2: Run deterministic build twice, then generate public output once.**
- [ ] **Step 3: Inspect the local page at desktop, tablet and 390px mobile for contrast, clipping and overflow.**
- [ ] **Step 4: Review the diff, commit generated route output and push the focused release.**
- [ ] **Step 5: Verify the live Master Key page and report the commit.**
