# Seven-Day Experience and Conversion Journey Design

**Date:** 2026-08-22  
**Status:** Approved in conversation; awaiting written-spec review  
**Site:** Unleash Your Power  
**Deployment:** GitHub Pages using the existing free infrastructure

## Purpose

Create an honest, useful, bilingual seven-day introductory experience that gives visitors immediate value and provides a clear path from curiosity to a direct conversation with Tariq Saddique and, when appropriate, the complete 24-week coaching programme.

The work must preserve the existing premium cream, navy and gold identity, approved programme structure, pricing, contact details, links and GitHub Pages compatibility. It must not invent business facts or imply that Charles F. Haanel endorsed or is affiliated with the modern coaching programme.

## Success Criteria

- A visitor can begin Day 1 immediately without registering or paying.
- Seven complete English and European Spanish lessons are available as real pages.
- Lessons form a clear progressive journey and each contains teaching, observation, reflection and action.
- Optional progress tracking works locally on the visitor's device and is explained honestly.
- Visitors can contact Tariq through the existing WhatsApp number or email with a prefilled message.
- Day 7 offers a natural, low-pressure path to the existing 24-week programme and pricing.
- A printable/downloadable bilingual workbook supports all seven lessons.
- The experience remains usable when JavaScript or local storage is unavailable.
- The released site has no fabricated testimonials, claims, integrations, accounts or payment methods.
- Mobile and desktop verification passes before publication.

## Experience Architecture

### Entry point

The existing `/start-free/` route becomes the dashboard for the free experience. Its primary action opens Day 1 immediately. Registration is not required and the page must not imply that an account has been created or that information has been sent to Tariq.

### Lesson routes

Create seven dedicated lesson pages beneath the free-experience area. Their exact generated paths may follow the repository's established route conventions, but they must be stable, human-readable and compatible with GitHub Pages.

The dashboard displays all seven days, current progress and clear resume navigation. Visitors may open any lesson; the interface encourages the intended order but does not impose artificial calendar locks or claim that a server knows when a day has passed.

### Lesson structure

Every lesson uses the same predictable structure:

1. Short teaching
2. What to observe today
3. Reflection prompt
4. One practical action
5. Mark-today-complete control
6. Previous/next lesson navigation
7. Optional contact action

This consistency should reduce cognitive effort and make the experience feel like a coherent programme rather than seven disconnected articles.

## Canonical Lesson Journey

1. **See What's Running Your Life** — notice thoughts and automatic reactions that normally pass unobserved.
2. **Take Back Your Attention** — practise deliberately choosing where attention goes.
3. **Recognise What Keeps Repeating** — identify recurring mental patterns behind familiar responses and outcomes.
4. **Give Your Mind a Direction** — turn a vague desire into a clear intention the visitor can hold in mind.
5. **Become Someone You Can Rely On** — build self-trust through a small, specific commitment.
6. **Change From the Inside Out** — begin working with the inner pattern that influences outward behaviour.
7. **Make It Part of How You Live** — form a sustainable daily practice and consider the next appropriate step.

The copy should explain that the material is progressive: each lesson prepares the visitor for the next, and deeper awareness, clarity and purposeful action may emerge through consistent practice. The phrase “an almost magical process begins to unfold” may be used as evocative language only when immediately grounded in progressive learning and personal practice. It must not become a guarantee of transformation, health, income or any other result.

Day 7 introduces Tariq's coaching and the complete 24-week programme gently and without false urgency or pressure.

## Language and Editorial Standards

- Provide complete English and polished European Spanish versions.
- Spanish uses natural `tú` language suitable for Spanish speakers in Barcelona, not literal machine translation.
- English spelling follows the site's existing British style, including “recognise” and “programme”.
- Retain the required independence statement: **An independent coaching experience inspired by the Master Key System.**
- Charles F. Haanel may be identified as the author and originator of the Master Key System using only verified facts already approved for the site.
- Do not imply endorsement, partnership, affiliation or participation by Haanel in the modern programme.
- Do not invent biography details, qualifications, student or client numbers, testimonials, success rates, results, statistics or endorsements.

## Progress Tracking and Privacy

Progress is optional browser-side enhancement stored in `localStorage` under a site-specific key. The stored value contains only lesson-completion state; it does not contain names, email addresses, reflection answers or sensitive information.

The interface must disclose, in clear language, that:

- progress remains on the current browser/device;
- progress is not transmitted to or stored by Tariq;
- clearing browser data or changing devices may remove it.

A clearly labelled **Reset progress** control lets the visitor remove saved completion state. It must require a deliberate confirmation before clearing data.

All lesson text, prompts and navigation remain available without JavaScript. If local storage is blocked, full lessons still work and the interface falls back gracefully without claiming that progress was saved.

## Workbook

Provide a polished printable/downloadable workbook covering all seven days. It should match the cream, navy and gold identity and include enough writing space for the observation, reflection and action prompts.

The workbook must not contain fillable or submission controls that imply answers are returned to Tariq. It may be produced as separate English and Spanish versions if that yields clearer typography and easier printing. Any PDF output must be rendered and visually inspected before release to confirm that headings, prompts and writing areas are not clipped.

## Lead and Conversion Journey

The intended path is:

**Homepage → Free 7-Day Experience → Daily progress → Direct conversation → 24-week coaching offer**

### Direct contact

Use the existing approved contact details:

- WhatsApp: `+34 611 223 345`
- Email: `toslondon9@gmail.com`

Actions such as **Tell Tariq I'm starting** and **Ask Tariq a question** open an existing WhatsApp or email mechanism with a concise, prefilled message. The visitor chooses whether to send it. The site must not claim that Tariq has been notified until the visitor sends the message in their own application.

### Booking

Until an approved booking service and real booking URL are supplied, **Book a conversation** routes to WhatsApp/email. Do not invent Calendly, Zoom or other account links. The code may provide a documented integration point for a future booking URL, but the public interface must represent current capability accurately.

### Registration and email

Do not show a registration or email-capture form as operational unless a real approved backend exists. At £0 upfront, immediate access plus direct WhatsApp/email contact is the canonical working approach.

### Payments

Use only the site's existing approved payment method and details. Do not create accounts, introduce a new provider or restore the removed six-payment plan. The locked offer remains:

- Foundation, Weeks 1–4: £97
- Visualisation, Weeks 5–11: £197
- Concentration, Weeks 12–18: £397
- Contemplation & Mastery, Weeks 19–24: £497
- Four stages bought separately: £1,188
- Complete 24-week programme: £997
- Save £191 versus the four founding stage prices
- Combined MSRP: £1,788
- Save £791 versus MSRP
- 44% off full MSRP

### Testimonials and analytics

Do not publish testimonials or testimonial placeholders unless genuine, approved material is provided. If a testimonial component is prepared for later use, it must render nothing when its approved data set is empty.

Do not create analytics accounts or invent tracking IDs. A future analytics integration point may be documented, but no tracking runs until the user approves a provider and supplies the required identifier or account action.

## Visual Design and Responsiveness

- Preserve the current premium cream, navy and gold visual language.
- Reuse the existing typography, navigation, cards, buttons, spacing system and approved imagery where appropriate.
- Do not perform a broad redesign of the homepage or shared site chrome.
- Keep faces and important text in existing images uncropped.
- Use fluid sizing and responsive layouts with no horizontal scrolling.
- Optimise the lesson experience for Android phones, iPhones, tablets and desktop screens.

## Accessibility and Resilience

- Use semantic headings, landmarks, lists, buttons and links.
- All interactive controls must work by keyboard and display a visible focus state.
- Progress controls expose meaningful accessible names and states.
- Language-switcher changes must localise lesson text, navigation, dynamic status messages and accessible labels.
- Text and controls must maintain readable contrast within the premium palette.
- Navigation remains usable with JavaScript unavailable.
- Missing or corrupt progress data is ignored safely and replaced with a clean state.
- Failed storage writes do not block lesson access or navigation.
- External contact links retain an understandable fallback, including the visible contact details where appropriate.

## Testing and Acceptance

Before publishing:

- Add automated tests for all new routes and their English/Spanish content.
- Test the seven-lesson structure, previous/next navigation and dashboard links.
- Test completion, persistence, reset confirmation, malformed stored data and unavailable-storage fallbacks.
- Test that reflection text is never stored.
- Test WhatsApp/email URLs and the approved contact details.
- Test prohibited strings and claims, including removed payment-plan language and unapproved integrations.
- Verify the existing pricing values and week ranges remain exact.
- Run the full repository test suite and deterministic build check.
- Check internal links and assets for all generated pages.
- Perform browser checks at minimum at 390 × 844 and 1440 × 1000, plus a tablet-sized viewport.
- Confirm no clipped text, horizontal overflow, broken images, keyboard traps or console errors.
- Verify English/Spanish switching and persistence across the journey.
- Render and visually inspect the workbook output.

## Release Safety

Create a rollback branch or equivalent recoverable Git reference before each major release. Preserve unrelated user files and uncommitted work.

Generate and inspect a private/local preview before public deployment. Major visual changes require explicit preview approval. Publication happens only after approval, using the existing GitHub Pages workflow. After deployment, verify the actual public URL on mobile and desktop rather than assuming that a successful push proves the site is working.

## Completion Report

The delivery report must separate:

1. **Completed and working** — features verified on the live site.
2. **Prepared but awaiting your action** — optional integrations requiring a real account, URL, ID or approved content.
3. **Still outstanding** — anything not completed, with the reason stated plainly.

## Out of Scope Without Further Approval

- Paid services or subscriptions
- New external accounts
- Server-side registration or databases
- Automated email sequences
- Invented booking or meeting links
- New payment providers or payment plans
- Active analytics tracking
- Public testimonials not supplied and approved by the user
- Claims or credentials not supplied and verified by the user
- Major rebranding or redesign of the wider site

