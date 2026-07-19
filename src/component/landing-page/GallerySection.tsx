"use client";

import React, { useState, useEffect } from "react";
import { useActiveGalleryImages } from "@/hooks/useGallery";
import Link from "next/link";

const GallerySection = () => {
  const [mounted, setMounted] = useState(false);
  const { images: galleryImages, loading, error } = useActiveGalleryImages(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const fallbackImages = [
    {
      id: "fallback-1",
      imageUrl: "/kantor_desa.jpg",
      title: "Kantor Desa",
      description: "Kantor Desa Ngebruk",
    },
    {
      id: "fallback-2",
      imageUrl: "/stasiun_ngebruk.JPG",
      title: "Stasiun Ngebruk",
      description: "Stasiun Ngebruk",
    },
    {
      id: "fallback-3",
      imageUrl: "/pasar_ngebruk.png",
      title: "Pasar Ngebruk",
      description: "Pasar Ngebruk",
    },
    {
      id: "fallback-4",
      imageUrl: "/kampung_gatot.png",
      title: "Kampung Gatot",
      description: "Kampung Gatot",
    },
    {
      id: "fallback-5",
      imageUrl: "/koka_caffee.png",
      title: "Koka Caffee",
      description: "Koka Caffee",
    },
  ];

  const displayImages = galleryImages.length > 0 ? galleryImages : fallbackImages;

  const repeatedImagesRow1 = Array(4).fill(displayImages).flat();
  const repeatedImagesRow2 = Array(4).fill(displayImages).flat();

  return (
    <section className={`py-8 md:py-12 bg-white smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
        <div className="overflow-hidden">
          <div className="flex animate-scroll-left gap-3 md:gap-6">
            {repeatedImagesRow1.map((image, index) => (
              <div key={`row1-${index}`} className="flex-shrink-0 w-48 h-64 md:w-64 md:h-96 group cursor-pointer overflow-hidden rounded-lg bg-gray-100 hover-lift smooth-transition">
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-105 smooth-transition"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = "/kantor_desa.jpg";
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="flex animate-scroll-right gap-3 md:gap-6">
            {repeatedImagesRow2.map((image, index) => (
              <div key={`row2-${index}`} className="flex-shrink-0 w-48 h-64 md:w-64 md:h-96 group cursor-pointer overflow-hidden rounded-lg bg-gray-100 hover-lift smooth-transition">
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-105 smooth-transition"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = "/kantor_desa.jpg";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        <div className="text-center">
          <Link href="/galeri">
            <button className="bg-[#1B3A6D] text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold hover:bg-[#152f5a] smooth-transition text-sm md:text-base btn-animate">Lihat Galeri Lainnya</button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;

