export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const imageRow = rows[0];
  const nameRow = rows[1];
  const roleRow = rows[2];
  const dateRow = rows[3];

  const imageCell = imageRow ? imageRow.querySelector(':scope > div') : null;
  let mediaEl = imageCell ? imageCell.querySelector('picture, img') : null;

  const name = nameRow ? nameRow.textContent.trim() : '';
  const role = roleRow ? roleRow.textContent.trim() : '';
  const date = dateRow ? dateRow.textContent.trim() : '';

  if (!mediaEl && imageCell) {
    const src = imageCell.textContent.trim();
    if (src) {
      const img = document.createElement('img');
      img.src = src;
      img.alt = name;
      mediaEl = img;
    }
  }

  block.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'author-card';

  if (mediaEl) {
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'author-image';
    imageWrapper.appendChild(mediaEl);
    card.appendChild(imageWrapper);
  }

  const details = document.createElement('div');
  details.className = 'author-details';
  details.innerHTML = `
    <h4>${name}</h4>
    ${role ? `<p class="author-role">${role}</p>` : ''}
    ${date ? `<span class="author-date">${date}</span>` : ''}
  `;

  card.appendChild(details);
  block.appendChild(card);
}
