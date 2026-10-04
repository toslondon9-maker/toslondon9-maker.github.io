const disclosures = document.querySelectorAll(".foundationPage__lifePowerDetails, .homeTradition__lifePowerDetails");

for (const disclosure of disclosures) {
  const summary = disclosure.querySelector("summary");
  if (!summary) continue;
  const syncExpandedState = () => summary.setAttribute("aria-expanded", String(disclosure.open));
  syncExpandedState();
  disclosure.addEventListener("toggle", syncExpandedState);
}
