# The Inner Circle — Barcelona
## Approved interest-registration email sequence

**Trigger:** A person successfully registers interest through the Inner Circle page.
**Schedule:** Email 1 immediately; Email 2 on Day 2; Email 3 on Day 4; Email 4 on Day 7.
**Event date:** TBA.
**Event location:** TBA.
**Hotel reference:** Hotel Casa Fuster is linked as a venue inspiration only. No venue booking, partnership or event arrangement is confirmed.
**Primary page:** https://unleashyourpowerwithtariq.com/inner-circle/
**Hotel link:** https://www.hotelcasafuster.com/

---

## Email 1 — Immediately
**Subject:** We've received your Inner Circle application 🥂

Thank you for your interest in **The Inner Circle — Barcelona**.

We're bringing together a small group of curious, ambitious and open-minded people to connect, exchange ideas and explore the CASHFLOW game and the thinking behind it.

**Think. Connect. Play. Grow.**

Our gatherings are planned in Barcelona, with free Founding Membership limited to just 10 people.

**Date:** TBA  
**Location:** TBA

[Discover The Inner Circle](https://unleashyourpowerwithtariq.com/inner-circle/)

[Explore Hotel Casa Fuster](https://www.hotelcasafuster.com/) — a possible source of inspiration for the kind of setting we have in mind; no venue is confirmed.

We'll review your application and be in touch personally.

---

## Email 2 — Day 2
**Subject:** It's about more than the game

The CASHFLOW game offers an opportunity to explore how we think about money, financial decisions, assets and liabilities — all in an engaging, interactive setting.

But The Inner Circle is also about the people around the table: sharing perspectives, learning from one another and building genuine connections.

That's what makes the experience different.

[Discover The Inner Circle](https://unleashyourpowerwithtariq.com/inner-circle/)

[Explore Hotel Casa Fuster](https://www.hotelcasafuster.com/)

---

## Email 3 — Day 4
**Subject:** Imagine the conversations around the table ☕

A relaxed setting, interesting people, fresh perspectives and conversations that continue long after the game ends.

That's the atmosphere we're creating.

With regular gatherings planned in Barcelona and a maximum of 10 Founding Members, The Inner Circle is designed to be personal, welcoming and engaging.

**Date:** TBA  
**Location:** TBA

[Discover The Inner Circle](https://unleashyourpowerwithtariq.com/inner-circle/)

[Explore Hotel Casa Fuster](https://www.hotelcasafuster.com/) for a glimpse of the kind of setting that inspires us. The event venue is still TBA.

---

## Email 4 — Day 7
**Subject:** Your next step with The Inner Circle 🥂

Thank you again for your interest.

We're preparing to welcome our first 10 Founding Members. The launch date and gathering details will be confirmed in due course.

Membership will initially be free, with applications reviewed to help create the right group.

If you've already applied, we'll be in touch personally with the next steps.

We look forward to welcoming you.

[Discover The Inner Circle](https://unleashyourpowerwithtariq.com/inner-circle/)

[Explore Hotel Casa Fuster](https://www.hotelcasafuster.com/) — venue inspiration only; the event location remains TBA.

**Think. Connect. Play. Grow.**

---

## Automation and acceptance requirements

1. Replace the current mailto-only form with a secure server-side registration endpoint and persist each successful interest registration.
2. Send Email 1 only after the registration is successfully saved.
3. Schedule Emails 2, 3 and 4 relative to the registration timestamp: +2 days, +4 days and +7 days.
4. Prevent duplicate enrolments and duplicate sends; use idempotency and per-contact/per-email send status.
5. Provide an unsubscribe mechanism and honour opt-outs before every scheduled send.
6. Store consent evidence, registration timestamp, language preference and delivery status; include appropriate privacy notice and retention controls.
7. Support English and Spanish versions, following the language selected on the page.
8. Do not send the sequence to existing applicants again when they re-submit; handle updates without restarting the sequence unless explicitly intended.
9. Keep application review separate from the automated sequence. These emails acknowledge interest; they do not confirm acceptance or membership.
10. Test successful registration, failed registration, duplicate submission, delayed jobs, bounce/unsubscribe handling, both languages and all four send timings before enabling live sends.

**Important current-state note:** The live Inner Circle page currently uses a mailto form and its own disclaimer says applications are not yet stored online. The automated sequence cannot go live until the registration form, secure storage and email delivery/scheduling service are implemented and tested.
