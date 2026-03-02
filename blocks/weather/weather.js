export default async function decorate(block) {
  // 1. Get ONLY the location (ignoring the 'weather' header if it's there)
  // We look for the second row or just the last bit of text
  const location = block.textContent.replace('weather', '').trim();
  
  if (!location) {
    block.textContent = 'No location provided';
    return;
  }

  block.textContent = 'Loading weather...';

  try {
    const API_KEY = '2125a904ab51be804fb3d9d6bef5f6a8';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&q=${location}&units=metric`);
    const data = await response.json();

    // CHECK: If API returned an error (e.g. 404 City Not Found)
    if (data.cod !== 200) {
      block.textContent = `Weather error: ${data.message}`;
      return;
    }

    // 3. Create HTML structure
    // We use safe access to data.weather[0] now that we know data.cod is 200
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
    console.log(error);
  }
}
