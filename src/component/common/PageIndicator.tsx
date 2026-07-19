"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface PageIndicatorProps {
  className?: string;
}

const PageIndicator = ({ className = "" }: PageIndicatorProps) => {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const pages = [
    { name: "Home", path: "/" },
    { name: "Tentang", path: "/tentang" },
    { name: "Berita", path: "/berita" },
    { name: "Pengumuman", path: "/pengumuman" },
    { name: "Struktur", path: "/struktur" },
    { name: "Pelayanan", path: "/pelayanan" },
  ];

  const isActivePage = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  if (!mounted) return null;

  return (
    <div className={`page-indicator ${className}`}>
      {pages.map((page, index) => (
        <div key={page.path} className={`page-indicator-dot ${isActivePage(page.path) ? "active" : ""}`} title={page.name} />
      ))}
    </div>
  );
};

export default PageIndicator;
