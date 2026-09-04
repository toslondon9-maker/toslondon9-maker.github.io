# Seven-Day Free Experience lead-capture design

## Purpose and scope

The public `/start-free/` page will become a registration-first journey for
the existing free seven-day experience. Registration collects only the contact
and context fields approved for this release. The seven existing lesson pages
remain public, unchanged, and their completion flags remain in the visitor's
own browser only.

This design adds a new, isolated Cloudflare Worker and a Google Apps Script
receiver. It does not modify the existing AI Mentor Worker, payment links,
prices, navigation destinations, Master Key content, or referrals.

## Architecture

```text
Visitor browser
  | HTTPS POST, JSON, exact-origin CORS
  v
unleash-your-power-leads Worker
  | validate, rate-limit, create/request submission ID, timeout once
  | HTTPS POST with shared secret, no PII logs
  v
Google Apps Script web app (/exec)
  | validate again, lock, idempotency check, append row
  | optional email notification and quota check
  v
Private Google Sheet and toslondon9@gmail.com notification
```

The browser receives success only when the Apps Script response confirms that
the lead row exists. The Worker is required because a static GitHub Pages site
cannot reliably read an Apps Script cross-origin response and therefore cannot
truthfully present the required in-page success or error state by posting to
Apps Script directly.

## Public form and journey

The existing Start Free page will retain its seven-day overview, flyer, lesson
cards and local progress UI. Its primary action becomes a registration section
with the following required fields:

1. First name, maximum 80 characters.
2. Surname, maximum 80 characters.
3. Email address, maximum 254 characters.
4. WhatsApp number with country code, maximum 32 characters.
5. Main goal, maximum 1,000 characters.
6. Current difficulty, maximum 1,000 characters.
7. Privacy consent, required and never preselected.

The form also includes an unnamed/hidden honeypot, a client-created submission
ID, and its creation time. These are not presented as user fields. The client
will not send a request before a modest minimum completion time (three seconds)
has elapsed. The Worker remains the authority for validation, so browser checks
only improve the experience.

On accepted registration, the form is replaced by the approved welcome message,
the Day 1 action, and this secure WhatsApp destination:

`https://wa.me/34611223345?text=Hi%20Tariq%2C%20I%20have%20just%20registered%20for%20the%20free%207-Day%20Unleash%20Your%20Power%20experience.`

The WhatsApp action opens with `target="_blank"` and
`rel="noopener noreferrer"`. A restrained “Already registered?” link opens the
existing seven-day dashboard. It is convenience only, not authentication.

If the Worker rejects or cannot confirm the submission, the form keeps its
non-sensitive entered values, focuses an accessible status message, and allows
the visitor to retry with the same submission ID. It never redirects or claims
registration was completed.

All form, success, error and validation copy is implemented through the
existing English/Spanish translation registry. The selected language is included
in the submitted lead record.

## Worker boundary

A new `backend/lead-capture/` project will contain the Worker. It is separate
from `backend/ai-mentor-worker.mjs` and from its Wrangler configuration.

The Worker exposes only `POST /lead` and `OPTIONS /lead`. It accepts the live
origin `https://toslondon9-maker.github.io` and explicitly configured local
test origins only. Every allowed response carries the exact requesting allowed
origin, `Vary: Origin`, `Access-Control-Allow-Methods: POST, OPTIONS`, and a
minimal `Access-Control-Allow-Headers: Content-Type, X-UYP-Submission-ID`.
Unexpected origins, methods, paths and content types receive generic errors.

The Worker applies the following controls before its upstream request:

- a small JSON body ceiling (8 KiB);
- strict field allowlist, validation, normalisation and length limits;
- honeypot rejection and a three-second minimum completion time;
- Cloudflare Rate Limiting binding keyed by `CF-Connecting-IP`, with a
  conservative per-IP window appropriate for a contact form;
- no logs containing submitted values, email, WhatsApp number or goal text;
- a generated UUID submission ID when the browser does not provide a valid one;
- one upstream request only, with a short abortable timeout; no automatic retry.

The Worker will use a non-secret configuration value for approved origins and
two Cloudflare secrets:

- `GOOGLE_APPS_SCRIPT_EXEC_URL` — the production `/exec` URL.
- `LEAD_CAPTURE_SHARED_SECRET` — a high-entropy value also held in Apps Script
  Script Properties.

The public GitHub Pages page has no endpoint until Stage 2 provides the deployed
Worker URL. The Apps Script URL, shared secret, Spreadsheet ID and notification
configuration never appear in public HTML, generated files or Git history.

## Apps Script receiver

`integrations/google-apps-script/lead-capture.gs` will be a standalone Apps
Script web-app source using `doPost(e)`. It expects JSON from the Worker and
reads configuration only from Script Properties:

- `LEAD_SHEET_ID`
- `LEAD_SHEET_NAME`
- `LEAD_NOTIFICATION_EMAIL` (`toslondon9@gmail.com`)
- `LEAD_CAPTURE_SHARED_SECRET`
- `LEAD_DUPLICATE_WINDOW_MINUTES`

It will validate the shared secret, parse and validate the body again, and
normalise whitespace, email and WhatsApp. It will neutralise spreadsheet formula
prefixes (`=`, `+`, `-`, `@`) in every supplied free-text field before Sheet
write. It will not write to logs.

`LockService` protects the full idempotency-and-append operation. The receiver
checks the `Submission ID` column first. A repeat with the same ID returns the
original stored result and never appends another row. It also detects a practical
near-duplicate based on a normalised email plus a short configured time window;
the result is safe to return without exposing another lead's data.

The Sheet columns are:

1. Submission date and time
2. Submission ID
3. First name
4. Surname
5. Email
6. WhatsApp
7. Main goal
8. Current difficulty
9. Consent
10. Source page
11. Language
12. Lead status (`New`)
13. Notes
14. Notification status
15. Remaining email quota

After a successful append, the receiver checks
`MailApp.getRemainingDailyQuota()`. If it can send, it emails
`toslondon9@gmail.com` with a subject such as `New UYP 7-Day Lead: Firstname
Surname`, all submitted fields, and a clickable WhatsApp link. If email is
unavailable or fails, the appended row remains valid, its notification status
is updated to `Pending` or `Failed`, and the response remains `stored: true`
with a non-sensitive notification-state code. The browser can state that
registration succeeded and that follow-up notification could not be confirmed,
without retrying or creating another Sheet row.

## Privacy copy

The Start Free page will replace “No sign-up or purchase required” with accurate
registration-required/free wording. It will state that registration details are
stored securely in Tariq's private lead sheet, while lesson-completion progress
remains on the visitor's device unless a later system says otherwise.

The Privacy page will narrowly disclose the collected fields, free-experience
delivery and relevant follow-up purpose, private Google Sheet storage, the
contact address `toslondon9@gmail.com`, and requests for access, correction or
deletion. It will not invent legal registrations, processors, retention periods
or security certifications. Consent is required for this specific service and is
never automatically selected.

## Manual setup

Stage 1 documentation will give child-simple instructions to:

1. Create a private Google Sheet and add the documented columns in the supplied
   order.
2. Create a standalone Apps Script project under the account that owns the
   Sheet.
3. Paste the receiver source and set each Script Property without committing
   its value.
4. Authorise the Sheet and Mail services from the Apps Script editor.
5. Deploy through **Deploy → New deployment → Web app**, execute as the owner,
   allow the public audience required for form submissions, and copy the `/exec`
   URL.
6. Provide the `/exec` URL to Codex for Stage 2; do not place it in the page.
7. Create the independent Cloudflare Worker and Rate Limiting binding.
8. Set the two Worker secrets and the approved origin configuration.
9. Deploy the Worker, supply its public Worker URL to the site configuration,
   and perform one marked test submission.

The setup guide will call out that the Apps Script deployment owner must retain
access, because Google web apps can stop working when ownership changes.

## Tests

Tests will cover the Worker request boundary, exact CORS behavior, origin and
method rejection, maximum body size, server-side field validation, anti-spam
checks, rate-limit handling, upstream timeout, generic error envelopes and the
single-attempt policy.

The Start Free tests will cover labels, client validation, required consent,
English/Spanish translations, accessibility hooks, success state, retained values
after errors, secure WhatsApp markup, existing lesson links and preservation of
local-only completion tracking. Existing commercial tests will prove payment URLs
remain unchanged. The complete repository test suite and deterministic static
build will run before Stage 2 publication.

Apps Script itself cannot run in the local Node test runner. Its pure validation
contract will be mirrored in Worker tests and verified in Stage 2 with one
clearly marked real test submission, direct Sheet-row confirmation, and email
receipt confirmation. The test row is removed only with explicit authorisation.

## Rollback and non-goals

The frontend is configured only after a real Worker URL exists. Removing that
configuration disables registration rather than sending visitors to a fallback
or placeholder endpoint. The existing public lesson URLs and device-only
progress remain available throughout.

This release does not add authentication, passwords, payment collection,
storage of individual lesson progress, analytics logging of leads, changes to
the AI Mentor Worker, or a dashboard for lead management.
