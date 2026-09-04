# Seven-Day Lead Capture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a secure, bilingual registration gateway for the free seven-day experience that stores accepted leads in a private Google Sheet and sends a notification without changing the existing AI Mentor or commercial site behavior.

**Architecture:** The static Start Free page posts to a new, independent `unleash-your-power-leads` Cloudflare Worker. The Worker validates and rate-limits the request, then performs one timeout-bound server-to-server POST to a Google Apps Script `doPost(e)` web app. Apps Script validates again, writes a locked/idempotent Sheet row, and records notification status before returning a small success envelope.

**Tech Stack:** Existing Node static-site generator and Node test runner; browser ES modules; Cloudflare Workers and Rate Limiting binding; Google Apps Script, Google Sheets, `LockService`, `PropertiesService`, and `MailApp`.

**Spec:** `docs/superpowers/specs/2026-09-04-seven-day-lead-capture-design.md`

## Global Constraints

- Preserve `/start-free/day-1-*` through `/start-free/day-7-*` content and browser-local completion flags exactly.
- Do not modify `backend/ai-mentor-worker.mjs`, `backend/wrangler.toml`, payment links, prices, Pay Now copy, coaching page, navigation destinations, or the header-logo correction.
- The public page may include the Worker endpoint only after a real deployed Worker URL is provided; unset configuration must fail closed.
- No secret, Sheet ID, Apps Script URL, email configuration, lead value, visitor IP address, or full request body may be written to public output, Git, console logs, analytics, or error responses.
- The live browser origin is exactly `https://toslondon9-maker.github.io`; local origins are explicitly enumerated only in the Worker development environment.
- The Apps Script shared secret is sent in the JSON request body as `gatewaySecret`, because `doPost(e)` reliably exposes `e.postData.contents`; it is never placed in a URL or browser request.
- Success means the Sheet row exists. An email-notification failure is reported as a safe registered-success subtype, never retried automatically and never turned into a duplicate lead.
- Do not deploy, push, create cloud resources, configure an endpoint, or change generated public HTML until the Google `/exec` URL and Worker deployment setup are complete in the later release stage.

---

## File Structure

- `assets/lead-capture-contract.mjs` — public-safe shared validation constants and pure field normalisation; imported by the Worker and copied to the static build without secrets.
- `assets/lead-capture-form.mjs` — Start Free progressive enhancement, accessible validation, submit state, success state, and retained values.
- `content/lead-capture-config.mjs` — canonical non-secret Worker endpoint configuration; `null` by default and a real HTTPS URL only in the Stage 2 release commit.
- `src/pages/start-free.mjs` — registration markup and unchanged existing lesson dashboard below it.
- `content/translations.mjs` — English and Spanish registration, validation, success, and honest storage wording.
- `assets/platform.css` — scoped `sevenDayRegistration` styles and mobile layout only.
- `src/pages/legal.mjs` — narrow privacy-policy additions for collected registration data and private Google Sheet handling.
- `tools/build-site.mjs` — adds only the two public-safe lead-capture browser modules to runtime build dependencies.
- `backend/lead-capture/` — independent Worker package, Wrangler configuration, source, and Worker-specific tests.
- `integrations/google-apps-script/lead-capture.gs` — standalone Apps Script receiver source; no values committed.
- `docs/lead-capture-google-sheets-setup.md` — exact Google and Cloudflare setup, testing, monitoring and rollback steps.
- `tests/lead-capture-contract.test.mjs`, `tests/lead-capture-form.test.mjs`, `tests/lead-capture-worker.test.mjs` — focused contracts; existing Start Free, privacy, commercial and build tests are updated only where behavior intentionally changes.

## Shared request contract

The browser submits this JSON only to the Worker:

```js
{
  submissionId: "UUID",
  submittedAtMs: 1760000000000,
  firstName: "Ada",
  surname: "Lovelace",
  email: "ada@example.test",
  whatsapp: "+34611223345",
  goal: "Build a calmer daily practice.",
  difficulty: "I lose focus when I am busy.",
  consent: true,
  sourcePage: "/start-free/",
  language: "en",
  website: "" // honeypot; must stay empty
}
```

The Worker adds `gatewaySecret` and forwards the JSON to Apps Script. Apps
Script returns one of these safe envelopes:

```js
{ ok: true, stored: true, notification: "sent" }
{ ok: true, stored: true, notification: "pending" }
{ ok: false, code: "invalid" | "duplicate" | "unauthorized" | "unavailable" }
```

No envelope contains a Sheet ID, email quota number, email address, existing
lead data, exception text, or secret.

---

### Task 1: Lock the non-secret form and Worker contracts

**Files:**
- Create: `assets/lead-capture-contract.mjs`
- Create: `content/lead-capture-config.mjs`
- Create: `tests/lead-capture-contract.test.mjs`
- Modify: `tools/build-site.mjs`
- Modify: `tests/build-site.test.mjs`

**Interfaces:**
- Produces `validateLeadPayload(payload, nowMs)`, `normaliseLeadPayload(payload)`, `sanitizeSpreadsheetValue(value)`, `isValidInternationalWhatsApp(value)`, `resolveLeadEndpoint(config)`, `MAX_LEAD_REQUEST_BYTES`, and `leadCaptureConfig.endpoint`.
- `leadCaptureConfig.endpoint` is `null` during all pre-release commits; form code must treat any non-HTTPS endpoint as unavailable.

- [ ] **Step 1: Write failing contract tests.**

```js
test("lead contract accepts the approved shape and rejects unsafe input", () => {
  const result = validateLeadPayload(validLead, Date.now());
  assert.equal(result.ok, true);
  assert.equal(validateLeadPayload({ ...validLead, consent: false }, Date.now()).code, "consent-required");
  assert.equal(validateLeadPayload({ ...validLead, whatsapp: "611223345" }, Date.now()).code, "invalid-whatsapp");
  assert.equal(sanitizeSpreadsheetValue("=SUM(A1:A2)"), "'=SUM(A1:A2)");
});

test("unconfigured endpoint fails closed and is never emitted as a fake URL", () => {
  assert.equal(leadCaptureConfig.endpoint, null);
  assert.equal(resolveLeadEndpoint(leadCaptureConfig), null);
});
```

- [ ] **Step 2: Run the focused contract test and confirm it fails because the module does not exist.**

Run: `node --test tests/lead-capture-contract.test.mjs`

Expected: module-not-found failure.

- [ ] **Step 3: Implement the pure contract.**

Use exact limits: names 80, email 254, WhatsApp 32, goal/difficulty 1,000,
body 8,192 bytes. Require UUID-shaped submission ID, non-empty first/surname,
trimmed email with a conservative email pattern, E.164-style `+` number, true
consent, `en` or `es`, `/start-free/` source, blank honeypot and a completion
time at least 3,000 milliseconds old. Return stable non-sensitive codes only.

- [ ] **Step 4: Add public-safe runtime copying and confirm the build dependency test passes.**

Add `assets/lead-capture-contract.mjs` and, later, `assets/lead-capture-form.mjs`
to the explicit `runtimeFiles` list. Do not add `content/lead-capture-config.mjs`
or any backend path to public build dependencies.

- [ ] **Step 5: Run focused tests.**

Run: `node --test tests/lead-capture-contract.test.mjs tests/build-site.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit the contract-only checkpoint.**

```bash
git add assets/lead-capture-contract.mjs content/lead-capture-config.mjs tools/build-site.mjs tests/lead-capture-contract.test.mjs tests/build-site.test.mjs
git commit -m "Define seven-day lead capture contract"
```

### Task 2: Scaffold the isolated Cloudflare Worker and its no-PII boundary

**Files:**
- Create: `backend/lead-capture/package.json`
- Create: `backend/lead-capture/wrangler.jsonc`
- Create: `backend/lead-capture/src/index.mjs`
- Create: `backend/lead-capture/src/cors.mjs`
- Create: `backend/lead-capture/src/upstream.mjs`
- Create: `tests/lead-capture-worker.test.mjs`

**Interfaces:**
- Consumes `validateLeadPayload` and the request contract from Task 1.
- Produces `worker.fetch(request, env, ctx)` with only `POST /lead` and `OPTIONS /lead`.
- Environment contract: `GOOGLE_APPS_SCRIPT_EXEC_URL`, `LEAD_CAPTURE_SHARED_SECRET`, `ALLOWED_ORIGINS`, `LEAD_RATE_LIMITER`.

- [ ] **Step 1: Write failing Worker tests for exact CORS, unsafe origins and generic errors.**

```js
test("lead Worker returns exact-origin CORS and never wildcard CORS", async () => {
  const response = await app.fetch(request("/lead", { method: "OPTIONS", origin: liveOrigin }), env);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), liveOrigin);
  assert.equal(response.headers.get("Vary"), "Origin");
  assert.notEqual(response.headers.get("Access-Control-Allow-Origin"), "*");
});

test("lead Worker rejects missing secrets, bodies over 8192 bytes and disallowed origins safely", async () => {
  assert.equal((await app.fetch(request("/lead", { origin: "https://example.invalid" }), env)).status, 403);
  assert.equal((await app.fetch(oversizedRequest, env)).status, 413);
  assert.deepEqual(await json(missingSecretResponse), { ok: false, code: "unavailable" });
});
```

- [ ] **Step 2: Run Worker tests and confirm they fail before the Worker exists.**

Run: `node --test tests/lead-capture-worker.test.mjs`

Expected: module-not-found failure.

- [ ] **Step 3: Implement the Worker configuration and route boundary.**

Use a separate Worker named `unleash-your-power-leads`. Configure a current
compatibility date, one production origin in `ALLOWED_ORIGINS`, and development
origins `http://localhost:8787` and `http://127.0.0.1:8787` only in a dedicated
development environment. Configure the Workers Rate Limiting binding as
`LEAD_RATE_LIMITER`; use it against `CF-Connecting-IP` without writing the IP
to KV, D1, analytics, console output, or the Sheet.

`index.mjs` must reject unknown route/method/content type; cap bytes before
JSON parsing; call the rate limiter; validate the body; validate that both
secrets and a HTTPS Apps Script `/exec` URL exist; then call `forwardLead`.
Every catch path returns `{ ok: false, code: "unavailable" }` with no exception
details and logs nothing.

- [ ] **Step 4: Implement one timeout-bound upstream attempt.**

```js
export async function forwardLead(payload, env, fetchImpl = fetch) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetchImpl(env.GOOGLE_APPS_SCRIPT_EXEC_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...payload, gatewaySecret: env.LEAD_CAPTURE_SHARED_SECRET }),
      signal: controller.signal,
    });
    return await parseSafeAppsScriptResponse(response);
  } finally {
    clearTimeout(timer);
  }
}
```

Do not retry `fetch`. Accept only a JSON `{ ok: true, stored: true }` response
as registered success. Accept `notification: "pending"` as stored success;
all other upstream outcomes become generic availability failures.

- [ ] **Step 5: Add tests for rate limiting, one attempt, timeout, secret-body forwarding and notification-pending success.**

```js
test("a stored lead with pending notification is successful and upstream is called once", async () => {
  const result = await submit(validLead, envWithPendingNotification);
  assert.deepEqual(result.body, { ok: true, stored: true, notification: "pending" });
  assert.equal(fetchCalls, 1);
});
```

- [ ] **Step 6: Run Worker tests and validate configuration without deployment.**

Run: `node --test tests/lead-capture-worker.test.mjs`

Run: `cd backend/lead-capture && npm test`

Run: `cd backend/lead-capture && npx wrangler check`

Expected: PASS; no `wrangler deploy` command.

- [ ] **Step 7: Commit the isolated Worker foundation.**

```bash
git add backend/lead-capture tests/lead-capture-worker.test.mjs
git commit -m "Add isolated lead capture Worker foundation"
```

### Task 3: Implement the Apps Script receiver and setup documentation

**Files:**
- Create: `integrations/google-apps-script/lead-capture.gs`
- Create: `docs/lead-capture-google-sheets-setup.md`
- Create: `tests/google-apps-script-contract.test.mjs`

**Interfaces:**
- Consumes JSON with `gatewaySecret` and the Task 1 lead fields.
- Produces JSON content responses matching the shared response envelopes.
- Reads only Apps Script Script Properties listed in the spec.

- [ ] **Step 1: Write failing source-contract tests.**

```js
test("Apps Script receiver uses doPost, LockService, Script Properties and no Logger calls", () => {
  const source = readFileSync(scriptUrl, "utf8");
  assert.match(source, /function doPost\(e\)/);
  assert.match(source, /LockService\.getScriptLock/);
  assert.match(source, /PropertiesService\.getScriptProperties/);
  assert.doesNotMatch(source, /Logger\.|console\.log|console\.error/);
});

test("Apps Script source stores notification status and spreadsheet-safe values", () => {
  assert.match(source, /Notification status/);
  assert.match(source, /MailApp\.getRemainingDailyQuota/);
  assert.match(source, /sanitizeSpreadsheetValue/);
});
```

- [ ] **Step 2: Run the test and confirm it fails before receiver creation.**

Run: `node --test tests/google-apps-script-contract.test.mjs`

Expected: file-not-found failure.

- [ ] **Step 3: Implement `doPost(e)` with its shared secret in JSON.**

Parse `e.postData.contents`; compare `gatewaySecret` to the Script Property
before reading the Sheet; then validate and normalise the remaining payload.
Never accept `c` or `sid` request parameters because Apps Script reserves them.
Return `ContentService.createTextOutput(JSON.stringify(envelope))` with JSON
MIME type. Do not echo invalid values or secret values.

- [ ] **Step 4: Implement lock-protected idempotency and Sheet writes.**

Acquire the script lock with a bounded wait. Under the lock, locate an existing
`Submission ID`; return its stored success status without appending. Check a
normalised-email duplicate within `LEAD_DUPLICATE_WINDOW_MINUTES`; return
`duplicate` without exposing the existing record. Append exactly one row with
the 15 documented columns, `Lead status = New`, blank notes, and notification
status `Pending` before attempting email.

- [ ] **Step 5: Implement notification and partial failure behavior.**

If `MailApp.getRemainingDailyQuota()` is at least one, send one email to the
configured notification address containing safe HTML-escaped values and a
WhatsApp URL built from digits only. Update `Notification status` to `Sent` and
store the remaining quota snapshot. If quota is zero or sending throws, leave
the row, update status to `Pending` or `Failed`, record the quota snapshot, and
return `{ ok: true, stored: true, notification: "pending" }`. Do not throw after
the append and do not invoke another append.

- [ ] **Step 6: Write the setup and operations instructions.**

Document Sheet creation, exact column order, Script Property names, authorising
the script, `/exec` deployment as the owner, handling the account audience,
copying the `/exec` URL, Worker secret commands, one marked test lead, how to
locate notification status, and how to inspect Apps Script executions/quota.
Document that Google account quotas vary and that `MailApp.getRemainingDailyQuota`
is checked per accepted row.

- [ ] **Step 7: Run source-contract tests.**

Run: `node --test tests/google-apps-script-contract.test.mjs`

Expected: PASS.

- [ ] **Step 8: Commit Apps Script and operator documentation.**

```bash
git add integrations/google-apps-script/lead-capture.gs docs/lead-capture-google-sheets-setup.md tests/google-apps-script-contract.test.mjs
git commit -m "Add seven-day lead capture Sheets receiver"
```

### Task 4: Build the bilingual Start Free registration experience

**Files:**
- Create: `assets/lead-capture-form.mjs`
- Modify: `src/pages/start-free.mjs`
- Modify: `content/translations.mjs`
- Modify: `assets/platform.css`
- Modify: `tests/start-free-page.test.mjs`
- Create: `tests/lead-capture-form.test.mjs`

**Interfaces:**
- Consumes `leadCaptureConfig.endpoint`, `validateLeadPayload`, `t(key, language)` and the Worker response envelope.
- Produces form `[data-lead-capture-form]`, error region `[data-lead-capture-status]`, success panel `[data-lead-capture-success]`, and no request when endpoint is null.

- [ ] **Step 1: Write failing page and client tests.**

```js
test("Start Free renders the required accessible bilingual lead form and retains the seven lessons", () => {
  const html = routeRenderers[siteData.routes.startFree](siteData).body;
  assert.match(html, /<form[^>]+data-lead-capture-form/);
  assert.match(html, /<label[^>]+for="lead-first-name"/);
  assert.match(html, /type="checkbox"[^>]+required[^>]+name="consent"/);
  assert.match(html, /href="\/privacy\/"/);
  assert.equal((html.match(/class="sevenDayDashboard__lesson"/g) ?? []).length, 7);
});

test("client preserves values and announces a generic failure", async () => {
  const fixture = mountLeadForm({ fetch: async () => new Response("", { status: 503 }) });
  await fixture.submit(validFields);
  assert.equal(fixture.value("firstName"), validFields.firstName);
  assert.match(fixture.statusText(), /couldn't register/i);
});
```

- [ ] **Step 2: Run tests and confirm they fail before form implementation.**

Run: `node --test tests/start-free-page.test.mjs tests/lead-capture-form.test.mjs`

Expected: assertion/module failure for the absent registration form.

- [ ] **Step 3: Render form markup and translations.**

Add the exact approved English copy and natural Spanish equivalents for heading,
supporting text, all labels, consent, privacy link, existing-student link,
validation errors, busy text, generic failures, and success states. Use native
`required`, appropriate `autocomplete`, `maxlength`, `aria-describedby`,
`aria-invalid`, and a focusable `role="status" aria-live="polite"` message.
No input is prefilled, and no marketing consent is added.

Replace only the inaccurate Start Free statements: registration is required,
the programme is free, registration details are stored in Tariq's private lead
sheet, and lesson completion remains browser-local. Keep the existing lessons,
flyer, workbook, dashboard and progress controls below the form.

- [ ] **Step 4: Implement fail-closed enhancement.**

When `leadCaptureConfig.endpoint` is null or invalid, keep submit disabled with
an honest visible unavailable message and make no network request. When a real
HTTPS Worker endpoint is configured, submit one JSON request, preserving the
same `submissionId` on a retry. Only `ok && stored` shows the welcome panel.
`notification: "pending"` shows a short non-sensitive follow-up notice while
still allowing Day 1. Errors leave values in place and never reveal Worker or
Apps Script details.

- [ ] **Step 5: Add scoped responsive styles.**

Use `.sevenDayRegistration*` selectors only. Match the existing cream, navy and
gold system; use a one-column form at 390px, 44px minimum controls, no horizontal
overflow, visible focus, accessible error contrast, and no changes to header or
navigation selectors.

- [ ] **Step 6: Run focused form tests.**

Run: `node --test tests/start-free-page.test.mjs tests/lead-capture-form.test.mjs tests/seven-day-progress.test.mjs`

Expected: PASS.

- [ ] **Step 7: Commit the static form checkpoint without endpoint configuration.**

```bash
git add assets/lead-capture-form.mjs src/pages/start-free.mjs content/translations.mjs assets/platform.css tests/start-free-page.test.mjs tests/lead-capture-form.test.mjs
git commit -m "Add seven-day registration experience"
```

### Task 5: Update privacy information and lock non-regressions

**Files:**
- Modify: `src/pages/legal.mjs`
- Modify: `tests/legal-pages.test.mjs`
- Modify: `tests/site-offers.test.mjs`
- Modify: `tests/navigation.test.mjs`

**Interfaces:**
- Consumes the approved collection/purpose/storage wording.
- Produces an accurate Privacy Policy section without changing Terms, payment or navigation behavior.

- [ ] **Step 1: Write failing privacy and regression tests.**

```js
test("privacy policy describes seven-day registration and private Sheet storage accurately", () => {
  const html = privacyPage.body;
  assert.match(html, /first name, surname, email address, WhatsApp number/i);
  assert.match(html, /private Google Sheet/i);
  assert.match(html, /toslondon9@gmail\.com/i);
  assert.match(html, /access, correction or deletion/i);
});

test("lead capture work does not alter payments, AI Mentor, header navigation or lesson routes", () => {
  assert.deepEqual(paymentUrls(), approvedPaymentUrls);
  assert.equal(readFileSync(aiMentorWorkerUrl, "utf8"), baselineAiMentorWorker);
  assert.deepEqual(headerDestinations(), approvedHeaderDestinations);
  assert.equal(sevenDayExperience.lessons.length, 7);
});
```

- [ ] **Step 2: Run regression tests and confirm the privacy assertions fail.**

Run: `node --test tests/legal-pages.test.mjs tests/site-offers.test.mjs tests/navigation.test.mjs tests/seven-day-content.test.mjs`

Expected: privacy assertion failure only.

- [ ] **Step 3: Add only the required Privacy Policy section.**

State the collected registration fields, private Google Sheet storage, free
experience delivery and relevant follow-up, `toslondon9@gmail.com`, access/
correction/deletion requests, browser-local lesson progress, and a warning not
to supply unnecessary sensitive information. State that deletion is processed
on request and add the operational retention procedure to the setup guide: a
monthly Sheet review removes leads with completed deletion requests and any
stale entries not needed for an active relationship or legal/administrative
reason. Do not invent a fixed legal retention term or company details.

- [ ] **Step 4: Run focused tests.**

Run: `node --test tests/legal-pages.test.mjs tests/site-offers.test.mjs tests/navigation.test.mjs tests/seven-day-content.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit privacy and regression coverage.**

```bash
git add src/pages/legal.mjs tests/legal-pages.test.mjs tests/site-offers.test.mjs tests/navigation.test.mjs docs/lead-capture-google-sheets-setup.md
git commit -m "Document seven-day registration privacy handling"
```

### Task 6: Complete local quality checks and hold at the configuration gate

**Files:**
- Modify only if generated output differs after the established build: `start-free/index.html`, `privacy/index.html`, copied browser assets, and affected generated pages.
- Test: all `tests/*.test.mjs`

**Interfaces:**
- Consumes all prior tasks with `leadCaptureConfig.endpoint === null`.
- Produces a complete, unconfigured, fail-closed implementation ready for account setup.

- [ ] **Step 1: Run all focused tests.**

Run: `node --test tests/lead-capture-contract.test.mjs tests/lead-capture-worker.test.mjs tests/google-apps-script-contract.test.mjs tests/lead-capture-form.test.mjs tests/start-free-page.test.mjs tests/legal-pages.test.mjs`

Expected: PASS.

- [ ] **Step 2: Run the complete suite and deterministic build twice.**

Run: `node --test tests/*.test.mjs`

Run: `node tools/build-site.mjs --write-public`

Run: `node tools/build-site.mjs --check`

Run: `node tools/build-site.mjs --check`

Expected: all tests pass; both checks print `Build is deterministic`.

- [ ] **Step 3: Inspect the generated Start Free and Privacy output.**

Confirm the generated form has no `https://script.google.com` URL, no Worker URL,
no secret name/value, no fake success state, seven lesson links, the local-only
progress wording, and the privacy disclosure. Confirm `backend/ai-mentor-worker.mjs`,
`backend/wrangler.toml`, pricing source and header source are absent from the
diff.

- [ ] **Step 4: Commit the unconfigured implementation checkpoint locally.**

```bash
git add assets content src tools backend/lead-capture integrations/google-apps-script docs tests start-free/index.html privacy/index.html
git commit -m "Prepare UYP seven-day lead capture"
```

- [ ] **Step 5: Stop and request manual account setup.**

Do not push, deploy, create a Worker, create a Rate Limiting binding, or change
`leadCaptureConfig.endpoint`. Ask the owner to complete the Google steps and
provide the Apps Script production `/exec` URL; then ask for Cloudflare Worker
deployment authority or existing account access.

### Task 7: Google and Cloudflare configuration gate

**Manual actions by the owner:**

- [ ] **Step 1: Set Google Apps Script properties and deploy `/exec`.**

Create the private Sheet; set `LEAD_SHEET_ID`, `LEAD_SHEET_NAME`,
`LEAD_NOTIFICATION_EMAIL`, `LEAD_CAPTURE_SHARED_SECRET`, and
`LEAD_DUPLICATE_WINDOW_MINUTES`; authorise; deploy as a Web App executing as
the owner; test from the Apps Script deployment panel; provide the production
`/exec` URL only to the implementation agent.

- [ ] **Step 2: Create and configure the independent Cloudflare Worker.**

Create only `unleash-your-power-leads` and its Rate Limiting binding. Set
`GOOGLE_APPS_SCRIPT_EXEC_URL` and `LEAD_CAPTURE_SHARED_SECRET` with Wrangler
secrets; configure `ALLOWED_ORIGINS=https://toslondon9-maker.github.io`; deploy
only after local Worker tests pass. Do not alter the existing AI Mentor Worker.

- [ ] **Step 3: Confirm values privately.**

Provide the Worker HTTPS endpoint after deployment. Never paste the shared
secret, Sheet ID, notification credentials or Apps Script property values into
chat, source control or public configuration.

### Task 8: Stage 2 configuration, end-to-end proof and release

**Files:**
- Modify: `content/lead-capture-config.mjs`
- Modify: generated Start Free/asset files only through `node tools/build-site.mjs --write-public`
- Test: existing full suite plus live end-to-end evidence

**Interfaces:**
- Consumes owner-supplied production Worker HTTPS endpoint and independently verified `/exec` configuration.
- Produces the first live registration-capable release.

- [ ] **Step 1: Write a failing configuration test.**

```js
test("production lead configuration is the approved HTTPS Worker endpoint", () => {
  assert.match(leadCaptureConfig.endpoint, /^https:\/\/unleash-your-power-leads\..+\.workers\.dev\/lead$/);
  assert.doesNotMatch(leadCaptureConfig.endpoint, /script\.google\.com|localhost/);
});
```

- [ ] **Step 2: Configure the real Worker endpoint and run the test.**

Set only `leadCaptureConfig.endpoint` to the owner-provided Worker HTTPS URL;
never set the Apps Script URL in this file. Run the focused configuration test
and confirm PASS.

- [ ] **Step 3: Perform one marked live test submission.**

Use an agreed test identity and `sourcePage: "/start-free/"`. Verify exactly
one row with status `New`, a unique submission ID, the selected language and
the expected notification status. Verify the WhatsApp link is correctly formed.
Confirm email delivery to `toslondon9@gmail.com`; if it is pending, confirm the
row remains and its notification status explains why. Remove the test row only
with explicit owner authorisation; otherwise leave it clearly marked `TEST`.

- [ ] **Step 4: Verify a same-ID retry and a legitimate fresh retry.**

Repeat the same submission ID and confirm no new row. Submit a corrected or
later legitimate retry with a new submission ID and confirm the documented
duplicate-window behavior is clear and non-destructive.

- [ ] **Step 5: Run full verification.**

Run: `node --test tests/*.test.mjs`

Run: `node tools/build-site.mjs --write-public`

Run: `node tools/build-site.mjs --check`

Check the live `/start-free/` page at desktop and 390px, keyboard-only form
navigation, EN/ES text, valid submission, invalid submission, failure retention,
Day 1 success action, existing-student link, local progress, payment URLs,
header/navigation, and AI Mentor availability.

- [ ] **Step 6: Review diff, commit and deploy.**

```bash
git diff --check
git diff --name-only
git add content/lead-capture-config.mjs start-free/index.html privacy/index.html assets/lead-capture-contract.mjs assets/lead-capture-form.mjs
git commit -m "Add UYP seven-day lead capture"
git push origin HEAD:main
```

Wait for the GitHub Pages workflow, then fetch the actual live Start Free page
and confirm it references the Worker endpoint but never Apps Script, Sheet or
secret data.

### Task 9: Rollback and operations

**Files:**
- Modify: `docs/lead-capture-google-sheets-setup.md`

**Interfaces:**
- Produces owner-run incident and data-deletion procedures without a public data endpoint.

- [ ] **Step 1: Document immediate rollback.**

To stop new registrations, first remove the Worker endpoint from
`content/lead-capture-config.mjs`, rebuild and deploy; the form then fails
closed. Separately disable the Cloudflare Worker route or delete its secrets.
Do not delete the Google Sheet as a rollback action because it contains accepted
leads.

- [ ] **Step 2: Document lead deletion and notification recovery.**

For a verified access/correction/deletion request received at
`toslondon9@gmail.com`, locate the row by email and submission ID, update or
remove it in the private Sheet, and record the action in the non-public Notes
column. For `Pending`/`Failed` notifications, resend manually from the private
Sheet after verifying the quota; do not replay the browser submission.

- [ ] **Step 3: Document routine quota and retention review.**

Once per month, review `Notification status`, remaining quota snapshots,
Apps Script execution failures and deletion requests. Remove only records no
longer needed for an active relationship, approved follow-up, legal or
administrative need; keep no visitor-IP register. This is an operational policy,
not a claim of an invented statutory retention period.

- [ ] **Step 4: Commit operations documentation.**

```bash
git add docs/lead-capture-google-sheets-setup.md
git commit -m "Document lead capture operations and rollback"
```
