"use client";

import { useVillageSettings } from "@/hooks/useVillageSettings";

interface HeroContentProps {
  mounted: boolean;
}

const HeroContent = ({ mounted }: HeroContentProps) => {
  const { settings } = useVillageSettings();
  const villageName = settings?.villageName || "Desa";
  const villageTagline = settings?.villageTagline || "Kampung Damai & Budaya Luhur, Harmoni Alam dan Kearifan Lokal";

  const infoItems = [
    {
      number: "01",
      title: "Temukan informasi penting",
      description: `Dapatkan berita terkini, agenda kegiatan, dan pengumuman lengkap dari ${villageName}.`,
    },
    {
      number: "02",
      title: "Nikmati pelayanan lebih mudah",
      description: "Unduh formulir administrasi, cek persyaratan, dan datang dengan lebih siap.",
    },
  ];

  return (
    <div className={`relative z-10 w-full px-4 sm:px-6 lg:px-8 text-left text-white smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>Selamat Datang di {villageName}</h1>
        <p className={`text-sm sm:text-base md:text-lg mb-8 text-gray-200 max-w-2xl smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>{villageTagline}</p>

        <div className={`w-full h-px bg-white mb-8 smooth-transition ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}></div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-4xl smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
          {infoItems.map((item, index) => (
            <div key={index} className="space-y-4 hover-lift smooth-transition">
              <div className="text-xl md:text-2xl font-bold text-white">{item.number}</div>
              <h3 className="text-base md:text-lg font-semibold text-white mb-2 md:mb-4">{item.title}</h3>
              <p className="text-white text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroContent;
