# The Inner Circle — Barcelona
## Welcome and interest-registration email sequence

**Trigger:** A person successfully registers interest through the Inner Circle page.  
**Schedule:** Email 1 immediately; Email 2 on Day 2; Email 3 on Day 4; Email 4 on Day 7.  
**Event date:** TBA.  
**Event location:** TBA.  
**Hotel reference:** Hotel Casa Fuster is a venue inspiration only. No booking, partnership or event arrangement is confirmed.  
**Primary page:** https://unleashyourpowerwithtariq.com/inner-circle/  
**Hotel link:** https://www.hotelcasafuster.com/

---

## Email 1 — Immediately
**Subject:** A warm welcome to The Inner Circle — Barcelona

Dear {{first_name}},

Thank you for registering your interest in **The Inner Circle — Barcelona**. It is a pleasure to welcome you to the first stage of what we hope will become a rather special community.

The Inner Circle is being created for curious, open-minded and enterprising people who enjoy good conversation, fresh perspectives and the opportunity to learn from others. Our intention is to bring together a carefully considered group of people from different backgrounds, united by a shared interest in ideas, entrepreneurship, financial thinking and personal development.

At the heart of our gatherings will be the **CASHFLOW board game**: an engaging way to explore financial concepts, consider decisions from a different perspective and enjoy a little friendly competition. Just as importantly, it gives everyone around the table a natural starting point for conversation and the exchange of ideas.

Our guiding thought is simple:

**Think. Connect. Play. Grow.**

We are planning an intimate founding circle, with just **10 complimentary Founding Membership places** available during the initial launch period. Gatherings are intended to take place in Barcelona.

**Date:** TBA  
**Location:** TBA

We are particularly drawn to distinctive Barcelona settings such as [Hotel Casa Fuster](https://www.hotelcasafuster.com/), whose character and atmosphere capture something of the experience we would like to create. This is an example for inspiration only; the venue has not been confirmed.

In the meantime, you can discover more about the concept here:

[Visit The Inner Circle — Barcelona](https://unleashyourpowerwithtariq.com/inner-circle/)

We will review your expression of interest and be in touch personally as the founding circle takes shape.

With warm regards,  
**The Inner Circle — Barcelona**

---

## Email 2 — Day 2
**Subject:** The conversation begins around the table

Dear {{first_name}},

One of the things we find most interesting about the **CASHFLOW board game** is the way it turns financial concepts into a shared experience.

As the game unfolds, players encounter decisions involving cash flow, assets, liabilities, opportunities and unexpected expenses. It is an opportunity to pause, consider different approaches and notice how our assumptions can influence the choices we make.

Yet the game itself is only part of the appeal.

The real pleasure of The Inner Circle will be the conversation it encourages: hearing how other people approach a challenge, exchanging experiences, questioning familiar ideas and perhaps leaving the table with a perspective you had not considered before.

We want our gatherings to feel welcoming and relaxed, while still offering something stimulating and worthwhile. No two people bring quite the same experience to the table, and that is precisely the point.

If you have not already done so, take a moment to revisit the concept:

[Discover The Inner Circle — Barcelona](https://unleashyourpowerwithtariq.com/inner-circle/)

For a sense of the kind of Barcelona surroundings that inspire us, you can also [explore Hotel Casa Fuster](https://www.hotelcasafuster.com/). Our eventual meeting venue and arrangements remain TBA.

We look forward to sharing more with you.

With best wishes,  
**The Inner Circle — Barcelona**

---

## Email 3 — Day 4
**Subject:** Good company, considered surroundings and conversations worth having

Dear {{first_name}},

Imagine an intimate table, a handful of interesting people and an evening that moves effortlessly between a lively game, thoughtful conversation and the pleasure of meeting someone new.

That is the spirit behind **The Inner Circle — Barcelona**.

We are not setting out to create another conventional networking event. We would rather cultivate a small community in which people feel comfortable sharing ideas, discussing business and life, learning from one another and, in time, forming genuine friendships.

The CASHFLOW game will provide one of our signature shared experiences, but the wider ambition is to create an environment where curiosity is encouraged and every member has something to contribute.

We are taking care over the details, including the atmosphere and surroundings. Barcelona offers some beautiful settings, and [Hotel Casa Fuster](https://www.hotelcasafuster.com/) is one example of the architectural character and understated elegance we admire. It is an inspiration rather than a confirmed venue.

**Gathering date:** TBA  
**Meeting location:** TBA

Our founding group will be deliberately small, with a maximum of 10 complimentary Founding Members during the initial launch period.

You can find the full introduction here:

[Explore The Inner Circle — Barcelona](https://unleashyourpowerwithtariq.com/inner-circle/)

We hope to welcome you to one of our first gatherings.

Warm regards,  
**The Inner Circle — Barcelona**

---

## Email 4 — Day 7
**Subject:** The Inner Circle — a note on what happens next

Dear {{first_name}},

It has been a pleasure introducing you to the thinking behind **The Inner Circle — Barcelona**, and thank you once again for registering your interest.

We are now shaping the founding group and preparing the first gatherings. Our intention is to begin with no more than **10 Founding Members**, with complimentary membership during the initial launch period.

The experience will bring together the CASHFLOW board game, stimulating conversation and the opportunity to meet people with varied interests and experiences. Above all, we want to create a circle that feels considered, welcoming and worthwhile to be part of.

The launch date and meeting arrangements are still being finalised:

**Date:** TBA  
**Location:** TBA

We will contact you personally as the plans develop. Registering your interest is not yet confirmation of membership; applications will be reviewed so that we can establish the right founding group.

If you would like to revisit the concept, you can do so here:

[Visit The Inner Circle — Barcelona](https://unleashyourpowerwithtariq.com/inner-circle/)

And, for a little inspiration on the kind of setting we admire, here is [Hotel Casa Fuster](https://www.hotelcasafuster.com/). It is not a confirmed event venue.

Thank you for your interest. We hope this will be the beginning of some excellent conversations and new connections.

With warm regards,  
**The Inner Circle — Barcelona**

**Think. Connect. Play. Grow.**

---

## Automation and implementation requirements

1. Replace the current mailto-only form with a secure server-side registration endpoint and persist each successful interest registration.
2. Send Email 1 only after the registration has been successfully saved.
3. Schedule Emails 2, 3 and 4 relative to the registration timestamp: +2 days, +4 days and +7 days.
4. Prevent duplicate enrolments and duplicate sends; use idempotency and per-contact/per-email send status.
5. Provide an unsubscribe mechanism and honour opt-outs before every scheduled send.
6. Store consent evidence, registration timestamp, language preference and delivery status; include appropriate privacy notice and retention controls.
7. Support English and Spanish versions, following the language selected on the page.
8. Do not restart the sequence when an existing applicant updates or re-submits their details unless explicitly intended.
9. Keep application review separate from the automated sequence. These emails acknowledge interest; they do not confirm acceptance or membership.
10. Test successful registration, failed registration, duplicate submission, delayed jobs, bounce/unsubscribe handling, both languages and all four send timings before enabling live sends.

**Current-state note:** The live Inner Circle page currently uses a mailto form and states that applications are not yet stored online. The automated sequence cannot go live until secure registration storage and email delivery/scheduling are implemented and tested.
