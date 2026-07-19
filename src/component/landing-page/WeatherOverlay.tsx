import { useWeather } from "@/hooks/useWeather";
import { useActiveGalleryImages } from "@/hooks/useGallery";
import WeatherEffects from "@/component/common/WeatherEffects";
import { useEffect, useState } from "react";

interface WeatherOverlayProps {
  weather: any;
  weatherVisible: boolean;
  onWeatherOverlayClass: (weatherCode: string, description: string) => string;
}

const WeatherOverlay = ({ weather, weatherVisible, onWeatherOverlayClass }: WeatherOverlayProps) => {
  if (!weather) return null;

  const weatherOverlayClass = onWeatherOverlayClass(weather.icon, weather.description);

  console.log("Weather overlay mapping:", {
    icon: weather.icon,
    description: weather.description,
    overlayClass: weatherOverlayClass,
  });

  return (
    <>
      <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${weatherOverlayClass} ${weatherVisible ? "opacity-100" : "opacity-0"}`}></div>
      {weatherVisible && (
        <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
          <WeatherEffects weatherCode={weather.icon} description={weather.description} intensity="medium" />
        </div>
      )}
    </>
  );
};

export default WeatherOverlay;

