"use client";

import { FiHome, FiFileText, FiBell, FiLogOut, FiX, FiUser, FiImage, FiUsers, FiBookOpen, FiSettings, FiMenu as FiMenuIcon, FiFile as FiFileIcon, FiMapPin, FiMap as FiMapIcon, FiShoppingBag, FiInfo } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthActions } from "@/hooks/useAuth";
import { useVillageSettings } from "@/hooks/useVillageSettings";
import StorageProgress from "./StorageProgress";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);
  const { profile } = useAuth();
  const { logout } = useAuthActions();
  const { settings } = useVillageSettings();

  const villageName = settings?.villageName || "Desa";
  const logoUrl = settings?.logoUrl || "/logo.png";
  const sidebarBg = "var(--primary)";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && window.innerWidth < 1024) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const menuItems = [
    { icon: FiHome, text: "Dashboard", href: "/dashboard" },
    { icon: FiSettings, text: "Pengaturan Desa", href: "/dashboard/settings" },
    { icon: FiInfo, text: "Kelola Profil Desa", href: "/dashboard/profil-desa" },
    { icon: FiMenuIcon, text: "Manajemen Menu", href: "/dashboard/menus" },
    { icon: FiFileIcon, text: "Kelola Dokumen", href: "/dashboard/documents" },
    { icon: FiHome, text: "Kelola Penginapan", href: "/dashboard/accommodations" },
    { icon: FiMapIcon, text: "Kelola Destinasi", href: "/dashboard/destinations" },
    { icon: FiShoppingBag, text: "Kelola Produk", href: "/dashboard/products" },
    { icon: FiFileText, text: "Kelola Berita", href: "/dashboard/article" },
    { icon: FiBell, text: "Kelola Pengumuman", href: "/dashboard/announcement" },
    { icon: FiUsers, text: "Kelola Struktur", href: "/dashboard/structure" },
    { icon: FiImage, text: "Kelola Galeri", href: "/dashboard/gallery" },
    { icon: FiUser, text: "Kelola Akun", href: "/dashboard/users" },
    { icon: FiBookOpen, text: "Panduan Admin", href: "/dashboard/panduan" },
  ];

  return (
    <>
      <aside
        ref={sidebarRef}
        className={`
        dashboard-sidebar fixed lg:relative lg:translate-x-0
        w-64 h-full flex flex-col text-white shadow-lg
        z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
        style={{ backgroundColor: sidebarBg }}
      >
        <div className="lg:hidden absolute top-4 right-4 z-10">
          <button onClick={onClose} className="text-white hover:bg-white/10 p-2 rounded-lg smooth-transition hover:scale-110 active:scale-95">
            <FiX size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-white/10 smooth-transition">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 smooth-transition hover:scale-105">
              <img
                src={logoUrl}
                alt={`${villageName} Logo`}
                className="w-10 h-10 object-contain smooth-transition"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold text-white smooth-transition">{villageName}</h1>
              <p className="text-xs text-white/70 smooth-transition">Panel Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-grow px-4 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={item.text} className={`animate-slide-in-left`}>
                <Link
                  href={item.href}
                  onClick={() => onClose()}
                  className={`
                    flex items-center px-4 py-3 rounded-lg smooth-transition text-xs group
                    hover:scale-105 active:scale-95
                    ${pathname === item.href ? "bg-white font-medium shadow-sm" : "text-white/90 hover:bg-white/10 hover:text-white"}
                  `}
                  style={pathname === item.href ? { color: "var(--primary)" } : {}}
                >
                  <item.icon className="mr-2 smooth-transition group-hover:scale-110" size={14}
                    style={pathname === item.href ? { color: "var(--primary)" } : {}} />
                  <span className="smooth-transition">{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <StorageProgress />

        <div className="px-4 py-3 border-t border-white/10 space-y-3 flex-shrink-0">
          <button onClick={logout} className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-white/10 smooth-transition text-xs text-white/90 hover:text-white group hover:scale-105 active:scale-95">
            <FiLogOut className="mr-2 smooth-transition group-hover:scale-110" size={14} />
            <span className="smooth-transition">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
