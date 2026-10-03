# Six Commercial Improvements Design

**Status:** Draft for review

## Goal

Improve the Unleash Your Power conversion path across the homepage, Foundation, Start Free, Coaching, content pages and analytics while preserving the existing brand, bilingual behavior, payment destinations, lead-capture contract and privacy model.

## Scope

The work covers six approved changes:

1. Remove stale homepage wording about Private Mentoring and Corporate Programmes.
2. Reorganize the canonical Foundation page into a scan-first purchase page without removing confirmed detail.
3. Reduce Start Free registration friction by deferring only the two optional long-answer questions.
4. Clarify the Complete Journey purchase on Coaching with a confirmed inclusion summary.
5. Add restrained, intent-based conversion CTAs to the specified content pages.
6. Extend the existing consent-gated anonymous analytics events and document measurement limits.

## Global constraints

- Preserve cream, navy and antique-gold branding, typography, navigation, footer, bilingual EN/ES behavior and responsive layout.
- Preserve all PayPal URLs and payment amounts.
- Keep GBP as the payment currency and EUR as indicative.
- Keep Private Mentoring and Corporate Programmes absent from public offers.
- Keep Mastery Circle public with its existing canonical price, application wording and contact route.
- Do not invent claims, guarantees, testimonials, qualifications, programme facts or Complete Journey call counts.
- Do not edit generated HTML as the source of truth.
- Do not change analytics consent, privacy behavior or backend registration behavior.
- Work locally only; no commit, push or deployment in this task.

## Approved registration contract

The existing lead-capture worker and stored payload contract remain authoritative. The initial form keeps these fields:

- First name — required
- Surname — required
- Email — required
- WhatsApp number — required
- WhatsApp contact consent — required
- Email updates consent — optional

Only the two optional long-answer questions (`goal` and `difficulty`) are removed from or deferred beyond the initial registration form. Their payload validation and storage compatibility remain intact.

## Architecture

Canonical commercial facts remain in `content/site-data.mjs`, `content/pages/home.mjs`, `content/pages/coaching.mjs` and translation keys in `content/translations.mjs`. Page renderers consume those shared values and emit bilingual `data-i18n` hooks. Generated root HTML is refreshed only at the final verification stage.

The Foundation page stays the only public Foundation checkout location. Informational CTAs target `/foundation/`; PayPal links remain on the Foundation and Coaching purchase surfaces that already own them. Shared CTA and Foundation-summary helpers are reused where they fit instead of duplicating offer facts across pages.

Analytics continues through `assets/site-analytics.mjs`. New event names are allowlisted, consent-gated and parameter-sanitized. No names, emails, WhatsApp numbers, message contents or other personal data are sent. A concise internal measurement document records which figures are observable and that the static site cannot confirm completed PayPal purchases without a trusted payment-confirmation source.

## Page behavior

### Homepage

Replace stale “available on the Coaching page” wording with the current public offer structure and bilingual translation hooks. Preserve the existing offer cards and routes.

### Foundation

Use the existing Foundation facts and translations in this order:

1. Hero purchase panel with price, one-time payment, existing PayPal CTA and Start Free secondary link.
2. Three-value summary: four weeks; eight private 45-minute Zoom calls; workbook, lessons and WhatsApp support.
3. Five concise benefits.
4. Mark Smith testimonial.
5. Four confirmed weeks.
6. Closed-by-default native `<details>` accordions for payment/access, time commitment, fit, Week 1 and common questions.
7. Final payment panel with the same PayPal destination and payment note.

All existing confirmed payment, access, missed-call and refund guidance remains available in the accordions.

### Start Free

Keep the current required identity, WhatsApp and consent fields. Remove or defer only the optional goal and difficulty questions. Preserve registration submission, privacy consent, Day 1 access, private progress, language switching and analytics events.

### Coaching

Add a compact Complete Journey inclusion summary using only confirmed facts: 24 weeks, four progressive stages, weekly study/practice, personal coaching guidance/accountability, workbook/online lessons and existing AI support. Do not state a call count. Keep the current £997 / €1,167, `PAY NOW`, PayPal URL, Foundation balance explanation, Mastery Circle and absence of Private Mentoring/Corporate Programmes.

### Content CTAs

Use one restrained next step per page based on intent. Add bilingual hooks to MKS, Resources, Insights hub, applicable Insights articles, AI Learning and About Tariq. Informational Foundation links use `/foundation/`; checkout links remain canonical. Preserve article body copy.

## Testing and verification

Add or update focused tests for homepage offer wording, Foundation structure and invariants, Start Free form fields and submission contract, Coaching inclusion and offer invariants, CTA route coverage, translation hooks, analytics allowlisting/privacy, and route/SEO contracts.

Run:

- Focused subsystem tests.
- The full test suite, reporting the two baseline failures separately unless they change for a demonstrated reason.
- Deterministic build twice.
- `git diff --check`.
- English/Spanish visible-string hook audit.
- PayPal URL and amount invariants.
- Generated-output verification.
- Desktop/mobile local preview checks with no horizontal overflow and closed keyboard-accessible accordions.

## Review focus

- Existing lead-capture contract: required surname, WhatsApp and WhatsApp consent must remain required; test the rendered form and worker validator together.
- Payment ownership: Foundation informational links must not gain checkout URLs, and existing PayPal destinations/amounts must remain byte-for-byte unchanged.
- Public offer accuracy: homepage and Coaching must not reintroduce Private Mentoring or Corporate Programmes, while Mastery Circle remains present.
- Bilingual completeness: every new visible English string must have an ES translation hook and both languages must render without key leakage.
- Analytics privacy: new events must be consent-gated, allowlisted and free of personal lead fields; completed PayPal purchases must not be claimed as measured.

