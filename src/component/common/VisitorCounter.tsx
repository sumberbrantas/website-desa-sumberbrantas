"use client";

import React from "react";
import { FiEye, FiUsers, FiTrendingUp } from "react-icons/fi";
import { useVisitorStats } from "@/hooks/useStatistics";

const VisitorCounter = () => {
  const { totalVisitors, dailyVisitors, pageViews, loading, error } = useVisitorStats();

  if (loading) {
    return (
      <div className="flex items-center space-x-4 text-white/70 text-xs">
        <div className="flex items-center space-x-1">
          <FiEye size={14} />
          <span>Memuat...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-white/70 text-xs">
        <FiUsers size={14} />
        <span>Statistik tidak tersedia</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-1 sm:space-y-0 text-white/70 text-xs">
      <div className="flex items-center space-x-1">
        <FiUsers size={14} />
        <span>{totalVisitors.toLocaleString("id-ID")} total pengunjung</span>
      </div>
      <div className="flex items-center space-x-1">
        <FiTrendingUp size={14} />
        <span>{dailyVisitors} hari ini</span>
      </div>
      <div className="flex items-center space-x-1">
        <FiEye size={14} />
        <span>{pageViews.toLocaleString("id-ID")} halaman dilihat</span>
      </div>
    </div>
  );
};

export default VisitorCounter;
