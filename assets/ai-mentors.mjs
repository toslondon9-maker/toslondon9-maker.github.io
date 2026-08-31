const HISTORY_LIMIT = 12;
const UNAVAILABLE_MESSAGE = "AI mentor is unavailable right now. You can still copy the complete prompt or open ChatGPT.";
const BACKEND_MENTOR_IDS = Object.freeze({ helmar: "rudolph" });

export function backendMentorId(mentorId) {
  return BACKEND_MENTOR_IDS[mentorId] ?? mentorId;
}

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

function appendMessage(container, role, content) {
  const message = document.createElement("article");
  const text = document.createElement("p");
  message.className = `aiMentorMessage aiMentorMessage--${role}`;
  text.textContent = content;
  message.append(text);
  container.append(message);
  message.scrollIntoView({ block: "nearest" });
}

function labels() {
  return document.documentElement.lang === "es"
    ? { ready: "Elige una pregunta inicial o escribe la tuya.", loading: "Pensando…", sent: "Respuesta recibida.", reset: "Nueva conversación preparada." }
    : { ready: "Choose a starter question or write your own.", loading: "Thinking…", sent: "Reply received.", reset: "New conversation ready." };
}

function initialiseAiMentors() {
  const dataElement = document.querySelector("#ai-mentor-data");
  if (!dataElement) return;
  const data = JSON.parse(dataElement.textContent);
  const endpointElement = document.querySelector('meta[name="ai-mentor-endpoint"]');
  const endpoint = endpointElement?.content || "/api/mentor";
  const promptElement = document.querySelector("[data-ai-mentor-prompt]");
  const selectedChapter = document.querySelector("[data-ai-mentor-selected-chapter]");
  const copyButton = document.querySelector("[data-ai-mentor-copy]");
  const copyStatus = document.querySelector("[data-ai-mentor-copy-status]");
  const messages = document.querySelector("[data-ai-mentor-messages]");
  const welcome = document.querySelector("[data-ai-mentor-welcome]");
  const status = document.querySelector("[data-ai-mentor-status]");
  const error = document.querySelector("[data-ai-mentor-error]");
  const form = document.querySelector("[data-ai-mentor-form]");
  const question = document.querySelector("[data-ai-mentor-question]");
  const sendButton = document.querySelector("[data-ai-mentor-send]");
  const newConversation = document.querySelector("[data-ai-mentor-new-conversation]");
  const state = { mentor: "haanel", chapter: 1, purpose: "understand", history: [], loading: false, requestVersion: 0 };

  const selection = () => ({
    mentor: data.mentors.find((mentor) => mentor.id === state.mentor),
    chapter: data.chapters.find((chapter) => chapter.week === state.chapter),
    purpose: data.purposes.find((purpose) => purpose.id === state.purpose),
  });
  const setStatus = (value) => { status.textContent = value; };
  const setError = (value = "") => {
    error.textContent = value;
    error.hidden = !value;
  };
  const setLoading = (loading) => {
    state.loading = loading;
    question.disabled = loading;
    sendButton.disabled = loading;
    newConversation.disabled = loading;
    form.setAttribute("aria-busy", String(loading));
  };
  const resetConversation = (message) => {
    state.requestVersion += 1;
    state.history = [];
    messages.replaceChildren(welcome);
    setError();
    setStatus(message ?? labels().ready);
    setLoading(false);
    question.value = "";
    question.focus();
  };
  const render = ({ reset = false } = {}) => {
    const current = selection();
    promptElement.textContent = buildAiMentorPrompt(current);
    selectedChapter.textContent = `Week ${current.chapter.week} · ${current.chapter.title} · ${current.chapter.phase}`;
    document.querySelectorAll("[data-ai-mentor-id]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.aiMentorId === state.mentor)));
    document.querySelectorAll("[data-ai-mentor-chapter]").forEach((button) => button.setAttribute("aria-pressed", String(Number(button.dataset.aiMentorChapter) === state.chapter)));
    document.querySelectorAll("[data-ai-mentor-purpose]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.aiMentorPurpose === state.purpose)));
    copyStatus.textContent = "";
    if (reset) resetConversation();
  };
  const sendQuestion = async (value) => {
    const content = value.trim();
    if (!content || state.loading) return;
    const current = selection();
    const requestVersion = state.requestVersion;
    setError();
    appendMessage(messages, "user", content);
    state.history.push({ role: "user", content });
    state.history = state.history.slice(-HISTORY_LIMIT);
    question.value = "";
    setLoading(true);
    setStatus(labels().loading);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mentorId: backendMentorId(current.mentor.id),
          chapter: current.chapter.week,
          messages: state.history.slice(-HISTORY_LIMIT),
        }),
      });
      const payload = await response.json();
      if (requestVersion !== state.requestVersion) return;
      if (!response.ok || typeof payload.reply !== "string" || !payload.reply.trim()) throw new Error("Mentor request failed");
      const reply = payload.reply.trim();
      state.history.push({ role: "assistant", content: reply });
      state.history = state.history.slice(-HISTORY_LIMIT);
      appendMessage(messages, "assistant", reply);
      setStatus(labels().sent);
    } catch {
      if (requestVersion === state.requestVersion) {
        setError(UNAVAILABLE_MESSAGE);
        setStatus("");
      }
    } finally {
      if (requestVersion === state.requestVersion) setLoading(false);
    }
  };

  document.querySelectorAll("[data-ai-mentor-id]").forEach((button) => button.addEventListener("click", () => { state.mentor = button.dataset.aiMentorId; render({ reset: true }); }));
  document.querySelectorAll("[data-ai-mentor-chapter]").forEach((button) => button.addEventListener("click", () => { state.chapter = Number(button.dataset.aiMentorChapter); render({ reset: true }); }));
  document.querySelectorAll("[data-ai-mentor-purpose]").forEach((button) => button.addEventListener("click", () => { state.purpose = button.dataset.aiMentorPurpose; render({ reset: true }); }));
  document.querySelectorAll("[data-ai-mentor-starter]").forEach((button) => button.addEventListener("click", () => sendQuestion(button.dataset.aiMentorStarter ?? "")));
  newConversation.addEventListener("click", () => resetConversation(labels().reset));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    sendQuestion(question.value);
  });
  question.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  copyButton.addEventListener("click", async () => {
    try {
      await copyPrompt(promptElement.textContent);
      copyStatus.textContent = "Prompt copied.";
    } catch {
      copyStatus.textContent = "Copy failed. Select the prompt and copy it manually.";
    }
  });
  render();
}

if (typeof document !== "undefined") initialiseAiMentors();
