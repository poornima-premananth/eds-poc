import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const ul = document.createElement('ul');

  rows.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const cells = [...row.children];

    const iconCell = cells[0] || null;
    const titleCell = cells[1] || null;
    const descriptionCell = cells[2] || null;
    const ctaCell = cells[3] || null;

    let iconWrapper = null;
    if (iconCell) {
      const rawImg = iconCell.querySelector('picture > img, img');
      if (rawImg && rawImg.src) {
        const optimized = createOptimizedPicture(
          rawImg.src,
          rawImg.alt || '',
          false,
          [{ width: '64' }],
        );
        const optimizedImg = optimized.querySelector('img');
        if (optimizedImg) {
          moveInstrumentation(rawImg, optimizedImg);
        }
        const pictureOrImg = rawImg.closest('picture') || rawImg;
        pictureOrImg.replaceWith(optimized);

        iconWrapper = document.createElement('div');
        iconWrapper.className = 'logo-card-icon';
        iconWrapper.append(optimized);
      }
    }

    const content = document.createElement('div');
    content.className = 'logo-card-content';

    const titleText = titleCell ? titleCell.textContent.trim() : '';
    if (titleText) {
      const titleEl = document.createElement('h3');
      titleEl.className = 'logo-card-title';
      titleEl.textContent = titleText;
      content.appendChild(titleEl);
    }

    const descriptionText = descriptionCell ? descriptionCell.textContent.trim() : '';
    if (descriptionText) {
      const descEl = document.createElement('p');
      descEl.className = 'logo-card-description';
      descEl.textContent = descriptionText;
      content.appendChild(descEl);
    }

    if (ctaCell) {
      const link = ctaCell.querySelector('a');
      if (link && link.href) {
        const ctaEl = document.createElement('a');
        ctaEl.className = 'logo-card-cta';
        ctaEl.href = link.href;
        ctaEl.textContent = (link.textContent || '').trim() || link.href;
        content.appendChild(ctaEl);
      }
    }

    if (iconWrapper) {
      li.appendChild(iconWrapper);
    }

    li.appendChild(content);
    ul.appendChild(li);
  });

  block.replaceChildren(ul);
}
