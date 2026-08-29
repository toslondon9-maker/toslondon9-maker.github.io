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
const status = document.querySelector("[data-curriculum-status]");

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
for (const link of chapterLinks) link.addEventListener("click", (event) => { event.preventDefault(); const number = link.dataset.curriculumChapterLink; history.replaceState(null, "", `#week-${number}`); selectChapter(number, { focus: true, scroll: true }); });
for (const button of document.querySelectorAll("[data-curriculum-complete]")) button.addEventListener("click", () => { const complete = button.getAttribute("aria-pressed") !== "true"; button.setAttribute("aria-pressed", String(complete)); button.firstChild.textContent = complete ? "Completed Chapter " : "Complete Chapter "; });

const fragment = window.location.hash.match(/^#week-(\d{1,2})$/)?.[1];
selectChapter(fragment ?? 1);
