"use client";

import { useState } from "react";
import { useActiveProducts, useProductCategories } from "@/hooks/useProducts";
import { useVillageSettings } from "@/hooks/useVillageSettings";
import { formatProductPrice } from "@/lib/productService";
import { FiExternalLink } from "react-icons/fi";
import Link from "next/link";

const ProductsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { products, loading, error } = useActiveProducts(6);
  const { categories } = useProductCategories();
  const { settings } = useVillageSettings();

  if (loading) {
    return (
      <section className="py-16 px-4" style={{ backgroundColor: "var(--background)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="bg-gray-200 rounded h-5 w-3/4 mb-2 animate-pulse"></div>
                  <div className="bg-gray-200 rounded h-4 w-full mb-2 animate-pulse"></div>
                  <div className="bg-gray-200 rounded h-4 w-1/2 mb-4 animate-pulse"></div>
                  <div className="bg-gray-200 rounded h-10 w-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) return null;

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const generateWhatsAppLink = (productName: string) => {
    const phone = settings?.whatsappNumber;
    if (!phone) return null;
    const normalized = phone.replace(/\D/g, "").replace(/^0/, "62");
    const message = `Halo, saya mau pesan: ${productName}`;
    return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section className="py-16 px-4" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-earth-dark">
            Produk UMKM
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-6 text-earth-muted">
            Produk lokal berkualitas dari pelaku usaha desa
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === "all" ? "text-white shadow-md" : "bg-white text-earth-primary hover:bg-earth-sand"
              }`}
              style={selectedCategory === "all" ? { backgroundColor: "var(--primary)" } : {}}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat ? "text-white shadow-md" : "bg-white text-earth-primary hover:bg-earth-sand"
                }`}
                style={selectedCategory === cat ? { backgroundColor: "var(--primary)" } : {}}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 8).map((product) => {
            const waLink = generateWhatsAppLink(product.name);

            return (
              <div
                key={product.id}
                className="group card-earth overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.imageUrl || "/kantor_desa.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/kantor_desa.jpg"; }}
                  />
                  {product.category && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-xs font-medium text-earth-dark">{product.category}</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1 text-earth-dark">
                    {product.name}
                  </h3>
                  <p className="text-sm text-earth-muted line-clamp-2 mb-3 min-h-[2.5rem]">
                    {product.description}
                  </p>
                  <p className="font-bold text-xl mb-4 text-earth-dark">
                    {formatProductPrice(product.price)}
                  </p>

                  {waLink ? (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-medium text-white transition-all hover:scale-105 active:scale-95"
                      style={{ backgroundColor: "#25D366" }}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span>Pesan via WhatsApp</span>
                    </a>
                  ) : (
                    <div className="w-full py-2.5 rounded-lg font-medium bg-gray-100 text-gray-400 text-center cursor-not-allowed">
                      WhatsApp tidak tersedia
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: "var(--primary)", color: "white" }}
          >
            <span>Lihat Semua Produk</span>
            <FiExternalLink size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
