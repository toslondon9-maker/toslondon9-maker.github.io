# Seven-Day Master Key System Alignment Design

## Goal

Align the seven online lessons and English workbook around one bilingual canonical content source, adding beginner-friendly optional Master Key System connections without changing registration, progress storage, analytics, routes, branding, or commercial offers.

## Source and safety boundaries

- Use the supplied workbook PDF as the current presentation baseline.
- Use Parts One to Seven of the supplied Master Key System PDF as source material for paraphrased principles and exercises.
- Do not copy large passages or reproduce source wording as lesson text.
- Preserve the independent-coaching disclaimer and avoid guaranteed claims about wealth, healing, manifestation, or transformation.

## Content architecture

Create `content/seven-day-canonical.json` as the single bilingual source. Each lesson contains the existing title and core lesson fields plus `mksPart`, `mksConnection`, `optionalPractice`, `practiceTime`, and localized `en`/`es` values. `content/seven-day-experience.mjs` maps route metadata and translation keys to that source. `content/translations.mjs` exposes the canonical copy to the existing language switcher without duplicating lesson prose.

The workbook generator reads the same JSON source, so the English workbook's lesson title, teaching, observation, reflection, action, MKS connection, optional practice, and time wording match the online lesson exactly. The existing generated PDF path and dashboard link remain unchanged.

## Rendering

Keep the current teaching, observation, reflection, core action, progress, privacy, navigation, and Day 7 coaching sections. Add `MASTER KEY CONNECTION` and `OPTIONAL MKS PRACTICE` sections after the core action, with clear optional wording and suggested time. Add corresponding typography and mobile-safe spacing using the existing design system.

## Verification

Add focused tests before implementation for canonical structure, all seven part mappings, bilingual copy, online/workbook parity, optional timing, route/progress/registration/analytics preservation, and embedded-font/PDF output. Run focused tests, workbook and contract tests, full tests, production build, deterministic build, `git diff --check`, and visual checks at desktop and 390px widths. Do not commit, push, publish, or deploy.
