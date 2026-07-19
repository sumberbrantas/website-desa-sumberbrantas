"use client";

import React from "react";
import { useProfilDesa } from "@/hooks/useProfilDesa";

const PetaLokasiSection = () => {
  const { profilDesa, loading } = useProfilDesa();

  if (loading || !profilDesa) {
    return (
      <section className="py-6" style={{ backgroundColor: "var(--background)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-earth-dark mb-4">Peta Lokasi Desa</h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="animate-pulse card-earth p-4 h-32"></div>
              <div className="animate-pulse card-earth p-4 h-32"></div>
            </div>
            <div className="lg:col-span-2">
              <div className="animate-pulse card-earth p-4 h-96"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-earth-dark mb-4">Peta Lokasi Desa</h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="card-earth-static p-4 text-center border-l-4 border-earth-primary">
                <div className="text-lg font-bold text-earth-accent">{profilDesa.statistik.luasDesa}</div>
                <div className="text-xs text-earth-muted">Ha Luas Desa</div>
              </div>
              <div className="card-earth-static p-4 text-center border-l-4 border-earth-primary">
                <div className="text-lg font-bold text-earth-accent">{profilDesa.statistik.jumlahPenduduk}</div>
                <div className="text-xs text-earth-muted">Jiwa Penduduk</div>
              </div>
            </div>

            <div className="card-earth p-4">
              <h3 className="text-sm font-semibold text-earth-dark mb-3 border-b border-earth-light pb-2">Batas Wilayah Desa</h3>
              <div className="space-y-2">
                {profilDesa.batasWilayah.map((batas, index) => (
                  <div key={index} className="flex justify-between items-start text-xs">
                    <span className="font-medium text-earth-primary w-12">{batas.arah}:</span>
                    <span className="text-earth-muted text-right flex-1">{batas.wilayah}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-earth p-4">
              <h3 className="text-sm font-semibold text-earth-dark mb-3 border-b border-earth-light pb-2">Informasi Lokasi</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-earth-muted">Jarak ke Kecamatan:</span>
                  <span className="font-medium text-earth-primary">{profilDesa.statistik.jarakKeKecamatan} Km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-earth-muted">Jarak ke Kabupaten:</span>
                  <span className="font-medium text-earth-primary">{profilDesa.statistik.jarakKeKabupaten} Km</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card-earth p-4">
              <iframe
                src={profilDesa.googleMapsUrl}
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
                title="Peta Lokasi Desa"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PetaLokasiSection;
