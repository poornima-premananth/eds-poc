// /blocks/weather/weather.js

export default async function decorate(block) {
  // 1. Get the location from the block content (e.g., text "London")
  const location = block.textContent.trim();
  block.textContent = ''; // Clear the block

  // 2. Fetch weather data (Example using a placeholder API)
  const API_KEY = '2125a904ab51be804fb3d9d6bef5f6a8';
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&q=${location}&units=metric`);
  const data = await response.json();

  // 3. Create HTML structure
  const weatherHTML = `
    <div class="weather-card">
      <h3>${data.name}</h3>
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].main}" />
      <p class="temp">${data.main.temp}°C</p>
      <p class="condition">${data.weather.description}</p>
    </div>
  `;

  block.innerHTML = weatherHTML;
}
