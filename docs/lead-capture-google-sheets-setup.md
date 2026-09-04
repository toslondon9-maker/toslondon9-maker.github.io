# Seven-Day Lead Capture setup

Do not deploy this receiver until the owner has created a private Google Sheet. Create the columns in the receiver's documented order, add the script, then set these Script Properties: `LEAD_SHEET_ID`, `LEAD_SHEET_NAME`, `LEAD_NOTIFICATION_EMAIL`, `LEAD_CAPTURE_SHARED_SECRET`, and `LEAD_DUPLICATE_WINDOW_MINUTES`.

Deploy it as a Web App that executes as the owner and copy only its production `/exec` URL to the Worker secret configuration. The Worker receives `GOOGLE_APPS_SCRIPT_EXEC_URL` and `LEAD_CAPTURE_SHARED_SECRET` as secrets; its allowed production origin is `https://toslondon9-maker.github.io`.

The Sheet must remain private. Test with one clearly marked test lead after deployment. Review Apps Script executions and the recorded notification status and remaining `MailApp.getRemainingDailyQuota()` value monthly. A stored row is successful even if its notification is Pending or Failed; resend manually from the private Sheet rather than replaying a browser request. Process verified deletion requests through `toslondon9@gmail.com`; monthly, remove completed deletion requests and stale records not needed for an active relationship or legal/administrative reason. To roll back, remove the public Worker endpoint first so the form fails closed; do not delete the Sheet.
