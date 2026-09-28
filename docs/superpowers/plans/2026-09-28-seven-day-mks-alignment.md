# Seven-Day Master Key System Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Align the seven online lessons and downloadable workbook from one bilingual canonical content source while preserving existing site behavior and branding.

**Architecture:** Store all lesson fields and English/Spanish copy in `content/seven-day-canonical.json`. The JavaScript content model and translations expose that source to page renderers and the language switcher, while the Python workbook generator reads it directly. Render the new MKS connection and optional-practice sections from the lesson model and regenerate the existing workbook output.

**Tech Stack:** Node.js ESM, static HTML renderers, CSS, Python ReportLab, JSON, Node test runner, Poppler/PDF inspection.

**Spec:** `docs/superpowers/specs/2026-09-28-seven-day-mks-alignment-design.md`

## Global Constraints

- Do not commit, push, publish, or deploy.
- Keep the main title `7 Days to Change the Way You Use Your Mind` and Spanish title `7 días para cambiar la forma en que usas tu mente`.
- Keep route names, asset filenames, progress-storage keys, registration, analytics, header, logo, navigation, footer, and Day 7 Foundation handoff unchanged.
- Keep core lessons approximately 10–15 minutes; optional MKS practice approximately 5–10 minutes; full optional experience approximately 15–25 minutes per day.
- Paraphrase the supplied PDFs; do not copy large passages or make guarantees.

## Review Focus

- Canonical source drift: tests must compare rendered online fields with workbook input values.
- Optional-practice clarity: tests must prove core action remains separate and completion does not require MKS practice.
- Spanish parity: every new field must have natural Spanish copy and runtime translation keys.
- PDF typography: tests must verify embedded fonts and rendered pages do not show separated glyphs.
- Existing contracts: tests must pin routes, progress keys, registration, analytics privacy, white `SEE ALL 7 DAYS`, and Day 7 coaching behavior.

### Task 1: Establish failing canonical-content tests

**Files:**
- Create: `tests/seven-day-mks-alignment.test.mjs`
- Modify: `tests/workbook-assets.test.mjs` only for parity helpers if needed

- [ ] Add assertions for seven lessons, MKS parts 1–7, required canonical fields, bilingual values, exact title parity, core/optional time wording, and the absence of guarantee language.
- [ ] Add assertions that rendered lesson HTML contains both new labelled sections and the canonical localized values.
- [ ] Add assertions that routes, `Day N of 7`, progress attributes, registration markers, analytics privacy, and Day 7 coaching links remain present.
- [ ] Run `node --test tests/seven-day-mks-alignment.test.mjs`; verify it fails because the new canonical fields and renderer sections do not exist.

### Task 2: Add the bilingual canonical content source

**Files:**
- Create: `content/seven-day-canonical.json`
- Modify: `content/seven-day-experience.mjs`
- Modify: `content/translations.mjs`

- [ ] Encode all seven titles, teaching, observation, reflection, core action, MKS part, MKS connection, optional practice, and suggested practice time in English and Spanish.
- [ ] Preserve current titles and core exercises; add only the specified MKS-aligned material.
- [ ] Make `seven-day-experience.mjs` derive lesson content keys and metadata from the canonical source without changing route or progress identifiers.
- [ ] Make `translations.mjs` expose canonical fields through the existing `t()` API and retain all unrelated translations.
- [ ] Run the focused test and confirm the canonical structure tests pass.

### Task 3: Render aligned online lessons

**Files:**
- Modify: `src/pages/seven-day-lesson.mjs`
- Modify: `assets/platform.css`
- Modify: `tests/seven-day-lessons.test.mjs` as required by the new contract

- [ ] Add `MASTER KEY CONNECTION` and `OPTIONAL MKS PRACTICE` after the existing core action, including suggested time.
- [ ] Keep progress controls, device-private wording, navigation, and Day 7 coaching handoff unchanged.
- [ ] Add responsive styles using existing cream/navy/gold design tokens and verify no horizontal overflow at 390px.
- [ ] Run lesson and focused alignment tests until green.

### Task 4: Regenerate workbook from canonical source

**Files:**
- Modify: `tools/build-seven-day-workbook.py`
- Modify: `tests/workbook-assets.test.mjs`
- Regenerate: `downloads/seven-day-experience-workbook-en.pdf`

- [ ] Remove the duplicated lesson prose and load `content/seven-day-canonical.json`.
- [ ] Include the exact online title, core fields, MKS connection, optional practice, suggested time, writing space, completion checkbox, and device-privacy wording for every day.
- [ ] Use an embedded project-available font or embedded ReportLab font configuration that prevents abnormal letter spacing.
- [ ] Add tests for canonical parity, PDF extraction, font embedding, and output validity.
- [ ] Run the workbook tests and render cover, Day 1, Day 6, and Day 7 pages for visual inspection.

### Task 5: Update generated site output and broad test coverage

**Files:**
- Generated: `.build-preview/**`, lesson HTML, `start-free/index.html`, `downloads/seven-day-experience-workbook-en.pdf`, and any build-managed SEO outputs
- Modify: focused/homepage/start-free/translation/build tests only where the new approved wording requires assertions

- [ ] Run the production build and write the public/generated outputs locally.
- [ ] Run focused seven-day, workbook, translation, homepage, Start Free, registration, analytics, sitemap, and SEO tests.
- [ ] Run the full test suite and record the known unrelated book-page navigation expectation if it persists.
- [ ] Run deterministic build verification and `git diff --check`.

### Task 6: Local visual verification and handoff

**Files:**
- No further source changes unless visual verification identifies a defect.

- [ ] Serve the local preview and inspect homepage, Start Free, all seven lesson pages, Day 7 handoff, EN/ES states, workbook cover/Day 1/Day 6/Day 7, and an MKS reference render.
- [ ] Check desktop and approximately 390px × 844px mobile layouts for clipping, overflow, typography, and unchanged header/logo/navigation.
- [ ] Report exact source/generated files, canonical model, tests, build results, PDF/font results, preview URL, inspected pages, and remaining limitations.
- [ ] Stop for approval without commit, push, publish, or deploy.
