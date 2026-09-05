export const invitation = "I’ve been exploring a 24-week Master Key System programme called Unleash Your Power. There’s a free 7-Day Experience if you want to try it for yourself. No pressure — I just thought you might find it interesting.";
export const startFreeUrl = "https://toslondon9-maker.github.io/start-free/";

export function buildReferralShareUrl() {
  return `https://wa.me/?text=${encodeURIComponent(`${invitation} ${startFreeUrl}`)}`;
}

export async function copyReferralMessage(navigatorObject = globalThis.navigator) {
  const text = `${invitation} ${startFreeUrl}`;
  if (!navigatorObject?.clipboard?.writeText) return false;
  try { await navigatorObject.clipboard.writeText(text); return true; } catch { return false; }
}

function initReferral() {
  const copyButton = document.querySelector("[data-referral-copy-button]");
  const status = document.querySelector("[data-referral-status]");
  const whatsapp = document.querySelector("[data-referral-whatsapp]");
  if (!copyButton || !status) return;
  whatsapp?.setAttribute("href", buildReferralShareUrl());
  copyButton.addEventListener("click", async () => {
    const copied = await copyReferralMessage();
    status.textContent = copied ? "Copied!" : "Copy unavailable — select the invitation text to copy it.";
    if (copied) window.setTimeout(() => { status.textContent = ""; }, 3500);
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initReferral, { once: true });
  else initReferral();
}
