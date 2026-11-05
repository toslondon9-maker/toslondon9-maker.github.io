const dialog = document.querySelector("#home-transformation-dialog");
if (dialog instanceof HTMLDialogElement) {
  const openButton = document.querySelector("[data-transformation-open]");
  const closeButton = dialog.querySelector("[data-transformation-close]");
  openButton?.addEventListener("click", () => {
    if (!dialog.open) dialog.showModal();
  });
  closeButton?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}
