# Task 4 report — static build integration and safety verification

## Result

- Regenerated `ai-mentors/index.html` from the completed renderer and client so the committed static route now includes the on-page conversation shell, current AI Mentor module, and the Copy Prompt/Open ChatGPT fallback.
- Added build regression coverage that checks the committed page for the current client and fallback controls.
- Added public-build security coverage. It verifies the fallback endpoint is `/api/mentor`, rejects endpoint values that resemble credentials, and confirms the sensitive server-side key name is absent from the relevant public source files and every generated build file.
- No browser credential, deployment secret, backend asset, or unrelated route content was added or changed. The existing client fallback supplies the public endpoint, so no additional configuration emission was required.

## Test-first evidence

- Red: running `tests/build-site.test.mjs` directly with the bundled Node runtime initially failed the new committed-page assertion because `ai-mentors/index.html` was stale and lacked `data-ai-mentor-messages`.
- Green: regenerated the static site using `tools/build-site.mjs --write-public`; the focused build test then passed 12/12.

## Verification

- Focused: `node tests/build-site.test.mjs` via the bundled runtime — 12 passed, 0 failed.
- Determinism: `node tools/build-site.mjs --check` run twice — both reported `Build is deterministic`.
- Full suite: every `tests/*.test.mjs` module run directly with the bundled runtime — all 21 modules passed, 0 failures.
- `git diff --check` passed with no whitespace errors.

## Environment note

The normal `node --test` runner cannot spawn child processes in this sandbox (`EPERM`). Running each test module directly executes the same Node test definitions and completed successfully.

## Round 1 fix — explicit public endpoint hook

- Root cause: the initial static integration used only the JSON/client fallback, so the generated page did not expose an explicit non-secret endpoint configuration boundary.
- Added a route-scoped `<meta name="ai-mentor-endpoint" content="/api/mentor">` to the static AI Mentor page.
- Updated the browser client to read that meta value first and retain `/api/mentor` as its safe fallback.
- Extended focused build/client tests to require the emitted hook and the client lookup, then regenerated the committed route. No secret or credential was added.

## Round 2 fix — rollback documentation

- Updated the rollback guidance to reference the actual `ai-mentor-endpoint` meta hook and removed the obsolete static configuration name.
