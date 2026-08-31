# True On-Page AI Mentor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a secure, chapter-aware on-page AI Mentor while preserving the existing prompt-copy fallback and all approved site work.

**Architecture:** GitHub Pages remains the static frontend. A small Cloudflare Worker receives allowlisted mentor/chapter context and bounded conversation history, calls the OpenAI Responses API with a server-side key, and returns plain text; if no deployment credentials exist, the frontend safely falls back to the existing prompt workflow.

**Tech Stack:** Existing Node ESM static renderer, browser JavaScript/CSS, Cloudflare Worker module, OpenAI Responses API, Node built-in tests.

**Spec:** `C:\Users\tsa100\.codex\attachments\8420e575-98d6-46ef-943e-ac695b634986\pasted-text.txt`

## Global Constraints

- Never expose `OPENAI_API_KEY` in HTML, browser JavaScript, source control or built files.
- Keep the current homepage, curriculum, 7-Day funnel/lightbox, coaching, contact, Session Hub, navigation, metadata and EN/ES behavior unchanged.
- Use only fixed mentor IDs, chapter IDs, model allowlist, bounded messages/history and safe text rendering.
- Preserve Copy Prompt and Open ChatGPT fallback actions.
- Do not impersonate Haanel, Rudolph or Saddique or claim endorsement.

---

### Task 1: Secure Worker contract

**Files:**
- Create: `backend/ai-mentor-worker.mjs`
- Create: `backend/wrangler.toml`
- Create: `.env.example`
- Create: `docs/ai-mentor-deployment.md`
- Test: `tests/ai-mentor-backend.test.mjs`

- [ ] Write tests for CORS origin checks, malformed requests, invalid mentor/chapter IDs, bounded message/history, safe generic errors, fixed model selection and Responses API request shape.
- [ ] Run `node --test tests/ai-mentor-backend.test.mjs` and observe expected failures.
- [ ] Implement a Worker `fetch(request, env)` handler with `POST /mentor`, `OPTIONS`, fixed `gpt-5.6-luna` default via `OPENAI_MODEL`, `OPENAI_API_KEY` from `env`, and a fixed safety/system prompt. Return JSON `{reply}` or generic `{error}` without provider details.
- [ ] Run the focused backend tests until green.
- [ ] Document Cloudflare deployment, secret configuration, `ALLOWED_ORIGIN`, spend/rate limits, `AI_MENTOR_ENDPOINT`, testing and rollback. Keep `.env.example` placeholders only.
- [ ] Commit the backend contract and documentation.

### Task 2: On-page AI Mentor renderer

**Files:**
- Modify: `src/pages/ai-mentors.mjs`
- Modify: `tests/ai-mentor-experience.test.mjs`

- [ ] Add failing renderer assertions for perspective/chapter selectors, welcome/status/error regions, message list, question form, starter actions, New Conversation, disclosure and preserved fallback controls.
- [ ] Run the focused AI Mentor tests and confirm failure.
- [ ] Extend the existing renderer using the current `aiMentorChapters`, `mentorProfiles` and `purposes` source of truth; do not duplicate curriculum content.
- [ ] Keep the existing complete prompt in a collapsed/fallback area and add a chat shell with safe labels and EN/ES hooks.
- [ ] Run focused tests until green.
- [ ] Commit the renderer changes.

### Task 3: Chat client behavior

**Files:**
- Modify: `assets/ai-mentors.mjs`
- Modify: `assets/platform.css`
- Modify: `tests/ai-mentor-experience.test.mjs`

- [ ] Add failing tests for endpoint request payload, chapter context, starter questions, follow-ups, bounded history, New Conversation, Enter/Shift+Enter, loading/error fallback, safe text rendering and language labels.
- [ ] Run the focused client tests and confirm failure.
- [ ] Implement fetch to a configured endpoint (default `/api/mentor`), never accept a browser-supplied model/system prompt, render all user/model text with `textContent`, maintain bounded in-memory history, and expose fallback when unavailable.
- [ ] Add responsive premium chat styles with accessible contrast, touch targets and no horizontal overflow at 390px.
- [ ] Run focused tests until green.
- [ ] Commit the client/UI changes.

### Task 4: Static build integration and safety verification

**Files:**
- Modify: `src/page-shell.mjs` only if endpoint configuration must be emitted without secrets
- Modify: `tools/build-site.mjs` only if asset copying is required
- Modify: `tests/build-site.test.mjs`

- [ ] Add tests proving the AI API key string cannot occur in source or generated output, endpoint configuration is non-secret, all existing routes still build, and AI Mentor fallback remains available.
- [ ] Run focused build/security tests and confirm failure before the integration change.
- [ ] Integrate only the public endpoint placeholder/configuration and copy the Worker documentation assets without adding credentials.
- [ ] Run focused tests until green.
- [ ] Run the complete suite and deterministic build twice; compare generated output hashes.
- [ ] Review `git diff --check` and confirm no unrelated files changed.

### Task 5: Deployment decision and live verification

**Files:**
- Modify: generated `ai-mentors/index.html` and any generated asset output required by the build

- [ ] Verify desktop and 390px AI Mentor layouts, EN/ES switching, chapter/mentor context, fallback controls, no overflow and no console errors.
- [ ] If authorized backend credentials are available, deploy the Worker and verify a real request without exposing secrets; otherwise leave the backend documented but undeployed and verify the static fallback live.
- [ ] Commit only the final static/backend-safe changes, push `main`, and verify the live page and API status honestly.

