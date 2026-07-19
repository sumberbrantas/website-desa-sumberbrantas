"use client";

import React, { useEffect, useState } from "react";

interface WeatherEffectsProps {
  weatherCode: string;
  description: string;
  intensity?: "light" | "medium" | "heavy";
}

const WeatherEffects: React.FC<WeatherEffectsProps> = ({ weatherCode, description, intensity = "medium" }) => {
  const [mounted, setMounted] = useState(false);
  const [effectsVisible, setEffectsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setEffectsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const getWeatherType = (code: string, desc: string): string => {
    const codeNum = parseInt(code);
    const descLower = desc.toLowerCase();

    if (codeNum >= 200 && codeNum <= 299) return "stormy";
    if (descLower.includes("thunderstorm") || descLower.includes("lightning") || descLower.includes("storm")) return "stormy";

    if (codeNum >= 300 && codeNum <= 399) return "drizzle";
    if (descLower.includes("drizzle") || descLower.includes("light rain")) return "drizzle";

    if (codeNum >= 500 && codeNum <= 599) {
      if (codeNum === 500 || codeNum === 501) return "rainy";
      if (codeNum >= 502 && codeNum <= 504) return "heavy-rain";
      if (codeNum >= 520 && codeNum <= 531) return "rainy";
      return "rainy";
    }
    if (descLower.includes("heavy rain") || descLower.includes("torrential") || descLower.includes("extreme rain")) return "heavy-rain";
    if (descLower.includes("moderate rain") || descLower.includes("rain")) return "rainy";

    if (codeNum >= 600 && codeNum <= 699) return "snowy";
    if (descLower.includes("snow") || descLower.includes("blizzard") || descLower.includes("sleet")) return "snowy";

    if (codeNum >= 700 && codeNum <= 799) return "foggy";
    if (descLower.includes("fog") || descLower.includes("mist") || descLower.includes("haze") || descLower.includes("dust") || descLower.includes("sand")) return "foggy";

    if (codeNum === 800) return "sunny";
    if (descLower.includes("clear") || descLower.includes("sunny")) return "sunny";

    if (codeNum === 801) return "few-clouds";
    if (codeNum === 802) return "scattered-clouds";
    if (codeNum === 803) return "broken-clouds";
    if (codeNum === 804) return "overcast";
    if (descLower.includes("overcast")) return "overcast";
    if (descLower.includes("broken cloud")) return "broken-clouds";
    if (descLower.includes("scattered cloud")) return "scattered-clouds";
    if (descLower.includes("few cloud")) return "few-clouds";
    if (descLower.includes("cloud")) return "scattered-clouds";

    return "few-clouds";
  };

  const weatherType = getWeatherType(weatherCode, description);

  console.log("Weather mapping debug:", {
    weatherCode,
    description,
    mappedType: weatherType,
  });

  const generateRainDrops = (isStormy = false, isHeavy = false) => {
    const drops = [];
    let baseDropCount = intensity === "light" ? 15 : intensity === "medium" ? 25 : 35;

    if (isHeavy) baseDropCount = Math.min(baseDropCount * 1.5, 50);
    else if (isStormy) baseDropCount = Math.min(baseDropCount * 1.3, 45);

    const dropCount = baseDropCount;

    for (let i = 0; i < dropCount; i++) {
      const delay = Math.random() * (isStormy ? 2 : isHeavy ? 1.5 : 4);
      const baseDuration = isHeavy ? 0.8 : isStormy ? 1 : 1.5;
      const duration = baseDuration + Math.random() * (isHeavy ? 0.4 : isStormy ? 0.5 : 0.8);
      const left = Math.random() * 105;

      const height = isHeavy ? 12 + Math.random() * 8 : isStormy ? 10 + Math.random() * 6 : 8 + Math.random() * 4;

      const baseOpacity = isHeavy ? 0.4 : isStormy ? 0.35 : 0.25;
      const opacity = baseOpacity + Math.random() * 0.2;

      const windIntensity = isHeavy ? 40 : isStormy ? 35 : 20;
      const windOffset = Math.random() * windIntensity;

      const dropWidth = isHeavy ? 1.8 + Math.random() * 0.4 : isStormy ? 1.6 + Math.random() * 0.3 : 1.2 + Math.random() * 0.2;

      drops.push(
        <div
          key={i}
          className={`rain-drop ${isStormy ? "stormy" : ""} ${isHeavy ? "heavy" : ""}`}
          style={
            {
              left: `${left}%`,
              height: `${height}px`,
              width: `${dropWidth}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              opacity: effectsVisible ? opacity : 0,
              transition: "opacity 0.8s ease-in-out",
              "--wind-offset": `${windOffset}px`,
            } as React.CSSProperties
          }
        />
      );
    }
    return drops;
  };

  const generateSnowFlakes = () => {
    const flakes = [];
    const flakeCount = intensity === "light" ? 12 : intensity === "medium" ? 20 : 30;

    for (let i = 0; i < flakeCount; i++) {
      const delay = Math.random() * 6;
      const duration = 6 + Math.random() * 4;
      const left = Math.random() * 100;
      const symbols = ["❄", "❅", "❆"];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const opacity = 0.5 + Math.random() * 0.3;

      const size = 8 + Math.random() * 4;

      flakes.push(
        <div
          key={i}
          className="snow-flake"
          style={{
            left: `${left}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            fontSize: `${size}px`,
            opacity: effectsVisible ? opacity : 0,
            transition: "opacity 1s ease-in-out",
          }}
        >
          {symbol}
        </div>
      );
    }
    return flakes;
  };

  const generateClouds = (cloudType = "normal") => {
    const clouds = [];
    let cloudCount = intensity === "light" ? 1 : intensity === "medium" ? 2 : 3;

    if (cloudType === "few") cloudCount = 1;
    if (cloudType === "scattered") cloudCount = Math.max(1, Math.floor(cloudCount * 0.8));
    if (cloudType === "broken") cloudCount = Math.floor(cloudCount * 1.2);
    if (cloudType === "overcast") cloudCount = Math.floor(cloudCount * 1.4);

    for (let i = 0; i < cloudCount; i++) {
      const delay = Math.random() * 30;
      const baseDuration = cloudType === "overcast" ? 60 : 45;
      const duration = baseDuration + Math.random() * 30;
      const top = cloudType === "overcast" ? Math.random() * 50 : 8 + Math.random() * 25;
      const width = 80 + Math.random() * 60;
      const height = 25 + Math.random() * 25;

      let opacity = 0.1 + Math.random() * 0.1;
      if (cloudType === "few") opacity *= 0.7;
      if (cloudType === "overcast") opacity *= 1.5;

      clouds.push(
        <div
          key={i}
          className={`cloud cloud-${cloudType}`}
          style={{
            top: `${top}%`,
            width: `${width}px`,
            height: `${height}px`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            opacity: effectsVisible ? opacity : 0,
            transition: "opacity 1.5s ease-in-out",
          }}
        />
      );
    }
    return clouds;
  };

  const generateFogLayers = () => {
    const layerCount = intensity === "light" ? 2 : intensity === "medium" ? 3 : 4;
    
    return (
      <>
        {[...Array(layerCount)].map((_, i) => (
          <div
            key={i}
            className="fog-layer"
            style={{
              opacity: effectsVisible ? (0.3 - i * 0.05) : 0,
              transition: `opacity ${1.5 + i * 0.3}s ease-in-out`,
              transitionDelay: `${i * 0.4}s`,
              top: `${15 + i * 20}%`,
              height: `${100 - i * 10}px`,
            }}
          />
        ))}
      </>
    );
  };

  const generateLightningEffects = () => {
    return (
      <>

        <div 
          className="lightning-flash" 
          style={{
            opacity: effectsVisible ? 0.6 : 0,
            transition: "opacity 1s ease-in-out",
          }}
        />


        <div
          className="lightning-bolt"
          style={{
            opacity: effectsVisible ? 0.8 : 0,
            transition: "opacity 1s ease-in-out",
            transform: "scale(0.7)",
          }}
        />


        <div className="lightning-streaks">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className={`lightning-streak lightning-streak-${i + 1}`}
              style={{
                opacity: effectsVisible ? 0.5 : 0,
                transition: `opacity 0.8s ease-in-out`,
                transitionDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </>
    );
  };

  const renderWeatherEffect = () => {
    switch (weatherType) {
      case "drizzle":
        return <div className={`rain-container drizzle transition-opacity duration-1000 ${effectsVisible ? "opacity-100" : "opacity-0"}`}>{generateRainDrops(false, false)}</div>;

      case "rainy":
        return <div className={`rain-container transition-opacity duration-1000 ${effectsVisible ? "opacity-100" : "opacity-0"}`}>{generateRainDrops(false, false)}</div>;

      case "heavy-rain":
        return <div className={`rain-container heavy-rain transition-opacity duration-1000 ${effectsVisible ? "opacity-100" : "opacity-0"}`}>{generateRainDrops(false, true)}</div>;

      case "snowy":
        return <div className={`snow-container transition-opacity duration-1000 ${effectsVisible ? "opacity-100" : "opacity-0"}`}>{generateSnowFlakes()}</div>;

      case "few-clouds":
        return <div className={`clouds-container transition-opacity duration-1000 ${effectsVisible ? "opacity-100" : "opacity-0"}`}>{generateClouds("few")}</div>;

      case "scattered-clouds":
        return <div className={`clouds-container transition-opacity duration-1000 ${effectsVisible ? "opacity-100" : "opacity-0"}`}>{generateClouds("scattered")}</div>;

      case "broken-clouds":
        return <div className={`clouds-container transition-opacity duration-1000 ${effectsVisible ? "opacity-100" : "opacity-0"}`}>{generateClouds("broken")}</div>;

      case "overcast":
        return <div className={`clouds-container transition-opacity duration-1000 ${effectsVisible ? "opacity-100" : "opacity-0"}`}>{generateClouds("overcast")}</div>;

      case "stormy":
        return (
          <>
            <div className={`rain-container storm-rain transition-opacity duration-1000 ${effectsVisible ? "opacity-100" : "opacity-0"}`}>{generateRainDrops(true, false)}</div>
            <div className={`lightning-container transition-opacity duration-500 ${effectsVisible ? "opacity-100" : "opacity-0"}`}>{generateLightningEffects()}</div>
          </>
        );

      case "sunny":
        return (
          <div className={`sun-rays-container transition-opacity duration-2000 ${effectsVisible ? "opacity-100" : "opacity-0"}`}>
            <div 
              className="sun-rays"
              style={{
                opacity: effectsVisible ? 0.8 : 0,
                transition: "opacity 2s ease-in-out",
              }}
            />

            {intensity !== "light" && (
              <div className="sun-particles">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="sun-particle"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 40}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      opacity: effectsVisible ? 0.3 : 0,
                      transition: `opacity ${1.5 + Math.random()}s ease-in-out`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case "foggy":
        return <div className={`fog-container transition-opacity duration-1000 ${effectsVisible ? "opacity-100" : "opacity-0"}`}>{generateFogLayers()}</div>;

      default:
        return <div className={`clouds-container transition-opacity duration-1000 ${effectsVisible ? "opacity-100" : "opacity-0"}`}>{generateClouds("few")}</div>;
    }
  };

  return <>{renderWeatherEffect()}</>;
};

export default WeatherEffects;

