import { FiSun, FiUsers, FiHome } from "react-icons/fi";
import { usePublicStats } from "@/hooks/usePublicStats";
import { useWeather } from "@/hooks/useWeather";
import { useWeatherIcon } from "@/hooks/useWeatherIcon";

export const useInfoCardsData = () => {
  const { totalArticles, activeAnnouncements, loading } = usePublicStats();
  const { weather, loading: weatherLoading } = useWeather();
  const { getWeatherIcon } = useWeatherIcon();

  const cardData = [
    {
      icon: weather ? getWeatherIcon(weather.icon, weather.description) : FiSun,
      title: "Cuaca Hari Ini",
      value: weatherLoading ? "..." : weather ? `${weather.temperature}°C` : "26°C",
      subtitle: weatherLoading ? "Memuat..." : weather ? weather.description : "Partly Cloudy",
    },
    {
      icon: FiUsers,
      title: "Jumlah Penduduk",
      value: "7.847",
      subtitle: "Jiwa",
    },
    {
      icon: FiHome,
      title: "Jumlah RT",
      value: "39",
      subtitle: "Rukun Tetangga",
    },
  ];

  return { cardData, loading, weatherLoading };
};
