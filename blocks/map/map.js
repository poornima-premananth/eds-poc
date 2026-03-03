export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  const cell = row ? row.querySelector(':scope > div') : null;
  const location = cell ? cell.textContent.trim() : block.textContent.trim();

  block.textContent = '';

  if (!location) {
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
  iframe.width = '100%';
  iframe.height = '450';
  iframe.style.border = '0';
  block.appendChild(iframe);
}
