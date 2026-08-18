import { t } from "../content/translations.mjs";

export function mountNavigation(document) {
  const root = document?.querySelector?.("[data-site-navigation]");
  const button = root?.querySelector?.("[data-navigation-toggle]");
  const panel = root?.querySelector?.("[data-navigation-panel]");
  const body = document?.body;

  if (!root || !button || !panel || !body) return () => {};

  const desktopQuery = document.defaultView?.matchMedia?.("(min-width: 1081px)");

  const setOpen = (open, restoreFocus = false) => {
    const labelKey = open ? "menu.close" : "menu.open";
    const language = document.documentElement?.lang === "es" ? "es" : "en";
    button.setAttribute("aria-expanded", String(open));
    if (button.dataset) button.dataset.i18nAriaLabel = labelKey;
    button.setAttribute("aria-label", t(labelKey, language));
    panel.hidden = !open;
    body.classList.toggle("navigationOpen", open);
    if (!open && restoreFocus) button.focus();
  };

  const onToggle = () => setOpen(button.getAttribute("aria-expanded") !== "true");
  const onKeydown = (event) => {
    if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
      setOpen(false, true);
    }
  };
  const onDocumentClick = (event) => {
    if (button.getAttribute("aria-expanded") === "true" && !root.contains(event.target)) {
      setOpen(false, true);
    }
  };
  const onPanelClick = (event) => {
    if (event.target.closest?.("a[href]")) setOpen(false, true);
  };
  const onBreakpointChange = (event) => {
    if (event.matches) setOpen(false);
  };

  root.classList.add("navigationEnhanced");
  setOpen(false);
  button.addEventListener("click", onToggle);
  panel.addEventListener("click", onPanelClick);
  document.addEventListener("keydown", onKeydown);
  document.addEventListener("click", onDocumentClick);
  if (typeof desktopQuery?.addEventListener === "function") {
    desktopQuery.addEventListener("change", onBreakpointChange);
  } else {
    desktopQuery?.addListener?.(onBreakpointChange);
  }

  return () => {
    button.removeEventListener("click", onToggle);
    panel.removeEventListener("click", onPanelClick);
    document.removeEventListener("keydown", onKeydown);
    document.removeEventListener("click", onDocumentClick);
    if (typeof desktopQuery?.removeEventListener === "function") {
      desktopQuery.removeEventListener("change", onBreakpointChange);
    } else {
      desktopQuery?.removeListener?.(onBreakpointChange);
    }
    setOpen(false);
    root.classList.remove("navigationEnhanced");
    panel.hidden = false;
  };
}

if (typeof document !== "undefined") {
  mountNavigation(document);
}
