"use client";

import React, { useState, useEffect } from "react";
import { useActiveGalleryImages } from "@/hooks/useGallery";
import { usePageVisitor } from "@/hooks/usePageVisitor";
import Header from "@/component/landing-page/Header";
import Footer from "@/component/landing-page/Footer";
import Pagination from "@/component/common/Pagination";
import { LoadingSpinner } from "@/component/common/LoadingStates";

const GalleryPage = () => {
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const [selectedImageData, setSelectedImageData] = useState<any>(null);

  const { images, loading, error, refetch } = useActiveGalleryImages();

  usePageVisitor("Galeri");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { value: "all", label: "Semua" },
    { value: "umum", label: "Umum" },
    { value: "kegiatan", label: "Kegiatan" },
    { value: "fasilitas", label: "Fasilitas" },
    { value: "wisata", label: "Wisata" },
    { value: "pembangunan", label: "Pembangunan" },
  ];

  const filteredImages = images.filter((image) => {
    const matchesCategory = selectedCategory === "all" || image.category === selectedCategory;
    const matchesSearch = searchTerm === "" || image.title.toLowerCase().includes(searchTerm.toLowerCase()) || (image.description && image.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentImages = filteredImages.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    console.log("Filtered images:", {
      selectedCategory,
      searchTerm,
      filteredImages,
      filteredLength: filteredImages.length,
    });
  }, [filteredImages, selectedCategory, searchTerm]);

  const openImageModal = (image: any) => {
    setSelectedImage(image.imageUrl);
    setSelectedImageData(image);
    document.body.style.overflow = "hidden";
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setSelectedImageData(null);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeImageModal();
      }
    };

    if (selectedImage) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [selectedImage]);

  return (
    <>
      <div className={`min-h-screen ${selectedImage ? "blur-sm" : ""}`} style={{ backgroundColor: "var(--background)" }}>
        <Header />

        <main>
          <section className="py-16" style={{ backgroundColor: "var(--background-alt)" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-earth-dark">Galeri Desa</h1>
                <p className="text-lg text-earth-muted max-w-2xl mx-auto">Dokumentasi kegiatan, fasilitas, dan keindahan desa kami</p>
              </div>
            </div>
          </section>

          <section className="py-8 md:py-12" style={{ backgroundColor: "var(--background)" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`mb-6 md:mb-8 smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
                <div className="max-w-md mx-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari gambar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#1B3A6D] focus:ring-1 focus:ring-[#1B3A6D]"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`mb-8 md:mb-12 smooth-transition ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}>
                <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                  {categories.map((category) => {
                    const categoryCount = category.value === "all" ? images.length : images.filter((img) => img.category === category.value).length;
                    return (
                      <button
                        key={category.value}
                        onClick={() => setSelectedCategory(category.value)}
                        className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-medium text-sm md:text-base transition-colors flex items-center gap-2 ${
                          selectedCategory === category.value ? "bg-[#1B3A6D] text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {category.label}
                        {categoryCount > 0 && <span className={`text-xs px-2 py-1 rounded-full ${selectedCategory === category.value ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}>{categoryCount}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                    <h3 className="text-red-800 font-semibold mb-2">Terjadi kesalahan</h3>
                    <p className="text-red-600 text-sm mb-4">{error}</p>
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => refetch()} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                        Coba Lagi
                      </button>
                      <button onClick={() => window.location.reload()} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors">
                        Muat Ulang
                      </button>
                    </div>
                  </div>
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Gambar</h3>
                    <p className="text-gray-600 mb-4">Belum ada gambar yang tersedia dalam galeri.</p>
                    <button onClick={() => refetch()} className="bg-[#1B3A6D] text-white px-4 py-2 rounded hover:bg-[#152f5a] transition-colors">
                      Refresh
                    </button>
                  </div>
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {selectedCategory === "all" ? "Galeri Kosong" : `Tidak ada gambar untuk kategori "${categories.find((c) => c.value === selectedCategory)?.label}"`}
                      {searchTerm && ` dengan kata kunci "${searchTerm}"`}
                    </h3>
                    <p className="text-gray-600 mb-4">{selectedCategory === "all" && !searchTerm ? "Belum ada gambar yang ditambahkan ke galeri." : "Coba ubah filter atau kata kunci pencarian."}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {searchTerm && (
                        <button onClick={() => setSearchTerm("")} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors text-sm">
                          Hapus Pencarian
                        </button>
                      )}
                      {selectedCategory !== "all" && (
                        <button onClick={() => setSelectedCategory("all")} className="bg-[#1B3A6D] text-white px-4 py-2 rounded hover:bg-[#152f5a] transition-colors text-sm">
                          Lihat Semua
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid mb-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {currentImages.map((image, index) => (
                      <div
                        key={image.id}
                        className={`bg-white border-1 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => openImageModal(image)}
                      >
                        <div className="aspect-square overflow-hidden">
                          <img src={image.imageUrl} alt={image.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{image.title}</h3>
                          {image.description && <p className="text-sm text-gray-600 line-clamp-2">{image.description}</p>}
                          <div className="mt-2">
                            <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded capitalize">{categories.find((c) => c.value === image.category)?.label || image.category}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredImages.length}
                    loading={loading}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    itemsPerPageOptions={[8, 12, 16]}
                  />
                </>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>

      {selectedImage && selectedImageData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0" onClick={closeImageModal} />
          <div className="relative max-w-4xl max-h-full bg-white rounded-lg overflow-hidden shadow-2xl border border-gray-200 z-10">
            <button onClick={closeImageModal} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 z-20 bg-white rounded-full p-1 shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/3">
                <img src={selectedImage} alt={selectedImageData.title} className="w-full h-64 md:h-96 object-cover" />
              </div>

              <div className="md:w-1/3 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedImageData.title}</h3>

                {selectedImageData.description && <p className="text-gray-600 mb-4">{selectedImageData.description}</p>}

                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-sm bg-[#1B3A6D] text-white rounded-full">{categories.find((c) => c.value === selectedImageData.category)?.label || selectedImageData.category}</span>
                </div>

                {selectedImageData.createdAt && (
                  <p className="text-sm text-gray-500">
                    Ditambahkan pada:{" "}
                    {new Date(selectedImageData.createdAt.toDate()).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
                {!selectedImageData.createdAt && selectedImageData.updatedAt && (
                  <p className="text-sm text-gray-500">
                    Diperbarui pada:{" "}
                    {new Date(selectedImageData.updatedAt.toDate()).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryPage;
