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

const studyRoom = document.querySelector(".mksStudyRoom");
const weekSelect = studyRoom?.querySelector(".mksStudyRoom__select");
const stageBlocks = [...(studyRoom?.querySelectorAll(".mksStudyRoom__stageBlock[data-stage]") ?? [])];
const sidebarStages = [...(studyRoom?.querySelectorAll(".mksStudyRoom__stage[data-stage]") ?? [])];
const chapters = [...(studyRoom?.querySelectorAll(".mksStudyRoom__chapter[data-week]") ?? [])];
const currentHeading = studyRoom?.querySelector("#mks-current-title");
const currentTitle = studyRoom?.querySelector(".mksStudyRoom__currentTitle");
const progressLabel = studyRoom?.querySelector(".mksStudyRoom__progress span");
const progress = studyRoom?.querySelector(".mksStudyRoom__progress progress");

const activeAtViewportLine = (elements, line) => {
  let active = elements[0] ?? null;
  for (const element of elements) {
    if (element.getBoundingClientRect().top <= line) active = element;
    else break;
  }
  return active;
};

const syncStudyRoom = () => {
  if (!studyRoom || !stageBlocks.length || !chapters.length) return;
  const viewportLine = Math.max(120, window.innerHeight * .36);
  const activeChapter = activeAtViewportLine(chapters, viewportLine);
  const activeStage = activeChapter?.closest(".mksStudyRoom__stageBlock") ?? activeAtViewportLine(stageBlocks, viewportLine);
  const activeStageId = activeStage?.dataset.stage;
  const week = Number(activeChapter?.dataset.week ?? 1);
  const stageTitle = activeStage?.querySelector(".mksStudyRoom__stageHeader h2")?.textContent?.trim() ?? "Foundation";
  const title = activeChapter?.querySelector("summary strong")?.textContent?.trim() ?? "";
  const isSpanish = document.documentElement?.lang === "es";

  for (const stage of sidebarStages) {
    const active = stage.dataset.stage === activeStageId;
    stage.dataset.active = String(active);
    for (const link of stage.querySelectorAll("a[href^='#week-']")) link.removeAttribute("aria-current");
  }
  const activeLink = sidebarStages.find((stage) => stage.dataset.stage === activeStageId)?.querySelector(`a[href="#week-${week}"]`);
  activeLink?.setAttribute("aria-current", "location");
  if (currentHeading) currentHeading.textContent = `${isSpanish ? "Semana" : "Week"} ${week} · ${stageTitle}`;
  if (currentTitle) currentTitle.textContent = title;
  if (progressLabel) progressLabel.textContent = `${isSpanish ? "Semana" : "Week"} ${week} ${isSpanish ? "de" : "of"} ${chapters.length}`;
  if (progress) progress.value = week;
  if (weekSelect) weekSelect.value = `week-${week}`;
};

const observeStudyRoom = () => {
  if (!studyRoom) return;
  syncStudyRoom();
  window.addEventListener("scroll", syncStudyRoom, { passive: true });
  window.addEventListener("resize", syncStudyRoom);
  for (const link of studyRoom.querySelectorAll(".mksStudyRoom__stage a[href^='#week-']")) {
    link.addEventListener("click", () => {
      const target = document.getElementById(link.getAttribute("href").slice(1));
      if (target) syncStudyRoom();
    });
  }
  weekSelect?.addEventListener("change", () => {
    const target = document.getElementById(weekSelect.value);
    if (!target) return;
    syncStudyRoom();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    target.querySelector("summary")?.focus();
  });
  if (typeof window.IntersectionObserver === "function") {
    const observer = new window.IntersectionObserver(syncStudyRoom, { rootMargin: "-15% 0px -65% 0px", threshold: [0, .1] });
    for (const element of [...stageBlocks, ...chapters]) observer.observe(element);
  }
};

observeStudyRoom();

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
