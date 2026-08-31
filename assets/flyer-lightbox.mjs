const initFlyerLightbox = () => {
  const trigger = document.querySelector("[data-flyer-trigger]");
  const dialog = document.querySelector("[data-flyer-dialog]");
  if (!trigger || !dialog) return;
  const closeButton = dialog.querySelector("[data-flyer-close].sevenDayDashboard__flyerClose");
  let restoreFocus;

  const close = () => {
    dialog.hidden = true;
    document.body.classList.remove("flyer-lightbox-open");
    if (restoreFocus) restoreFocus.focus();
  };
  const open = () => {
    restoreFocus = document.activeElement;
    dialog.hidden = false;
    document.body.classList.add("flyer-lightbox-open");
    closeButton?.focus();
  };

  trigger.addEventListener("click", open);
  dialog.addEventListener("click", (event) => {
    if (event.target.matches("[data-flyer-close]")) close();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
    if (event.key === "Tab" && closeButton) {
      event.preventDefault();
      closeButton.focus();
    }
  });
};

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initFlyerLightbox, { once: true });
else initFlyerLightbox();
