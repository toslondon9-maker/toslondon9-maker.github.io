export function buildAiMentorPrompt({ mentor, purpose, chapter }) {
  return `You are a study guide, not Charles F. Haanel, Helmar Rudolph or Tariq Saddique. Do not impersonate Charles F. Haanel, Helmar Rudolph or Tariq Saddique, and do not claim endorsement or affiliation.\n\nSTUDY GUIDE\n${mentor.name}\n${mentor.instruction}\n\nPURPOSE\n${purpose.label}\n${purpose.instruction}\n\nAPPROVED STUDY MATERIAL\nWeek ${chapter.week}: ${chapter.title}\nProgramme stage: ${chapter.phase}\n\nIntroduction: ${chapter.introduction}\n\nCore teaching: ${chapter.teaching}\n\nWeekly exercise: ${chapter.exercise}\n\nGUIDANCE\nUse only the supplied material. Help me think, reflect and apply it responsibly; do not promise outcomes, invent facts or replace professional advice. Begin by asking me one thoughtful question.`;
}

async function copyPrompt(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const helper = document.createElement("textarea");
  helper.value = value;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.opacity = "0";
  document.body.append(helper);
  helper.select();
  document.execCommand("copy");
  helper.remove();
}

function initialiseAiMentors() {
  const dataElement = document.querySelector("#ai-mentor-data");
  if (!dataElement) return;
  const data = JSON.parse(dataElement.textContent);
  const promptElement = document.querySelector("[data-ai-mentor-prompt]");
  const selectedChapter = document.querySelector("[data-ai-mentor-selected-chapter]");
  const copyButton = document.querySelector("[data-ai-mentor-copy]");
  const copyStatus = document.querySelector("[data-ai-mentor-copy-status]");
  const state = { mentor: "haanel", chapter: 1, purpose: "understand" };

  const selection = () => ({
    mentor: data.mentors.find((mentor) => mentor.id === state.mentor),
    chapter: data.chapters.find((chapter) => chapter.week === state.chapter),
    purpose: data.purposes.find((purpose) => purpose.id === state.purpose),
  });
  const render = () => {
    const current = selection();
    promptElement.textContent = buildAiMentorPrompt(current);
    selectedChapter.textContent = `Week ${current.chapter.week} · ${current.chapter.title} · ${current.chapter.phase}`;
    document.querySelectorAll("[data-ai-mentor-id]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.aiMentorId === state.mentor)));
    document.querySelectorAll("[data-ai-mentor-chapter]").forEach((button) => button.setAttribute("aria-pressed", String(Number(button.dataset.aiMentorChapter) === state.chapter)));
    document.querySelectorAll("[data-ai-mentor-purpose]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.aiMentorPurpose === state.purpose)));
    copyStatus.textContent = "";
  };

  document.querySelectorAll("[data-ai-mentor-id]").forEach((button) => button.addEventListener("click", () => { state.mentor = button.dataset.aiMentorId; render(); }));
  document.querySelectorAll("[data-ai-mentor-chapter]").forEach((button) => button.addEventListener("click", () => { state.chapter = Number(button.dataset.aiMentorChapter); render(); }));
  document.querySelectorAll("[data-ai-mentor-purpose]").forEach((button) => button.addEventListener("click", () => { state.purpose = button.dataset.aiMentorPurpose; render(); }));
  copyButton.addEventListener("click", async () => {
    try {
      await copyPrompt(promptElement.textContent);
      copyStatus.textContent = "Prompt copied.";
    } catch {
      copyStatus.textContent = "Copy failed. Select the prompt and copy it manually.";
    }
  });
}

if (typeof document !== "undefined") initialiseAiMentors();
