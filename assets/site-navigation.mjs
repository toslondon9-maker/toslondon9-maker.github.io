export function mountNavigation(document) {
  const root = document?.querySelector?.("[data-site-navigation]");
  const button = root?.querySelector?.("[data-navigation-toggle]");
  const panel = root?.querySelector?.("[data-navigation-panel]");
  const body = document?.body;

  if (!root || !button || !panel || !body) return () => {};

  const desktopQuery = document.defaultView?.matchMedia?.("(min-width: 1081px)");

  const setOpen = (open, restoreFocus = false) => {
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
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
  desktopQuery?.addEventListener?.("change", onBreakpointChange);

  return () => {
    button.removeEventListener("click", onToggle);
    panel.removeEventListener("click", onPanelClick);
    document.removeEventListener("keydown", onKeydown);
    document.removeEventListener("click", onDocumentClick);
    desktopQuery?.removeEventListener?.("change", onBreakpointChange);
    setOpen(false);
    root.classList.remove("navigationEnhanced");
    panel.hidden = false;
  };
}

if (typeof document !== "undefined") {
  mountNavigation(document);
}
