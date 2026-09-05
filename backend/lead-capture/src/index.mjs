import { MAX_LEAD_REQUEST_BYTES, validateLeadPayload } from "../../../assets/lead-capture-contract.mjs";
import { allowedOrigin, corsHeaders } from "./cors.mjs";
import { forwardLead } from "./upstream.mjs";

function newRequestId() {
  return crypto.randomUUID();
}
function logOutcome(requestId, outcome, status) {
  console.log(JSON.stringify({ requestId, timestamp: new Date().toISOString(), outcome, status }));
}
function response(body, status, origin, requestId, outcome) {
  if (requestId && outcome) logOutcome(requestId, outcome, status);
  const headers = { "content-type": "application/json", ...corsHeaders(origin) };
  if (requestId) headers["X-Request-ID"] = requestId;
  return new Response(JSON.stringify(body), { status, headers });
}
function configured(env) {
  try { const url = new URL(env.GOOGLE_APPS_SCRIPT_EXEC_URL); return Boolean(env.LEAD_CAPTURE_SHARED_SECRET && url.protocol === "https:" && url.pathname.endsWith("/exec")); } catch { return false; }
}
export class RequestTooLargeError extends Error {}
export async function readBodyLimited(request, maximum = MAX_LEAD_REQUEST_BYTES) {
  const reader = request.body?.getReader?.();
  if (!reader) return "";
  const chunks = []; let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > maximum) { await reader.cancel(); throw new RequestTooLargeError(); }
      chunks.push(value);
    }
  } finally { reader.releaseLock?.(); }
  const bytes = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(bytes);
}
const app = { async fetch(request, env) {
  const isLeadPost = request.method === "POST" && new URL(request.url).pathname === "/lead";
  const requestId = isLeadPost ? newRequestId() : "";
  const origin = allowedOrigin(request, env);
  if (!origin) return response({ ok: false, code: "unavailable" }, 403, null, requestId, isLeadPost ? "origin_rejected" : "");
  if (request.method === "OPTIONS" && new URL(request.url).pathname === "/lead") return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (request.method !== "POST" || new URL(request.url).pathname !== "/lead" || !request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return response({ ok: false, code: "unavailable" }, 404, origin, requestId, isLeadPost ? "invalid" : "");
  const length = Number(request.headers.get("content-length"));
  if (Number.isFinite(length) && length > MAX_LEAD_REQUEST_BYTES) return response({ ok: false, code: "unavailable" }, 413, origin, requestId, "invalid");
  if (!configured(env)) return response({ ok: false, code: "unavailable" }, 503, origin, requestId, "upstream_error");
  const limit = await env.LEAD_RATE_LIMITER?.limit({ key: request.headers.get("CF-Connecting-IP") ?? "anonymous" });
  if (!limit?.success) return response({ ok: false, code: "unavailable" }, 429, origin, requestId, "rate_limited");
  let body; try { body = await readBodyLimited(request); } catch (error) { if (error instanceof RequestTooLargeError) return response({ ok: false, code: "unavailable" }, 413, origin, requestId, "invalid"); return response({ ok: false, code: "unavailable" }, 400, origin, requestId, "invalid"); }
  let payload; try { payload = JSON.parse(body); } catch { return response({ ok: false, code: "invalid" }, 400, origin, requestId, "invalid"); }
  if (!validateLeadPayload(payload).ok) return response({ ok: false, code: "invalid" }, 400, origin, requestId, "invalid");
  try {
    const result = await forwardLead(payload, env);
    const outcome = result.ok ? (result.duplicate || result.idempotent ? "duplicate" : "accepted") : "upstream_error";
    return response(result, result.ok ? 200 : 503, origin, requestId, outcome);
  } catch (error) {
    return response({ ok: false, code: "unavailable" }, 503, origin, requestId, error?.name === "AbortError" ? "upstream_timeout" : "upstream_error");
  }
} };
export default app;
