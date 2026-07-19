"use client";

import React from "react";
import { useProfilDesa } from "@/hooks/useProfilDesa";

const InformasiUmumSection = () => {
  const { profilDesa, loading } = useProfilDesa();

  if (loading || !profilDesa) {
    return (
      <section className="py-6" style={{ backgroundColor: "var(--background)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-earth-dark mb-4">Informasi Demografis</h2>
            <p className="text-sm text-earth-muted max-w-2xl mx-auto">Data statistik dan demografi desa</p>
          </div>
          <div className="space-y-8">
            <div className="animate-pulse card-earth p-6">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-earth-sand rounded-lg p-3 h-24"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-earth-dark mb-4">Informasi Demografis</h2>
          <p className="text-sm text-earth-muted max-w-2xl mx-auto">Data statistik dan demografi desa</p>
        </div>

        <div className="space-y-8">
          {/* Penggunaan Lahan */}
          <div className="card-earth p-6">
            <h3 className="text-lg font-semibold text-earth-dark mb-4 text-center">Penggunaan Lahan</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {profilDesa.penggunaanLahan.map((item) => (
                <div key={item.id} className="card-earth-static p-3 text-center hover-lift cursor-default">
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="text-xs text-earth-muted mb-1">{item.jenis}</div>
                  <div className="text-sm font-semibold text-earth-accent">{item.luas}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Penduduk per Dusun & Komposisi Agama */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card-earth p-5">
              <h3 className="text-lg font-semibold text-earth-dark mb-4">Data Penduduk per Dusun</h3>
              <div className="space-y-3">
                {profilDesa.dataDusun.map((item) => (
                  <div key={item.id} className="card-earth-static p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-earth-dark text-sm">{item.dusun}</h4>
                      <span className="text-xs badge-earth-primary px-2 py-1">
                        {item.penduduk.toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-earth-muted">
                      <div>RT: {item.rt}</div>
                      <div>RW: {item.rw}</div>
                      <div>KK: {item.kk}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-earth p-5">
              <h3 className="text-lg font-semibold text-earth-dark mb-4">Komposisi Agama</h3>
              <div className="space-y-2">
                {profilDesa.dataAgama.map((item) => (
                  <div key={item.id} className="card-earth-static p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-earth-primary text-sm">{item.agama}</span>
                      <div className="text-right">
                        <span className="font-bold text-earth-accent text-sm">{item.total.toLocaleString()}</span>
                        <span className="text-xs text-earth-muted ml-1">({item.persentase})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mata Pencaharian */}
          <div className="card-earth p-6">
            <h3 className="text-lg font-semibold text-earth-dark mb-4 text-center">Mata Pencaharian Utama</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {profilDesa.mataPencaharian.map((item) => (
                <div key={item.id} className="card-earth-static p-3 text-center hover-lift cursor-default">
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="text-xs text-earth-muted mb-1">{item.jenis}</div>
                  <div className="text-sm font-semibold text-earth-accent">{item.jumlah.toLocaleString()}</div>
                  <div className="text-xs text-earth-muted">orang</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InformasiUmumSection;
