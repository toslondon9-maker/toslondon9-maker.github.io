# Master Key Premium Study Experience Design

## Goal

Turn `/master-key-system/` into a polished, accessible study experience while retaining the existing Week 1–24 source material, Q&A, videos, links, and AI prompts unchanged.

## Content Integrity

`content/master-key-curriculum.html` remains unedited. The renderer continues to split its existing 24 chapter fragments and only adds semantic wrappers, state attributes, and navigation around those fragments. Existing exercise text, chapter text, Q&A, video links, and prompt content remain byte-for-byte sourced from the current file.

## Page Structure

1. A premium cream reading surface begins with the fixed heading `THE MASTER KEY SYSTEM`, `24 Weeks to Master the Way You Use Your Mind`, and an accessible live current-chapter status.
2. A sticky, grouped chapter navigator lists 01–24 in the supplied programme groupings: Foundation (1–4), Visualisation (5–11), Concentration (12–18), and Contemplation & Mastery (19–24). It remains horizontally scrollable on mobile.
3. Each existing accordion chapter becomes a focused reading card. Its summary presents chapter number, title and programme stage. Opening or selecting a chapter updates the status, active gold control and fragment URL.
4. The unchanged exercise is placed inside a clearly labelled `THIS WEEK'S PRACTICE` card followed by the approved explanatory line.
5. Existing Q&A, video and AI prompt components keep their current interactions and receive higher-contrast, reading-focused styles.
6. Each open chapter ends with Previous Chapter, a local visual Complete Chapter toggle, and Next Chapter. A subtle coaching link to `/coaching/` follows the chapter content.

## Interaction and Accessibility

- Navigator controls use anchor links and work with JavaScript disabled.
- `curriculum.mjs` progressively enhances the page: a selected link opens the appropriate details element, updates `aria-current`, keeps the current state label accurate and focuses the chapter summary without changing its original content.
- Completion is a non-persistent visual acknowledgement only; it does not claim enrolment or create a user account.
- The page preserves keyboard navigation, visible focus styles, touch-sized controls, heading hierarchy and no-JavaScript access to all content.

## Visual System

The scope is isolated to curriculum selectors. It uses deep navy for framing, warm cream/paper for long reading, restrained gold for state and important actions, modern system/Inter-style body typography, and serif headings. Chapter bodies are restricted to an 860px reading measure with desktop text near 19px and a 1.75 line height. Mobile uses scrollable navigator groups and does not shrink controls below touch size.

## Verification

Automated checks will confirm 24 chapters exactly once, source content remains intact, all four navigator groups/ranges exist, selected chapter state and practice cards are present, CTA and existing links are retained, and desktop/mobile CSS prevents page overflow. The complete suite and deterministic build will run before publication.
