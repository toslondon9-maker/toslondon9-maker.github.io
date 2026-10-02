const cards = () => [...document.querySelectorAll("[data-haanel-quote]")];
const randomRegion = document.querySelector("[data-quote-random]");
const feedback = document.querySelector("[data-copy-feedback]");
let current = null;

function selectCard(card) {
  if (!card) return;
  current = card;
  randomRegion.innerHTML = `<p class="resourcesQuotes__randomQuote"></p><p class="resourcesQuotes__reflection"></p><p class="resourcesQuotes__source"></p>`;
  randomRegion.querySelector(".resourcesQuotes__randomQuote").textContent = card.querySelector("blockquote").textContent;
  randomRegion.querySelector(".resourcesQuotes__reflection").textContent = card.querySelector(".resourcesQuotes__reflection").textContent;
  randomRegion.querySelector(".resourcesQuotes__source").textContent = card.querySelector(".resourcesQuotes__source").textContent;
}

if (randomRegion) {
  selectCard(cards()[0]);
  document.querySelectorAll("[data-quote-filter]").forEach((button) => button.addEventListener("click", () => {
    const filter = button.dataset.quoteFilter;
    document.querySelectorAll("[data-quote-filter]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    const visible = cards().filter((card) => filter === "all" || card.dataset.quoteTopics.split(" ").includes(filter));
    cards().forEach((card) => { card.hidden = !visible.includes(card); });
    if (visible.length) selectCard(visible[0]);
  }));
  document.querySelector("[data-quote-random-button]")?.addEventListener("click", () => {
    const visible = cards().filter((card) => !card.hidden);
    selectCard(visible[Math.floor(Math.random() * visible.length)]);
  });
  document.querySelector("[data-quote-copy]")?.addEventListener("click", async () => {
    if (!current) return;
    const text = `${current.querySelector("blockquote").textContent}\n${current.querySelector(".resourcesQuotes__source").textContent}`;
    try { await navigator.clipboard.writeText(text); feedback.textContent = "Copied"; } catch { feedback.textContent = "Select and copy the quote manually."; }
  });
  document.querySelector("[data-quote-share]")?.addEventListener("click", async () => {
    if (!current || !navigator.share) { feedback.textContent = "Sharing is not available in this browser."; return; }
    await navigator.share({ text: current.querySelector("blockquote").textContent, url: location.href });
  });
}
