const page = document.querySelector(".resourcesPage--visualEffects");
const field = document.querySelector(".resourcesScrollField");
const particleField = document.querySelector(".resourcesParticleField");
const canvas = particleField?.querySelector("canvas");
const portrait = document.querySelector(".resourcesPortrait");
const phrases = field ? [...field.querySelectorAll(".resourcesScrollField__phrase")] : [];
const headlines = page ? [...page.querySelectorAll("h2, h3")].filter((heading) => !heading.closest(".resourcesLoop")) : [];
const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");

if (page) {
  headlines.forEach((heading) => heading.classList.add("resourcesScrollHeadline", "scroll-headline"));
  const revealHeadline = (heading) => heading.classList.add("resourcesScrollHeadline--visible");
  if (reducedMotion?.matches || !("IntersectionObserver" in window)) headlines.forEach(revealHeadline);
  else {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) revealHeadline(entry.target);
    }), { threshold: 0.15, rootMargin: "0px 0px -8%" });
    headlines.forEach((heading) => observer.observe(heading));
  }
}

if (page && field && phrases.length) {
  let targetX = 0;
  let targetY = 0;
  let energy = 0;
  let currentX = 0;
  let currentY = 0;
  let currentEnergy = 0;
  let previousY = window.scrollY;
  let frame = 0;
  let width = 1;
  let height = 1;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const particles = Array.from({ length: 128 }, (_, index) => ({
    x: (index * 47) % 101 / 100,
    y: (index * 83) % 101 / 100,
    size: 0.9 + (index % 5) * 0.62,
    phase: index * 0.71,
    alpha: 0.18 + (index % 5) * 0.035,
  }));

  const resize = () => {
    if (!canvas) return;
    const rect = particleField.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  };
  resize();
  new ResizeObserver(resize).observe(particleField);

  const drawParticles = (time) => {
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      const drift = reducedMotion?.matches ? 0 : Math.sin(time * 0.00028 + particle.phase) * 5 * (0.35 + currentEnergy);
      const x = particle.x * width + currentX * (0.2 + particle.size / 4);
      const y = particle.y * height + currentY * (0.2 + particle.size / 4) + drift;
      context.fillStyle = `rgba(190, 148, 73, ${Math.min(0.72, particle.alpha + currentEnergy * 0.16)})`;
      context.beginPath();
      context.arc(x, y, particle.size + currentEnergy * 0.9, 0, Math.PI * 2);
      context.fill();
    });
  };

  const render = (time) => {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    currentEnergy += (energy - currentEnergy) * 0.12;
    energy *= 0.94;
    targetX *= 0.96;
    targetY *= 0.96;
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
      const driftX = currentX * depth + Math.sin(index * 1.7 + currentEnergy * 4) * currentEnergy * 16;
      const driftY = currentY * depth + Math.cos(index * 1.2 + currentEnergy * 3) * currentEnergy * 18;
      phrase.style.transform = `translate3d(${driftX.toFixed(2)}px, ${driftY.toFixed(2)}px, 0)`;
    });
    drawParticles(time);
    if (!reducedMotion?.matches) frame = requestAnimationFrame(render);
  };

  const activity = (x, y, strength = 0.65) => {
    targetX = Math.max(-34, Math.min(34, (x / window.innerWidth - 0.5) * 52));
    targetY = Math.max(-28, Math.min(28, (y / window.innerHeight - 0.5) * 40));
    energy = Math.min(1, Math.max(energy, strength));
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
      targetY = Math.max(-28, Math.min(28, targetY + delta * 0.09));
      energy = Math.min(1, Math.max(energy, Math.min(1, 0.5 + Math.abs(delta) * 0.018)));
    }, { passive: true });
    window.addEventListener("pointerleave", () => { energy = 0; targetX = 0; targetY = 0; }, { passive: true });
    frame = requestAnimationFrame(render);
  } else {
    field.dataset.reducedMotion = "true";
    if (particleField) particleField.dataset.reducedMotion = "true";
    if (portrait) portrait.dataset.reducedMotion = "true";
    drawParticles(0);
  }
}
