"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FiArrowLeft, FiShare2, FiCalendar, FiAlertCircle } from "react-icons/fi";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Header from "@/component/landing-page/Header";
import Footer from "@/component/landing-page/Footer";
import Link from "next/link";
import Image from "next/image";
import { useAnnouncementBySlug, useActiveAnnouncements } from "@/hooks/useAnnouncements";
import CreditsFooter from "@/component/common/CreditsFooter";

const PengumumanDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const [mounted, setMounted] = useState(false);

  const { announcement, loading, error } = useAnnouncementBySlug(slug);
  const { announcements: relatedAnnouncements } = useActiveAnnouncements(3);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, "EEEE, dd MMMM yyyy", { locale: idLocale });
    } catch (error) {
      return "";
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const startFormatted = format(start, "dd MMM yyyy", { locale: idLocale });
      const endFormatted = format(end, "dd MMM yyyy", { locale: idLocale });

      if (startDate === endDate) {
        return startFormatted;
      }
      return `${startFormatted} - ${endFormatted}`;
    } catch (error) {
      return "";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border border-red-200";
      case "penting":
        return "bg-blue-50 text-blue-800 border border-blue-200";
      default:
        return "bg-blue-50 text-blue-800 border border-blue-200";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "Urgent";
      case "penting":
        return "Penting";
      default:
        return "Normal";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return { color: "bg-blue-50 text-blue-800 border border-blue-200", label: "Aktif" };
      case "inactive":
        return { color: "bg-gray-100 text-gray-600 border border-gray-200", label: "Belum Aktif" };
      case "expired":
        return { color: "bg-red-50 text-red-800 border border-red-200", label: "Kedaluwarsa" };
      default:
        return { color: "bg-gray-100 text-gray-800 border border-gray-200", label: status };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-grow flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3A6D] mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat pengumuman...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <main className="min-h-screen flex flex-col lg:block">
        <Header />
        <div className="h-screen lg:h-screen lg:w-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 lg:fixed lg:inset-0 lg:overflow-hidden">
          <div className={`max-w-6xl w-full smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
              <div className="flex-1 flex justify-center lg:justify-end relative">
                <div className="relative">
                  <Image height={400} width={600} src="/not-found.png" alt="Pengumuman tidak ditemukan" className="max-w-full h-auto" />
                </div>
              </div>

              <div className="flex-1 text-center lg:text-left max-w-md lg:max-w-lg">
                <div className="space-y-6">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">Pengumuman Tidak Ditemukan</h1>

                  <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
                    {error || "Pengumuman yang Anda cari tidak ditemukan atau mungkin telah dipindahkan."}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link
                      href="/pengumuman"
                      className="bg-[#1B3A6D] text-white px-8 py-2 rounded-lg font-medium border-2 border-[#1B3A6D] hover:bg-[#1B3A6D] hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Kembali ke Pengumuman
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`w-full bg-gray-200 py-4 md:py-4 smooth-transition lg:fixed lg:bottom-0 lg:left-0 lg:z-20 ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
          <CreditsFooter variant="light" />
        </div>
      </main>
    );
  }

  const statusInfo = getStatusBadge(announcement.status);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: announcement.title,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link berhasil disalin!");
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "Urgent":
      case "Penting":
        return <FiAlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <Header />

      {/* Breadcrumb */}
      <nav className="bg-gray-50 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#1B3A6D] transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <Link href="/pengumuman" className="hover:text-[#1B3A6D] transition-colors">
              Pengumuman
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{announcement.title}</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow bg-white py-8">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link href="/pengumuman" className="inline-flex items-center gap-2 text-[#1B3A6D] hover:text-[#152f5a] transition-colors mb-6">
            <FiArrowLeft size={16} />
            Kembali ke Pengumuman
          </Link>

          {/* Announcement Header */}
          <header className="mb-8">
            {/* Priority Badge and Status */}
            <div className="mb-4 flex items-center gap-3">
              <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(announcement.priority)}`}>{getPriorityLabel(announcement.priority)}</span>
              <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>{statusInfo.label}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{announcement.title}</h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#1B3A6D] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">DN</span>
                </div>
                <span className="font-medium">{announcement.authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar size={16} />
                <span>{formatDate(announcement.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-[#1B3A6D]">
                <FiAlertCircle size={16} />
                <span>Berlaku: {formatDateRange(announcement.startDate, announcement.endDate)}</span>
              </div>
              <button onClick={handleShare} className="flex items-center gap-2 text-[#1B3A6D] hover:text-[#152f5a] transition-colors ml-auto">
                <FiShare2 size={16} />
                <span className="font-medium">Bagikan</span>
              </button>
            </div>
          </header>

          {/* Announcement Body */}
          <div className="prose prose-lg max-w-none mb-8">
            {announcement.content.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed text-justify">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="w-5 h-5 text-[#1B3A6D] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-[#1B3A6D] mb-2">Informasi Penting</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Pengumuman ini berlaku dari tanggal {formatDateRange(announcement.startDate, announcement.endDate)}. Untuk informasi lebih lanjut, silakan hubungi kantor desa atau kunjungi langsung Balai Desa Ngebruk.
                </p>
              </div>
            </div>
          </div>

          {/* Article Footer */}
          <footer className="pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Diterbitkan pada {formatDate(announcement.createdAt)}
                {announcement.updatedAt && announcement.updatedAt !== announcement.createdAt && <span> • Diperbarui pada {formatDate(announcement.updatedAt)}</span>}
              </div>
              <Link href="/pengumuman" className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B3A6D] text-white rounded hover:bg-[#152f5a] transition-colors">
                Lihat Pengumuman Lainnya
              </Link>
            </div>
          </footer>
        </article>

        {/* Related Announcements */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Pengumuman Terkait</h2>

          {relatedAnnouncements.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {relatedAnnouncements
                  .filter((related) => related.id !== announcement.id)
                  .slice(0, 3)
                  .map((related, index) => (
                    <Link key={related.id} href={`/pengumuman/${related.slug}`} className="block">
                      <div className="hover:bg-gray-50 transition-colors cursor-pointer group">
                        <div className="flex items-center">
                          {/* Content */}
                          <div className="flex-1 p-4 flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              {/* Priority Badge */}
                              <div className="mb-3">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(related.priority)}`}>{getPriorityLabel(related.priority)}</span>
                              </div>

                              {/* Title */}
                              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#1B3A6D] transition-colors">{related.title}</h3>

                              {/* Date */}
                              <p className="text-sm text-gray-600">{formatDate(related.createdAt)}</p>
                            </div>

                            {/* Arrow Icon */}
                            <div className="flex-shrink-0 ml-4">
                              <svg className="w-5 h-5 text-gray-400 group-hover:text-[#1B3A6D] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">Tidak ada pengumuman terkait</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PengumumanDetailPage;
