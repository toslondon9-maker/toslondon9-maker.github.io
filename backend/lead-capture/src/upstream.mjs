export async function forwardLead(payload, env, fetchImpl = fetch) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetchImpl(env.GOOGLE_APPS_SCRIPT_EXEC_URL, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...payload, gatewaySecret: env.LEAD_CAPTURE_SHARED_SECRET }), signal: controller.signal,
    });
    const result = await response.json().catch(() => null);
    return result?.ok === true && result.stored === true && ["sent", "pending"].includes(result.notification)
      ? { ok: true, stored: true, notification: result.notification }
      : { ok: false, code: "unavailable" };
  } finally { clearTimeout(timer); }
}
