export default function decorate(block) {
    const rows = block.querySelectorAll(':scope > div');
  
    const tabNav = document.createElement('div');
    tabNav.className = 'tab-nav';
  
    const tabContent = document.createElement('div');
    tabContent.className = 'tab-content';
  
    rows.forEach((row, index) => {
      const cells = row.querySelectorAll(':scope > div');
      if (cells.length === 2) {
        const title = cells[0].textContent.trim();
        const content = cells[1].innerHTML;
  
        const button = document.createElement('button');
        button.textContent = title;
        if (index === 0) button.classList.add('active');
  
        const contentDiv = document.createElement('div');
        contentDiv.className = 'tab-panel';
        if (index !== 0) contentDiv.style.display = 'none';
        contentDiv.innerHTML = content;
  
        button.addEventListener('click', () => {
          block.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
          block.querySelectorAll('.tab-nav button').forEach(b => b.classList.remove('active'));
          contentDiv.style.display = 'block';
          button.classList.add('active');
        });
  
        tabNav.appendChild(button);
        tabContent.appendChild(contentDiv);
      }
    });
  
    block.innerHTML = '';
    block.appendChild(tabNav);
    block.appendChild(tabContent);
  }