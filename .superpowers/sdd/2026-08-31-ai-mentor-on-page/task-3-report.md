# Task 3 — Chat client behavior

## Delivered

- Added a configured mentor endpoint with `/api/mentor` as the public fallback.
- Sends only the selected mentor ID, chapter number, and the latest 12 in-memory user/assistant messages; no browser model or instruction input is sent.
- Added starter-question submission, follow-up history, context reset when perspective/chapter changes, New Conversation, and Enter-to-send while preserving Shift+Enter for a newline.
- Added loading, unavailable fallback, safe `textContent` message rendering, and dynamic EN/ES client status labels.
- Preserved Copy Prompt and Open ChatGPT fallback controls.
- Added responsive chat styling with 44px touch targets, focus states, wrapping text, and a single-column form at 640px and below.

## Tests

- Red: the added client/UI contract test failed as expected because `HISTORY_LIMIT` did not exist.
- Green: `node --test tests/ai-mentor-experience.test.mjs` — 9 passed, 0 failed.

## Scope and concerns

- Changed only `assets/ai-mentors.mjs`, `assets/platform.css`, and `tests/ai-mentor-experience.test.mjs`, plus this required report.
- The endpoint remains `/api/mentor` unless a later integration task emits a public `endpoint` value in the existing page data. No secrets were added.
