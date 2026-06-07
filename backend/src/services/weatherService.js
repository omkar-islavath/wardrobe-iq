/**
 * Fetch current weather from OpenWeatherMap or simulate based on local season/coordinates
 */
export const getWeather = async (lat, lon, city, clientIp) => {
  const apiKey = process.env.WEATHER_API_KEY;

  let cityName = city;
  let simulatedLat = lat;
  let simulatedLon = lon;

  // Helper to check if IP is a public IP (skips loopbacks, private networks, and link-locals)
  const isPublicIp = (ip) => {
    if (!ip) return false;
    let cleanIp = ip;
    if (ip.startsWith('::ffff:')) {
      cleanIp = ip.substring(7);
    }
    if (cleanIp === '127.0.0.1' || cleanIp === '::1' || cleanIp === 'localhost' || cleanIp === '::') {
      return false;
    }
    const parts = cleanIp.split('.');
    if (parts.length === 4) {
      const p1 = parseInt(parts[0], 10);
      const p2 = parseInt(parts[1], 10);
      if (isNaN(p1) || isNaN(p2)) return false;
      if (p1 === 10) return false;
      if (p1 === 172 && p2 >= 16 && p2 <= 31) return false;
      if (p1 === 192 && p2 === 168) return false;
      if (p1 === 169 && p2 === 254) return false;
      return true;
    }
    if (cleanIp.includes(':')) {
      const lower = cleanIp.toLowerCase();
      if (lower.startsWith('fe80:') || lower.startsWith('fc00:') || lower.startsWith('fd00:')) {
        return false;
      }
      return true;
    }
    return false;
  };

  // If no city or coordinates are provided, attempt to geolocate using the client's public IP
  if (!cityName && (!simulatedLat || !simulatedLon)) {
    if (isPublicIp(clientIp)) {
      try {
        const ipResponse = await fetch(`http://ip-api.com/json/${clientIp}`);
        if (ipResponse.ok) {
          const ipData = await ipResponse.json();
          if (ipData && ipData.status === 'success' && ipData.city) {
            cityName = ipData.city;
            if (cityName.toLowerCase() === 'bangalore' || cityName.toLowerCase() === 'bengaluru') {
              cityName = 'Hyderabad';
            }
            simulatedLat = ipData.lat;
            simulatedLon = ipData.lon;
          }
        }
      } catch (err) {
        console.warn("Could not determine location from client IP, falling back to default:", err.message);
      }
    }
  }

  if (!cityName) cityName = 'Hyderabad';

  if (apiKey) {
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric`;
      if (cityName) {
        url += `&q=${encodeURIComponent(cityName)}`;
      } else if (simulatedLat && simulatedLon) {
        url += `&lat=${simulatedLat}&lon=${simulatedLon}`;
      } else {
        url += `&q=Hyderabad`; // default city
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather API returned status ${response.status}`);
      }
      const data = await response.json();

      return {
        temp: data.main.temp,
        tempMin: data.main.temp_min,
        tempMax: data.main.temp_max,
        humidity: data.main.humidity,
        condition: data.weather[0].main.toLowerCase(), // e.g. rain, clouds, clear, snow
        description: data.weather[0].description,
        rainProbability: data.rain ? 80 : (data.weather[0].main.toLowerCase().includes('rain') ? 90 : 10),
        cityName: data.name,
        isMock: false
      };
    } catch (error) {
      console.error("Error fetching weather from API, falling back to simulation:", error.message);
    }
  }

  // Seeded random helper to ensure consistency on the same day for the same city
  const getSeededRandom = (seedStr) => {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const x = Math.sin(hash) * 10000;
    return x - Math.floor(x);
  };

  // MOCK Fallback (Simulated Weather)
  const now = new Date();
  const month = now.getMonth(); // 0-11
  let temp = 25;
  let humidity = 60;
  let condition = 'clear';
  let rainProbability = 10;

  const todayStr = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${cityName}`;
  const seedTemp = getSeededRandom(todayStr + "-temp");
  const seedHum = getSeededRandom(todayStr + "-humidity");
  const seedCond = getSeededRandom(todayStr + "-condition");

  if (month >= 2 && month <= 4) {
    // March to May: Summer
    temp = 32 + Math.floor(seedTemp * 6); // 32 - 37°C
    humidity = 30 + Math.floor(seedHum * 20);
    condition = 'sunny';
    rainProbability = 5;
  } else if (month >= 5 && month <= 8) {
    // June to September: Rainy season
    temp = 24 + Math.floor(seedTemp * 5); // 24 - 28°C
    humidity = 80 + Math.floor(seedHum * 15);
    condition = seedCond > 0.4 ? 'rainy' : 'clouds';
    rainProbability = condition === 'rainy' ? 85 : 40;
  } else {
    // October to February: Winter / Mild
    temp = 17 + Math.floor(seedTemp * 6); // 17 - 22°C
    humidity = 50 + Math.floor(seedHum * 15);
    condition = 'clear';
    rainProbability = 10;
  }

  return {
    temp,
    tempMin: temp - 3,
    tempMax: temp + 3,
    humidity,
    condition,
    description: `simulated ${condition} weather`,
    rainProbability,
    cityName,
    isMock: true
  };
};
