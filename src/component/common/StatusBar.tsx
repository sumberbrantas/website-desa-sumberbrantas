"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FiMapPin, FiClock, FiUsers, FiActivity } from "react-icons/fi";
import { useVillageSettings } from "@/hooks/useVillageSettings";

interface StatusBarProps {
  onMenuClick?: () => void;
}

const StatusBar = ({ onMenuClick }: StatusBarProps = {}) => {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const pathname = usePathname();
  const { settings } = useVillageSettings();

  const villageName = settings?.villageName || "Desa";

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getPageInfo = () => {
    const pageMap: Record<string, { name: string; icon: React.ReactNode }> = {
      "/": { name: "Beranda", icon: <FiActivity size={14} /> },
      "/tentang": { name: "Tentang", icon: <FiUsers size={14} /> },
      "/berita": { name: "Berita", icon: <FiActivity size={14} /> },
      "/pengumuman": { name: "Pengumuman", icon: <FiActivity size={14} /> },
      "/struktur": { name: "Struktur", icon: <FiUsers size={14} /> },
      "/pelayanan": { name: "Pelayanan", icon: <FiActivity size={14} /> },
      "/galeri": { name: "Galeri", icon: <FiActivity size={14} /> },
      "/documents": { name: "Dokumen", icon: <FiActivity size={14} /> },
      "/accommodations": { name: "Penginapan", icon: <FiActivity size={14} /> },
      "/destinations": { name: "Destinasi", icon: <FiActivity size={14} /> },
      "/products": { name: "Produk", icon: <FiActivity size={14} /> },
    };

    const pathSegments = pathname.split("/").filter(Boolean);
    const baseRoute = pathSegments.length > 0 ? `/${pathSegments[0]}` : "/";

    return pageMap[baseRoute] || { name: "Halaman", icon: <FiActivity size={14} /> };
  };

  if (!mounted) return null;

  const { name, icon } = getPageInfo();

  return (
    <div className="fixed bottom-4 left-4 z-40 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-md shadow-sm px-3 py-2 hidden lg:block">
      <div className="flex items-center space-x-3 text-xs text-gray-600">

        <div className="flex items-center space-x-1">
          {icon}
          <span className="font-medium text-[#1B3A6D]">{name}</span>
        </div>

        <div className="w-px h-3 bg-gray-300"></div>


        <div className="flex items-center space-x-1">
          <FiMapPin size={12} />
          <span>{villageName}</span>
        </div>

        <div className="w-px h-3 bg-gray-300"></div>


        <div className="flex items-center space-x-1">
          <FiClock size={12} />
          <span>
            {currentTime.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
