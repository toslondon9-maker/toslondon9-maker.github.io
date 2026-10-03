# Six Commercial Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (recommended) or superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the six approved commercial improvements across the Unleash Your Power site while preserving the existing bilingual, payment, lead-capture, consent and public-offer contracts.

**Architecture:** Keep commercial facts and bilingual copy in the existing canonical content/translations modules. Reuse shared Foundation/CTA helpers where possible, update page renderers and the existing consent-gated analytics runtime, then regenerate tracked public HTML only after source verification. Keep the Foundation checkout canonical and preserve the current lead-capture worker contract.

**Tech Stack:** Node.js ES modules, static HTML renderer, shared translation keys, vanilla browser modules, Node built-in test runner, deterministic site builder.

**Spec:** `docs/superpowers/specs/2026-10-03-commercial-improvements-design.md`

## Global Constraints

- Preserve cream, navy and antique-gold branding, typography, navigation, footer, bilingual EN/ES behavior and responsive layout.
- Preserve all PayPal URLs and payment amounts.
- Keep GBP as the payment currency and EUR as indicative.
- Keep Private Mentoring and Corporate Programmes absent from public offers.
- Keep Mastery Circle public with its existing canonical price, application wording and contact route.
- Do not invent claims, guarantees, testimonials, qualifications, programme facts or Complete Journey call counts.
- Do not edit generated HTML as the source of truth.
- Do not change analytics consent, privacy behavior or backend registration behavior.
- Work locally only; do not commit, push or deploy.

## Review Focus

- The Start Free form must keep required first name, surname, email, WhatsApp and WhatsApp consent, with email updates optional; only goal/difficulty move out of the initial form.
- Foundation informational links must not gain PayPal destinations; Foundation and Complete Journey payment URLs and GBP amounts must remain unchanged.
- Homepage and Coaching must exclude Private Mentoring and Corporate Programmes while retaining Mastery Circle.
- Every new visible string must have an English/Spanish translation hook and both languages must render without key leakage.
- Analytics events must remain consent-gated, allowlisted and free of personal lead data; completed PayPal purchases must not be claimed as measured.

---

### Task 1: Canonical commercial copy and homepage offer wording

**Files:**
- Modify: `content/pages/home.mjs`
- Modify: `content/translations.mjs`
- Modify: `src/pages/home.mjs` only if the existing renderer cannot expose the canonical structure
- Test: `tests/home-page.test.mjs`, `tests/site-offers.test.mjs`, `tests/i18n.test.mjs`

**Interfaces:**
- Consumes: existing `homeContent`, `siteData.routes`, `t()` and pricing helpers.
- Produces: bilingual homepage offer copy naming only Free 7-Day Experience, Foundation, Complete Journey, Mastery Circle application-only and Alumni Practice Membership.

- [ ] Write regression assertions that stale Private Mentoring/Corporate wording is absent, the current public offer structure is present in English and Spanish, and existing Foundation/Complete routes remain unchanged.
- [ ] Run the focused homepage/offer/i18n tests and confirm they fail only for the missing or stale copy.
- [ ] Update canonical English and Spanish translation/content entries, preserving existing price values and route links.
- [ ] Run the focused tests again and confirm they pass.

### Task 2: Foundation purchase-page structure

**Files:**
- Modify: `src/pages/foundation.mjs`
- Modify: `content/translations.mjs`
- Modify: scoped Foundation styles in the existing platform stylesheet source
- Test: `tests/foundation-page.test.mjs`, `tests/foundation-conversion.test.mjs`, `tests/pricing.test.mjs`, `tests/i18n.test.mjs`

**Interfaces:**
- Consumes: canonical Foundation stage data, `priceCopy()`, `pricingNoteCopy()`, existing refund route and confirmed translation keys.
- Produces: a Foundation page with hero purchase panel, three-value summary, five benefits, Mark Smith testimonial, four weeks, closed native accordions and final payment panel.

- [ ] Add structural tests for hero price/CTA/secondary link, summary facts, five benefits, Mark Smith placement, four weeks, five closed accordions and final payment panel in both languages.
- [ ] Run focused Foundation tests and confirm the new structural expectations fail before implementation.
- [ ] Reorder the renderer to the approved scan-first structure without deleting confirmed guidance; use native `<details>` with no `open` attribute.
- [ ] Add or update only Foundation-scoped responsive styles for readable desktop/mobile layout and no overflow.
- [ ] Add/update translation keys for every visible new label and render English/Spanish hooks.
- [ ] Run focused Foundation, pricing, translation and route tests; confirm PayPal URL and amount invariants.

### Task 3: Start Free form-friction reduction within the existing contract

**Files:**
- Modify: `src/pages/start-free.mjs`
- Modify: `assets/lead-capture-form.mjs` only if the renderer/module requires safe deferred-field handling
- Modify: `content/translations.mjs` only for new deferred-field labels or explanatory copy
- Test: `tests/start-free-page.test.mjs`, `tests/lead-capture-form.test.mjs`, `tests/lead-capture-contract.test.mjs`, `tests/lead-capture-worker.test.mjs`

**Interfaces:**
- Consumes: existing form markup, `formCopy`, `validateLeadPayload()` and worker payload fields.
- Produces: initial form with required first name, surname, email, WhatsApp and WhatsApp consent; optional email updates; goal/difficulty removed or deferred without changing payload validation/storage.

- [ ] Add tests proving the required fields and optional email-updates checkbox remain present, goal/difficulty are not initial required inputs, and submission payload/worker validation remains compatible.
- [ ] Run focused form/contract/worker tests and confirm the new UI assertions fail before implementation.
- [ ] Remove or defer only goal/difficulty from the initial rendered form; do not alter backend validation, names or consent semantics.
- [ ] Update bilingual form copy/hooks if the changed UI needs new text.
- [ ] Run focused form/contract/worker tests and confirm registration behavior remains green.

### Task 4: Complete Journey clarity and public offer preservation

**Files:**
- Modify: `src/pages/coaching.mjs`
- Modify: `content/pages/coaching.mjs`
- Modify: `content/translations.mjs`
- Modify: scoped Coaching styles in the existing platform stylesheet source
- Test: `tests/coaching-page.test.mjs`, `tests/site-offers.test.mjs`, `tests/phase2-conversion.test.mjs`, `tests/pricing.test.mjs`

**Interfaces:**
- Consumes: canonical stage/offer data, existing Complete Journey PayPal URL, Foundation balance copy, Mastery Circle data and translation helpers.
- Produces: a compact Complete Journey inclusion summary using only confirmed facts, with `PAY NOW`, £997 / €1,167, balance explanation, Mastery Circle present and Private Mentoring/Corporate Programmes absent.

- [ ] Add tests for the inclusion summary, exact CTA/price/payment URL, no invented call count, Mastery Circle details and absence of removed offers.
- [ ] Run focused Coaching/pricing tests and confirm the new inclusion expectations fail before implementation.
- [ ] Add canonical summary copy and render it near the Complete Journey purchase card with bilingual hooks.
- [ ] Preserve the existing approved layout and add only scoped responsive styling if needed.
- [ ] Run focused Coaching, pricing, route and translation tests.

### Task 5: Shared intent-based CTAs across content pages

**Files:**
- Modify: `src/pages/master-key-curriculum.mjs`
- Modify: `src/pages/resources.mjs`
- Modify: `src/pages/insights-index.mjs`
- Modify: `src/pages/insight-article-shared.mjs`
- Modify: `src/pages/insights-source-article.mjs`
- Modify: `src/pages/ai-mentors.mjs`
- Modify: `src/pages/about-tariq.mjs`
- Modify: `content/translations.mjs`
- Modify: scoped CTA styles only if needed
- Test: `tests/master-key-curriculum.test.mjs`, `tests/resources-quotes.test.mjs`, `tests/insights.test.mjs`, `tests/ai-mentor-experience.test.mjs`, `tests/about-tariq.test.mjs` or the repository’s applicable About test, `tests/navigation.test.mjs`, `tests/seo.test.mjs`

**Interfaces:**
- Consumes: shared routes, `bookingCallHref()`, translation helpers and existing article markdown renderers.
- Produces: one restrained intent-based next step per specified page, with informational Foundation links targeting `/foundation/` and checkout links remaining canonical.

- [ ] Add route and bilingual-hook assertions for MKS, Resources, Insights hub/articles, AI Learning and About Tariq, including Resources’ early “Not sure where to start?” route and MKS Chapters 1–4 next step.
- [ ] Run focused content/route/SEO tests and confirm missing CTA expectations fail before implementation.
- [ ] Add shared or renderer-local CTA blocks without changing article body copy or duplicating payment links.
- [ ] Add only scoped responsive styles required by the new CTA blocks.
- [ ] Run focused content/route/SEO/translation tests and inspect CTA counts for restraint.

### Task 6: Consent-gated conversion analytics and measurement note

**Files:**
- Modify: `assets/site-analytics.mjs`
- Modify: `src/page-shell.mjs` or shared event hooks only if existing markup cannot identify the approved actions
- Create: `docs/conversion-measurement.md`
- Test: `tests/site-analytics.test.mjs`, `tests/privacy.test.mjs`, `tests/legal-pages.test.mjs`

**Interfaces:**
- Consumes: existing `createAnalyticsController()`, consent storage, DOM event delegation and approved PayPal/WhatsApp routes.
- Produces: anonymous allowlisted events for homepage CTA, Free 7-Day CTA/view/registration, Foundation view/checkout, Complete Journey checkout, WhatsApp, Coaching enquiry, Mastery Circle application and article CTA.

- [ ] Add failing tests for event names, consent gating, event-to-action mapping, privacy-safe parameters and no purchase-completion claim.
- [ ] Run focused analytics/privacy tests and confirm the new event assertions fail before implementation.
- [ ] Extend the allowlist and event delegation with sanitized route/data attributes; preserve existing event names and consent behavior.
- [ ] Write `docs/conversion-measurement.md` covering visitors, registrations, completions, checkout clicks, confirmed purchases where available, WhatsApp, enquiries/purchases and source conversion rates, explicitly documenting PayPal confirmation limits.
- [ ] Run focused analytics/privacy/legal tests and confirm no personal fields are emitted.

### Task 7: Integrated verification and local preview

**Files:**
- Generated output: refreshed only by `node tools/build-site.mjs --write-public`
- Tests: relevant focused suites plus the full `tests/*.test.mjs` suite

- [ ] Run the focused suites for homepage, Foundation, Start Free, Coaching, translations, analytics, routes and SEO.
- [ ] Run the full suite and compare failures with the two baseline failures: book discoverability and canonical-route coverage.
- [ ] Run `node tools/build-site.mjs --check` twice and verify deterministic output.
- [ ] Run `node tools/build-site.mjs --write-public` only after source checks pass, then inspect the generated diff.
- [ ] Run `git diff --check` and verify the changed-file list contains only approved source, tests, documentation, scoped styles and required generated output.
- [ ] Start a local HTTP preview on a clean port and inspect desktop/mobile routes for homepage, Foundation, Start Free, Coaching, MKS, Resources, Insights, AI Learning and About Tariq.
- [ ] Confirm no horizontal overflow, accordions closed by default and keyboard accessible, payment links unchanged, bilingual hooks complete, offer exclusions correct and no stale homepage wording remains.
- [ ] Stop locally and report results; do not commit, push or deploy.

