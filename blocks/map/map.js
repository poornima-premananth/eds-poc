export default function decorate(block) {
    const location = block.textContent.trim();
    block.textContent = '';
  
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
    iframe.width = '100%';
    iframe.height = '450';
    iframe.style.border = '0';
  
    block.appendChild(iframe);
  }