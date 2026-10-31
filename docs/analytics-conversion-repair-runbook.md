# UYP analytics and conversion repair runbook

Prepared: 2026-10-31
Scope: first implementation pass for measurement reliability. This document does not change the live website, analytics property settings, lead sheet, or payment configuration.

## What the current reporting indicates

The latest Windsor.ai / GA4 and Search Console review returned these signals for the selected recent reporting window:

- GA4: 482 sessions and 70 `first_visit` events.
- GA4 channel attribution: 370 sessions attributed to `unleashyourpowerwithtariq.com / referral`, 72 Direct, 9 Google organic, 4 LinkedIn referral, and 4 ChatGPT referral.
- GA4 event counts: 65 `registration_start`, 47 `start_free_registration_confirmed`, 16 `foundation_begin_checkout`, and 8 `complete_journey_begin_checkout`.
- No completed purchase event was returned.
- Search Console page results show low overall search clicks and only one click to `/start-free/` in the selected window.

These are event/session counts, not unique people or verified paid customers. The 370 own-domain referral sessions make channel reporting unreliable until investigated. The checkout events represent outbound intent only.

## Existing safeguards to preserve

- Keep the English and Spanish experience.
- Keep the existing registration requirements: first name, surname, email, WhatsApp number, and required WhatsApp contact consent when a WhatsApp number is supplied. Optional email marketing must remain optional and unchecked by default.
- Keep the current registration service and private Google Sheet workflow.
- Keep the consent banner and load GA4 only after analytics consent.
- Never send names, email addresses, phone numbers, WhatsApp numbers, goals, difficulties, affiliate codes, or form text to GA4.
- Preserve all current PayPal URLs, amounts, and payment currency.
- Do not report PayPal outbound clicks or checkout starts as completed sales.

## GA4 property actions (manual admin access required)

### 1. Investigate own-domain referrals

In GA4 Admin, open the web data stream for `unleashyourpowerwithtariq.com` and inspect the unwanted-referrals configuration and cross-domain settings.

- Confirm the canonical site hostname is `unleashyourpowerwithtariq.com` (without `www`).
- Add the site's own hostname to the unwanted-referrals list if it is being reintroduced as a referral during internal navigation or redirects.
- Inspect landing-page and page-referrer paths around the referral sessions before changing settings.
- Check whether any redirect, alternate hostname, or payment return journey is starting a new session.
- Do not add PayPal or other payment domains to the unwanted-referrals list without confirming that they are actually causing a broken attribution journey; preserve the original acquisition source through checkout where possible.
- After any change, validate with a consented test visit and compare source/medium in Realtime and standard acquisition reports.

### 2. Investigate development/test traffic

The report includes referrals from local-looking hosts such as `127.0.0.1:4194`. Do not treat these as customers.

- Identify whether these sessions came from local development, preview tooling, or a test browser.
- Use a GA4 developer-traffic filter for traffic explicitly marked with debug mode where appropriate.
- Use an internal-traffic filter only after identifying a stable real network IP/range. Do not use loopback addresses as an IP exclusion rule.
- Keep filters in Testing before activating them; confirm they do not remove genuine visitor data.

### 3. Configure key events

In GA4 Admin > Events / Key events:

- Mark `start_free_registration_confirmed` as a key event. It fires only after the registration endpoint confirms that the lead was stored.
- Do not also count `generate_lead` as a second primary registration conversion unless the reporting design explicitly deduplicates the two events.
- Do not mark `registration_start`, `begin_checkout`, `foundation_begin_checkout`, `complete_journey_begin_checkout`, or PayPal click events as purchases.
- A purchase key event must wait until a trusted payment confirmation source exists.

### 4. Verify the registration funnel

With analytics consent accepted, run one controlled test registration using the existing form and verify:

1. `registration_start` fires on submit.
2. `start_free_registration_confirmed` and `generate_lead` fire only after the service confirms storage.
3. A failed or rejected registration does not fire a success event.
4. No personal form fields appear in GA4 event parameters.
5. The lead appears once in the private lead sheet and the expected confirmation email is delivered.

Use a test record clearly labelled as a test and remove/archive it according to the lead-sheet retention procedure. Do not use a real customer's details for testing.

### 5. Verify paid conversions safely

The public website sends visitors to PayPal-hosted checkout. The static site currently has no trusted payment-success callback, so the existing PayPal click events cannot prove payment.

Before implementing purchase tracking:

- Confirm which PayPal product/account configuration is used for each offer.
- Identify an authoritative transaction notification or reconciliation source (for example, a verified PayPal webhook/IPN or a controlled transaction export).
- Confirm that the notification can be validated server-side and mapped to the correct offer and GBP amount.
- Only then send a purchase event with a unique transaction ID, currency and value.
- Never infer payment success from a return URL, a button click, or a browser query parameter alone.
- Never send payer identity or payment details to GA4.

## Campaign attribution

Use consistent UTM tags for every campaign link. Suggested LinkedIn convention:

- `utm_source=linkedin`
- `utm_medium=organic_social`
- `utm_campaign=free_7_day_intro`
- `utm_content=post_topic_or_date`

Use a different campaign name for Foundation promotions. Keep URLs free of personal information.

## Acceptance criteria

- Own-domain referral sessions are explained and no longer dominate genuine acquisition reporting.
- Development/test traffic is identified and handled without filtering real visitors.
- Confirmed registrations are counted once as a key event.
- Checkout intent is reported separately from completed purchases.
- Purchase tracking is not enabled until a trusted payment confirmation is available.
- Consent, English/Spanish functionality, required registration fields, private lead capture, email workflow, and existing payment URLs remain unchanged.
- A controlled test confirms both successful and failed registration paths.
