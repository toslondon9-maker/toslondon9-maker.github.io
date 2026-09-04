export function allowedOrigin(request, env) {
  const origin = request.headers.get("Origin") ?? "";
  return String(env.ALLOWED_ORIGINS ?? "").split(",").map((item) => item.trim()).includes(origin) ? origin : null;
}

export function corsHeaders(origin) {
  return origin ? {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": "600",
    Vary: "Origin",
  } : {};
}
