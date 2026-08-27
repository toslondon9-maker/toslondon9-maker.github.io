function copyText(value) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value);

  const field = document.createElement("textarea");
  field.value = value;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.append(field);
  field.select();
  document.execCommand("copy");
  field.remove();
  return Promise.resolve();
}

for (const button of document.querySelectorAll(".aiMasteryTop button")) {
  button.addEventListener("click", async () => {
    const prompt = button.closest(".aiMastery")?.querySelector("pre")?.textContent?.trim();
    if (!prompt) return;

    const originalLabel = button.textContent;
    try {
      await copyText(prompt);
      button.textContent = "Copied";
    } catch {
      button.textContent = "Copy failed";
    }
    window.setTimeout(() => { button.textContent = originalLabel; }, 1800);
  });
}
