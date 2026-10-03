const root = document.querySelector(".resourcesScrollField");
const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
const phrases = root ? [...root.querySelectorAll("span")] : [];

if (root && phrases.length && !reducedMotion?.matches) {
  let previousY = window.scrollY;
  let velocity = 0;
  let frame = 0;

  const step = () => {
    velocity *= 0.88;
    phrases.forEach((phrase, index) => {
      const depth = 0.45 + (index % 3) * 0.2;
      phrase.style.transform = `translate3d(0, ${velocity * depth * 16}px, 0)`;
    });
    if (Math.abs(velocity) > 0.01) frame = requestAnimationFrame(step);
    else frame = 0;
  };

  window.addEventListener("scroll", () => {
    const currentY = window.scrollY;
    velocity = Math.max(-1.4, Math.min(1.4, velocity + (currentY - previousY) * 0.018));
    previousY = currentY;
    if (!frame) frame = requestAnimationFrame(step);
  }, { passive: true });
}
