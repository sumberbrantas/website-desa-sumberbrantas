"use client";

import React from "react";
import { useProfilDesa } from "@/hooks/useProfilDesa";

const MisiSection = () => {
  const { profilDesa, loading } = useProfilDesa();

  if (loading || !profilDesa) {
    return (
      <section className="py-6" style={{ backgroundColor: "var(--background)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-earth-dark mb-6">Misi</h2>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start card-earth p-3">
                  <div className="animate-pulse flex-shrink-0 w-7 h-7 bg-earth-sand rounded-full mr-3 mt-0.5"></div>
                  <div className="flex-grow">
                    <div className="h-4 bg-earth-sand rounded w-full mb-2"></div>
                    <div className="h-4 bg-earth-sand rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const sortedMisi = [...profilDesa.misi].sort((a, b) => a.order - b.order);

  return (
    <section className="py-6" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-earth-dark mb-6">Misi</h2>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            {sortedMisi.map((misi, index) => (
              <div key={misi.id} className="flex items-start card-earth p-3">
                <span className="flex-shrink-0 w-7 h-7 bg-earth-primary text-white rounded-full flex items-center justify-center font-semibold mr-3 mt-0.5 text-sm">
                  {index + 1}
                </span>
                <p className="text-xs md:text-sm text-earth-primary leading-relaxed">{misi.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MisiSection;
