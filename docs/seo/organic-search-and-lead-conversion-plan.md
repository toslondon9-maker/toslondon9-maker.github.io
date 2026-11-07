# UYP organic search and lead-conversion plan

Prepared: 2026-11-07
Implementation branch: seo/uyp-lead-generation-funnel-stage-1
Primary outcome: qualified enquiries and paid coaching clients, not traffic volume alone.

## Positioning

Unleash Your Power is an independent coaching experience inspired by Charles F. Haanel's Master Key System. The commercial promise must remain grounded: guided study, practical exercises, reflection, accountability and deliberate practice to help people develop focus, concentration, mental discipline and purposeful action. Do not promise guaranteed transformation, therapeutic outcomes or instant results.

Primary audience: English-speaking adults in the UK and internationally who want more focus, consistency, clarity and achievement and are open to structured personal-development coaching.

Secondary audience: people already searching for Charles F. Haanel, The Master Key System, its 24 lessons and practical exercises.

## Evidence-led baseline

The connected Search Console and GA4 properties were queried through Windsor.ai on 2026-11-07.

Search Console, last 90 days:
- The visible query sample is dominated by branded searches for Tariq Saddique and informational searches around Charles F. Haanel, including "Charles F. Haanel cause of death".
- A small number of impressions exist for "the master key system exercises".
- The available query/page rows show very low non-branded click-through to the site's main lead pages. The sample is too small to claim reliable keyword demand or rank trends.
- Do not mistake impressions or average position for leads.

GA4, last 90 days:
- 311 sessions were attributed to the site's own hostname as a referral on the homepage row; this is not a credible acquisition channel and needs attribution repair.
- 9 sessions were attributed to Google organic in the returned landing-page rows (8 homepage, 1 coaching page).
- 6 sessions were attributed to LinkedIn referral on the homepage, plus 3 to the free-start page.
- One confirmed free-registration event appeared against the self-referral homepage row; no purchase event appeared in the returned data.
- Sessions are not unique people. Checkout clicks are not sales. A purchase must be confirmed by a trusted payment source.

These are diagnostic snapshots, not a statistically reliable conversion rate. Recheck after attribution repair and a clean reporting window.

## Keyword-to-page map

| Search intent | Primary target terms | Destination | Next action |
|---|---|---|---|
| Problem-aware | improve focus, improve concentration, stop overthinking, build self-discipline, overcome procrastination | Homepage and problem-led Insights articles | Free 7-Day Experience |
| Solution-aware | mindset coaching, personal development coach online, focus coaching, mental discipline coaching | Coaching page | Free experience or discovery call |
| Method-aware | Master Key System, Master Key System exercises, 24 lessons, how to study the Master Key System | Master Key System page, Resources and study articles | Free experience, then coaching |
| Author / research | Charles F. Haanel, Charles F. Haanel Master Key System | Haanel biography and method pages | Related guide and free experience |
| Product-aware | Master Key System coaching, 24-week Master Key System programme | Coaching and Complete Journey pages | Qualified enquiry / application |
| Tool-aware | AI Master Key System Study Companion | AI Mentors page | Study Companion, then free experience / coaching |

Do not force every keyword onto every page. One page should have one clear primary intent and a small set of closely related secondary terms. Avoid creating near-duplicate doorway pages.

## Stage-by-stage conversion system

### Stage 1 — Search foundations (this pull)
- Align homepage metadata with focus, mindset coaching and the Master Key System.
- Align the free-start page metadata with its actual free seven-day offer.
- Align the coaching page metadata with the 24-week guided coaching offer and its outcomes.
- Preserve the existing English and Spanish metadata.
- Keep canonical URLs, structured data, consent behaviour and registration contracts unchanged.
- Record the query-to-page map and current measurement limitations.

### Stage 2 — Landing-page relevance and internal links
- Review the homepage H1, first-screen explanation and calls to action against the problem-aware audience.
- Ensure each problem-led article links contextually to the free experience, the relevant method page and the coaching offer.
- Ensure the Master Key System and Haanel pages link back to practical exercises and coaching.
- Add concise, genuinely useful FAQs where they answer real objections; do not add keyword-stuffed FAQ blocks.
- Verify every page has one distinct search intent, a unique title and description, one clear H1 and a canonical URL.

### Stage 3 — Lead-magnet conversion
- Keep the free 7-Day Experience as the main low-friction first step.
- Explain the time commitment, what is included, who it is for and what happens after registration before the form.
- Preserve the existing required fields, WhatsApp consent rules and optional email-marketing consent. Never make marketing consent a condition of access.
- Test registration success and failure paths. A lead-success event must fire only after the registration service confirms storage.
- Do not send personal form details to analytics.

### Stage 4 — Nurture and qualification
- Confirm the immediate welcome email and the scheduled Day 2–7 follow-ups are active, delivered and not in test mode.
- Use each follow-up to reinforce that day's exercise, invite a reflection and offer a relevant next step without pressure.
- At the end of the experience, invite interested participants to a short conversation about goals, fit, time commitment and the right programme.
- Separate educational emails needed to deliver the experience from optional promotional emails; honour consent and unsubscribe requirements.
- Record lead status and source so conversations and outcomes can be reconciled.

### Stage 5 — Paid conversion
- Make the paid journey easy to understand: Foundation as an accessible first paid step where appropriate, and the premium 24-week / group coaching offer for qualified prospects.
- Present price, inclusions, duration, support, suitability and boundaries consistently across pages and calls.
- Use a real discovery conversation or application to qualify premium group clients. Do not use artificial scarcity or guaranteed outcome claims.
- Record completed sales from verified payment evidence, not PayPal button clicks or browser return pages.

### Stage 6 — Acquisition and iteration
- Publish one substantial, genuinely useful search-led article at a time, based on Search Console queries and customer language.
- Prioritise problem-led themes: focus, concentration, overthinking, procrastination, self-discipline and purposeful action.
- Use the existing Monday / Wednesday / Friday LinkedIn cadence to distribute the strongest article or exercise, with consistent campaign UTMs.
- Build authority through original teaching, transparent coaching boundaries, authentic testimonials and useful exercises. Do not buy links or mass-produce thin AI pages.

## Measurement dashboard requirements

Report weekly:
1. Search Console clicks and impressions by query, country, page and device.
2. Organic landing-page sessions after excluding confirmed self-referral and development traffic.
3. Free-experience page views, registration starts and confirmed registrations.
4. Day 1 opens and Day 7 completions.
5. Discovery calls booked and attended.
6. Qualified coaching enquiries.
7. Verified purchases and revenue by offer.
8. Conversion rates between each stage, using consistent denominators.

Required event definitions:
- Registration start: user submits the free-registration form.
- Confirmed registration: lead service confirms storage.
- Day 7 completion: learner completes the final step.
- Checkout start: outbound payment intent only.
- Purchase: trusted payment confirmation with unique transaction ID, currency and value.

## Acceptance gates

- No page is published solely to target a keyword without useful, original content.
- Metadata matches visible page content and the actual offer.
- English and Spanish remain coherent.
- Registration, consent, lead storage, welcome email and follow-up sequence are tested.
- GA4 acquisition reporting no longer mistakes internal site referrals for new acquisition.
- Paid revenue is counted only from verified payment confirmation.
- Performance is reviewed after enough new search data has accumulated; do not promise rankings or lead volumes in advance.
