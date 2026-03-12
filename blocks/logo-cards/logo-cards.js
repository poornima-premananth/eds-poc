import { createOptimizedPicture } from '../../scripts/aem.js';
import * as scripts from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  const rows = [...block.children];

  rows.forEach((row) => {
    const li = document.createElement('li');
    
    // Check if moveInstrumentation exists before calling it
    if (scripts.moveInstrumentation) {
      scripts.moveInstrumentation(row, li);
    }

    const cells = [...row.children];

    // Find cells by content to handle varying table structures in gdrive
    const iconCell = cells.find((c) => c.querySelector('picture, img'));
    const nonImageCells = cells.filter((c) => c.textContent.trim() && !c.querySelector('picture, img'));
    
    const titleCell = nonImageCells[0] || null;
    const descriptionCell = nonImageCells[1] || null;
    const ctaCell = cells.find((c) => c.querySelector('a'));

    // Handle Icon
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
        
        // Instrumentation for the image specifically
        const optimizedImg = optimized.querySelector('img');
        if (optimizedImg && scripts.moveInstrumentation) {
          scripts.moveInstrumentation(rawImg, optimizedImg);
        }

        iconWrapper = document.createElement('div');
        iconWrapper.className = 'logo-card-icon';
        iconWrapper.append(optimized);
      }
    }

    // Handle Content
    const content = document.createElement('div');
    content.className = 'logo-card-content';

    if (titleCell) {
      const titleEl = document.createElement('h3');
      titleEl.className = 'logo-card-title';
      titleEl.textContent = titleCell.textContent.trim();
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
        ctaEl.textContent = (link.textContent || '').trim() || link.href;
        content.appendChild(ctaEl);
      }
    }

    if (iconWrapper) li.appendChild(iconWrapper);
    li.appendChild(content);
    ul.appendChild(li);
  });

  block.replaceChildren(ul);
}