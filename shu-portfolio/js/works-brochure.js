(() => {
  const intro = document.querySelector('[data-works-intro]');
  const stack = document.querySelector('[data-work-stack]');
  const title = document.querySelector('.works-title-block');
  const subtitle = document.querySelector('.works-title-block p');
  const cards = [...document.querySelectorAll('[data-work-stack] a')];

  if (!intro || !stack) return;

  let updateRequested = false;
  let latestProgress = 0;
  let hoveredCard = null;

  const clamp = (value) => Math.min(1, Math.max(0, value));
  const ease = (value) => value * value * (3 - 2 * value);

  const updateBrochure = () => {
    updateRequested = false;
    const scrolled = Math.max(0, window.scrollY - intro.offsetTop);
    latestProgress = clamp(scrolled / (intro.offsetHeight - window.innerHeight));
  };

  const drawCards = (time) => {
    const progress = latestProgress;
    const organise = ease(clamp(progress / 0.28));
    const disperse = ease(clamp((progress - 0.62) / 0.38));
    const radius = Math.min(window.innerWidth * 0.45, window.innerHeight * 0.43, 440);
    const rotation = progress >= 0.28 && progress < 0.75 ? time / 24000 : 0;

    cards.forEach((card, index) => {
      const angle = -Math.PI / 2 + index * (Math.PI * 2 / cards.length) + rotation;
      const orbitX = Math.cos(angle) * radius;
      const orbitY = Math.sin(angle) * radius;
      const scatteredX = (index % 4 - 1.5) * 44 + (index % 2 ? 18 : -18);
      const scatteredY = (Math.floor(index / 4) - 1) * 38 + (index % 3 - 1) * 16;
      const departureX = orbitX * 1.72 + (index % 3 - 1) * 105;
      const departureY = orbitY - window.innerHeight * (0.56 + (index % 3) * 0.12);
      const x = scatteredX + (orbitX - scatteredX) * organise + (departureX - orbitX) * disperse;
      const y = scatteredY + (orbitY - scatteredY) * organise + (departureY - orbitY) * disperse;
      const cardRotation = (-16 + index * 3) * (1 - organise) + (angle * 180 / Math.PI + 90) * organise + disperse * (index - 6) * 5;
      const isHovered = card === hoveredCard;
      const scale = (1 - organise * 0.38 + disperse * 0.18) * (isHovered ? 1.15 : 1);
      const opacity = 1 - clamp((disperse - 0.45) / 0.55);
      card.style.opacity = String(opacity);
      card.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${cardRotation}deg) scale(${scale})`;
    });

    if (title) {
      const titleCenter = title.offsetTop + title.offsetHeight / 2;
      const stackCenter = stack.offsetTop + stack.offsetHeight / 2;
      const offset = (stackCenter - titleCenter) * organise;
      title.style.transform = `translate(-50%, ${offset}px)`;
    }

    if (subtitle) {
      subtitle.style.opacity = String(1 - organise);
    }

    stack.style.pointerEvents = progress > 0.95 ? 'none' : 'auto';
    window.requestAnimationFrame(drawCards);
  };

  const requestUpdate = () => {
    if (!updateRequested) {
      updateRequested = true;
      window.requestAnimationFrame(updateBrochure);
    }
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => { hoveredCard = card; });
    card.addEventListener('mouseleave', () => { hoveredCard = null; });
    card.addEventListener('focus', () => { hoveredCard = card; });
    card.addEventListener('blur', () => { hoveredCard = null; });
  });
  requestUpdate();
  window.requestAnimationFrame(drawCards);
})();
