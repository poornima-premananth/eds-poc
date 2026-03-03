// /blocks/weather/weather.js

export default async function decorate(block) {
  // Try to derive location in a way that works for both
  // document authoring tables and Universal Editor.
  let location = '';

  const rows = [...block.querySelectorAll(':scope > div')];

  if (rows.length) {
    const firstRowText = rows[0].textContent.trim();

    // Case 1: Franklin table with header "weather" in first row
    // and city in second row.
    if (/^weather$/i.test(firstRowText) && rows[1]) {
      location = rows[1].textContent.trim();
    } else if (firstRowText) {
      // Case 2: UE / simple authoring where first row is just the city.
      location = firstRowText;
    }
  }

  // Fallback: use all text content minus a possible "weather" header.
  if (!location) {
    location = block.textContent.replace(/weather/i, '').trim();
  }

  if (!location) {
    block.textContent = 'No location provided';
    return;
  }

  block.textContent = 'Loading weather...';

  try {
    const API_KEY = '2125a904ab51be804fb3d9d6bef5f6a8';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&q=${encodeURIComponent(location)}&units=metric`);
    const data = await response.json();

    if (data.cod !== 200) {
      block.textContent = `Weather error: ${data.message}`;
      return;
    }

    const weatherHTML = `
      <div class="weather-card">
        <h3>${data.name}</h3>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].main}" />
        <p class="temp">${Math.round(data.main.temp)}°C</p>
        <p class="condition">${data.weather[0].description}</p>
      </div>
    `;

    block.innerHTML = weatherHTML;
  } catch (error) {
    block.textContent = 'Failed to fetch weather data.';
    // eslint-disable-next-line no-console
    console.log(error);
  }
}
