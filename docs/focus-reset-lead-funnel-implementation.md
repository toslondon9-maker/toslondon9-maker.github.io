# Focus Reset lead funnel — implementation brief

## Commercial objective

Introduce the 10-Minute Focus Reset as a low-commitment first step without weakening the existing primary conversion path.

The primary homepage action remains the existing Free 7-Day Experience. The Focus Reset must not become a second hero CTA, pop-up, sticky banner, or competing full-width section.

## Visitor journey

1. Visitor discovers UYP through the homepage, an insight article, Resources, or a tracked campaign link.
2. Visitor opens the dedicated `/focus-reset/` landing page.
3. Visitor requests the free PDF with first name and email only. Marketing consent is a separate, unchecked, optional control.
4. The system stores the lead and attribution in the private Google Sheet, then sends the requested PDF as a transactional delivery email.
5. Only leads with explicit marketing consent enter the promotional nurture sequence.
6. Nurture introduces the existing Free 7-Day Experience as the next learning step.
7. Foundation (£97) is the first paid coaching offer; the Complete 24-Week Journey (£997) is presented as the deeper route. Do not force a sales pitch into the PDF delivery message.

## Placement rules

### Homepage
- Preserve the existing hero, its current primary CTA, and current layout.
- Add one discreet text link adjacent to or immediately after the existing free-experience CTA: “Prefer a quick first step? Get the free 10-Minute Focus Reset.”
- Do not add a new large card, section, modal, pop-up, or competing button.
- Keep the 7-Day Experience visually and semantically primary.

### Insights
- Add a compact inline CTA near the end of relevant focus, concentration, distraction, procrastination, self-doubt, and achievement articles.
- Avoid injecting the CTA into every article indiscriminately; use a relevance allow-list.
- Preserve the article's existing primary next step and avoid repeated CTAs.

### Resources
- Add the Focus Reset as the first item in the Practise group, not as a new top-level category or oversized banner.
- Keep the 7-Day Experience clearly visible as the next structured learning option.

### Landing page
- Dedicated route: `/focus-reset/`.
- One purpose: explain the practical value, collect the minimum data, deliver the workbook.
- First name and email required. WhatsApp is not required.
- Marketing email consent is optional and unchecked by default.
- Show the privacy link and explain transactional delivery separately from marketing.
- After successful registration, confirm delivery and offer the existing 7-Day Experience as the next step. Do not put paid checkout ahead of the free learning step.

## PDF asset

Use the approved English workbook: `UYP_10_Minute_Focus_Reset.pdf`.
The file must be added to the repository's `downloads/` directory and linked from the delivery email. Confirm the actual repository asset path and PDF accessibility before enabling the public form.

## Lead capture and Google Sheets

Do not reuse the existing `/start-free/` registration contract unchanged. It requires surname, WhatsApp and WhatsApp consent, and validates only `sourcePage === "/start-free/"`.

Create a separate Focus Reset contract and handler, or extend the existing Worker and Apps Script with a clearly separated lead type. Keep the existing 7-Day form behavior unchanged.

Minimum fields:
- submission ID, submitted timestamp, first name, email, language, source page, lead magnet ID
- UTM source, medium, campaign, content, term
- non-PII referrer domain and landing path
- marketing consent boolean, consent timestamp, notice version
- delivery status and timestamp, unsubscribe status, nurture sequence status

Do not put names, email addresses, WhatsApp numbers, form answers, or affiliate codes into GA4.

Protect the Sheet as private. Sanitize spreadsheet values against formula injection. Validate and rate-limit submissions, use idempotency/deduplication, and never expose secrets in client code.

## Consent-aware analytics

Reuse the existing consent-managed GA4 loader. Proposed events:
- `focus_reset_view`
- `focus_reset_form_start`
- `focus_reset_submit`
- `focus_reset_delivered` (only after server confirms persistence and delivery)
- `seven_day_start`
- `foundation_begin_checkout`
- `complete_journey_begin_checkout`
- `purchase` only after a verified payment integration exists

Persist UTM values for attribution independently of analytics consent, using only necessary first-party storage and the site's privacy/cookie disclosures. Do not fire analytics events before analytics consent.

## Follow-up sequence

Transactional email, sent to every valid requester:
- Immediately: deliver the requested PDF and explain how to use it.

Promotional sequence, only after explicit opt-in:
- Day 1: attention and daily focus.
- Day 3: recognise recurring thought patterns.
- Day 5: practical concentration exercise.
- Day 7: invitation to the existing Free 7-Day Experience.
- Day 10: Tariq's story and coaching approach.
- Day 13: Foundation offer (£97), suitability and what's included.
- Day 16: invitation to a free 15-minute conversation.

Every promotional email must include a working unsubscribe link. Unsubscribes and complaints must suppress future marketing sends. Do not treat resource delivery as marketing consent.

## QA and release gates

- Existing homepage hero and primary CTA unchanged.
- Existing Start Free registration and its Apps Script sequence regression-tested.
- Landing page renders, is accessible, mobile-friendly, and has accurate metadata/canonical URL.
- Form validation, duplicate submissions, rate limits, failure states and server responses tested.
- PDF delivery verified from a real test submission.
- Google Sheet attribution fields populated correctly with test UTMs.
- Marketing opt-in and non-opt-in test cases prove correct sequence eligibility.
- Unsubscribe tested end-to-end.
- GA4 events verified under granted consent; no events under denied consent.
- No PII sent to GA4.
- Build, route, privacy, analytics, lead-capture and commercial tests pass.
- Do not merge until backend configuration, email delivery and all release gates are verified.

## Known dependency

The existing lead-capture endpoint and Apps Script currently accept only the Start Free form schema. A new form must not be connected to that endpoint until the backend contract and Sheet schema have been safely extended and tested. The website must not advertise a working PDF opt-in before that end-to-end path is live.
