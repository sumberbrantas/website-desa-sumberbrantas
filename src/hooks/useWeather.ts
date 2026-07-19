"use client";

import { useState, useEffect } from "react";

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  feelsLike: number;
  source?: string;
}

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        const lat = -8.1525;
        const lon = 112.5183;

        let weatherData = null;

        try {
          const meteoResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`);
          if (meteoResponse.ok) {
            const meteoData = await meteoResponse.json();
            const current = meteoData.current_weather;

            const getWeatherDescription = (code: number): { description: string; icon: string } => {
              if (code === 0) return { description: "Clear sky", icon: "800" };
              if (code === 1) return { description: "Mainly clear", icon: "801" };
              if (code === 2) return { description: "Partly cloudy", icon: "802" };
              if (code === 3) return { description: "Overcast", icon: "804" };
              if (code >= 45 && code <= 48) return { description: "Fog", icon: "741" };
              if (code >= 51 && code <= 57) return { description: "Drizzle", icon: "300" };
              if (code >= 61 && code <= 67) return { description: "Rain", icon: "500" };
              if (code >= 71 && code <= 77) return { description: "Snow", icon: "600" };
              if (code >= 80 && code <= 82) return { description: "Rain showers", icon: "521" };
              if (code >= 85 && code <= 86) return { description: "Snow showers", icon: "621" };
              if (code >= 95 && code <= 99) return { description: "Thunderstorm", icon: "200" };
              return { description: "Clear sky", icon: "800" };
            };

            const weatherInfo = getWeatherDescription(current.weathercode);

            weatherData = {
              temperature: Math.round(current.temperature),
              description: weatherInfo.description,
              humidity: meteoData.hourly.relative_humidity_2m[0] || 75,
              windSpeed: Math.round(current.windspeed),
              icon: weatherInfo.icon,
              feelsLike: Math.round(current.temperature + (current.windspeed > 10 ? -2 : 0)),
              source: "Open-Meteo"
            };
          }
        } catch (error) {
          console.log("Open-Meteo failed, trying backup...");
        }

        if (!weatherData) {
          try {
            const wttrResponse = await fetch(`https://wttr.in/Malang,Indonesia?format=j1`);
            if (wttrResponse.ok) {
              const wttrData = await wttrResponse.json();
              const current = wttrData.current_condition[0];
              weatherData = {
                temperature: parseInt(current.temp_C),
                description: current.weatherDesc[0].value,
                humidity: parseInt(current.humidity),
                windSpeed: parseInt(current.windspeedKmph),
                icon: current.weatherCode,
                feelsLike: parseInt(current.FeelsLikeC),
                source: "wttr.in"
              };
            }
          } catch (error) {
            console.log("wttr.in backup also failed...");
          }
        }

        if (weatherData) {
          console.log("✅ Weather data received from", weatherData.source, ":", {
            description: weatherData.description,
            icon: weatherData.icon,
            temperature: weatherData.temperature + "°C"
          });
          setWeather(weatherData);
        } else {
          throw new Error("All weather services failed");
        }
      } catch (err) {
        console.error("Error fetching weather:", err);
        setError("Gagal mengambil data cuaca");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    const interval = setInterval(fetchWeather, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { weather, loading, error };
};

