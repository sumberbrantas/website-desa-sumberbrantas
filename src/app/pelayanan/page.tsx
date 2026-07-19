"use client";

import React, { useState, useEffect } from "react";
import Header from "@/component/landing-page/Header";
import Footer from "@/component/landing-page/Footer";
import { usePageVisitor } from "@/hooks/usePageVisitor";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import AnnouncementsContent from "@/component/landing-page/AnnouncementsContent";
import { useActiveAnnouncements } from "@/hooks/useAnnouncements";
import DownloadFormulirSection from "@/component/pelayanan/DownloadFormulirSection";

interface SubLayanan {
  id: string;
  title: string;
  persyaratan: string[];
}

interface Layanan {
  id: string;
  title: string;
  persyaratan: string[];
  tataCara: string[];
  category: string;
}

const PelayananPage = () => {
  const [mounted, setMounted] = useState(false);
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
  const [activeCategory, setActiveCategory] = useState<string>("semua");

  const { announcements: activeAnnouncements, loading: announcementsLoading, error: announcementsError, refetch: refetchAnnouncements } = useActiveAnnouncements(3);

  usePageVisitor("Pelayanan");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const layananData = [
    {
      id: "pencatatan-biodata-wni",
      title: "PENCATATAN BIODATA WNI",
      category: "kependudukan",
      persyaratan: [
        "Surat pengantar dari Desa/Kelurahan",
        "Fotokopi dokumen/bukti Peristiwa Kependudukan dan Peristiwa Penting (contoh: paspor, surat keterangan lahir)",
        "Fotokopi bukti pendidikan terakhir (ijazah)",
        "Apabila tidak memiliki dokumen di atas, mengisi Formulir F.1.04 (Surat Pernyataan Tidak Memiliki Dokumen)",
        "Surat pernyataan tidak keberatan dari pemilik rumah (jika menumpang, menyewa, atau kost)",
      ],
      tataCara: [],
    },
    {
      id: "penerbitan-kk-baru",
      title: "PENERBITAN KARTU KELUARGA (KK) BARU",
      category: "kependudukan",
      persyaratan: [
        "Karena Membentuk Keluarga Baru:",
        "• Fotokopi buku nikah/kutipan akta perkawinan atau kutipan akta perceraian",
        "• SPTJM perkawinan/perceraian belum tercatat (Formulir F-1.05), jika tidak memiliki akta",
        "Karena Penggantian Kepala Keluarga (Meninggal Dunia):",
        "• Fotokopi akta kematian",
        "• Fotokopi KK lama",
      ],
      tataCara: [],
    },
    {
      id: "penerbitan-ktp-el-baru",
      title: "PENERBITAN KTP-ELEKTRONIK (KTP-EL) BARU",
      category: "kependudukan",
      persyaratan: ["Telah berusia 17 tahun, sudah kawin, atau pernah kawin", "Fotokopi KK"],
      tataCara: [],
    },
    {
      id: "penerbitan-ktp-el-hilang-rusak",
      title: "PENERBITAN KTP-EL KARENA HILANG ATAU RUSAK",
      category: "kependudukan",
      persyaratan: ["KTP-el Hilang:", "• Surat Keterangan Kehilangan dari Kepolisian", "• Fotokopi KK", "KTP-el Rusak:", "• KTP-el yang rusak", "• Fotokopi KK"],
      tataCara: [],
    },
    {
      id: "penerbitan-kia-baru",
      title: "PENERBITAN KARTU IDENTITAS ANAK (KIA) BARU",
      category: "kependudukan",
      persyaratan: ["Fotokopi kutipan akta kelahiran (tunjukkan aslinya)", "KK asli orang tua/wali", "KTP-el asli kedua orang tua/wali", "Pas foto anak berwarna ukuran 2x3 (2 lembar) untuk anak usia 5 tahun s.d. 17 tahun kurang satu hari"],
      tataCara: [],
    },
    {
      id: "penerbitan-skpwni",
      title: "PENERBITAN SURAT KETERANGAN PINDAH (SKPWNI)",
      category: "kependudukan",
      persyaratan: ["KK Asli", "KTP-el Asli", "Mengisi Formulir F.1-03 (Pendaftaran Perpindahan Penduduk)", "Surat pernyataan tidak keberatan dari pemilik rumah (jika menumpang)"],
      tataCara: [],
    },
    {
      id: "perubahan-elemen-data",
      title: "PERUBAHAN ELEMEN DATA KEPENDUDUKAN",
      category: "kependudukan",
      persyaratan: ["KK Asli", "KTP-el Asli", "Fotokopi dokumen pendukung perubahan data (contoh: ijazah, surat nikah, dll.)"],
      tataCara: [],
    },
    {
      id: "pencatatan-kelahiran-wni",
      title: "PENCATATAN KELAHIRAN WNI",
      category: "sipil",
      persyaratan: [
        "Fotokopi surat keterangan kelahiran dari faskes/dokter/bidan atau kepala desa/lurah",
        "Fotokopi buku nikah/kutipan akta perkawinan",
        "Fotokopi KK",
        "KTP-el orang tua/pelapor",
        "Berita acara dari kepolisian (untuk anak yang tidak diketahui asal usulnya)",
        "SPTJM kebenaran data kelahiran (Formulir F-2.03) dengan 2 saksi, jika tidak ada surat keterangan lahir",
        "SPTJM kebenaran sebagai pasangan suami istri (Formulir F-2.04) dengan 2 saksi, jika tidak ada bukti perkawinan",
      ],
      tataCara: [],
    },
    {
      id: "pencatatan-kematian",
      title: "PENCATATAN KEMATIAN",
      category: "sipil",
      persyaratan: ["Fotokopi surat kematian dari dokter, kepala desa/lurah, atau keterangan kepolisian", "Fotokopi KK/KTP yang meninggal dunia", "Dokumen perjalanan (jika WNI bukan penduduk atau WNA)"],
      tataCara: [],
    },
    {
      id: "pencatatan-perkawinan",
      title: "PENCATATAN PERKAWINAN",
      category: "sipil",
      persyaratan: [
        "Fotokopi surat keterangan perkawinan dari pemuka agama/penghayat kepercayaan",
        "Pas foto berwarna suami dan istri berdampingan (ukuran 4x6, 1 lembar)",
        "KTP-el Asli",
        "KK Asli",
        "Fotokopi akta kematian pasangan (bagi janda/duda cerai mati)",
        "Fotokopi akta perceraian (bagi janda/duda cerai hidup)",
      ],
      tataCara: [],
    },
    {
      id: "pencatatan-perceraian",
      title: "PENCATATAN PERCERAIAN",
      category: "sipil",
      persyaratan: ["Salinan putusan pengadilan yang telah berkekuatan hukum tetap", "Kutipan Akta Perkawinan Asli", "KK Asli", "KTP-el Asli"],
      tataCara: [],
    },
    {
      id: "pencatatan-pengangkatan-anak",
      title: "PENCATATAN PENGANGKATAN ANAK",
      category: "sipil",
      persyaratan: ["Salinan penetapan pengadilan", "Kutipan Akta Kelahiran anak", "KK dan KTP-el orang tua angkat"],
      tataCara: [],
    },
    {
      id: "pencatatan-perubahan-nama",
      title: "PENCATATAN PERUBAHAN NAMA",
      category: "sipil",
      persyaratan: ["Salinan penetapan pengadilan negeri tentang perubahan nama", "Kutipan Akta Pencatatan Sipil (Akta Kelahiran/Perkawinan)", "KK dan KTP-el"],
      tataCara: [],
    },
    {
      id: "penerbitan-kembali-akta",
      title: "PENERBITAN KEMBALI AKTA PENCATATAN SIPIL (KARENA HILANG/RUSAK)",
      category: "sipil",
      persyaratan: ["Surat Keterangan Kehilangan dari Kepolisian (jika hilang)", "Akta yang rusak (jika rusak)", "Fotokopi KK dan KTP-el"],
      tataCara: [],
    },
  ];

  const categories = [
    { id: "kependudukan", name: "Layanan Kependudukan", count: layananData.filter((l) => l.category === "kependudukan").length },
    { id: "sipil", name: "Layanan Pencatatan Sipil", count: layananData.filter((l) => l.category === "sipil").length },
  ];

  const filteredLayanan = activeCategory === "semua" ? layananData : layananData.filter((layanan) => layanan.category === activeCategory);

  return (
    <div className={`min-h-screen bg-gray-50 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Layanan Desa Ngebruk</h1>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <p className="text-gray-700 leading-relaxed text-justify text-sm">
                Selamat datang di bagian Layanan website Desa Ngebruk! Kami hadir untuk memudahkan Anda dalam setiap langkah pembuatan surat yang Anda butuhkan. Di sini, kami menyediakan berbagai layanan pembuatan surat yang dirancang untuk
                memenuhi kebutuhan administrasi warga desa.
              </p>
            </div>

            <div className="mb-6">
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category.id ? "bg-[#1B3A6D] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredLayanan.map((layanan, index) => (
                <div key={layanan.id} className={`bg-white rounded-lg overflow-hidden smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`} style={{ animationDelay: `${index * 0.05}s` }}>
                  <button
                    onClick={() => toggleExpanded(layanan.id)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left bg-white rounded-lg text-gray-700 border-gray-100 border-2 hover:border-[#1B3A6D] transition-colors text-sm font-medium"
                  >
                    <span>{layanan.title}</span>
                    {expandedItems[layanan.id] ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                  </button>

                  {expandedItems[layanan.id] && (
                    <div className="px-6 py-4 bg-white border-2 border-gray-100 rounded-lg mt-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 text-sm">Persyaratan</h4>
                        <ul className="space-y-2">
                          {layanan.persyaratan.map((item, itemIndex) => (
                            <li key={itemIndex} className="text-gray-700 text-sm flex items-start">
                              <span className="w-2 h-2 bg-[#1B3A6D] rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                              <span className="flex-1">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <DownloadFormulirSection />
          </div>

          <div className={`mt-8 lg:mt-0 smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 smooth-transition">Pengumuman</h3>
            <AnnouncementsContent activeAnnouncements={activeAnnouncements} announcementsLoading={announcementsLoading} announcementsError={announcementsError} refetchAnnouncements={refetchAnnouncements} mounted={mounted} />

            <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
              <h4 className="text-lg font-bold text-[#1B3A6D] mb-3">Layanan Online SIPEDULI</h4>
              <div className="text-center mb-4">
                <div className="bg-gray-50 bg-opacity-5 border border-[#1B3A6D] border-opacity-20 rounded-lg p-3">
                  <p className="text-sm font-medium text-[#1B3A6D]">sipeduli.malangkab.go.id</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-xs text-gray-600">Layanan administrasi kependudukan online:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-50 bg-opacity-5 p-2 rounded border border-[#1B3A6D] border-opacity-20">
                    <span className="font-semibold text-[#1B3A6D]">1.</span> <span className="text-gray-700">Registrasi</span>
                  </div>
                  <div className="bg-gray-50 bg-opacity-5 p-2 rounded border border-[#1B3A6D] border-opacity-20">
                    <span className="font-semibold text-[#1B3A6D]">2.</span> <span className="text-gray-700">Aktivasi Email</span>
                  </div>
                  <div className="bg-gray-50 bg-opacity-5 p-2 rounded border border-[#1B3A6D] border-opacity-20">
                    <span className="font-semibold text-[#1B3A6D]">3.</span> <span className="text-gray-700">Upload KTP</span>
                  </div>
                  <div className="bg-gray-50 bg-opacity-5 p-2 rounded border border-[#1B3A6D] border-opacity-20">
                    <span className="font-semibold text-[#1B3A6D]">4.</span> <span className="text-gray-700">Verifikasi</span>
                  </div>
                  <div className="bg-gray-50 bg-opacity-5 p-2 rounded border border-[#1B3A6D] border-opacity-20">
                    <span className="font-semibold text-[#1B3A6D]">5.</span> <span className="text-gray-700">Pengajuan</span>
                  </div>
                  <div className="bg-gray-50 bg-opacity-5 p-2 rounded border border-[#1B3A6D] border-opacity-20">
                    <span className="font-semibold text-[#1B3A6D]">6.</span> <span className="text-gray-700">Ambil Berkas</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <p className="text-xs text-gray-600 mb-2">Informasi lebih lanjut:</p>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-[#1B3A6D]">📞 0858-9545-3152</p>
                  <p className="text-xs font-medium text-[#1B3A6D]">📞 0858-9545-3153</p>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  <span className="text-[#1B3A6D] font-medium">✅ Proses dari rumah</span>
                  <br />
                  <span className="text-[#1B3A6D] font-medium">📋 Ambil di kantor kecamatan</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PelayananPage;
