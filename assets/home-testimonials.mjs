const details = document.querySelectorAll(".homeTestimonials__more");

for (const disclosure of details) {
  const summary = disclosure.querySelector("summary");
  if (!summary) continue;
  const syncExpandedState = () => summary.setAttribute("aria-expanded", String(disclosure.open));
  syncExpandedState();
  disclosure.addEventListener("toggle", syncExpandedState);
}
