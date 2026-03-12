import { createOptimizedPicture } from '../../scripts/aem.js';
// Removed the broken moveInstrumentation import

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const ul = document.createElement('ul');

  rows.forEach((row) => {
    const li = document.createElement('li');
    // Note: moveInstrumentation(row, li) removed to prevent crashes

    const cells = [...row.children];

    // Find cells based on content rather than strict index
    const iconCell = cells.find((c) => c.querySelector('picture, img'));
    const contentCell = cells.find((c) => c.textContent.trim() && !c.querySelector('picture, img'));
    // The description is usually the next div with text
    const descriptionCell = cells.filter((c) => c.textContent.trim() && !c.querySelector('picture, img'))[1];
    const ctaCell = cells.find((c) => c.querySelector('a'));

    let iconWrapper = null;
    if (iconCell) {
      const rawImg = iconCell.querySelector('picture > img, img');
      if (rawImg && rawImg.src) {
        const optimized = createOptimizedPicture(
          rawImg.src,
          rawImg.alt || '',
          false,
          [{ width: '80' }],
        );
        
        iconWrapper = document.createElement('div');
        iconWrapper.className = 'logo-card-icon';
        iconWrapper.append(optimized);
      }
    }

    const content = document.createElement('div');
    content.className = 'logo-card-content';

    if (contentCell) {
      const titleEl = document.createElement('h3');
      titleEl.className = 'logo-card-title';
      titleEl.textContent = contentCell.textContent.trim();
      content.appendChild(titleEl);
    }

    if (descriptionCell) {
      const descEl = document.createElement('p');
      descEl.className = 'logo-card-description';
      descEl.textContent = descriptionCell.textContent.trim();
      content.appendChild(descEl);
    }

    if (ctaCell) {
      const link = ctaCell.querySelector('a');
      if (link) {
        const ctaEl = document.createElement('a');
        ctaEl.className = 'logo-card-cta';
        ctaEl.href = link.href;
        ctaEl.textContent = link.textContent;
        content.appendChild(ctaEl);
      }
    }

    if (iconWrapper) li.appendChild(iconWrapper);
    li.appendChild(content);
    ul.appendChild(li);
  });

  block.replaceChildren(ul);
}