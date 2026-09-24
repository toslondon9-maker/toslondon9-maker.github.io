const reduceMotion = () => globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;

function focusRegistration(documentRef) {
  const registration = documentRef.querySelector?.("#start-free-registration");
  const firstName = registration?.querySelector?.("[name=firstName]");
  registration?.scrollIntoView?.({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });
  firstName?.focus?.({ preventScroll: true });
}

export function mountStartFreeConversion(documentRef = globalThis.document) {
  if (!documentRef?.querySelectorAll) return () => {};
  const listeners = [];
  for (const cta of documentRef.querySelectorAll("[data-start-free-cta]")) {
    const listener = (event) => {
      event.preventDefault();
      focusRegistration(documentRef);
    };
    cta.addEventListener?.("click", listener);
    listeners.push(() => cta.removeEventListener?.("click", listener));
  }
  return () => listeners.forEach((remove) => remove());
}

if (typeof document !== "undefined") mountStartFreeConversion();
