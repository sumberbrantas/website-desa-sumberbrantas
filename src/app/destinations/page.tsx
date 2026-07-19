"use client";

import { useState, useEffect } from "react";
import { useActiveDestinations, useDestinationCategories } from "@/hooks/useDestinations";
import { FiMapPin, FiSearch } from "react-icons/fi";
import Header from "@/component/landing-page/Header";
import Footer from "@/component/landing-page/Footer";

export default function DestinationsPage() {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { destinations, loading, error } = useActiveDestinations();
  const { categories } = useDestinationCategories();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      searchTerm === "" ||
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || dest.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--background)" }}>
      <Header />

      <main className="flex-grow">
        <div
          className={`relative py-20 px-4 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ backgroundColor: "var(--background-alt)" }}
        >
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--foreground-dark)" }}>Destinasi Wisata</h1>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: "var(--foreground)" }}>
              Temukan tempat wisata menarik di desa kami
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari destinasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === "all" ? "text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                style={selectedCategory === "all" ? { backgroundColor: "var(--primary)" } : {}}
              >
                Semua
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === cat ? "text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  style={selectedCategory === cat ? { backgroundColor: "var(--primary)" } : {}}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-5">
                    <div className="h-6 bg-gray-200 rounded w-2/3 mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredDestinations.length === 0 ? (
            <div className="text-center py-16">
              <FiMapPin size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-xl text-gray-500">
                {searchTerm || selectedCategory !== "all"
                  ? "Tidak ada destinasi yang sesuai"
                  : "Belum ada destinasi yang tersedia"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
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
                        <span className="text-xs font-medium text-gray-800">{dest.category}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-xl mb-2" style={{ color: "var(--foreground)" }}>
                      {dest.name}
                    </h3>
                    {dest.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <FiMapPin size={14} />
                        <span>{dest.location}</span>
                      </div>
                    )}
                    {dest.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {dest.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
