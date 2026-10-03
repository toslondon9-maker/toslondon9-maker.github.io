# Conversion measurement

The site records anonymous conversion events only after analytics consent is granted. Events describe page views, free-experience registration and CTA or checkout intent; they do not include names, email addresses, WhatsApp numbers or message text.

The main measures are homepage and article CTA clicks, Free 7-Day registration, Foundation and Complete Journey payment intent, WhatsApp and coaching enquiry clicks, and Mastery Circle application clicks. PayPal completion is not observable from this site because payment happens on PayPal; the checkout events measure outbound intent only.

The existing consent banner and `assets/site-analytics.mjs` remain the control point for loading analytics and emitting events. Event parameters are allow-listed and limited to anonymous values.
