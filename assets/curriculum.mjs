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

const weekSelect = document.querySelector(".mksStudyRoom__select");
weekSelect?.addEventListener("change", () => {
  const target = document.getElementById(weekSelect.value);
  target?.scrollIntoView({ behavior: "smooth", block: "start" });
  target?.querySelector("summary")?.focus();
});

const progressKey = "uyp-mks-study-progress";
const readProgress = () => {
  try {
    const value = JSON.parse(window.localStorage.getItem(progressKey) || "[]");
    return new Set(Array.isArray(value) ? value.filter((week) => Number.isInteger(week)) : []);
  } catch {
    return new Set();
  }
};
const writeProgress = (progress) => {
  try { window.localStorage.setItem(progressKey, JSON.stringify([...progress].sort((a, b) => a - b))); } catch { /* storage is optional */ }
};
const completedWeeks = readProgress();
for (const button of document.querySelectorAll("[data-complete-week]")) {
  const week = Number(button.dataset.completeWeek);
  const update = (complete) => {
    button.setAttribute("aria-pressed", String(complete));
    button.textContent = complete ? button.dataset.completedLabel : button.dataset.completeLabel;
  };
  update(completedWeeks.has(week));
  button.addEventListener("click", () => {
    if (completedWeeks.has(week)) completedWeeks.delete(week);
    else completedWeeks.add(week);
    update(completedWeeks.has(week));
    writeProgress(completedWeeks);
  });
}
