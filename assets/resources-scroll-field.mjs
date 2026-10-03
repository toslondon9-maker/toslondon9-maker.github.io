const page = document.querySelector(".resourcesPage--scrollField");
const field = document.querySelector(".resourcesScrollField");
const portrait = document.querySelector(".resourcesPortrait");
const phrases = field ? [...field.querySelectorAll(".resourcesScrollField__phrase")] : [];
const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");

if (page && field && phrases.length) {
  let targetX = 0;
  let targetY = 0;
  let energy = 0;
  let currentX = 0;
  let currentY = 0;
  let currentEnergy = 0;
  let previousY = window.scrollY;
  let frame = 0;

  const render = () => {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    currentEnergy += (energy - currentEnergy) * 0.12;
    field.style.setProperty("--field-x", `${currentX.toFixed(2)}px`);
    field.style.setProperty("--field-y", `${currentY.toFixed(2)}px`);
    field.style.setProperty("--field-energy", currentEnergy.toFixed(3));
    if (portrait) {
      portrait.style.setProperty("--portrait-x", `${(currentX * 0.32).toFixed(2)}px`);
      portrait.style.setProperty("--portrait-y", `${(currentY * 0.32).toFixed(2)}px`);
      portrait.style.setProperty("--portrait-energy", currentEnergy.toFixed(3));
    }
    phrases.forEach((phrase, index) => {
      const depth = 0.45 + (index % 5) * 0.12;
      const driftX = currentX * depth + Math.sin(index * 1.7 + currentEnergy * 4) * currentEnergy * 9;
      const driftY = currentY * depth + Math.cos(index * 1.2 + currentEnergy * 3) * currentEnergy * 12;
      phrase.style.transform = `translate3d(${driftX.toFixed(2)}px, ${driftY.toFixed(2)}px, 0)`;
    });
    if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05 || Math.abs(energy - currentEnergy) > 0.01) frame = requestAnimationFrame(render);
    else frame = 0;
  };

  const wake = () => { if (!frame) frame = requestAnimationFrame(render); };
  const activity = (x, y, strength = 0.65) => {
    targetX = Math.max(-22, Math.min(22, (x / window.innerWidth - 0.5) * 36));
    targetY = Math.max(-18, Math.min(18, (y / window.innerHeight - 0.5) * 28));
    energy = Math.min(1, Math.max(energy, strength));
    wake();
  };

  if (!reducedMotion?.matches) {
    window.addEventListener("pointermove", (event) => activity(event.clientX, event.clientY, 0.72), { passive: true });
    window.addEventListener("touchmove", (event) => {
      const touch = event.touches[0];
      if (touch) activity(touch.clientX, touch.clientY, 0.8);
    }, { passive: true });
    window.addEventListener("scroll", () => {
      const delta = window.scrollY - previousY;
      previousY = window.scrollY;
      targetY = Math.max(-18, Math.min(18, targetY + delta * 0.04));
      energy = Math.min(1, Math.max(energy, Math.min(1, 0.35 + Math.abs(delta) * 0.012)));
      wake();
    }, { passive: true });
    window.addEventListener("pointerleave", () => { energy = 0; targetX = 0; targetY = 0; wake(); }, { passive: true });
  } else {
    field.dataset.reducedMotion = "true";
    if (portrait) portrait.dataset.reducedMotion = "true";
  }
}
