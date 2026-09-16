/* Keep the name in place through the hero, then let it disappear as Info arrives. */
(() => {
  const title = document.querySelector('[data-hero-title]');
  const about = document.querySelector('#about');
  const hero = document.querySelector('.home-hero');
  const heroImage = document.querySelector('.hero-image');
  const experienceTrack = document.querySelector('.experience-track');
  const experienceHeading = document.querySelector('.experience > h2');
  const experienceCards = [...document.querySelectorAll('.experience-card')];

  if (!title || !about) return;

  let frameRequested = false;
  let experienceUpdateRequested = false;
  let experienceSettleTimer;
  let activeExperienceCard;

  const updateTitle = () => {
    frameRequested = false;
    const titleTop = title.getBoundingClientRect().top;
    const infoTop = about.getBoundingClientRect().top;
    const fadeDistance = Math.max(window.innerHeight * 0.16, 96);
    const progress = Math.min(1, Math.max(0, (titleTop - infoTop + 24) / fadeDistance));

    title.style.opacity = String(1 - progress);
    title.style.pointerEvents = progress > 0.95 ? 'none' : '';

    if (hero && heroImage) {
      const heroProgress = Math.min(1, Math.max(0, (window.scrollY - hero.offsetTop) / (window.innerHeight * 0.9)));
      heroImage.style.opacity = String(1 - heroProgress * 0.82);
      heroImage.style.transform = `scale(${1 - heroProgress * 0.16})`;
    }
  };

  const updateExperience = () => {
    experienceUpdateRequested = false;
    if (!experienceTrack || !experienceCards.length) return;

    const trackCenter = experienceTrack.getBoundingClientRect().left + experienceTrack.clientWidth / 2;
    let activeCard = experienceCards[0];
    let closestDistance = Infinity;

    experienceCards.forEach((card) => {
      const cardBox = card.getBoundingClientRect();
      const distance = Math.abs(cardBox.left + cardBox.width / 2 - trackCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        activeCard = card;
      }
    });

    activeExperienceCard = activeCard;
    experienceCards.forEach((card) => card.classList.toggle('is-active', card === activeCard));
  };

  const requestExperienceUpdate = () => {
    if (!experienceUpdateRequested) {
      experienceUpdateRequested = true;
      window.requestAnimationFrame(updateExperience);
    }
  };

  const focusExperienceCard = (card) => {
    if (!experienceTrack || !experienceHeading) return;

    const cardBox = card.getBoundingClientRect();
    const headingBox = experienceHeading.getBoundingClientRect();
    const headingCenter = headingBox.left + headingBox.width / 2;
    const cardCenter = cardBox.left + cardBox.width / 2;
    const targetLeft = Math.max(0, experienceTrack.scrollLeft + cardCenter - headingCenter);
    experienceTrack.scrollTo({ left: targetLeft, behavior: 'smooth' });
  };

  const settleExperienceCard = () => {
    updateExperience();
    if (!experienceTrack || !experienceHeading || !activeExperienceCard) return;

    const cardBox = activeExperienceCard.getBoundingClientRect();
    const headingBox = experienceHeading.getBoundingClientRect();
    const headingCenter = headingBox.left + headingBox.width / 2;
    const cardCenter = cardBox.left + cardBox.width / 2;
    const targetLeft = Math.max(0, experienceTrack.scrollLeft + cardCenter - headingCenter);
    if (Math.abs(experienceTrack.scrollLeft - targetLeft) > 2) {
      experienceTrack.scrollTo({ left: targetLeft, behavior: 'smooth' });
    }
  };

  const requestUpdate = () => {
    if (!frameRequested) {
      frameRequested = true;
      window.requestAnimationFrame(updateTitle);
    }
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', () => {
    requestUpdate();
    requestExperienceUpdate();
  });
  experienceTrack?.addEventListener('scroll', () => {
    requestExperienceUpdate();
    window.clearTimeout(experienceSettleTimer);
    experienceSettleTimer = window.setTimeout(settleExperienceCard, 140);
  }, { passive: true });
  experienceCards.forEach((card) => {
    card.tabIndex = 0;
    card.addEventListener('click', () => focusExperienceCard(card));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        focusExperienceCard(card);
      }
    });
  });
  requestUpdate();
  requestExperienceUpdate();
})();
