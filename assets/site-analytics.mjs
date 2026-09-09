export const analyticsMeasurementId = "G-7TSSP2WYHJ";
export const analyticsConsentStorageKey = "uyp.analyticsConsent";

const allowedEventNames = new Set([
  "page_view",
  "generate_lead",
  "begin_checkout",
  "article_cta_click",
  "start_free_view",
  "start_free_registration_confirmed",
  "day_1_open",
  "day_7_completion",
  "whatsapp_call_click",
  "foundation_begin_checkout",
  "complete_journey_begin_checkout",
]);
const foundationPaymentUrl = "https://www.paypal.com/ncp/payment/V5QYXZZS6KQE2";

function readChoice(storage) {
  try {
    const value = storage?.getItem?.(analyticsConsentStorageKey);
    return value === "accepted" || value === "declined" ? value : null;
  } catch {
    return null;
  }
}

function writeChoice(storage, value) {
  try {
    if (value) storage?.setItem?.(analyticsConsentStorageKey, value);
    else storage?.removeItem?.(analyticsConsentStorageKey);
  } catch {
    // Consent still applies for this page when storage is unavailable.
  }
}

function getDefaultStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

function safeEventParameters(name, parameters = {}) {
  if (name === "generate_lead") return { method: "website" };
  if (name === "begin_checkout") return { currency: "GBP" };
  if (name === "page_view") return { page_location: typeof parameters.page_location === "string" && parameters.page_location.startsWith("/") ? parameters.page_location : "/" };
  return {};
}

export function createAnalyticsController({ documentRef = globalThis.document, windowRef = globalThis, storage = getDefaultStorage() } = {}) {
  let choice = readChoice(storage);
  let loaded = false;
  const banner = documentRef?.querySelector?.("[data-analytics-banner]");
  const accept = documentRef?.querySelector?.("[data-analytics-accept]");
  const decline = documentRef?.querySelector?.("[data-analytics-decline]");
  const preferences = documentRef?.querySelector?.("[data-analytics-preferences]");

  const updateBanner = () => {
    if (!banner) return;
    banner.hidden = Boolean(choice);
    if (choice) banner.setAttribute?.("aria-hidden", "true");
    else banner.removeAttribute?.("aria-hidden");
  };

  const emit = (name, parameters = {}) => {
    if (!allowedEventNames.has(name) || choice !== "accepted" || typeof windowRef?.gtag !== "function") return false;
    windowRef.gtag("event", name, safeEventParameters(name, parameters));
    return true;
  };

  const emitRouteEvents = () => {
    const pathname = documentRef?.location?.pathname ?? "";
    if (pathname === "/start-free/") emit("start_free_view");
    if (pathname.startsWith("/start-free/day-1-")) emit("day_1_open");
    if (pathname.startsWith("/start-free/day-7-")) emit("day_7_completion");
  };

  const load = () => {
    if (loaded || choice !== "accepted" || !documentRef?.createElement) return;
    loaded = true;
    windowRef.dataLayer = windowRef.dataLayer || [];
    if (typeof windowRef.gtag !== "function") windowRef.gtag = function gtag() { windowRef.dataLayer.push(arguments); };
    windowRef.gtag("js", new Date());
    windowRef.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    windowRef.gtag("config", analyticsMeasurementId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    const script = documentRef.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsMeasurementId}`;
    documentRef.head?.appendChild?.(script);
    emit("page_view", { page_location: documentRef?.location?.pathname || "/" });
    emitRouteEvents();
  };

  const acceptAnalytics = () => {
    choice = "accepted";
    writeChoice(storage, choice);
    if (loaded) {
      windowRef.gtag?.("consent", "update", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      emit("page_view", { page_location: documentRef?.location?.pathname || "/" });
    } else load();
    updateBanner();
  };
  const declineAnalytics = () => {
    choice = "declined";
    writeChoice(storage, choice);
    if (typeof windowRef?.gtag === "function") windowRef.gtag("consent", "update", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    updateBanner();
  };
  const withdraw = () => {
    choice = null;
    writeChoice(storage, null);
    if (typeof windowRef?.gtag === "function") windowRef.gtag("consent", "update", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    updateBanner();
  };

  accept?.addEventListener?.("click", acceptAnalytics);
  decline?.addEventListener?.("click", declineAnalytics);
  preferences?.addEventListener?.("click", withdraw);
  documentRef?.addEventListener?.("uyp:registration-success", () => {
    emit("generate_lead", { method: "website" });
    emit("start_free_registration_confirmed");
  });
  documentRef?.addEventListener?.("click", (event) => {
    const link = event.target?.closest?.("a[href]");
    const href = link?.href ?? "";
    if (href.includes("/start-free/")) emit("article_cta_click");
    if (href.includes("wa.me/34611223345")) emit("whatsapp_call_click");
    if (link?.dataset?.analyticsEvent) emit(link.dataset.analyticsEvent);
    if (href.includes("paypal.com/ncp/payment/")) {
      emit("begin_checkout", { currency: "GBP" });
      if (href.includes(foundationPaymentUrl)) emit("foundation_begin_checkout");
    }
  });

  updateBanner();
  if (choice === "accepted") load();

  return Object.freeze({
    accept: acceptAnalytics,
    decline: declineAnalytics,
    withdraw,
    trackEvent: emit,
    getChoice: () => choice,
  });
}

if (typeof document !== "undefined") createAnalyticsController();
