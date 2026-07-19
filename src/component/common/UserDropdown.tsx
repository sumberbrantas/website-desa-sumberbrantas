"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FiUser, FiSettings, FiLogOut, FiChevronDown, FiBarChart } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthActions } from "@/hooks/useAuth";
import { confirmLogout, showError } from "@/utils/confirmationUtils";

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { profile, user } = useAuth();
  const { logout } = useAuthActions();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    const confirmed = await confirmLogout();
    if (confirmed) {
      try {
        setIsOpen(false);
        await logout();
      } catch (error) {
        console.error("Error logging out:", error);
        showError("Terjadi kesalahan saat logout");
      }
    }
  };

  if (!profile || !user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="user-dropdown-btn flex items-center space-x-2 text-gray-700 hover:text-[#1B3A6D] px-3 py-2 text-sm font-medium smooth-transition rounded-md">
        <div className="user-avatar w-8 h-8 bg-[#1B3A6D] rounded-full flex items-center justify-center">
          <FiUser className="text-white" size={16} />
        </div>
        <span className="hidden md:block">{profile.name}</span>
        <FiChevronDown className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-scale-in">
          <div className="py-1">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <p className="text-sm font-medium text-gray-900">{profile.name}</p>
              <p className="text-xs text-gray-500">{profile.email}</p>
              <p className="text-xs text-gray-400 capitalize">{profile.role}</p>
            </div>

            <Link href="/dashboard" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1B3A6D] smooth-transition group" onClick={() => setIsOpen(false)}>
              <FiBarChart className="mr-3 group-hover:scale-110 transition-transform" size={16} />
              Dashboard
            </Link>

            <Link href="/dashboard/profile" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1B3A6D] smooth-transition group" onClick={() => setIsOpen(false)}>
              <FiUser className="mr-3 group-hover:scale-110 transition-transform" size={16} />
              Profil Saya
            </Link>

            <hr className="my-1 border-gray-200" />

            <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 smooth-transition group rounded-b-lg">
              <FiLogOut className="mr-3 group-hover:scale-110 transition-transform" size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
