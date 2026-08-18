# Guided Mentors and Local Progress Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add transparent £0 Haanel, Helmar and Tariq guided experiences, safe browser-local progress and contextual taster/weekly study companions.

**Architecture:** Pure deterministic builders turn controlled visitor selections and curated local context into structured guidance. A separate UI controller renders forms safely, while a versioned storage adapter keeps optional progress in the visitor’s browser without accounts, paid APIs or external transmission.

**Tech Stack:** Browser-native ES modules, static HTML/CSS, JSON, `localStorage`, Node.js built-in tests

**Spec:** `docs/superpowers/specs/2026-08-18-premium-platform-redesign-design.md`

## Global Constraints

- Complete the Platform Foundation and Core Journey Pages plans first.
- Do not call OpenAI or any external model and do not include API keys.
- Do not impersonate Haanel, Helmar or Tariq or imply endorsement/real-time participation.
- Paraphrase approved Helmar themes; do not copy source passages or repeat health/scientific claims as fact.
- Visitor free text stays on the device and is inserted with `textContent`, never raw HTML.
- Tools remain useful when `localStorage` or clipboard access fails.
- English and Spanish behavior must be equivalent.
- Use test-first development and one focused commit per task.

---

### Task 1: Create the Mentor Source Boundaries and Curated Context

**Files:**
- Create: `content/mentors/haanel.json`
- Create: `content/mentors/helmar.json`
- Create: `content/mentors/tariq.json`
- Create: `tests/mentor-content.test.mjs`

**Interfaces:**
- Produces records with `{ id, name, disclosure, themes, questionFlow, responseFrames, es, sources }`.

- [ ] **Step 1: Write failing source-boundary tests**

```js
for (const id of ["haanel", "helmar", "tariq"]) test(`${id} mentor is transparent and bilingual`, () => {
  const record = JSON.parse(readFileSync(new URL(`../content/mentors/${id}.json`, import.meta.url)));
  assert.match(record.disclosure, /automated|inspired|not .* personally/i);
  assert.ok(record.es.disclosure);
  assert.ok(record.themes.length >= 5);
  assert.ok(record.questionFlow.length >= 3);
});

test("Helmar context records approved public sources", () => {
  assert.deepEqual(helmar.sources, ["https://en.mrmasterkey.com/", "https://en.mrmasterkey.com/helmar-rudolph/", "https://en.mrmasterkey.com/beginners-guide/"]);
});
```

- [ ] **Step 2: Run and confirm three missing-file failures**

Run: `node --test --test-isolation=none tests/mentor-content.test.mjs`
Expected: FAIL.

- [ ] **Step 3: Create Haanel context from local approved lessons**

Themes: conscious attention, habit, visualisation, concentration, cause and effect, reflection and progressive practice. Attribute ideas to Haanel/the Master Key System; do not manufacture quotes.

- [ ] **Step 4: Create Helmar context from approved public themes**

Themes: systematic 24-week study, applying rather than merely reading, perseverance, practice, clear explanation and turning principles into daily use. Record sources as provenance. Exclude unverified accolades and avoid medical, scientific and guaranteed-result claims.

- [ ] **Step 5: Create Tariq context from approved site copy**

Themes: responsibility, attention, discipline, consistency, reflection, implementation, aligned action and positive transformation. Use only supported owner-authored positioning.

- [ ] **Step 6: Run tests and commit**

Run: `node --test --test-isolation=none tests/mentor-content.test.mjs`
Expected: PASS.

```bash
git add content/mentors tests/mentor-content.test.mjs
git commit -m "Add transparent mentor source contexts"
```

### Task 2: Build the Pure Deterministic Guidance Engines

**Files:**
- Create: `assets/mentor-guidance.mjs`
- Create: `tests/mentor-guidance.test.mjs`

**Interfaces:**
- Produces: `buildHaanelGuide(input, context)`, `buildHelmarGuide(input, context)`, `buildTariqGuide(input, context)`.
- Each returns `{ title, sections: Array<{ heading, body }>, followUp: string, disclosure: string }`.

- [ ] **Step 1: Write failing builder contract tests**

```js
test("Tariq guide produces a practical next step and follow-up", () => {
  const result = buildTariqGuide({ topic: "procrastination", intention: "finish one page", obstacle: "distraction", language: "en" }, tariq);
  assert.deepEqual(result.sections.map(section => section.heading), ["WHAT I NOTICE", "THE SHIFT", "YOUR NEXT MOVE", "YOUR COMMITMENT"]);
  assert.match(result.followUp, /when|what time|first step/i);
  assert.match(result.disclosure, /not Tariq personally/i);
});

test("Spanish mentor output is not an English fallback", () => {
  const result = buildHelmarGuide({ topic: "study", intention: "aplicar la lección", language: "es" }, helmar);
  assert.equal(result.sections[0].heading, "LO QUE ESTÁS ESTUDIANDO");
});
```

- [ ] **Step 2: Run and confirm missing-export failure**

Run: `node --test --test-isolation=none tests/mentor-guidance.test.mjs`
Expected: FAIL.

- [ ] **Step 3: Implement shared input validation**

Accept only configured topic identifiers, trim text, limit each free-text field to 600 characters and reject empty required values with `{ code:"required", field }`. Builders return data only and never touch the DOM or storage.

- [ ] **Step 4: Implement three distinct response structures**

Haanel connects a selected principle to observation, exercise and reflection. Helmar connects study intention to understanding, application and repetition. Tariq connects the situation to responsibility, one action, timing and commitment. Every result ends with one useful follow-up question.

- [ ] **Step 5: Add safety mutation tests**

Assert no builder output contains “I am Charles”, “I am Helmar”, “I am Tariq”, “guaranteed”, “medical advice”, “live AI” or raw HTML from visitor input.

- [ ] **Step 6: Run tests and commit**

Run: `node --test --test-isolation=none tests/mentor-guidance.test.mjs`
Expected: PASS.

```bash
git add assets/mentor-guidance.mjs tests/mentor-guidance.test.mjs
git commit -m "Build deterministic mentor guidance engines"
```

### Task 3: Build Versioned Browser-Local Progress

**Files:**
- Create: `assets/progress-store.mjs`
- Create: `tests/progress-store.test.mjs`

**Interfaces:**
- Produces: `createProgressStore(storage) -> { load, save, update, clear }`.
- Data: `{ schemaVersion:1, language, currentWeek, completedWeeks, tasterDays, commitments, savedCards }`.

- [ ] **Step 1: Write failing storage tests**

```js
const memory = new Map();
const storage = { getItem:key => memory.get(key) ?? null, setItem:(key,value) => memory.set(key,value), removeItem:key => memory.delete(key) };

test("corrupt data falls back safely", () => {
  storage.setItem("uyp.studentProfile", "{");
  assert.deepEqual(createProgressStore(storage).load().completedWeeks, []);
});

test("clear removes all saved progress", () => {
  const store = createProgressStore(storage);
  store.update(profile => ({ ...profile, currentWeek: 8 }));
  store.clear();
  assert.equal(store.load().currentWeek, 1);
});
```

- [ ] **Step 2: Run and confirm missing-module failure**

Run: `node --test --test-isolation=none tests/progress-store.test.mjs`
Expected: FAIL.

- [ ] **Step 3: Implement validation and fallback**

Clamp weeks to 1–24, taster days to 1–7, deduplicate numeric arrays, limit commitments/cards to 50 records and each string to 2,000 characters, discard unknown properties and retain an in-memory session copy when storage throws.

- [ ] **Step 4: Run tests and commit**

Run: `node --test --test-isolation=none tests/progress-store.test.mjs`
Expected: PASS for defaults, save, update, clear, corrupt data, blocked storage and bounds.

```bash
git add assets/progress-store.mjs tests/progress-store.test.mjs
git commit -m "Add safe browser-local progress storage"
```

### Task 4: Build the AI Mentors Page and Accessible Guided UI

**Files:**
- Create: `src/pages/ai-mentors.mjs`
- Create: `content/pages/ai-mentors.mjs`
- Create: `assets/mentor-ui.mjs`
- Create: `assets/mentors.css`
- Create: `tests/mentor-page.test.mjs`
- Modify: `src/routes.mjs`

**Interfaces:**
- Produces: `renderAiMentors({ language, mentors })`, `mountMentors(root, options)` and `openMentor(id)`.

- [ ] **Step 1: Write failing page and accessibility tests**

```js
test("mentor page presents three transparent guides", () => {
  const html = renderAiMentors({ language: "en", mentors });
  for (const name of ["Ask Charles Haanel", "Ask Helmar Rudolph", "Ask Tariq"]) assert.ok(html.includes(name));
  assert.match(html, /AI educational simulation|automated educational guidance/i);
  assert.match(html, /role="dialog"/);
  assert.match(html, /aria-modal="true"/);
  assert.doesNotMatch(html, /live AI|Charles Haanel is answering/i);
});
```

- [ ] **Step 2: Run and confirm missing-renderer failure**

Run: `node --test --test-isolation=none tests/mentor-page.test.mjs`
Expected: FAIL.

- [ ] **Step 3: Render three cards and one reusable dialog**

Each card explains its source boundary, identifies the experience as an AI educational simulation using automated deterministic guidance, and opens the shared dialog. The dialog has a labelled heading, progress indicator, controlled select/radio inputs, short optional text inputs, inline errors and one primary action at a time.

- [ ] **Step 4: Implement safe progressive interaction**

Use event delegation and `textContent` for output. Trap Tab only while open, close on Escape, restore prior focus and body scroll, and expose status/errors through `aria-live="polite"`. Provide Copy, Save, Start Again and Close actions.

- [ ] **Step 5: Implement failure paths**

Clipboard failure selects the result text and displays bilingual manual-copy guidance. Storage failure leaves the result usable and explains that it was not saved. Empty and over-limit inputs show field-specific messages without losing previous answers.

- [ ] **Step 6: Run tests, mobile keyboard QA and commit**

Run: `node --test --test-isolation=none tests/mentor-page.test.mjs tests/mentor-guidance.test.mjs tests/progress-store.test.mjs`
Inspect 390 × 844 with the dialog open and keyboard-sized viewport; controls remain reachable and 44 pixels high.

```bash
git add src/pages/ai-mentors.mjs content/pages/ai-mentors.mjs assets/mentor-ui.mjs assets/mentors.css src/routes.mjs tests/mentor-page.test.mjs
git commit -m "Build transparent guided mentors experience"
```

### Task 5: Add Contextual Seven-Day Guided Coach Actions

**Files:**
- Modify: `src/pages/start-free.mjs`
- Modify: `assets/mentor-ui.mjs`
- Modify: `tests/start-free.test.mjs`

**Interfaces:**
- Produces: `openTasterGuide(day)` which loads exactly one in-page taster record and opens the shared guide UI.

- [ ] **Step 1: Add failing seven-action tests**

```js
test("each taster day opens one contextual guide", () => {
  const html = renderStartFree({ language: "en" });
  for (let day = 1; day <= 7; day++) assert.equal((html.match(new RegExp(`data-taster-day="${day}"`, "g")) ?? []).length, 1);
});
```

- [ ] **Step 2: Run and verify failure**

Run: `node --test --test-isolation=none tests/start-free.test.mjs`
Expected: FAIL because contextual actions are absent.

- [ ] **Step 3: Add one discreet action per day**

Label the action “Ask Your Guided Coach” / “Consulta a tu guía”. Pass the day, title, reflection and action as context. Day 7 output contains a review and one tasteful 24-week invitation.

- [ ] **Step 4: Save optional completion state**

On explicit Save, add the day to `tasterDays`; never save free-text answers automatically.

- [ ] **Step 5: Run tests and commit**

Run: `node --test --test-isolation=none tests/start-free.test.mjs tests/progress-store.test.mjs`
Expected: PASS.

```bash
git add src/pages/start-free.mjs assets/mentor-ui.mjs tests/start-free.test.mjs
git commit -m "Add contextual taster guidance"
```

### Task 6: Add 24 Weekly Study Companions

**Files:**
- Modify: `src/pages/master-key-system.mjs`
- Modify: `assets/mentor-ui.mjs`
- Modify: `tests/master-key-page.test.mjs`

**Interfaces:**
- Produces: `openWeekGuide(week, action)` where action is `explain`, `apply`, `exercise`, `reflect` or `quiz`.

- [ ] **Step 1: Add failing context-marker tests**

```js
test("each week exposes exactly one study companion", () => {
  const html = renderMasterKeySystem({ language: "en", weeks });
  for (let week = 1; week <= 24; week++) assert.equal((html.match(new RegExp(`data-guided-week="${week}"`, "g")) ?? []).length, 1);
});
```

- [ ] **Step 2: Run and verify failure**

Run: `node --test --test-isolation=none tests/master-key-page.test.mjs`
Expected: FAIL.

- [ ] **Step 3: Render one compact companion per week**

Provide Explain Simply, Apply to My Life, Help With the Exercise, Reflect and Test Understanding. The context is already rendered with the week and no request loads all weeks at runtime.

- [ ] **Step 4: Add check-in and maximum-five-question quiz**

Week 1 asks readiness. Weeks 2–24 ask Yes, Partly or No about the previous exercise and respond without shame. Quiz uses only existing week questions; objectively answerable items score, reflection items record participation without false scoring.

- [ ] **Step 5: Save explicit progress only**

On Save/Complete, add the week to `completedWeeks`, update `currentWeek`, and optionally save the generated action card. Explain that clearing browser data removes progress.

- [ ] **Step 6: Run tests and commit**

Run: `node --test --test-isolation=none tests/master-key-page.test.mjs tests/master-key-data.test.mjs tests/progress-store.test.mjs`
Expected: PASS.

```bash
git add src/pages/master-key-system.mjs assets/mentor-ui.mjs tests/master-key-page.test.mjs
git commit -m "Add weekly guided study companions"
```

### Task 7: Add Privacy Controls and Honest £0 Documentation

**Files:**
- Create: `AI-SETUP.md`
- Modify: `src/pages/privacy.mjs`
- Modify: `assets/progress-store.mjs`
- Modify: `content/translations.mjs`
- Create: `tests/privacy-and-secrets.test.mjs`

**Interfaces:**
- Produces a visible `data-delete-progress` control calling `store.clear()` after confirmation.

- [ ] **Step 1: Write failing disclosure and secret tests**

```js
test("privacy explains and deletes local-only progress", () => {
  const html = renderPrivacy({ language: "en" });
  assert.match(html, /stored only in this browser/i);
  assert.match(html, /Delete My Saved Progress/);
});

test("public source contains no secrets or paid model calls", () => {
  for (const text of publicSourceTexts) {
    assert.doesNotMatch(text, /OPENAI_API_KEY|sk-[A-Za-z0-9_-]{20,}/);
    assert.doesNotMatch(text, /api\.openai\.com|generativelanguage\.googleapis\.com/);
  }
});
```

- [ ] **Step 2: Run and verify disclosure failure**

Run: `node --test --test-isolation=none tests/privacy-and-secrets.test.mjs`
Expected: FAIL because the control/documentation is absent.

- [ ] **Step 3: Add bilingual disclosure and deletion behavior**

Explain what is stored, that it remains in the current browser, that clearing browser data removes it and that visitor notes are not transmitted. Deletion requires one confirmation and announces completion through a live region.

- [ ] **Step 4: Write owner documentation**

`AI-SETUP.md` explains the £0 deterministic design, data behavior, mentor source files, translations, safety limitations, and how a future secure backend could be added without putting a key in public files. State that no paid AI is active.

- [ ] **Step 5: Run tests and commit**

Run: `node --test --test-isolation=none tests/privacy-and-secrets.test.mjs tests/progress-store.test.mjs`
Run: `rg -n "OPENAI_API_KEY|sk-[A-Za-z0-9_-]{20,}|api\.openai\.com" -g "!docs/**" .`
Expected: tests PASS and search returns no matches.

```bash
git add AI-SETUP.md src/pages/privacy.mjs assets/progress-store.mjs content/translations.mjs tests/privacy-and-secrets.test.mjs
git commit -m "Document and protect local guided progress"
```

## Guided experience completion gate

Run:

```bash
node --test --test-isolation=none tests/mentor-content.test.mjs tests/mentor-guidance.test.mjs tests/progress-store.test.mjs tests/mentor-page.test.mjs tests/start-free.test.mjs tests/master-key-page.test.mjs tests/privacy-and-secrets.test.mjs
node tools/build-site.mjs --check
git diff --check
```

Expected: zero failures, no paid API endpoints or secrets, and all three mentor/taster/week flows work in English and Spanish.
