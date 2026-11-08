# Free 7-Day email sequence: trigger setup and release checklist

This Apps Script owns the welcome email and the Day 2–7 follow-up sequence for registrations submitted through the UYP lead-capture Worker.

## What this change does

- Adds an idempotent `installDailySequenceTrigger()` helper.
- Re-running the installer replaces existing triggers for `sendDueSequenceEmails`, avoiding duplicate daily triggers.
- Adds `removeDailySequenceTriggers()` as a safe rollback.
- Does **not** turn on live sending or change any script properties.

## One-time setup in Google Apps Script

1. Open the Apps Script project attached to the UYP registration spreadsheet.
2. Confirm the existing script properties are present: `LEAD_SHEET_ID`, `LEAD_SHEET_NAME`, `LEAD_NOTIFICATION_EMAIL`, and `LEAD_CAPTURE_SHARED_SECRET`. Never put secret values in GitHub.
3. Set the Apps Script project timezone to `Europe/Madrid` under Project Settings. The sequence date calculation already uses this timezone; the time-based trigger uses the project timezone.
4. Confirm `LEAD_SEQUENCE_MODE` is **not** set to `live` yet.
5. Run `installDailySequenceTrigger()` manually from the editor and approve the requested Apps Script permissions.
6. In the Triggers panel, verify exactly one time-driven trigger exists for `sendDueSequenceEmails`, running daily at approximately 09:00.
7. Complete a controlled test using a dedicated test spreadsheet and test lead addresses. If using `LEAD_SEQUENCE_TEST_EMAIL`, remember that the current sender advances the sequence status after sending to that test recipient; do not use test mode against production leads.
8. Inspect the sent test messages and spreadsheet sequence columns before enabling production delivery.

## Enabling live sending

Only after the test is successful and the business has approved the email wording and consent basis, set the Script Property:

- `LEAD_SEQUENCE_MODE` = `live`

The sequence function sends Day 2–7 messages only to leads whose welcome email status is `sent` and whose `Email marketing consent` field is true. The Day 1 welcome email is sent during registration by the existing `doPost` handler.

If the live mode property is absent or not exactly `live`, the daily handler will not send to registrants unless a test recipient is configured.

## Monitoring

- Review Apps Script Executions after the first scheduled run and after any script change.
- Check the spreadsheet columns `Sequence day sent`, `Sequence email sent at`, `Sequence email status`, and `Sequence email error`.
- Check MailApp daily quota before expecting all due emails to send.
- A failed message is recorded as failed and remains eligible for a later retry; inspect repeated failures before leaving the automation unattended.

## Rollback

Run `removeDailySequenceTriggers()` from the Apps Script editor. This removes only triggers whose handler is `sendDueSequenceEmails`; it does not delete leads, sent-email history, or script properties. To stop live sends immediately, remove the `LEAD_SEQUENCE_MODE` property or change it away from `live`.

## Not covered by this change

- This does not deploy the Apps Script project or create its trigger remotely.
- This does not verify Cloudflare Worker environment variables or the Apps Script web-app deployment.
- This does not implement PayPal payment webhooks, purchase verification, paid-customer onboarding, or cancellation/suppression of free-sequence emails after a purchase.
- It does not prove email deliverability; production must be verified through Apps Script execution logs and actual inbox receipt.
