"use client";

import { useState } from "react";
import { FiUsers, FiUserCheck, FiUserX, FiClock, FiSearch, FiFilter } from "react-icons/fi";

interface UserStatsProps {
  stats: {
    totalUsers: number;
    pendingUsers: number;
    adminUsers: number;
  };
  loading: boolean;
}

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  roleFilter: string;
  onRoleFilterChange: (role: string) => void;
}

export const UserStats = ({ stats, loading }: UserStatsProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      icon: FiUsers,
      label: "Total Pengguna",
      value: stats.totalUsers,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: FiClock,
      label: "Menunggu Persetujuan",
      value: stats.pendingUsers,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      icon: FiUserCheck,
      label: "Administrator",
      value: stats.adminUsers,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {statItems.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md smooth-transition">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-lg ${item.bgColor} flex items-center justify-center`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const UserFilters = ({ searchTerm, onSearchChange, roleFilter, onRoleFilterChange }: UserFiltersProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent"
            />
          </div>
        </div>
        <div className="md:w-48">
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={roleFilter}
              onChange={(e) => onRoleFilterChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent appearance-none"
            >
              <option value="all">Semua Role</option>
              <option value="pending">Menunggu Persetujuan</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
