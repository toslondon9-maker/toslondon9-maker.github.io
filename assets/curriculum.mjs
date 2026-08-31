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
    const panel = button.closest(".aiMastery");
    const prompt = panel?.querySelector(".aiMasteryPrompt pre")?.textContent?.trim();
    const feedback = panel?.querySelector("[data-ai-copy-feedback]");
    if (!prompt) return;
    const originalLabel = button.textContent;
    try {
      await copyText(prompt);
      button.textContent = "Copied";
      if (feedback) feedback.textContent = "Prompt copied.";
    } catch {
      button.textContent = "Copy failed";
      if (feedback) feedback.textContent = "Copy failed.";
    }
    window.setTimeout(() => {
      button.textContent = originalLabel;
      if (feedback) feedback.textContent = "";
    }, 1800);
  });
}

const chapters = [...document.querySelectorAll("[data-curriculum-chapter]")];
const chapterLinks = [...document.querySelectorAll("[data-curriculum-chapter-link]")];
const sectionLinks = [...document.querySelectorAll("[data-curriculum-section-link]")];
const status = document.querySelector("[data-curriculum-status]");
const navigatorToggle = document.querySelector("[data-curriculum-navigator-toggle]");
const studyNavigator = document.querySelector("[data-curriculum-navigator]");
const mobileNavigator = window.matchMedia("(max-width: 640px)");

function setNavigatorCollapsed(collapsed) {
  if (!navigatorToggle || !studyNavigator) return;
  studyNavigator.dataset.collapsed = String(collapsed);
  navigatorToggle.setAttribute("aria-expanded", String(!collapsed));
  navigatorToggle.firstChild.textContent = collapsed ? "Show all 24 chapters " : "Hide chapter navigator ";
}

function syncNavigatorForViewport() {
  setNavigatorCollapsed(mobileNavigator.matches);
}

function selectChapter(number, { focus = false, scroll = false } = {}) {
  const chapter = chapters.find((item) => Number(item.dataset.curriculumChapter) === Number(number));
  if (!chapter) return;
  chapter.open = true;
  for (const link of chapterLinks) {
    if (Number(link.dataset.curriculumChapterLink) === Number(number)) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  }
  if (status) status.textContent = `Chapter ${number} of 24 · ${chapter.dataset.curriculumStage}`;
  if (scroll) chapter.scrollIntoView({ behavior: "smooth", block: "start" });
  if (focus) chapter.querySelector("summary")?.focus({ preventScroll: true });
}

for (const chapter of chapters) chapter.addEventListener("toggle", () => { if (chapter.open) selectChapter(chapter.dataset.curriculumChapter); });
for (const link of chapterLinks) link.addEventListener("click", (event) => { event.preventDefault(); const number = link.dataset.curriculumChapterLink; history.replaceState(null, "", `#week-${number}`); selectChapter(number, { focus: true, scroll: true }); if (mobileNavigator.matches) setNavigatorCollapsed(true); });
for (const link of sectionLinks) link.addEventListener("click", (event) => {
  event.preventDefault();
  const chapter = link.closest("[data-curriculum-chapter]");
  const target = document.querySelector(link.hash);
  if (!chapter || !target) return;
  selectChapter(chapter.dataset.curriculumChapter);
  history.replaceState(null, "", link.hash);
  window.requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth", block: "start" }));
});
for (const button of document.querySelectorAll("[data-curriculum-complete]")) button.addEventListener("click", () => { const complete = button.getAttribute("aria-pressed") !== "true"; button.setAttribute("aria-pressed", String(complete)); button.firstChild.textContent = complete ? "Completed Chapter " : "Complete Chapter "; });
navigatorToggle?.addEventListener("click", () => setNavigatorCollapsed(studyNavigator?.dataset.collapsed !== "true"));
mobileNavigator.addEventListener?.("change", syncNavigatorForViewport);

const fragment = window.location.hash.match(/^#week-(\d{1,2})$/)?.[1];
selectChapter(fragment ?? 1);
syncNavigatorForViewport();
