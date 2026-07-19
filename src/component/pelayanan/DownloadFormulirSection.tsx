"use client";

import React from "react";
import { FiDownload, FiFileText, FiInfo } from "react-icons/fi";

const DownloadFormulirSection = () => {
  const formulirData = [
    {
      id: "formulir-f-2-01",
      title: "F2.01 - Formulir Pelaporan Pencatatan Sipil",
      description: "Formulir umum yang digunakan untuk berbagai keperluan pencatatan sipil seperti pelaporan kelahiran, kematian, perkawinan, perceraian, dll.",
      downloadUrl: "https://drive.google.com/file/d/1DisS6Yt08VBFwMnOa7VgXFdwetyZLMwR/view?usp=sharing",
    },
    {
      id: "surat-pernyataan",
      title: "Surat Pernyataan Kebenaran Data",
      description: "Template Surat Pernyataan Tanggung Jawab Mutlak (SPTJM) yang menyatakan bahwa semua data dan dokumen yang diserahkan adalah benar dan sah.",
      downloadUrl: "https://drive.google.com/file/d/1rNZjGuezkohoMZ1SuETyZ38TfLXlT6B2/view?usp=sharing",
    },
  ];

  const handleDownload = (formulir: (typeof formulirData)[0]) => {
    if (formulir.downloadUrl) {
      window.open(formulir.downloadUrl, "_blank");
    } else {
      alert("Link download akan segera tersedia");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
      <h2 className="text-xl font-bold text-[#1B3A6D] mb-2">Unduh Formulir</h2>
      <p className="text-gray-600 text-sm mb-4">Unduh formulir yang diperlukan untuk keperluan administrasi kependudukan dan pencatatan sipil.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formulirData.map((formulir) => (
          <div key={formulir.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#1B3A6D] transition-colors">
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{formulir.title}</h3>
                <p className="text-xs text-gray-600 mb-3">{formulir.description}</p>
                <button onClick={() => handleDownload(formulir)} className="inline-flex items-center px-3 py-1.5 bg-[#1B3A6D] text-white text-xs font-medium rounded hover:bg-[#152f5a] transition-colors">
                  <FiDownload className="w-3 h-3 mr-1" />
                  Unduh PDF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadFormulirSection;

