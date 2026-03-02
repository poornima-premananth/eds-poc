import { decorateBlock, loadBlock } from '../../scripts/aem.js';

export default async function decorate(block) {
  const tabNav = document.createElement('div');
  tabNav.className = 'tab-nav';
  const tabContent = document.createElement('div');
  tabContent.className = 'tab-content';

  const rows = [...block.children];

  rows.forEach((row, index) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const tabName = cells[0].textContent.trim();
      const contentSource = cells[1];

      // 1. Create Button
      const button = document.createElement('button');
      button.className = 'tab-button';
      button.textContent = tabName;
      if (index === 0) button.classList.add('active');

      // 2. Create Panel
      const tabPanel = document.createElement('div');
      tabPanel.className = 'tab-panel';
      if (index !== 0) tabPanel.classList.add('hidden');

      // 3. Move the content (including inner tables)
      while (contentSource.firstChild) {
        tabPanel.append(contentSource.firstChild);
      }

      // 4. Find any tables inside this tab and prepare them as blocks
      // This is crucial for EDS to recognize them
      tabPanel.querySelectorAll(':scope > div > table, :scope > table').forEach((table) => {
        // We wrap the table in a div because decorateBlock expects a div structure
        const blockName = table.querySelector('tr:first-child td').textContent.trim();
        const innerBlock = document.createElement('div');
        innerBlock.classList.add(blockName);
        innerBlock.append(table); 
        tabPanel.append(innerBlock);
        
        // Prepare the block (adds 'block' class, data-block-name, etc.)
        decorateBlock(innerBlock);
      });

      button.addEventListener('click', () => {
        block.querySelectorAll('.tab-button').forEach((b) => b.classList.remove('active'));
        block.querySelectorAll('.tab-panel').forEach((p) => p.classList.add('hidden'));
        button.classList.add('active');
        tabPanel.classList.remove('hidden');
      });

      tabNav.append(button);
      tabContent.append(tabPanel);
    }
  });

  // 5. Replace original content
  block.replaceChildren(tabNav, tabContent);

  // 6. MANUALLY LOAD THE INNER BLOCKS
  // We find all elements we just decorated and load them one by one
  const nestedBlocks = [...tabContent.querySelectorAll('.block')];
  for (const nb of nestedBlocks) {
    await loadBlock(nb);
  }
}