# Seven-Day Experience and Conversion Journey Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Use `superpowers:test-driven-development` for every feature or fix, the `pdf:pdf` skill for workbook generation and visual verification, `superpowers:requesting-code-review` before integration, and `superpowers:verification-before-completion` before any completion claim or release.

**Goal:** Deliver a genuine, bilingual, zero-cost seven-day learning experience with private on-device progress, downloadable workbooks and an honest path to Tariq's existing WhatsApp/email and 24-week coaching offer.

**Architecture:** Extend the existing deterministic static-site generator with a structured seven-day content model, dedicated dashboard and lesson renderers, and a small progressively enhanced progress module. English remains the server-rendered fallback; the existing strict translation registry and language module supply natural European Spanish. The experience works without JavaScript, stores only completion flags in `localStorage`, and uses only static GitHub Pages assets and existing contact channels.

**Tech Stack:** Native Node.js ES modules and `node:test`, static semantic HTML, existing CSS and browser-side ES modules, Python/ReportLab through the bundled workspace runtime for PDFs, Git/GitHub Pages.

---

## Global implementation rules

- Work in an isolated `codex/` worktree created from the approved specification commit `2f193bf`.
- Before any public write, create a recoverable rollback branch pointing at the currently deployed commit.
- Preserve unrelated user files, especially the untracked 2026-08-18 guided-coaching plan and specification.
- Use red-green-refactor: add a focused failing test, run it and observe the expected failure, implement only enough to pass, then run the focused and full suites.
- Generate `.build-preview` only during implementation. Do not use `--write-public`, push or publish until the user approves the preview.
- Do not add a package manager, network dependency, paid service, fabricated content, fake form, analytics tracker, booking account or payment integration.
- Commit after each completed task with the message shown.

### Task 1: Establish the experience data and route contracts

**Files:**

- Create: `content/seven-day-experience.mjs`
- Modify: `content/site-data.mjs`
- Modify: `src/routes.mjs`
- Modify: `tools/build-site.mjs`
- Create: `tests/seven-day-routes.test.mjs`
- Modify: `tests/build-site.test.mjs`

**Step 1: Write the failing route-contract tests**

Test that the shared data contains exactly seven ordered lesson definitions with stable IDs, routes and canonical English titles. Assert that `/start-free/` plus seven lesson routes have registered renderers and are present in the build manifest without polluting the shared-navigation route list.

**Step 2: Run the focused tests and confirm RED**

Run:

```powershell
$node='C:\Users\tsa100\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $node --test --test-isolation=none tests/seven-day-routes.test.mjs tests/build-site.test.mjs
```

Expected: failure because the seven-day content model and lesson routes do not exist.

**Step 3: Implement the minimal data and build plumbing**

Create an immutable seven-day content definition containing IDs, route slugs, sequence numbers and translation-key references. Add a separate experience-route collection so lesson pages are buildable but do not automatically appear in global navigation. Extend the route renderer map and deterministic build route enumeration with placeholder semantic lesson renderers only where needed for the contract.

**Step 4: Run focused and full verification**

Run the focused command above, then:

```powershell
& $node --test --test-isolation=none
& $node tools/build-site.mjs --check
```

Expected: all tests pass and the build reports deterministic output.

**Step 5: Commit**

```powershell
git add content/seven-day-experience.mjs content/site-data.mjs src/routes.mjs tools/build-site.mjs tests/seven-day-routes.test.mjs tests/build-site.test.mjs
git commit -m "Add seven-day experience route contracts"
```

### Task 2: Add complete bilingual lesson content

**Files:**

- Modify: `content/translations.mjs`
- Modify: `content/seven-day-experience.mjs`
- Create: `tests/seven-day-content.test.mjs`
- Modify: `tests/i18n.test.mjs`

**Step 1: Write the failing content tests**

Assert that every day has English and Spanish strings for its title, teaching, observation guidance, reflection prompt, action, completion label and navigation/status text. Test exact canonical day names, British English spellings, natural `tú` voice markers, the independence statement, and the absence of guarantees, invented credentials, endorsements and prohibited payment-plan copy.

**Step 2: Run the focused tests and confirm RED**

```powershell
& $node --test --test-isolation=none tests/seven-day-content.test.mjs tests/i18n.test.mjs
```

Expected: missing translation keys and incomplete lesson content.

**Step 3: Write the English and European Spanish experience copy**

Populate all seven lessons in the central translation registry. Keep each teaching concise, practical and progressive. Ground the “almost magical process” wording explicitly in cumulative practice and avoid guarantees. Include complete dashboard, progress, privacy, reset, contact and workbook labels in both languages.

**Step 4: Run focused and full verification**

Run the focused test command, the complete test suite and `tools/build-site.mjs --check`.

**Step 5: Commit**

```powershell
git add content/translations.mjs content/seven-day-experience.mjs tests/seven-day-content.test.mjs tests/i18n.test.mjs
git commit -m "Write bilingual seven-day lesson content"
```

### Task 3: Build the free-experience dashboard

**Files:**

- Create: `src/pages/start-free.mjs`
- Modify: `src/routes.mjs`
- Modify: `assets/platform.css`
- Create: `tests/start-free-page.test.mjs`
- Modify: `tests/site-offers.test.mjs`

**Step 1: Write the failing dashboard tests**

Render `/start-free/` and assert one H1, an immediate Day 1 action, seven lesson cards with valid links, progressive-practice copy, the local-device privacy disclosure, a progress-status region, reset control, workbook actions and no registration form or fake storage claim. Assert bilingual hooks on all changeable text.

**Step 2: Run the focused tests and confirm RED**

```powershell
& $node --test --test-isolation=none tests/start-free-page.test.mjs tests/site-offers.test.mjs
```

Expected: the existing generic route shell lacks the dashboard.

**Step 3: Implement the semantic dashboard**

Replace only the `/start-free/` generic renderer with a dedicated page renderer. Use the shared shell and existing design tokens. Render English as the no-JavaScript baseline and attach translation keys for runtime localisation. Show every lesson as available while visually recommending the sequence.

**Step 4: Add responsive premium styling**

Add narrowly scoped dashboard, progress and lesson-card classes. Maintain the cream/navy/gold system, visible focus styles, flexible wrapping and no fixed widths that can create mobile overflow.

**Step 5: Verify and commit**

Run focused tests, the full suite, deterministic build and `git diff --check`, then commit:

```powershell
git add src/pages/start-free.mjs src/routes.mjs assets/platform.css tests/start-free-page.test.mjs tests/site-offers.test.mjs
git commit -m "Build the free seven-day dashboard"
```

### Task 4: Build all seven accessible lesson pages

**Files:**

- Create: `src/pages/seven-day-lesson.mjs`
- Modify: `src/routes.mjs`
- Modify: `assets/platform.css`
- Modify: `tests/seven-day-routes.test.mjs`
- Create: `tests/seven-day-lessons.test.mjs`

**Step 1: Write the failing lesson-rendering tests**

For each day, assert one H1 and the complete teaching, observation, reflection and practical-action structure; working previous/next links; a dashboard link; a completion control; progress status; and an optional contact action. Assert that every lesson remains fully readable and navigable before JavaScript runs.

**Step 2: Run the focused tests and confirm RED**

```powershell
& $node --test --test-isolation=none tests/seven-day-routes.test.mjs tests/seven-day-lessons.test.mjs
```

Expected: placeholder lesson shells do not satisfy the learning-flow contract.

**Step 3: Implement the shared lesson renderer**

Render all seven routes from the immutable content definition. Use semantic articles and sections, a real button for completion and links for navigation. Day 7 alone adds the low-pressure transition to coaching and the existing pricing route.

**Step 4: Style and verify**

Add responsive scoped styles for the lesson header, practice sections, actions and navigation. Run focused tests, the full suite, deterministic build and diff check.

**Step 5: Commit**

```powershell
git add src/pages/seven-day-lesson.mjs src/routes.mjs assets/platform.css tests/seven-day-routes.test.mjs tests/seven-day-lessons.test.mjs
git commit -m "Create the seven guided lesson pages"
```

### Task 5: Add privacy-preserving progress enhancement

**Files:**

- Create: `assets/seven-day-progress.mjs`
- Modify: `src/pages/start-free.mjs`
- Modify: `src/pages/seven-day-lesson.mjs`
- Modify: `tools/build-site.mjs`
- Create: `tests/seven-day-progress.test.mjs`
- Modify: `tests/build-site.test.mjs`

**Step 1: Write failing unit tests around pure progress functions**

Test the storage schema, sanitisation, completion toggling, count calculation and reset logic. Cover malformed JSON, unknown lesson IDs, storage read/write exceptions and empty state. Explicitly prove that the saved payload contains only schema/version and completion flags—not names, emails or reflection text.

**Step 2: Run and confirm RED**

```powershell
& $node --test --test-isolation=none tests/seven-day-progress.test.mjs
```

Expected: the progress module is missing.

**Step 3: Implement pure state helpers and DOM enhancement**

Use a namespaced key such as `uyp.sevenDayProgress.v1`. Enhance dashboard cards, status and lesson completion controls after the DOM is ready. If storage is unavailable, retain lesson access and show an honest non-persistent status. Require confirmation before reset and return focus sensibly after the action.

**Step 4: Wire and verify the module**

Load one deferred module on dashboard and lesson routes, copy it as a build dependency, and confirm no duplicated script. Run focused tests, full tests and deterministic build.

**Step 5: Commit**

```powershell
git add assets/seven-day-progress.mjs src/pages/start-free.mjs src/pages/seven-day-lesson.mjs tools/build-site.mjs tests/seven-day-progress.test.mjs tests/build-site.test.mjs
git commit -m "Add private on-device lesson progress"
```

### Task 6: Add honest WhatsApp and email conversion actions

**Files:**

- Create: `src/contact-links.mjs`
- Modify: `src/pages/start-free.mjs`
- Modify: `src/pages/seven-day-lesson.mjs`
- Modify: `content/translations.mjs`
- Create: `tests/contact-links.test.mjs`
- Modify: `tests/start-free-page.test.mjs`
- Modify: `tests/seven-day-lessons.test.mjs`

**Step 1: Write failing contact-link tests**

Test URL encoding and derivation from injected `siteData.contact` rather than hard-coded addresses. Assert the dashboard “Tell Tariq I'm starting” and lesson “Ask Tariq a question” messages in both languages. Assert there are no forms, invented booking/Zoom/Calendly links or automatic-submission claims.

**Step 2: Run and confirm RED**

```powershell
& $node --test --test-isolation=none tests/contact-links.test.mjs tests/start-free-page.test.mjs tests/seven-day-lessons.test.mjs
```

Expected: reusable, safely encoded contact links do not exist.

**Step 3: Implement and wire the contact actions**

Generate `https://wa.me/` links from the approved number and `mailto:` links from the approved email. Provide visible fallback contact details. Keep the visitor in control of sending. Ensure Day 7's coaching action targets `/coaching/` and uses no artificial urgency.

**Step 4: Verify and commit**

Run focused tests, the full suite, deterministic build and diff check, then commit:

```powershell
git add src/contact-links.mjs src/pages/start-free.mjs src/pages/seven-day-lesson.mjs content/translations.mjs tests/contact-links.test.mjs tests/start-free-page.test.mjs tests/seven-day-lessons.test.mjs
git commit -m "Connect the free journey to Tariq"
```

### Task 7: Generate and link the bilingual workbooks

**Required skill:** Read and follow `pdf:pdf` before this task.

**Files:**

- Create: `tools/build-seven-day-workbooks.py`
- Create: `downloads/seven-day-experience-workbook-en.pdf`
- Create: `downloads/experiencia-siete-dias-cuaderno-es.pdf`
- Modify: `tools/build-site.mjs`
- Modify: `src/pages/start-free.mjs`
- Modify: `content/translations.mjs`
- Create: `tests/workbook-assets.test.mjs`
- Create: `.superpowers/sdd/2026-08-22-seven-day-conversion-system/workbook-qa.md`

**Step 1: Write failing workbook contract tests**

Assert both PDF files are present, begin with the PDF signature, have non-trivial size, are included in the deterministic build and are linked from the dashboard with language-appropriate labels and download attributes.

**Step 2: Run and confirm RED**

```powershell
& $node --test --test-isolation=none tests/workbook-assets.test.mjs
```

Expected: workbook source and PDF assets are missing.

**Step 3: Create deterministic workbook generation**

Use the bundled Python/ReportLab runtime located through the workspace dependency loader. Generate separate English and Spanish workbooks from approved content, with premium cover, seven day sections, prompts and adequate writing space. Avoid form controls or submission language.

**Step 4: Render and visually inspect every PDF page**

Follow the PDF skill: render both PDFs to images using Poppler, inspect every page for clipping, font substitution, poor contrast and insufficient writing space, correct issues and regenerate. Record commands, page counts and findings in `workbook-qa.md`.

**Step 5: Wire downloads and verify**

Copy `downloads/` through the static build, add bilingual dashboard links, run the workbook test, full suite, deterministic build and diff check.

**Step 6: Commit**

```powershell
git add tools/build-seven-day-workbooks.py downloads src/pages/start-free.mjs content/translations.mjs tools/build-site.mjs tests/workbook-assets.test.mjs .superpowers/sdd/2026-08-22-seven-day-conversion-system/workbook-qa.md
git commit -m "Add bilingual seven-day workbooks"
```

### Task 8: Harden localisation, accessibility and responsive behaviour

**Files:**

- Modify: `assets/site-language.mjs`
- Modify: `assets/seven-day-progress.mjs`
- Modify: `assets/platform.css`
- Modify: `tests/i18n.test.mjs`
- Modify: `tests/seven-day-progress.test.mjs`
- Create: `tests/seven-day-accessibility.test.mjs`

**Step 1: Write failing integration contracts**

Test that switching language localises static lesson copy, dynamic progress text, reset confirmation, accessible names and document metadata. Test meaningful button state, live-region restraint, visible focus-class contracts and valid heading/landmark structure. Add CSS/static assertions that guard against fixed-width overflow.

**Step 2: Run and confirm RED**

```powershell
& $node --test --test-isolation=none tests/i18n.test.mjs tests/seven-day-progress.test.mjs tests/seven-day-accessibility.test.mjs
```

Expected: one or more dynamic localisation/accessibility contracts are absent.

**Step 3: Implement minimal hardening**

Make progress updates react to the existing language-change mechanism without storing duplicate language state. Improve state announcements, focus restoration and responsive rules while preserving the existing shared navigation and design system.

**Step 4: Verify and commit**

Run focused tests, the full suite, deterministic build and diff check, then commit:

```powershell
git add assets/site-language.mjs assets/seven-day-progress.mjs assets/platform.css tests/i18n.test.mjs tests/seven-day-progress.test.mjs tests/seven-day-accessibility.test.mjs
git commit -m "Harden the bilingual lesson experience"
```

### Task 9: Complete static preview and automated release audit

**Files:**

- Create: `tests/seven-day-release.test.mjs`
- Create: `.superpowers/sdd/2026-08-22-seven-day-conversion-system/automated-qa.md`
- Modify only if a test exposes a real defect: files from Tasks 1–8

**Step 1: Add release-level regression tests**

Build to a temporary output and crawl every generated page for internal links and referenced local assets. Assert the exact pricing/week values remain present on coaching, the removed payment-plan language remains absent, the independence statement remains present, no placeholder/testimonial/form/analytics/booking artefacts exist, and every experience route loads one H1 and one progress module at most.

**Step 2: Run release verification**

```powershell
& $node --test --test-isolation=none
& $node tools/build-site.mjs --check
& $node tools/build-site.mjs
git diff --check
git status --short
```

Expected: the complete suite passes, the build is deterministic, `.build-preview` contains all expected pages/assets, and no public files have been written.

**Step 3: Record evidence**

Write the exact command results, test totals, preview page count and prohibited-string scan results to `automated-qa.md`.

**Step 4: Request code review and fix findings**

Use `superpowers:requesting-code-review` on the complete implementation range. Apply `superpowers:receiving-code-review` to each finding, reproduce valid issues with a failing test and commit fixes separately.

**Step 5: Commit the release audit**

```powershell
git add tests/seven-day-release.test.mjs .superpowers/sdd/2026-08-22-seven-day-conversion-system/automated-qa.md
git commit -m "Audit the seven-day static release"
```

### Task 10: Perform browser QA and present the private preview

**Files:**

- Create: `.superpowers/sdd/2026-08-22-seven-day-conversion-system/browser-qa.md`
- Modify only if QA exposes a real defect: relevant implementation/test files

**Step 1: Serve only the generated preview**

Run a local static server rooted at `.build-preview`. Do not publish or copy preview output into the repository's public route directories.

**Step 2: Check desktop, tablet and mobile**

Using `browser:control-in-app-browser`, verify at 390 × 844, a representative tablet viewport and 1440 × 1000:

- dashboard and all seven lessons;
- EN/ES switching and persistence;
- completion, refresh persistence and confirmed reset;
- unavailable-storage/no-JavaScript fallback where tooling permits;
- keyboard order, visible focus, Escape behaviour in shared navigation and focus restoration;
- WhatsApp/email URLs without sending a message;
- workbook downloads;
- no horizontal overflow, clipping, broken assets or console errors.

**Step 3: Record screenshots and evidence**

Document all checked viewports, key results and any limitations in `browser-qa.md`. Fix any discovered defect test-first and repeat the relevant checks.

**Step 4: Commit QA evidence**

```powershell
git add .superpowers/sdd/2026-08-22-seven-day-conversion-system/browser-qa.md
git commit -m "Verify the seven-day experience preview"
```

**Step 5: Stop for user preview approval**

Give the user a concise preview report and visual evidence. Do not merge, write public output, push or deploy until the user explicitly approves the preview.

### Task 11: Publish the approved release and verify production

**Prerequisite:** Explicit user approval of the Task 10 preview.

**Files:**

- Modify: generated public route files and approved static assets only through `tools/build-site.mjs --write-public`
- Create: `.superpowers/sdd/2026-08-22-seven-day-conversion-system/release-report.md`

**Step 1: Create and verify the rollback reference**

Create a uniquely dated `codex/rollback-...` branch at the pre-release public commit. Verify its commit ID before proceeding. Do not overwrite any existing rollback branch.

**Step 2: Re-run the full verification gate**

Use `superpowers:verification-before-completion` and re-run the complete tests, deterministic build, diff check and worktree audit. Stop if anything fails.

**Step 3: Write public output and audit the exact diff**

Run the existing public build once. Confirm that only expected generated pages, runtime assets and workbooks changed. Verify public files byte-match the approved preview where applicable. Do not stage unrelated user files.

**Step 4: Commit and push the release**

Commit the generated public output with a release-specific message, merge through the repository's approved branch workflow and push only the intended branch. Do not force-push.

**Step 5: Verify the live GitHub Pages site**

Wait for deployment, then verify the public URL on phone and desktop sizes: start-free dashboard, seven lessons, language switching, progress, contact links, workbooks, pricing integrity, no payment plan and no broken assets. Treat a successful Git push as insufficient until the live URLs pass.

**Step 6: Write the completion report**

Separate the report into:

1. Completed and working
2. Prepared but awaiting the user's action
3. Still outstanding

Include live links, release and rollback commit IDs, test evidence and any external-service integration points left intentionally inactive.

**Step 7: Commit the report if it was not included in the release commit**

```powershell
git add .superpowers/sdd/2026-08-22-seven-day-conversion-system/release-report.md
git commit -m "Document the seven-day experience release"
```
