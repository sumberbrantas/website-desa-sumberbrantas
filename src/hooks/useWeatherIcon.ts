import { FiSun, FiCloud, FiCloudRain } from "react-icons/fi";

export const useWeatherIcon = () => {
  const getWeatherIcon = (weatherCode: string, description: string) => {
    const code = parseInt(weatherCode);

    if (code === 113) return FiSun;
    if ([116, 119, 122].includes(code)) return FiCloud;
    if ([119, 122, 143, 248, 260].includes(code)) return FiCloud;
    if ([176, 179, 182, 185, 200, 227, 230, 263, 266, 281, 284, 293, 296, 299, 302, 305, 308, 311, 314, 317, 320, 323, 326, 356, 359, 362, 365, 368, 371, 374, 377, 386, 389, 392, 395].includes(code)) return FiCloudRain;

    return FiSun;
  };

  return { getWeatherIcon };
};
