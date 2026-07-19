"use client";

import React from "react";
import { useProfilDesa } from "@/hooks/useProfilDesa";

const VisiSection = () => {
  const { profilDesa, loading } = useProfilDesa();

  if (loading || !profilDesa) {
    return (
      <section className="py-6" style={{ backgroundColor: "var(--background)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-6">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-earth-dark mb-6">Visi</h2>
            <div className="card-earth p-6 mx-auto max-w-4xl">
              <div className="animate-pulse">
                <div className="h-4 bg-earth-sand rounded w-full mb-2"></div>
                <div className="h-4 bg-earth-sand rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-6">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-earth-dark mb-6">Visi</h2>
          <div className="card-earth p-6 mx-auto max-w-4xl">
            <blockquote className="text-sm md:text-medium text-earth-primary leading-relaxed italic">
              "{profilDesa.visi.text}"
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisiSection;
