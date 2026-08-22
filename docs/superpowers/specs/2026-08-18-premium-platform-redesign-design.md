# Unleash Your Power Premium Platform Redesign

Date: 18 August 2026
Status: Approved direction; awaiting owner review of this canonical specification

## Purpose and authority

This specification converts the current static website into a premium, bilingual, multi-page personal-development platform organised around:

**Discover → Experience → Learn → Transform → Master**

It supersedes the earlier zero-cost guided-coaching draft wherever the two disagree. The latest owner instructions are authoritative. In particular:

- Tariq is always spelled **Tariq**.
- The 6 × £169 payment plan and £1,014 total remain removed.
- The mentor experience launches at £0 without paid model calls.
- Existing approved Haanel/Tariq imagery and the cream/portrait/navy homepage treatment are preserved.
- No modern endorsement, affiliation or participation by Charles F. Haanel or Helmar Rudolph is implied.

## Desired customer experience

The site must feel calm, modern, premium and easy to navigate. Each page has one clear purpose, one primary next action and substantially more whitespace than the current long homepage. Detailed content moves to canonical pages; other pages use only short teasers and links.

The primary conversion hierarchy is:

1. **Start Free for 7 Days**
2. **Explore the 24-Week Journey**
3. **Book a Session**

## Technical approach

The repository is a generated Vinext/React static export with no editable application source tree or package manifest. Repeatedly hand-editing compiled HTML, RSC and bundles is fragile.

The redesign will remain a zero-cost static GitHub Pages site but introduce a small maintainable source layer:

- dependency-free Node build script;
- shared HTML templates for navigation, footer and page shells;
- central English/Spanish content registry;
- structured Master Key, taster, resource and mentor data;
- shared CSS design system;
- dependency-free browser modules for navigation, language, tabs, accordions, mentor flows and local progress;
- generated static HTML for every public route.

No framework migration, server, database, account system, API key or paid service is introduced. Existing RSC files may remain for legacy routes during migration, but redesigned pages will not depend on client hydration to display essential content.

## Release strategy

The redesign is delivered in coherent phases so the currently working public site remains available:

1. **Foundation:** shared design system, navigation, footer, language framework, content inventory and route shells.
2. **Core journey:** shorter homepage plus Start Free, Master Key System, Coaching, About Tariq, Resources and Book / Contact pages.
3. **Guided experience:** AI Mentors page, local guided tools, weekly/taster context and local progress.
4. **Consolidation and QA:** remove duplicates, repair links/assets, complete SEO/accessibility/mobile checks and publish the reviewed release.

Each phase must pass automated and browser checks before it can replace public content. No partial page with missing destinations will be published.

## Site map and global navigation

Public navigation:

- Home
- Start Free
- Master Key System
- Coaching
- AI Mentors
- About Tariq
- Resources
- Book / Contact
- FAQ
- EN | ES

The desktop navigation uses compact typography and measured spacing. At widths where all items no longer fit comfortably, it changes to the same accessible menu pattern used on phones rather than wrapping or shrinking text excessively. The mobile menu uses a real button, exposes its state with `aria-expanded`, closes on Escape and after navigation, and restores focus.

Existing routes remain valid or redirect safely:

- `/` — Home
- `/start-free/`
- `/master-key-system/`
- `/coaching/`
- `/ai-mentors/`
- `/about-tariq/`
- `/resources/`
- `/faq/`
- `/contact/`
- `/live-coaching/` — enrolled-student session hub, retained
- `/referral/` — retained and linked contextually
- `/privacy/`
- `/terms/`

## Homepage

The homepage answers only what the platform is, who it is for, what is free, what is paid, who Tariq is, why the process is credible and what to do next.

Order:

1. **Hero:** “Unleash Your Power,” concise change message, approved Tariq imagery, Start Free and 24-Week Journey CTAs.
2. **Journey pathway:** Discover, Experience, Learn, Transform and Master, one sentence each.
3. **Free seven-day teaser:** title and seven approved day names only, linking to Start Free.
4. **Master Key pathway teaser:** short explanation of progressive weekly study, linking to the education page.
5. **Origins and guidance:** the approved cream message, Haanel/Tariq portrait pair and navy message, presented once.
6. **Coaching value teaser:** the four stage names/ranges and £997 full-journey value, linking to Coaching; detailed pricing stays off the homepage.
7. **Mentor teaser:** Haanel, Helmar and Tariq cards, with transparent £0-guidance disclosure.
8. **Final action:** Start Free as primary and Book a Session as secondary.

Long curriculum, founder biography, complete pricing detail, full taster workbook and repeated programme inclusions are removed from the homepage only after being mapped to their canonical pages.

## Start Free

The page presents **7 Days to Change the Way You Use Your Mind** as a guided, trust-building experience. Seven accessible accordion cards reveal one day at a time. The locked titles are:

1. See What’s Running Your Life
2. Take Back Your Attention
3. Recognize What Keeps Repeating
4. Give Your Mind a Direction
5. Become Someone You Can Rely On
6. Strengthen the New Pattern
7. Choose What Happens Next

Existing approved workbook meaning is retained. Day 7 leads naturally to “Ready to Go Deeper?” and the 24-week journey without aggressive repeated selling.

## Master Key System

This is the canonical education page. It contains:

- what the Master Key System is;
- Charles F. Haanel and historical context;
- how weekly study, exercises, reflection, application, repetition and progression work;
- all 24 weeks as accessible expandable cards;
- complete approved weekly exercises;
- a practical FAQ.

The 24 weeks are grouped for education as Foundation (1–4), Awareness & Control (5–11), Application (12–18), and Integration & Mastery (19–24). These educational phase labels do not replace the separately approved commercial stage names on the Coaching page.

Spiritual, metaphysical, health and scientific statements are clearly attributed to their source or presented as historical ideas, not established facts. The page states that Unleash Your Power is an independent coaching experience inspired by the system.

## Coaching

This is the only canonical commercial page. It uses accessible segmented tabs for Overview, four stages, Full Journey and FAQ. Only one panel is visible at a time while all content remains keyboard accessible.

Locked stage facts:

| Stage | Weeks | Founding price | Comparison MSRP |
| --- | --- | ---: | ---: |
| Foundation | 1–4 | £97 | £147 |
| Visualisation | 5–11 | £197 | £297 |
| Concentration | 12–18 | £397 | £597 |
| Contemplation & Mastery | 19–24 | £497 | £747 |

Locked value facts:

- four founding stages separately: £1,188;
- complete 24-week journey: £997;
- save £191 versus the four founding stages;
- combined MSRP: £1,788;
- save £791 versus MSRP;
- 44% off full MSRP;
- no instalment or payment-plan claim.

Each collapsed stage shows only name, range, short outcome, price and CTA. Expanded content explains inclusions. Savings language is factual and does not create false urgency.

## AI Mentors

The page contains three premium guided experiences:

- **Ask Charles Haanel:** responses derived from approved Master Key source material and labelled “AI-guided responses inspired by the teachings and philosophy of Charles F. Haanel.” It never claims Haanel is responding.
- **Ask Helmar Rudolph:** paraphrased educational guidance based on owner-approved public material from `https://en.mrmasterkey.com/`. It focuses on systematic study, practical application, disciplined repetition and clear explanation. It does not copy source passages, repeat strong health/scientific claims as fact, or imply Helmar’s endorsement or participation.
- **Ask Tariq:** action-oriented coaching around responsibility, attention, discipline, consistency, reflection, implementation and positive transformation. It asks useful follow-up questions and never claims Tariq is personally responding in real time.

The £0 release is a deterministic browser-based educational simulation. It uses controlled choices, short optional visitor inputs and curated response templates. It must say that responses are automated educational guidance, not live human or generative-AI conversations. Visitor text stays on the device and is escaped at render time.

## FAQ

The dedicated FAQ page uses concise accessible accordions and covers the Master Key System, intended participants, previous experience, daily commitment, the free challenge, the next step, coaching inclusions, educational scope versus therapy, mentor identity, Spanish study, arranging sessions and payment workflow. Page-specific FAQs may remain on Master Key and Coaching only when they answer a specialist question without duplicating the complete global answer.

## About Tariq

This becomes the canonical founder page, using only supported existing material:

- Tariq’s Story
- Why Unleash Your Power Exists
- Why the Master Key System
- Coaching Philosophy
- The Mission
- How Tariq Works With Students

No credentials, qualifications, awards, outcomes or testimonials are invented. The homepage retains only a short introduction and link.

## Resources

Resources are organised with accessible tabs:

- Workbooks
- Audio
- Exercises
- Downloads
- AI Tools

Every item uses a consistent card with type, purpose and action. Local files are checked during the build. A missing asset is rendered as unavailable for repair rather than linked as though working. The known mismatch between `/audio/my-story-theme.m4a` and the existing MP3 file is corrected.

## Book / Contact

The page preserves the existing approved details and separates:

- Book a Session
- WhatsApp
- Email
- Zoom
- Payment

It uses direct links and honest workflow copy. Zoom access is arranged privately after confirmation. Payment is arranged through the existing approved process. No fake availability, checkout or automatic meeting confirmation is created.

## Content consolidation

The build includes a content map recording each substantial old section, its new canonical destination and whether it is moved, shortened or retained. Unique content is not deleted until represented at its destination.

Canonical ownership:

- Master Key explanations and exercises → Master Key System
- taster workbook → Start Free
- pricing and programme detail → Coaching
- founder story → About Tariq
- downloads and audio → Resources
- guided prompts → AI Mentors
- booking, Zoom and payment workflow → Book / Contact

## Bilingual behaviour

English is the default. A central translation registry supplies polished European Spanish using natural `tú` language suitable for Barcelona. The language choice is stored locally and preserved across routes. Switching language updates:

- navigation and footer;
- page copy and CTAs;
- form labels, validation and status text;
- mentor headings and disclosures;
- accessible labels;
- `html[lang]`, title and meta description.

Prices, names, week ranges, URLs and contact details are shared locked data rather than independently translated strings.

## Design system

The approved cream, navy and gold palette remains. A compact token layer defines colour, typography, spacing, width, radius, shadows, focus rings and button variants.

- One display-serif scale for H1–H3.
- One readable sans-serif body scale.
- Primary, secondary and text CTA variants only.
- Consistent cards and section widths.
- Generous responsive spacing.
- Subtle transitions that respect reduced-motion settings.
- Responsive images with correct aspect ratios, meaningful alt text and lazy loading below the fold.

## Accessibility and interaction

- Semantic headings and landmarks.
- One H1 per page.
- Real buttons for tabs, menus and accordions.
- `aria-expanded`, `aria-controls`, roving or arrow-key tab behaviour where appropriate.
- Visible focus states and 44-pixel minimum interactive targets.
- Escape-to-close menus/dialogs and focus restoration.
- Live regions for validation/status messages.
- No important content hidden only by colour or hover.
- No horizontal overflow at 320, 360, 375, 390, 412, 768, 1024 and 1440 pixels.

## SEO and performance

Every page has a unique title, meta description, canonical URL, H1, logical hierarchy and descriptive image alternatives. `sitemap.xml`, `robots.txt` and the 404 page are updated for the new routes.

Shared CSS/JS is loaded once and kept dependency-free. Non-critical images are lazy-loaded, oversized images are not used where a smaller approved asset suffices, duplicate scripts are removed and essential content renders without JavaScript.

## Safety and trust

The redesign does not invent testimonials, customer counts, results, income claims, medical claims, scientific claims, qualifications, endorsements or quotations. Historical and third-party material is paraphrased conservatively with attribution. The privacy page explains local-only progress and includes a Delete My Saved Progress control.

## Testing and release gates

Test-first implementation covers:

- route generation and unique metadata;
- navigation/footer consistency;
- English/Spanish completeness and persistence;
- locked pricing arithmetic and absent payment plan;
- seven taster records and 24 weekly records;
- accessible tabs, accordions, menus and mentor forms;
- local progress validation, deletion and corrupt-storage fallback;
- preserved contact/payment/WhatsApp/Zoom destinations;
- local asset existence and internal-link integrity;
- spelling of Tariq;
- absence of secret keys, paid API calls and impersonation language;
- build idempotence.

Browser QA covers desktop, tablet, iPhone-class and Android-class widths; navigation; language switching; tabs; accordions; mentor flows; copy/save/delete; downloads; audio; forms; back navigation; focus; reduced motion; overflow and console errors.

## Publication and reporting

Before the redesigned site is pushed, Tariq receives:

- exact changed-file list and diff summary;
- test totals and responsive/browser results;
- a local preview or screenshots;
- known limitations and genuinely unresolved inputs.

The final QA report uses the requested headings: Completed, Moved, Duplicates Removed, New Pages, Fixed, Needs My Input and Warnings. The public site is verified after GitHub Pages reports a successful deployment.

## Completion criteria

The redesign is complete when the new site map, shorter homepage, canonical content pages, accurate coaching offer, bilingual experience, transparent £0 mentor tools, accessible interactions, repaired assets, global navigation/footer and responsive presentation pass all automated and browser checks without requiring paid infrastructure or losing unique existing content.
