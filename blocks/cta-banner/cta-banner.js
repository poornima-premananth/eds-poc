export default function decorate(block) {
    const config = {};
  
    const rows = block.querySelectorAll(':scope > div');
    rows.forEach((row) => {
      const cells = row.querySelectorAll(':scope > div');
      if (cells.length === 2) {
        const key = cells[0].textContent.trim().toLowerCase();
        const value = cells[1].textContent.trim();
        config[key] = value;
      }
    });
  
    const title = config.title || 'Get Started Today';
    const text = config.text || '';
    const buttonText = config['button-text'] || 'Learn More';
    const buttonLink = config['button-link'] || '#';
    const theme = config.theme || 'primary';
  
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