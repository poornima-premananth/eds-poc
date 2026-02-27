export default function decorate(block) {
    const config = {};
    const rows = block.querySelectorAll(':scope > div');
  
    rows.forEach((row) => {
      const cells = row.querySelectorAll(':scope > div');
      if (cells.length === 2) {
        config[cells[0].textContent.trim().toLowerCase()] =
          cells[1].textContent.trim();
      }
    });
  
    const siteName = config['site-name'] || document.title;
    const baseUrl = config['base-url'] || window.location.origin;
    const fullUrl = `${baseUrl}${window.location.pathname}`;
    const encodedUrl = encodeURIComponent(fullUrl);
  
    block.innerHTML = `
      <div class="share-wrapper">
        <span>Share:</span>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}" target="_blank">LinkedIn</a>
        <a href="mailto:?subject=${encodeURIComponent(siteName)}&body=${encodedUrl}">Email</a>
        <button class="copy-btn">Copy Link</button>
      </div>
    `;
  
    block.querySelector('.copy-btn').addEventListener('click', () => {
      navigator.clipboard.writeText(fullUrl);
      alert('Link copied!');
    });
  }