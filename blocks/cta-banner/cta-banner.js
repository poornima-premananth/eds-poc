export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const titleRow = rows[0];
  const textRow = rows[1];
  const buttonTextRow = rows[2];
  const linkRow = rows[3];
  const themeRow = rows[4];

  const getCell = (row) => (row ? row.querySelector(':scope > div') : null);
  const getText = (row) => {
    const cell = getCell(row);
    return cell ? cell.textContent.trim() : '';
  };

  const title = getText(titleRow) || '';
  const text = getText(textRow) || '';
  const buttonText = getText(buttonTextRow) || '';

  // Link can be an <a> or plain text URL
  const linkCell = getCell(linkRow);
  let buttonLink = '#';
  if (linkCell) {
    const anchor = linkCell.querySelector('a');
    if (anchor) {
      buttonLink = anchor.getAttribute('href') || anchor.textContent.trim() || '#';
    } else {
      const raw = linkCell.textContent.trim();
      if (raw) buttonLink = raw;
    }
  }

  let theme = getText(themeRow).toLowerCase();
  if (!['primary', 'secondary'].includes(theme)) {
    theme = 'primary';
  }

  block.innerHTML = '';

  const container = document.createElement('div');
  container.className = `cta-container ${theme}`;

  container.innerHTML = `
    <div class="cta-content">
      <h2>${title}</h2>
      ${text ? `<p>${text}</p>` : ''}
    </div>
    <div class="cta-action">
      <a href="${buttonLink}" class="cta-button">${buttonText}</a>
    </div>
  `;

  block.appendChild(container);
}
