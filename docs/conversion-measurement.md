# Conversion measurement

The site records anonymous conversion events only after analytics consent is granted. Events describe page views, free-experience registration and CTA or checkout intent; they do not include names, email addresses, WhatsApp numbers or message text.

The main measures are consented anonymous events for homepage CTA clicks, Free 7-Day CTA clicks and registration, Foundation page views and PayPal outbound clicks, Complete Journey PayPal outbound clicks, Calendly clicks, WhatsApp clicks, coaching enquiries, Mastery Circle applications and article CTA clicks. PayPal completion is not observable from this static site because payment happens on PayPal; the checkout events measure outbound intent only and must not be reported as completed purchases without a trusted payment-confirmation source.

The existing consent banner and `assets/site-analytics.mjs` remain the control point for loading analytics and emitting events. Event parameters are allow-listed and limited to anonymous values.
