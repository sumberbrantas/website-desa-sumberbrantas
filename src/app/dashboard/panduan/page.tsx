"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/component/common/PageHeader";
import { FiBookOpen, FiMaximize2, FiMinimize2, FiDatabase, FiServer, FiGlobe, FiGithub, FiExternalLink } from "react-icons/fi";
import CreditsFooter from "@/component/common/CreditsFooter";

const PanduanPage = () => {
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Panduan Penggunaan"
        subtitle="Panduan lengkap penggunaan dan manajemen website Desa Sumberbrantas"
        mounted={mounted}
        actions={
          <button onClick={toggleFullscreen} className="inline-flex items-center px-3 py-1.5 bg-[#1B3A6D] text-white text-xs font-medium rounded-lg hover:bg-[#1B3A6D]/90 smooth-transition hover:scale-105 active:scale-95">
            {isFullscreen ? <FiMinimize2 className="mr-1.5" size={12} /> : <FiMaximize2 className="mr-1.5" size={12} />}
            {isFullscreen ? "Kecilkan" : "Perbesar"}
          </button>
        }
      />

      <div className="flex-1 p-4 sm:p-6 bg-gray-50">
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden smooth-transition ${isFullscreen ? "fixed inset-4 z-50" : ""} ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
          {isFullscreen && (
            <div className="flex items-center justify-between p-4 bg-[#1B3A6D] text-white">
              <div className="flex items-center">
                <FiBookOpen className="mr-2" size={16} />
                <h2 className="text-sm font-medium">Panduan Penggunaan Dashboard</h2>
              </div>
              <button onClick={toggleFullscreen} className="p-2 hover:bg-white/10 rounded-lg smooth-transition">
                <FiMinimize2 size={16} />
              </button>
            </div>
          )}

          <div className={`${isFullscreen ? "h-[calc(100vh-120px)]" : "w-full aspect-video"}`}>
            <iframe src="https://www.canva.com/" title="Panduan Penggunaan Dashboard Desa Sumberbrantas" className="w-full h-full border-0" allowFullScreen allow="camera; microphone; geolocation" loading="lazy" />
          </div>
        </div>

        <div className={`mt-6 smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Panduan Dashboard Eksternal</h2>
          <p className="text-xs text-gray-700 mb-4">Pastikan anda login menggunakan Akun Google desasumberbrantasbatu@gmail.com saat mengakses dashboard eksternal tersebut. Baca panduan di atas untuk informasi lebih lanjut.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md smooth-transition hover-lift cursor-pointer group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:scale-110 smooth-transition">
                  <FiDatabase className="text-[#1B3A6D]" size={20} />
                </div>
                <FiExternalLink className="text-gray-400 group-hover:text-[#1B3A6D] smooth-transition" size={16} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Firebase Console</h3>
              <p className="text-sm text-gray-600 mb-3">Kelola database dan sistem autentikasi website ini.</p>
              <button
                onClick={() => window.open("https://console.firebase.google.com/u/1/project/sumberbrantas/overview", "_blank")}
                className="w-full bg-[#1B3A6D] text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#152f5a] smooth-transition"
              >
                Buka Firebase
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md smooth-transition hover-lift cursor-pointer group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:scale-110 smooth-transition">
                  <FiServer className="text-[#1B3A6D]" size={20} />
                </div>
                <FiExternalLink className="text-gray-400 group-hover:text-[#1B3A6D] smooth-transition" size={16} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Vercel Dashboard</h3>
              <p className="text-sm text-gray-600 mb-3">Monitor deployment dan performance dari website ini.</p>
              <button onClick={() => window.open("https://vercel.com/sumberbrantasbatu/desasumberbrantas", "_blank")} className="w-full bg-[#1B3A6D] text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#152f5a] smooth-transition">
                Buka Vercel
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md smooth-transition hover-lift cursor-pointer group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:scale-110 smooth-transition">
                  <FiGlobe className="text-[#1B3A6D]" size={20} />
                </div>
                <FiExternalLink className="text-gray-400 group-hover:text-[#1B3A6D] smooth-transition" size={16} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">IDCloudHost</h3>
              <p className="text-sm text-gray-600 mb-3">Kelola domain desangebruk.web.id yang digunakan oleh web ini.</p>
              <button onClick={() => window.open("https://my.idcloudhost.com/clientarea.php", "_blank")} className="w-full bg-[#1B3A6D] text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#152f5a] smooth-transition">
                Buka IDCloudHouse
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md smooth-transition hover-lift cursor-pointer group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:scale-110 smooth-transition">
                  <FiGithub className="text-[#1B3A6D]" size={20} />
                </div>
                <FiExternalLink className="text-gray-400 group-hover:text-[#1B3A6D] smooth-transition" size={16} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">GitHub Repository</h3>
              <p className="text-sm text-gray-600 mb-3">Akses dan modifikasi source code dari website ini.</p>
              <button
                onClick={() => window.open("https://github.com/sumberbrantas/website-desa-sumberbrantas", "_blank")}
                className="w-full bg-[#1B3A6D] text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#152f5a] smooth-transition"
              >
                Buka GitHub
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`w-full bg-gray-100 py-4 md:py-4 smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
        <CreditsFooter variant="light" />
      </div>
    </div>
  );
};

export default PanduanPage;
