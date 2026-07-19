"use client";

import React, { useState, useEffect } from "react";
import Header from "@/component/landing-page/Header";
import Footer from "@/component/landing-page/Footer";
import { VisiSection, MisiSection, PetaLokasiSection, InformasiUmumSection } from "@/component/profil-desa";
import usePageVisitor from "@/hooks/usePageVisitor";
import { useProfilDesa } from "@/hooks/useProfilDesa";

const ProfilDesaPage = () => {
  const [mounted, setMounted] = useState(false);
  const { profilDesa, loading } = useProfilDesa();

  usePageVisitor("Profil Desa");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const judul = profilDesa?.judulHalaman || "Profil Desa";
  const subJudul = profilDesa?.subJudul || "";

  return (
    <div className={`min-h-screen flex flex-col smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <Header />

      <section className="bg-[#1B3A6D] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{judul}</h1>
            {subJudul && <p className="text-base text-white/90 max-w-2xl mx-auto">{subJudul}</p>}
          </div>
        </div>
      </section>

      <div className="flex-grow">
        <VisiSection />
        <MisiSection />
        <PetaLokasiSection />
        <InformasiUmumSection />
      </div>

      <Footer />
    </div>
  );
};

export default ProfilDesaPage;
