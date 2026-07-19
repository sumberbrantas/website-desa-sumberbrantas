"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useVillageSettings } from "@/hooks/useVillageSettings";

interface ActivePageTitleProps {
  className?: string;
}

const ActivePageTitle = ({ className = "" }: ActivePageTitleProps) => {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { settings } = useVillageSettings();

  const villageName = settings?.villageName || "Desa";

  useEffect(() => {
    setMounted(true);
  }, []);

  const getPageTitle = () => {
    const pathSegments = pathname.split("/").filter(Boolean);

    const pageMap: Record<string, { title: string; subtitle: string }> = {
      "/": { title: "Beranda", subtitle: `Selamat datang di website ${villageName}` },
      "/tentang": { title: "Tentang", subtitle: `Informasi mengenai ${villageName}` },
      "/berita": { title: "Berita", subtitle: `Berita terbaru dari ${villageName}` },
      "/pengumuman": { title: "Pengumuman", subtitle: "Pengumuman resmi dari pemerintah desa" },
      "/struktur": { title: "Struktur", subtitle: "Struktur organisasi pemerintahan desa" },
      "/pelayanan": { title: "Pelayanan", subtitle: "Layanan untuk masyarakat desa" },
      "/galeri": { title: "Galeri", subtitle: "Koleksi foto dan video kegiatan desa" },
      "/dashboard": { title: "Dashboard", subtitle: "Panel administrasi website" },
      "/documents": { title: "Dokumen", subtitle: `Dokumen dan file resmi ${villageName}` },
      "/accommodations": { title: "Penginapan", subtitle: "Tempat penginapan di sekitar desa" },
      "/destinations": { title: "Destinasi", subtitle: "Tempat wisata di sekitar desa" },
      "/products": { title: "Produk UMKM", subtitle: "Produk lokal dari pelaku usaha desa" },
    };

    if (pathSegments.length > 1) {
      const baseRoute = `/${pathSegments[0]}`;
      const pageInfo = pageMap[baseRoute];
      if (pageInfo) {
        return {
          title: pageInfo.title,
          subtitle: `${pageInfo.subtitle}`,
        };
      }
    }

    return pageMap[pathname] || { title: "Halaman", subtitle: villageName };
  };

  if (!mounted) return null;

  const { title, subtitle } = getPageTitle();

  return (
    <div className={`text-center py-8 bg-gradient-to-r from-[#1B3A6D] to-[#2563eb] text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className={`text-3xl md:text-4xl font-bold mb-2 smooth-transition ${mounted ? "animate-slide-in-down" : "animate-on-load"}`}>{title}</h1>
        <p className={`text-lg text-blue-100 smooth-transition ${mounted ? "animate-slide-in-up" : "animate-on-load"}`}>{subtitle}</p>


        <div className="mt-4 flex justify-center">
          <div className="w-20 h-1 bg-white rounded-full animate-scale-in"></div>
        </div>
      </div>
    </div>
  );
};

export default ActivePageTitle;
