"use client";

import { useState, useEffect } from "react";
import { useActiveDocuments, useDocumentCategories } from "@/hooks/useDocuments";
import { FiFile, FiSearch, FiExternalLink } from "react-icons/fi";
import Header from "@/component/landing-page/Header";
import Footer from "@/component/landing-page/Footer";

export default function DocumentsPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { documents, loading, error } = useActiveDocuments();
  const { categories } = useDocumentCategories();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesSearch =
      searchTerm === "" ||
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Profil Desa": "bg-blue-100 text-blue-800",
      "Peta Potensi": "bg-green-100 text-green-800",
      "Destinasi Wisata": "bg-yellow-100 text-yellow-800",
      "Penginapan": "bg-purple-100 text-purple-800",
      "UMKM": "bg-pink-100 text-pink-800",
      "Layanan": "bg-cyan-100 text-cyan-800",
      "Regulasi": "bg-orange-100 text-orange-800",
      "Lainnya": "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--foreground-dark)" }}>Dokumen Desa</h1>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: "var(--foreground)" }}>
              Kumpulan dokumen penting yang dapat dilihat dan diunduh melalui Google Drive
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari dokumen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === "all"
                    ? "text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                style={selectedCategory === "all" ? { backgroundColor: "var(--primary)" } : {}}
              >
                Semua
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? "text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  style={selectedCategory === category ? { backgroundColor: "var(--primary)" } : {}}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                      <div className="h-6 bg-gray-200 rounded w-2/3 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-16">
              <FiFile size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-xl text-gray-500">
                {searchTerm || selectedCategory !== "all"
                  ? "Tidak ada dokumen yang sesuai dengan pencarian"
                  : "Belum ada dokumen yang tersedia"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-earth-sand p-3 rounded-lg group-hover:bg-earth-grullo transition-colors">
                      <FiFile className="text-earth-dark" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full mb-2 ${getCategoryColor(doc.category)}`}>
                        {doc.category}
                      </span>
                      <h3 className="font-semibold text-lg mb-1 line-clamp-2 text-earth-dark">
                        {doc.title}
                      </h3>
                      {doc.description && (
                        <p className="text-sm text-earth-muted line-clamp-2 mb-3">
                          {doc.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-sm font-medium text-earth-accent">
                        <FiExternalLink size={16} />
                        <span>Buka di Google Drive</span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
