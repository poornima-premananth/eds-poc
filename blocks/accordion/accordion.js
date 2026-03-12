export default function decorate(block) {
  const items = [...block.children];
  
  items.forEach((item, index) => {
    // Add accordion item class
    item.classList.add('accordion-item');
    
    // Get title and content divs
    const [titleDiv, contentDiv] = [...item.children];
    
    if (!titleDiv || !contentDiv) return;
    
    // Create button for title
    const button = document.createElement('button');
    button.className = 'accordion-header';
    button.type = 'button';
    button.id = `accordion-header-${index}`;
    button.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
    button.setAttribute('aria-controls', `accordion-content-${index}`);
    
    // Move title content to button
    while (titleDiv.firstChild) {
      button.appendChild(titleDiv.firstChild);
    }
    
    // Add icon
    const icon = document.createElement('span');
    icon.className = 'accordion-icon';
    icon.setAttribute('aria-hidden', 'true');
    button.appendChild(icon);
    
    // Setup content div
    contentDiv.className = 'accordion-content';
    contentDiv.id = `accordion-content-${index}`;
    contentDiv.setAttribute('role', 'region');
    contentDiv.setAttribute('aria-labelledby', `accordion-header-${index}`);
    
    // Set initial state (first item open by default)
    if (index === 0) {
      item.classList.add('is-open');
      contentDiv.style.maxHeight = `${contentDiv.scrollHeight}px`;
    } else {
      contentDiv.style.maxHeight = '0';
    }
    
    // Replace title div with button
    item.replaceChild(button, titleDiv);
    
    // Click handler
    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      
      // Close all items (for accordion behavior)
      items.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove('is-open');
          const otherContent = otherItem.querySelector('.accordion-content');
          const otherButton = otherItem.querySelector('.accordion-header');
          if (otherContent) {
            otherContent.style.maxHeight = '0';
          }
          if (otherButton) {
            otherButton.setAttribute('aria-expanded', 'false');
          }
        }
      });
      
      // Toggle current item
      if (isOpen) {
        item.classList.remove('is-open');
        contentDiv.style.maxHeight = '0';
        button.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        contentDiv.style.maxHeight = `${contentDiv.scrollHeight}px`;
        button.setAttribute('aria-expanded', 'true');
      }
    });
    
    // Update max-height when content changes (for dynamic content)
    const resizeObserver = new ResizeObserver(() => {
      if (item.classList.contains('is-open')) {
        contentDiv.style.maxHeight = `${contentDiv.scrollHeight}px`;
      }
    });
    resizeObserver.observe(contentDiv);
  });
}
