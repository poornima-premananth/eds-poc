export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const siteNameRow = rows[0];
  const baseUrlRow = rows[1];

  const getCell = (row) => (row ? row.querySelector(':scope > div') : null);
  const getText = (row) => {
    const cell = getCell(row);
    return cell ? cell.textContent.trim() : '';
  };

  const siteName = getText(siteNameRow) || document.title;

  const baseCell = getCell(baseUrlRow);
  let baseUrl = window.location.origin;
  if (baseCell) {
    const anchor = baseCell.querySelector('a');
    if (anchor) {
      baseUrl = anchor.getAttribute('href') || anchor.textContent.trim() || baseUrl;
    } else {
      const raw = baseCell.textContent.trim();
      if (raw) baseUrl = raw;
    }
  }

  const fullUrl = `${baseUrl}${window.location.pathname}`;
  const encodedUrl = encodeURIComponent(fullUrl);

  block.innerHTML = `
    <div class="share-wrapper">
      <span>Share:</span>
      <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <a href="mailto:?subject=${encodeURIComponent(siteName)}&body=${encodedUrl}">Email</a>
      <button class="copy-btn" type="button">Copy Link</button>
    </div>
  `;

  const copyBtn = block.querySelector('.copy-btn');
  if (copyBtn && navigator.clipboard) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(fullUrl);
      alert('Link copied!');
    });
  }
}