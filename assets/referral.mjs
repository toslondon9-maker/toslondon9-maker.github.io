export const invitation = "I’ve been exploring a 24-week Master Key System programme called Unleash Your Power. There’s a free 7-Day Experience if you want to try it for yourself. No pressure — I just thought you might find it interesting.";
export const startFreeUrl = "https://toslondon9-maker.github.io/start-free/";
export function sanitiseAffiliateCode(value) { return String(value ?? "").trim().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase().slice(0, 40); }
export function buildAffiliateLink(code) { const safe = sanitiseAffiliateCode(code); return safe ? `${startFreeUrl}?ref=${encodeURIComponent(safe)}` : startFreeUrl; }
export async function copyAffiliateLink(url, navigatorObject = globalThis.navigator) { if (!navigatorObject?.clipboard?.writeText) return false; try { await navigatorObject.clipboard.writeText(url); return true; } catch { return false; } }

export function buildReferralShareUrl(affiliateUrl = "") {
  if (!sanitiseAffiliateCode(new URL(affiliateUrl || startFreeUrl).searchParams.get("ref"))) return "";
  return `https://wa.me/?text=${encodeURIComponent(`${invitation} ${affiliateUrl}`)}`;
}

export async function copyReferralMessage(affiliateUrl, navigatorObject = globalThis.navigator) {
  if (!affiliateUrl || !sanitiseAffiliateCode(new URL(affiliateUrl).searchParams.get("ref"))) return false;
  const text = `${invitation} ${affiliateUrl}`;
  if (!navigatorObject?.clipboard?.writeText) return false;
  try { await navigatorObject.clipboard.writeText(text); return true; } catch { return false; }
}

function initReferral() {
  const copyButton = document.querySelector("[data-referral-copy-button]");
  const status = document.querySelector("[data-referral-status]");
  const whatsapp = document.querySelector("[data-referral-whatsapp]");
  if (!copyButton || !status) return;
  const codeInput = document.querySelector("[data-affiliate-code]");
  const link = document.querySelector("[data-affiliate-link]");
  const build = document.querySelector("[data-affiliate-build]");
  const setShareState = () => {
    const url = buildAffiliateLink(codeInput?.value);
    const hasCode = Boolean(sanitiseAffiliateCode(codeInput?.value));
    if (link) { link.href = url; link.textContent = url; }
    if (whatsapp) { const shareUrl = buildReferralShareUrl(url); if (shareUrl) whatsapp.href = shareUrl; else whatsapp.removeAttribute("href"); whatsapp.toggleAttribute("aria-disabled", !hasCode); }
    copyButton.disabled = !hasCode;
    return url;
  };
  copyButton.addEventListener("click", async () => {
    const copied = await copyReferralMessage(setShareState());
    status.textContent = copied ? "Copied!" : "Copy unavailable — select the invitation text to copy it.";
    if (copied) window.setTimeout(() => { status.textContent = ""; }, 3500);
  });
  const refresh = () => setShareState();
  build?.addEventListener("click", refresh); codeInput?.addEventListener("input", refresh); refresh();
  const copyLink = document.querySelector("[data-affiliate-copy-link]"); const openLink = document.querySelector("[data-affiliate-open-link]"); const linkStatus = document.querySelector("[data-affiliate-link-status]");
  copyLink?.addEventListener("click", async () => { const copied = await copyAffiliateLink(link?.href || startFreeUrl); if (linkStatus) linkStatus.textContent = copied ? "Copied!" : "Copy unavailable — select the link to copy it."; });
  openLink?.addEventListener("click", () => { if (link) window.open(link.href, "_blank", "noopener,noreferrer"); });
  const application = document.querySelector("[data-affiliate-application]");
  application?.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(application));
    const recipient = application.dataset.affiliateApplicationEmail || "toslondon9@gmail.com";
    const subject = encodeURIComponent("Unleash Your Power affiliate application");
    const body = encodeURIComponent(`First name: ${values.firstName || ""}\nSurname: ${values.surname || ""}\nEmail: ${values.email || ""}\nWhatsApp: ${values.whatsapp || ""}\nPlatform: ${values.platform || ""}\nOrganisation: ${values.organisation || ""}\nPlan: ${values.plan || ""}`);
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    const applicationStatus = application.querySelector("[data-affiliate-application-status]"); if (applicationStatus) applicationStatus.textContent = "Thank you — your application is ready to send.";
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initReferral, { once: true });
  else initReferral();
}
