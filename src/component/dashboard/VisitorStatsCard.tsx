"use client";

import React, { useState, useEffect } from "react";
import { FiUsers, FiEye, FiCalendar, FiTrendingUp, FiActivity } from "react-icons/fi";
import { useVisitorStats } from "@/hooks/useStatistics";
import { getVisitorStats, getTodayVisitorCount, getWeeklyVisitorCount } from "@/lib/visitorService";

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  loading?: boolean;
}

const StatCard = ({ icon: Icon, title, value, change, isPositive = true, loading = false }: StatCardProps) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4 border border-gray-100 animate-pulse">
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
          <div className="w-12 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="w-16 h-6 bg-gray-200 rounded mb-1"></div>
        <div className="w-20 h-3 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-6 h-6 text-[#1B3A6D]" />
        {change && <span className={`text-xs font-medium ${isPositive ? "text-green-600" : "text-red-500"}`}>{change}</span>}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  );
};

interface VisitorStatsCardProps {
  className?: string;
}

const VisitorStatsCard = ({ className = "" }: VisitorStatsCardProps) => {
  const [mounted, setMounted] = useState(false);
  const [extendedStats, setExtendedStats] = useState({
    weeklyVisitors: 0,
    averageDaily: 0,
    peakDay: "",
    peakDayCount: 0,
  });

  const { totalVisitors, dailyVisitors, todayChange, pageViews, loading, error } = useVisitorStats();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchExtendedStats = async () => {
      try {
        const stats = await getVisitorStats();
        if (stats) {
          const weeklyCount = getWeeklyVisitorCount(stats);
          const dailyData = stats.dailyVisits;

          const last7Days = Object.entries(dailyData)
            .slice(-7)
            .map(([_, count]) => count);
          const average = last7Days.length > 0 ? Math.round(last7Days.reduce((sum, count) => sum + count, 0) / last7Days.length) : 0;

          let peakDay = "";
          let peakCount = 0;
          Object.entries(dailyData).forEach(([date, count]) => {
            if (count > peakCount) {
              peakCount = count;
              peakDay = new Date(date).toLocaleDateString("id-ID", {
                weekday: "short",
                day: "numeric",
                month: "short",
              });
            }
          });

          setExtendedStats({
            weeklyVisitors: weeklyCount,
            averageDaily: average,
            peakDay,
            peakDayCount: peakCount,
          });
        }
      } catch (error) {
        console.error("Error fetching extended stats:", error);
      }
    };

    if (mounted && !loading) {
      fetchExtendedStats();
    }
  }, [mounted, loading]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toLocaleString("id-ID");
  };

  const calculateGrowthPercentage = () => {
    if (extendedStats.averageDaily > 0 && dailyVisitors > 0) {
      const growth = ((dailyVisitors - extendedStats.averageDaily) / extendedStats.averageDaily) * 100;
      return growth.toFixed(1);
    }
    return "0";
  };

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 ${className}`}>
        <div className="text-center text-gray-500 py-4">
          <FiActivity className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">{error}</p>
          <p className="text-xs text-gray-400 mt-1">Menggunakan data fallback</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 smooth-transition hover-lift ${mounted ? "smooth-reveal" : "animate-on-load"} ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Statistik Pengunjung</h3>
        <p className="text-sm text-gray-600">Data pengunjung website desa terkini</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={FiUsers} title="Total Pengunjung" value={formatNumber(totalVisitors)} loading={loading} />

        <StatCard icon={FiCalendar} title="Hari Ini" value={formatNumber(dailyVisitors)} change={todayChange > 0 ? `+${todayChange}` : "0"} isPositive={todayChange >= 0} loading={loading} />

        <StatCard icon={FiEye} title="Page Views" value={formatNumber(pageViews)} loading={loading} />

        <StatCard icon={FiTrendingUp} title="Minggu Ini" value={formatNumber(extendedStats.weeklyVisitors)} change={`${calculateGrowthPercentage()}%`} isPositive={parseFloat(calculateGrowthPercentage()) >= 0} loading={loading} />
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Rata-rata Harian</p>
          <p className="text-lg font-semibold text-[#1B3A6D]">
            {loading ? "..." : formatNumber(extendedStats.averageDaily)}
            <span className="text-sm font-normal text-gray-600 ml-1">pengunjung</span>
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Hari Tertinggi</p>
          <p className="text-lg font-semibold text-[#1B3A6D]">
            {loading ? "..." : extendedStats.peakDay || "Belum ada data"}
            {extendedStats.peakDay && <span className="text-sm font-normal text-gray-600 ml-1">({formatNumber(extendedStats.peakDayCount)})</span>}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VisitorStatsCard;

