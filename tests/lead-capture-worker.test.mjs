import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import app, { readBodyLimited } from "../backend/lead-capture/src/index.mjs";
import { forwardLead } from "../backend/lead-capture/src/upstream.mjs";

const origin = "https://toslondon9-maker.github.io";
const validLead = {
  submissionId: "9d5e99a1-8280-4e41-89ac-4e2e051569d2", submittedAtMs: Date.now() - 3_000,
  firstName: "Ada", surname: "Lovelace", email: "ada@example.test", whatsapp: "+34611223345",
  goal: "Build a calmer daily practice.", difficulty: "I lose focus when I am busy.", consent: true,
  emailMarketing: false,
  sourcePage: "/start-free/", language: "en", website: "",
};
const env = {
  ALLOWED_ORIGINS: origin,
  GOOGLE_APPS_SCRIPT_EXEC_URL: "https://script.google.com/macros/s/example/exec",
  LEAD_CAPTURE_SHARED_SECRET: "test-secret",
  LEAD_RATE_LIMITER: { limit: async () => ({ success: true }) },
};
function request(path, options = {}) {
  const { headers = {}, ...rest } = options;
  return new Request(`https://worker.example${path}`, { ...rest, headers: { origin, ...headers } });
}

test("lead Worker returns exact-origin CORS and never wildcard CORS", async () => {
  const response = await app.fetch(request("/lead", { method: "OPTIONS" }), env);
  assert.equal(response.status, 204);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), origin);
  assert.equal(response.headers.get("Vary"), "Origin");
  assert.notEqual(response.headers.get("Access-Control-Allow-Origin"), "*");
});

test("lead Worker rejects missing secrets, oversized bodies and disallowed origins safely", async () => {
  const blocked = await app.fetch(new Request("https://worker.example/lead", { method: "POST", headers: { origin: "https://example.invalid" } }), env);
  assert.equal(blocked.status, 403);
  const unavailable = await app.fetch(request("/lead", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(validLead) }), { ...env, LEAD_CAPTURE_SHARED_SECRET: "" });
  assert.deepEqual(await unavailable.json(), { ok: false, code: "unavailable" });
  const oversized = await app.fetch(request("/lead", { method: "POST", headers: { "content-type": "application/json" }, body: "x".repeat(8_193) }), env);
  assert.equal(oversized.status, 413);
});

test("streamed bodies are cancelled as soon as they exceed the request limit", async () => {
  let cancelled = false;
  const request = { body: new ReadableStream({
    start(controller) { controller.enqueue(new Uint8Array(8_000)); controller.enqueue(new Uint8Array(300)); },
    cancel() { cancelled = true; },
  }) };
  await assert.rejects(() => readBodyLimited(request));
  assert.equal(cancelled, true);
});

test("Worker forwards one valid request and accepts a stored pending-notification result", async () => {
  let calls = 0;
  const result = await forwardLead(validLead, env, async (_url, init) => {
    calls += 1;
    assert.match(init.body, /gatewaySecret/);
    return new Response(JSON.stringify({ ok: true, stored: true, notification: "pending" }), { headers: { "content-type": "application/json" } });
  });
  assert.deepEqual(result, { ok: true, stored: true, notification: "pending" });
  assert.equal(calls, 1);
});

test("upstream timeout aborts one request without retrying", async () => {
  let calls = 0;
  const result = await forwardLead(validLead, env, async (_url, init) => {
    calls += 1;
    return new Promise((_, reject) => init.signal.addEventListener("abort", () => reject(new Error("aborted"))));
  }, 1).catch(() => ({ ok: false }));
  assert.deepEqual(result, { ok: false });
  assert.equal(calls, 1);
});

test("Worker rejects a rate-limited request before forwarding", async () => {
  const response = await app.fetch(request("/lead", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(validLead) }), { ...env, LEAD_RATE_LIMITER: { limit: async () => ({ success: false }) } });
  assert.equal(response.status, 429);
  assert.deepEqual(await response.json(), { ok: false, code: "unavailable" });
});

test("the local Worker configuration has no invented deployable rate-limit namespace", () => {
  const config = readFileSync(new URL("../backend/lead-capture/wrangler.jsonc", import.meta.url), "utf8");
  assert.doesNotMatch(config, /namespace_id\s*[:=]\s*["']?1001/);
  assert.match(config, /fails closed/i);
});
