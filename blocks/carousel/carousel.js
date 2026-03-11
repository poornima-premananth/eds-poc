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

  const getCellText = (el) => (el?.textContent?.trim() ?? '');
  const applyButtonClass = (linkCell, label) => {
    const a = linkCell?.querySelector('a');
    if (a) {
      a.classList.add('carousel-button');
      a.textContent = label || a.textContent || 'CTA Button';
    }
  };

  originalSlides.forEach((slide) => {
    slide.classList.add('carousel-slide');

    const cells = [...slide.children];
    const alignmentCell = cells[1];
    const titleCell = cells[2];
    const descCell = cells[3];
    const buttonLabelCell = cells[4];
    const buttonLinkCell = cells[5];
    const styleCell = cells[6];

    const alignmentRaw = getCellText(alignmentCell).toLowerCase();
    let alignment = 'left';
    if (alignmentRaw === 'center') alignment = 'center';
    else if (alignmentRaw === 'right') alignment = 'right';

    const title = getCellText(titleCell);
    const description = getCellText(descCell);
    const buttonLabel = getCellText(buttonLabelCell);
    const hasLink = buttonLinkCell?.querySelector('a') || getCellText(buttonLinkCell);
    const hasDetails = !!(title || description || buttonLabel || hasLink);

    if (hasDetails) {
      const overlay = document.createElement('div');
      overlay.className = `carousel-overlay overlay-${alignment}`;

      [alignmentCell, titleCell, descCell, buttonLabelCell, buttonLinkCell, styleCell].forEach((c) => {
        if (c?.parentNode) {
          c.classList.add('carousel-overlay-cell');
          if (c === alignmentCell) c.classList.add('carousel-alignment');
          if (c === titleCell) c.classList.add('carousel-title');
          if (c === descCell) c.classList.add('carousel-desc');
          if (c === buttonLabelCell) c.classList.add('carousel-label');
          if (c === buttonLinkCell) {
            c.classList.add('carousel-link');
            applyButtonClass(c, buttonLabel);
          }
          if (c === styleCell) c.classList.add('carousel-button-style');
          overlay.appendChild(c);
        }
      });
      slide.appendChild(overlay);
    } else {
      [alignmentCell, titleCell, descCell, buttonLabelCell, buttonLinkCell, styleCell].forEach((c) => {
        if (c?.parentNode) c.remove();
      });
    }
  });

  /* ----------------------------
     Infinite Loop Setup
  ----------------------------- */

  const stripEditorAttrs = (el) => {
    const nodes = [el, ...el.querySelectorAll('*')];
    nodes.forEach((node) => {
      [...node.attributes].forEach((attr) => {
        if (attr.name.startsWith('data-aue-') || attr.name.startsWith('data-richtext-')) {
          node.removeAttribute(attr.name);
        }
      });
    });
  };

  const firstClone = originalSlides[0].cloneNode(true);
  const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);

  [firstClone, lastClone].forEach((clone) => {
    clone.classList.add('clone');
    stripEditorAttrs(clone);
  });

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