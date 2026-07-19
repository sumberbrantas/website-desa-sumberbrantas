import React, { useState, useEffect } from "react";
import { IconType } from "react-icons";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

interface DashboardCardProps {
  title: string;
  value: string;
  percentage: string;
  change: string;
  isPositive: boolean;
  loading?: boolean;
}

const DashboardCard = ({ title, value, percentage, change, isPositive, loading = false }: DashboardCardProps) => {
  const [mounted, setMounted] = useState(false);
  const textColor = isPositive ? "text-green-600" : "text-red-500";
  const Icon = isPositive ? FiArrowUp : FiArrowDown;

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className={`bg-white app-card shadow-sm border border-gray-100 hover-lift smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
        <div className="flex flex-col justify-between h-full min-h-[100px] sm:min-h-[120px] animate-pulse">
          <div className="mb-2">
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="mb-3 flex-grow flex items-center">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="flex items-center justify-start gap-1">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-20 ml-1"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white app-card shadow-sm border border-gray-100 hover-lift smooth-transition cursor-pointer ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <div className="flex flex-col justify-between h-full min-h-[100px] sm:min-h-[120px]">

        <div className="mb-2">
          <p className="text-gray-600 text-xs font-medium leading-tight smooth-transition">{title}</p>
        </div>


        <div className="mb-3 flex-grow flex items-center">
          <h3 className="app-text-xl font-bold text-black leading-tight break-words smooth-transition">{value}</h3>
        </div>


        <div className="flex items-center justify-start gap-1 group">
          <div className="flex items-center flex-shrink-0 smooth-transition group-hover:scale-105">
            <Icon className={`${textColor} mr-1 smooth-transition`} size={12} />
            <span className={`${textColor} text-xs font-medium smooth-transition`}>{percentage}</span>
          </div>
          <span className="text-gray-400 text-xs truncate ml-1 smooth-transition">{change}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;

