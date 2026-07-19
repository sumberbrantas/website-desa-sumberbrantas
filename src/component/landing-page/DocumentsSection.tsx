"use client";

import { useActiveDocuments } from "@/hooks/useDocuments";
import { FiFile, FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import { CardSkeleton } from "@/component/common/LoadingStates";
import { convertToEmbedUrl } from "@/lib/documentService";

const DocumentsSection = () => {
  const { documents, loading, error } = useActiveDocuments(6);

  if (loading) {
    return (
      <section className="py-16 px-4" style={{ backgroundColor: "var(--background)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card-earth p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-earth-sand p-3 rounded-lg animate-pulse h-10 w-10"></div>
                  <div className="flex-1">
                    <div className="bg-earth-sand rounded h-4 w-20 mb-2 animate-pulse"></div>
                    <div className="bg-earth-sand rounded h-6 w-full mb-2 animate-pulse"></div>
                    <div className="bg-earth-sand rounded h-4 w-3/4 mb-3 animate-pulse"></div>
                    <div className="bg-earth-sand rounded h-3 w-24 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return null;
  }

  if (documents.length === 0) {
    return null;
  }

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
    <section className="py-16 px-4" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-earth-dark">
            Dokumen Desa
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-earth-muted">
            Kumpulan dokumen penting desa yang dapat Anda lihat dan unduh
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <a
              key={doc.id}
              href={doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group card-earth p-6"
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
                  <div className="flex items-center gap-2 text-sm font-medium text-earth-dark">
                    <FiExternalLink size={16} />
                    <span>Buka di Google Drive</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/documents"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ backgroundColor: "var(--primary)", color: "white" }}
          >
            <span>Lihat Semua Dokumen</span>
            <FiExternalLink size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DocumentsSection;
