export const AFFILIATE_STORAGE_KEY = "uyp-affiliate-attribution";
export const AFFILIATE_RETENTION_MS = 60 * 24 * 60 * 60 * 1000;

export function sanitiseAffiliateCode(value) {
  return String(value ?? "").trim().replace(/<[^>]*>/g, "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
}

function read(storage) {
  try { return JSON.parse(storage?.getItem(AFFILIATE_STORAGE_KEY) || "null"); } catch { return null; }
}

export function getStoredAffiliateCode(storage = globalThis.localStorage, now = Date.now()) {
  const record = read(storage);
  if (!record?.affiliate_code || !Number.isFinite(record.affiliate_first_seen) || now - record.affiliate_first_seen >= AFFILIATE_RETENTION_MS) return "";
  return record.affiliate_code;
}

export function captureAffiliateAttribution(locationRef = globalThis.location, storage = globalThis.localStorage, now = Date.now()) {
  const existing = read(storage);
  if (existing?.affiliate_code && Number.isFinite(existing.affiliate_first_seen) && now - existing.affiliate_first_seen < AFFILIATE_RETENTION_MS) {
    return existing;
  }
  const code = sanitiseAffiliateCode(new URLSearchParams(locationRef?.search || "").get("ref"));
  if (!code) { try { storage?.removeItem?.(AFFILIATE_STORAGE_KEY); } catch {} return null; }
  const record = { affiliate_code: code, affiliate_first_seen: now, affiliate_last_seen: now, landing_page: String(locationRef?.pathname || "/") };
  try { storage?.setItem(AFFILIATE_STORAGE_KEY, JSON.stringify(record)); } catch {}
  return record;
}

if (typeof document !== "undefined") {
  const start = () => captureAffiliateAttribution();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true }); else start();
}
