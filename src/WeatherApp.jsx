import React, { useState } from "react";
import "./WeatherApp.css";

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  // Weather code mapping
  function getWeatherIcon(code) {
    const mapping = {
      0: " Clear sky",
      1: " Mainly clear",
      2: " Partly cloudy",
      3: " Overcast",
      45: " Foggy",
      48: " Rime fog",
      51: " Light drizzle",
      53: " Moderate drizzle",
      55: " Heavy drizzle",
      61: " Light rain",
      63: " Moderate rain",
      65: " Heavy rain",
      71: " Light snow",
      73: " Moderate snow",
      75: " Heavy snow",
      77: " Snow grains",
      80: " Showers",
      81: " Heavy showers",
      82: " Violent showers",
      95: " Thunderstorm",
      96: " Thunderstorm w/ hail",
      99: " Severe thunderstorm",
    };
    return mapping[code] || " Weather data";
  }

  const getWeather = async () => {
    if (!city) {
      setError("⚠ Please enter a city name.");
      setWeather(null);
      return;
    }

    try {
      // Step 1: Get coordinates
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError(" City not found.");
        setWeather(null);
        return;
      }

      const lat = geoData.results[0].latitude;
      const lon = geoData.results[0].longitude;

      // Step 2: Fetch weather data
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m,apparent_temperature&daily=sunrise,sunset&timezone=auto`
      );
      const weatherData = await weatherRes.json();

      const current = weatherData.current_weather;
      const humidity = weatherData.hourly.relativehumidity_2m[0];
      const feelsLike = weatherData.hourly.apparent_temperature[0];
      const sunrise = weatherData.daily.sunrise[0].split("T")[1];
      const sunset = weatherData.daily.sunset[0].split("T")[1];

      const weatherInfo = getWeatherIcon(current.weathercode);

      setWeather({
        city,
        temperature: current.temperature,
        feelsLike,
        wind: current.windspeed,
        humidity,
        sunrise,
        sunset,
        weatherInfo,
      });
      setError("");
    } catch (err) {
      setError(" Error fetching weather.");
      setWeather(null);
    }
  };

  return (
    <div className="weather-container">
      <div className="weather-card">
        <h1>Weather Now</h1>

        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <br />
        <button onClick={getWeather}>Get Weather</button>

        {error && <div className="error">{error}</div>}

        {weather && (
          <div className="weather-info">
            <div className="weather-icon">
              {weather.weatherInfo.split(" ")[0]}
            </div>
            <b>{weather.city}</b>
            <br />
            {weather.weatherInfo}
            <br />
            Temp: {weather.temperature}°C
            <br />
            Feels Like: {weather.feelsLike}°C
            <br />
            Wind: {weather.wind} km/h
            <br />
            Humidity: {weather.humidity}%
            <br />
            Sunrise: {weather.sunrise}
            <br />
            Sunset: {weather.sunset}
          </div>
        )}
      </div>
    </div>
  );
}
