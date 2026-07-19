"use client";

import React, { useState, useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement } from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { getVisitorStats, getTodayVisitorCount, getWeeklyVisitorCount } from "@/lib/visitorService";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

interface VisitorChartProps {
  type?: "line" | "bar" | "doughnut";
  timeRange?: "7days" | "30days";
  className?: string;
}

const VisitorChart = ({ type = "line", timeRange = "7days", className = "" }: VisitorChartProps) => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const { getVisitorStats, getVisitorDataByRange, getTodayVisitorCount, getWeeklyVisitorCount, ensureHistoricalData } = await import("@/lib/visitorService");

        const days = timeRange === "7days" ? 7 : 30;
        await ensureHistoricalData(days);

        const stats = await getVisitorStats();

        if (stats) {
          if (type === "doughnut") {
            const todayVisitors = getTodayVisitorCount(stats);
            const weeklyVisitors = getWeeklyVisitorCount(stats);
            const totalVisitors = stats.totalVisitors;
            const otherVisitors = Math.max(0, totalVisitors - weeklyVisitors);

            setChartData({
              labels: ["Hari Ini", "Minggu Ini", "Lainnya"],
              datasets: [
                {
                  data: [todayVisitors, weeklyVisitors - todayVisitors, otherVisitors],
                  backgroundColor: ["#1B3A6D", "#4F87C7", "#E5E7EB"],
                  borderColor: ["#1B3A6D", "#4F87C7", "#E5E7EB"],
                  borderWidth: 2,
                },
              ],
            });
          } else {
            const { labels, data: visitors } = getVisitorDataByRange(stats, days);

            setChartData({
              labels,
              datasets: [
                {
                  label: "Pengunjung Harian",
                  data: visitors,
                  borderColor: "#1B3A6D",
                  backgroundColor: type === "bar" ? "rgba(27, 58, 109, 0.1)" : "rgba(27, 58, 109, 0.1)",
                  borderWidth: 2,
                  fill: type === "line",
                  tension: 0.4,
                  pointBackgroundColor: "#1B3A6D",
                  pointBorderColor: "#fff",
                  pointBorderWidth: 2,
                  pointRadius: 4,
                  pointHoverRadius: 6,
                },
              ],
            });
          }
        } else {
          const labels = Array.from({ length: days }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (days - 1 - i));
            return date.toLocaleDateString("id-ID", {
              weekday: "short",
              day: "numeric",
              month: "short",
            });
          });
          const data = Array(days).fill(0);

          setChartData({
            labels,
            datasets: [
              {
                label: "Pengunjung Harian",
                data,
                borderColor: "#1B3A6D",
                backgroundColor: "rgba(27, 58, 109, 0.1)",
                borderWidth: 2,
                fill: type === "line",
                tension: 0.4,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);

        const days = timeRange === "7days" ? 7 : 30;
        const labels = Array.from({ length: days }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (days - 1 - i));
          return date.toLocaleDateString("id-ID", {
            weekday: "short",
            day: "numeric",
            month: "short",
          });
        });
        const data = Array(days).fill(0);

        setChartData({
          labels,
          datasets: [
            {
              label: "Pengunjung Harian",
              data,
              borderColor: "#1B3A6D",
              backgroundColor: "rgba(27, 58, 109, 0.1)",
              borderWidth: 2,
              fill: type === "line",
              tension: 0.4,
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    if (mounted) {
      fetchChartData();
    }
  }, [type, timeRange, mounted]);

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: type === "doughnut",
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#1B3A6D",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
      },
    },
  };

  const lineBarOptions = {
    ...commonOptions,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: "#6B7280",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 11,
          },
          color: "#6B7280",
          callback: function (value: any) {
            return value >= 1000 ? (value / 1000).toFixed(1) + "k" : value;
          },
        },
      },
    },
  };

  const doughnutOptions = {
    ...commonOptions,
    cutout: "60%",
    plugins: {
      ...commonOptions.plugins,
      legend: {
        ...commonOptions.plugins.legend,
        display: true,
      },
    },
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 ${className}`}>
        <div className="text-center text-gray-500 py-8">
          <p>Gagal memuat data grafik</p>
        </div>
      </div>
    );
  }

  const renderChart = () => {
    switch (type) {
      case "bar":
        return <Bar data={chartData} options={lineBarOptions} />;
      case "doughnut":
        return <Doughnut data={chartData} options={doughnutOptions} />;
      default:
        return <Line data={chartData} options={lineBarOptions} />;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 smooth-transition hover-lift ${mounted ? "smooth-reveal" : "animate-on-load"} ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{type === "doughnut" ? "Distribusi Pengunjung" : "Statistik Pengunjung"}</h3>
        <p className="text-sm text-gray-600">{type === "doughnut" ? "Pembagian pengunjung berdasarkan periode" : `Data pengunjung ${timeRange === "7days" ? "7 hari" : "30 hari"} terakhir`}</p>
      </div>

      <div className="h-48 sm:h-64">{renderChart()}</div>
    </div>
  );
};

export default VisitorChart;

