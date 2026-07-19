"use client";

import React from "react";
import Link from "next/link";

const AnnouncementSection = () => {
  const announcements = [
    {
      id: 1,
      title: "Pengumuman tentang Aksi Bersih Pegawai Pemerintah dengan Pernyataan...",
      date: "Rabu, 3 Juli 2024",
    },
    {
      id: 2,
      title: "Pengumuman tentang Aksi Bersih Pegawai Pemerintah dengan Pernyataan...",
      date: "Rabu, 3 Juli 2024",
    },
    {
      id: 3,
      title: "Pengumuman tentang Aksi Bersih Pegawai Pemerintah dengan Pernyataan...",
      date: "Rabu, 3 Juli 2024",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pengumuman</h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">{announcement.title}</h3>
                <p className="text-sm text-gray-500">{announcement.date}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/pengumuman" className="text-[#1B3A6D] hover:text-[#152f5a] font-medium transition-colors">
            Lihat Pengumuman Lainnya
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AnnouncementSection;
