"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/component/common/PageHeader";
import StatusBar from "@/component/common/StatusBar";
import RecentActivity from "@/component/dashboard/RecentActivity";
import VisitorChart from "@/component/dashboard/VisitorChart";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardStats } from "@/hooks/useStatistics";
import VisitorStatsCard from "@/component/dashboard/VisitorStatsCard";
import { useVillageSettings } from "@/hooks/useVillageSettings";
import { FiBell, FiFileText, FiMapPin, FiShoppingBag } from "react-icons/fi";
import CreditsFooter from "@/component/common/CreditsFooter";

const DashboardPage = () => {
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile, loading } = useAuth();
  const { articles, announcements } = useDashboardStats();
  const { settings } = useVillageSettings();

  const villageName = settings?.villageName || "Desa";

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 mx-auto mb-4" style={{ borderBottomColor: "var(--primary)" }}></div>
          <p className="text-earth-muted text-sm">Memuat data profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <StatusBar onMenuClick={() => setSidebarOpen(true)} />
      <PageHeader
        title="Dashboard"
        subtitle={`Selamat datang di panel admin ${villageName}`}
        mounted={mounted}
        actions={
          <div className="text-left sm:text-right sm:min-w-0 sm:flex-shrink-0">
            <p className="text-earth-muted text-xs truncate smooth-transition">Selamat datang, {profile.name || "Admin"}</p>
            <p className="text-earth-muted text-xs truncate smooth-transition" style={{ opacity: 0.7 }}>
              {profile.role === "admin" ? "Administrator" : "User"} • {profile.email}
            </p>
            <p className="text-earth-muted text-xs truncate smooth-transition" style={{ opacity: 0.7 }}>
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        }
      />

      <main className="flex-1 overflow-y-auto p-4 md:p-6">

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          <div className="xl:col-span-2 space-y-6">
            <VisitorStatsCard />
            <VisitorChart type="line" timeRange="7days" />
          </div>

          <div className="xl:col-span-1 space-y-6">
            <div className="card-earth p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-earth-dark mb-4">Tambahkan Informasi Baru</h3>
              <div className="space-y-3">
                <button
                  onClick={() => (window.location.href = "/dashboard/article/create")}
                  className="w-full text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 btn-earth-primary"
                >
                  <FiFileText />
                  Buat Berita Baru
                </button>
                <button
                  onClick={() => (window.location.href = "/dashboard/announcement/create")}
                  className="w-full border py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 btn-earth-outline"
                >
                  <FiBell />
                  Buat Pengumuman
                </button>
                <button
                  onClick={() => (window.location.href = "/dashboard/destinations/create")}
                  className="w-full border py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 btn-earth-outline"
                >
                  <FiMapPin />
                  Tambah Destinasi
                </button>
                <button
                  onClick={() => (window.location.href = "/dashboard/products/create")}
                  className="w-full border py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 btn-earth-outline"
                >
                  <FiShoppingBag />
                  Tambah Produk
                </button>
              </div>
            </div>
            <RecentActivity />

            <div className="card-earth p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-earth-dark mb-4">Ringkasan</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-earth-light last:border-b-0">
                  <span className="text-sm text-earth-muted">Berita Draft</span>
                  <span className="text-sm font-semibold text-earth-dark">{articles.totalDraft}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-earth-light last:border-b-0">
                  <span className="text-sm text-earth-muted">Berita Published</span>
                  <span className="text-sm font-semibold text-earth-dark">{articles.totalPublished}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-earth-light last:border-b-0">
                  <span className="text-sm text-earth-muted">Pengumuman Aktif</span>
                  <span className="text-sm font-semibold text-earth-dark">{announcements.activeAnnouncements}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-earth-muted">Pengumuman Expired</span>
                  <span className="text-sm font-semibold text-earth-dark">{announcements.expiredAnnouncements}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className={`w-full py-4 md:py-4 smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`} style={{ backgroundColor: "var(--background-alt)" }}>
        <CreditsFooter variant="light" />
      </div>
    </div>
  );
};

export default DashboardPage;
