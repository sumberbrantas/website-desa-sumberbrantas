"use client";

import { useActiveDestinations } from "@/hooks/useDestinations";
import { FiMapPin, FiExternalLink } from "react-icons/fi";
import Link from "next/link";

const DestinationsSection = () => {
  const { destinations, loading, error } = useActiveDestinations(6);

  if (loading) {
    return (
      <section className="py-16 px-4" style={{ backgroundColor: "var(--background)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card-earth overflow-hidden">
                <div className="h-48 bg-earth-sand animate-pulse"></div>
                <div className="p-5">
                  <div className="bg-earth-sand rounded h-6 w-3/4 mb-3 animate-pulse"></div>
                  <div className="bg-earth-sand rounded h-4 w-full mb-2 animate-pulse"></div>
                  <div className="bg-earth-sand rounded h-4 w-2/3 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) return null;
  if (destinations.length === 0) return null;

  return (
    <section className="py-16 px-4" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-earth-dark">
            Destinasi Wisata
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-earth-muted">
            Temukan tempat wisata menarik di desa kami
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="group card-earth overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={dest.imageUrl || "/kantor_desa.jpg"}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/kantor_desa.jpg"; }}
                />
                {dest.category && (
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-medium text-earth-dark">{dest.category}</span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-bold text-xl mb-2 text-earth-dark">
                  {dest.name}
                </h3>
                {dest.location && (
                  <div className="flex items-center gap-2 text-sm text-earth-muted mb-3">
                    <FiMapPin size={14} />
                    <span>{dest.location}</span>
                  </div>
                )}
                {dest.description && (
                  <p className="text-sm text-earth-muted line-clamp-2 mb-4">
                    {dest.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ backgroundColor: "var(--primary)", color: "white" }}
          >
            <span>Lihat Semua Destinasi</span>
            <FiExternalLink size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;
