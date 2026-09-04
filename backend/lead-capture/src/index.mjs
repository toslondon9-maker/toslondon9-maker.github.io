import { MAX_LEAD_REQUEST_BYTES, validateLeadPayload } from "../../../assets/lead-capture-contract.mjs";
import { allowedOrigin, corsHeaders } from "./cors.mjs";
import { forwardLead } from "./upstream.mjs";

function response(body, status, origin) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...corsHeaders(origin) } });
}
function configured(env) {
  try { const url = new URL(env.GOOGLE_APPS_SCRIPT_EXEC_URL); return Boolean(env.LEAD_CAPTURE_SHARED_SECRET && url.protocol === "https:" && url.pathname.endsWith("/exec")); } catch { return false; }
}
const app = { async fetch(request, env) {
  const origin = allowedOrigin(request, env);
  if (!origin) return response({ ok: false, code: "unavailable" }, 403, null);
  if (request.method === "OPTIONS" && new URL(request.url).pathname === "/lead") return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (request.method !== "POST" || new URL(request.url).pathname !== "/lead" || !request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return response({ ok: false, code: "unavailable" }, 404, origin);
  const length = Number(request.headers.get("content-length"));
  if (Number.isFinite(length) && length > MAX_LEAD_REQUEST_BYTES) return response({ ok: false, code: "unavailable" }, 413, origin);
  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > MAX_LEAD_REQUEST_BYTES) return response({ ok: false, code: "unavailable" }, 413, origin);
  if (!configured(env)) return response({ ok: false, code: "unavailable" }, 503, origin);
  const limit = await env.LEAD_RATE_LIMITER?.limit({ key: request.headers.get("CF-Connecting-IP") ?? "anonymous" });
  if (!limit?.success) return response({ ok: false, code: "unavailable" }, 429, origin);
  let payload; try { payload = JSON.parse(body); } catch { return response({ ok: false, code: "invalid" }, 400, origin); }
  if (!validateLeadPayload(payload).ok) return response({ ok: false, code: "invalid" }, 400, origin);
  try { const result = await forwardLead(payload, env); return response(result, result.ok ? 200 : 503, origin); } catch { return response({ ok: false, code: "unavailable" }, 503, origin); }
} };
export default app;
