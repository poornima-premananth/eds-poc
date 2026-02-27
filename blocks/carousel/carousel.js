export default function decorate(block) {
  const originalSlides = [...block.children];
  if (originalSlides.length <= 1) return;

  const viewport = document.createElement('div');
  viewport.className = 'carousel-viewport';

  const track = document.createElement('div');
  track.className = 'carousel-track';

  /* ----------------------------
     Prepare Slides (overlay logic)
  ----------------------------- */

  originalSlides.forEach((slide) => {
    slide.classList.add('carousel-slide');

    const imageWrapper = slide.children[0];
    const contentWrapper = slide.children[1];

    if (contentWrapper) {
      const overlay = document.createElement('div');
      overlay.className = 'carousel-overlay';

      // Alignment detection
      let alignment = 'left';
      const firstParagraph = contentWrapper.querySelector('p');

      if (firstParagraph) {
        const text = firstParagraph.textContent.trim().toLowerCase();
        if (text === 'align-center') alignment = 'center';
        if (text === 'align-right') alignment = 'right';
        if (text === 'align-left') alignment = 'left';

        if (text.startsWith('align-')) {
          firstParagraph.remove();
        }
      }

      overlay.classList.add(`overlay-${alignment}`);
      overlay.append(...contentWrapper.childNodes);

      // Convert links to buttons
      overlay.querySelectorAll('a').forEach((link) => {
        link.classList.add('carousel-button');
      });

      slide.appendChild(overlay);
      contentWrapper.remove();
    }
  });

  /* ----------------------------
     Infinite Loop Setup
  ----------------------------- */

  const firstClone = originalSlides[0].cloneNode(true);
  const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);

  firstClone.classList.add('clone');
  lastClone.classList.add('clone');

  track.append(lastClone);
  originalSlides.forEach((slide) => track.append(slide));
  track.append(firstClone);

  viewport.append(track);
  block.textContent = '';
  block.append(viewport);

  /* ----------------------------
     Navigation
  ----------------------------- */

  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-nav prev';
  prevBtn.innerHTML = '&#10094;';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-nav next';
  nextBtn.innerHTML = '&#10095;';

  block.append(prevBtn, nextBtn);

  let currentIndex = 1;
  const totalSlides = originalSlides.length;

  function setPosition(withTransition = true) {
    track.style.transition = withTransition
      ? 'transform 0.6s ease'
      : 'none';

    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  setPosition(false);

  nextBtn.addEventListener('click', () => {
    if (currentIndex >= totalSlides + 1) return;
    currentIndex++;
    setPosition();
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex <= 0) return;
    currentIndex--;
    setPosition();
  });

  track.addEventListener('transitionend', () => {
    if (currentIndex === totalSlides + 1) {
      currentIndex = 1;
      setPosition(false);
    }

    if (currentIndex === 0) {
      currentIndex = totalSlides;
      setPosition(false);
    }
  });
}