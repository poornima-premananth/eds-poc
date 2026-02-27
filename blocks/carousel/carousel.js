export default function decorate(block) {
  const slides = [...block.children];
  if (slides.length <= 1) return;

  const viewport = document.createElement('div');
  viewport.className = 'carousel-viewport';

  const track = document.createElement('div');
  track.className = 'carousel-track';

  slides.forEach((slide, i) => {
  slide.classList.add('carousel-slide');

  const imageWrapper = slide.children[0];
  const contentWrapper = slide.children[1];

  if (contentWrapper) {
    const overlay = document.createElement('div');
    overlay.className = 'carousel-overlay';

    // Detect alignment instruction
    let alignment = 'left'; // default

    const firstChild = contentWrapper.querySelector('p');
    if (firstChild) {
      const text = firstChild.textContent.trim().toLowerCase();

      if (text === 'align-center') alignment = 'center';
      if (text === 'align-right') alignment = 'right';
      if (text === 'align-left') alignment = 'left';

      if (text.startsWith('align-')) {
        firstChild.remove(); // remove instruction from UI
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

  track.appendChild(slide);
  });

  viewport.appendChild(track);
  block.textContent = '';
  block.appendChild(viewport);

  // Navigation
  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-nav prev';
  prevBtn.innerHTML = '&#10094;';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-nav next';
  nextBtn.innerHTML = '&#10095;';

  block.append(prevBtn, nextBtn);

  let currentIndex = 0;

  function goToSlide(index) {
    currentIndex = index;
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  prevBtn.addEventListener('click', () => {
    goToSlide((currentIndex - 1 + slides.length) % slides.length);
  });

  nextBtn.addEventListener('click', () => {
    goToSlide((currentIndex + 1) % slides.length);
  });
}