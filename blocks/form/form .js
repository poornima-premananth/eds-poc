export default function decorate(block) {
    const endpointRow = block.querySelector(':scope > div > div');
    const endpoint = endpointRow?.textContent.trim() || '#';
  
    block.innerHTML = `
      <form class="contact-form">
        <input type="text" name="name" placeholder="Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <textarea name="message" placeholder="Message"></textarea>
        <button type="submit">Submit</button>
      </form>
    `;
  
    block.querySelector('form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
  
      await fetch(endpoint, {
        method: 'POST',
        body: data
      });
  
      alert('Message sent successfully!');
    });
  }