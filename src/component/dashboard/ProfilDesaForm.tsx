"use client";

import React, { useState, useEffect } from "react";
import { ProfilDesa } from "@/lib/profilDesaTypes";
import { useProfilDesa } from "@/hooks/useProfilDesa";
import Swal from "sweetalert2";

const ProfilDesaForm = () => {
  const { profilDesa, loading, refetch } = useProfilDesa();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProfilDesa | null>(null);
  const [activeTab, setActiveTab] = useState("header");

  useEffect(() => {
    if (profilDesa) {
      setFormData(profilDesa);
    }
  }, [profilDesa]);

  const handleChange = (path: string, value: any) => {
    if (!formData) return;

    const keys = path.split(".");
    const newData = { ...formData };

    let current: any = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    setFormData(newData);
  };

  const handleArrayItemChange = (arrayPath: string, index: number, field: string, value: any) => {
    if (!formData) return;

    const keys = arrayPath.split(".");
    const newData = { ...formData };

    let current: any = newData;
    for (let i = 0; i < keys.length; i++) {
      current = current[keys[i]];
    }
    current[index] = { ...current[index], [field]: value };

    setFormData(newData);
  };

  const handleAddArrayItem = (arrayPath: string, defaultItem: any) => {
    if (!formData) return;

    const keys = arrayPath.split(".");
    const newData = { ...formData };

    let current: any = newData;
    for (let i = 0; i < keys.length; i++) {
      current = current[keys[i]];
    }
    current.push(defaultItem);

    setFormData(newData);
  };

  const handleRemoveArrayItem = (arrayPath: string, index: number) => {
    if (!formData) return;

    const keys = arrayPath.split(".");
    const newData = { ...formData };

    let current: any = newData;
    for (let i = 0; i < keys.length; i++) {
      current = current[keys[i]];
    }
    current.splice(index, 1);

    setFormData(newData);
  };

  const handleSave = async () => {
    if (!formData) return;

    setSaving(true);
    try {
      const { updateProfilDesa } = await import("@/lib/profilDesaService");
      await updateProfilDesa(formData);
      await refetch();

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Profil Desa berhasil disimpan!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error saving profil desa:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menyimpan profil desa. Silakan coba lagi.",
      });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "header", label: "Header" },
    { id: "visi-misi", label: "Visi & Misi" },
    { id: "peta", label: "Peta & Statistik" },
    { id: "demografi", label: "Demografi" },
  ];

  if (loading || !formData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B3A6D]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-[#1B3A6D] text-[#1B3A6D]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Header Tab */}
        {activeTab === "header" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pengaturan Header</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Judul Halaman</label>
                <input
                  type="text"
                  value={formData.judulHalaman}
                  onChange={(e) => handleChange("judulHalaman", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub Judul</label>
                <input
                  type="text"
                  value={formData.subJudul}
                  onChange={(e) => handleChange("subJudul", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Visi Misi Tab */}
        {activeTab === "visi-misi" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Visi</h3>
              <textarea
                value={formData.visi.text}
                onChange={(e) => handleChange("visi.text", e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Misi</h3>
                <button
                  onClick={() =>
                    handleAddArrayItem("misi", {
                      id: `m${Date.now()}`,
                      text: "",
                      order: formData.misi.length + 1,
                    })
                  }
                  className="px-3 py-1 bg-[#1B3A6D] text-white text-sm rounded-lg hover:bg-[#152f5a]"
                >
                  + Tambah Misi
                </button>
              </div>
              <div className="space-y-4">
                {formData.misi
                  .sort((a, b) => a.order - b.order)
                  .map((misi, index) => (
                    <div key={misi.id} className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                      <span className="flex-shrink-0 w-8 h-8 bg-[#1B3A6D] text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </span>
                      <div className="flex-grow">
                        <textarea
                          value={misi.text}
                          onChange={(e) => handleArrayItemChange("misi", formData.misi.findIndex((m) => m.id === misi.id), "text", e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent text-sm"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveArrayItem("misi", formData.misi.findIndex((m) => m.id === misi.id))}
                        className="flex-shrink-0 px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Peta & Statistik Tab */}
        {activeTab === "peta" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Google Maps Embed URL</h3>
              <textarea
                value={formData.googleMapsUrl}
                onChange={(e) => handleChange("googleMapsUrl", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent"
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
              <p className="text-xs text-gray-500 mt-1">Dapatkan URL dari Google Maps → Share → Embed a map</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik Desa</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Luas Desa (Ha)</label>
                  <input
                    type="text"
                    value={formData.statistik.luasDesa}
                    onChange={(e) => handleChange("statistik.luasDesa", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Penduduk</label>
                  <input
                    type="text"
                    value={formData.statistik.jumlahPenduduk}
                    onChange={(e) => handleChange("statistik.jumlahPenduduk", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jarak ke Kecamatan (Km)</label>
                  <input
                    type="text"
                    value={formData.statistik.jarakKeKecamatan}
                    onChange={(e) => handleChange("statistik.jarakKeKecamatan", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jarak ke Kabupaten (Km)</label>
                  <input
                    type="text"
                    value={formData.statistik.jarakKeKabupaten}
                    onChange={(e) => handleChange("statistik.jarakKeKabupaten", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Batas Wilayah</h3>
                <button
                  onClick={() =>
                    handleAddArrayItem("batasWilayah", {
                      arah: "Utara",
                      wilayah: "",
                    })
                  }
                  className="px-3 py-1 bg-[#1B3A6D] text-white text-sm rounded-lg hover:bg-[#152f5a]"
                >
                  + Tambah Batas
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.batasWilayah.map((batas, index) => (
                  <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <select
                      value={batas.arah}
                      onChange={(e) => handleArrayItemChange("batasWilayah", index, "arah", e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent"
                    >
                      <option value="Utara">Utara</option>
                      <option value="Timur">Timur</option>
                      <option value="Selatan">Selatan</option>
                      <option value="Barat">Barat</option>
                    </select>
                    <input
                      type="text"
                      value={batas.wilayah}
                      onChange={(e) => handleArrayItemChange("batasWilayah", index, "wilayah", e.target.value)}
                      placeholder="Nama wilayah"
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent"
                    />
                    <button
                      onClick={() => handleRemoveArrayItem("batasWilayah", index)}
                      className="flex-shrink-0 px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Demografi Tab */}
        {activeTab === "demografi" && (
          <div className="space-y-8">
            {/* Penggunaan Lahan */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Penggunaan Lahan</h3>
                <button
                  onClick={() =>
                    handleAddArrayItem("penggunaanLahan", {
                      id: `pl${Date.now()}`,
                      jenis: "",
                      luas: "",
                      icon: "📍",
                    })
                  }
                  className="px-3 py-1 bg-[#1B3A6D] text-white text-sm rounded-lg hover:bg-[#152f5a]"
                >
                  + Tambah
                </button>
              </div>
              <div className="space-y-3">
                {formData.penggunaanLahan.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <input
                      type="text"
                      value={item.icon}
                      onChange={(e) => handleArrayItemChange("penggunaanLahan", index, "icon", e.target.value)}
                      className="w-16 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent text-center"
                    />
                    <input
                      type="text"
                      value={item.jenis}
                      onChange={(e) => handleArrayItemChange("penggunaanLahan", index, "jenis", e.target.value)}
                      placeholder="Jenis"
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={item.luas}
                      onChange={(e) => handleArrayItemChange("penggunaanLahan", index, "luas", e.target.value)}
                      placeholder="Luas"
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent"
                    />
                    <button
                      onClick={() => handleRemoveArrayItem("penggunaanLahan", index)}
                      className="flex-shrink-0 px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Data per Dusun */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Data Penduduk per Dusun</h3>
                <button
                  onClick={() =>
                    handleAddArrayItem("dataDusun", {
                      id: `d${Date.now()}`,
                      dusun: "",
                      rt: 0,
                      rw: 0,
                      penduduk: 0,
                      kk: 0,
                    })
                  }
                  className="px-3 py-1 bg-[#1B3A6D] text-white text-sm rounded-lg hover:bg-[#152f5a]"
                >
                  + Tambah Dusun
                </button>
              </div>
              <div className="space-y-3">
                {formData.dataDusun.map((item, index) => (
                  <div key={item.id} className="flex flex-wrap items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <input
                      type="text"
                      value={item.dusun}
                      onChange={(e) => handleArrayItemChange("dataDusun", index, "dusun", e.target.value)}
                      placeholder="Nama Dusun"
                      className="flex-grow min-w-[150px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent"
                    />
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-500">RT:</label>
                      <input
                        type="number"
                        value={item.rt}
                        onChange={(e) => handleArrayItemChange("dataDusun", index, "rt", parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-500">RW:</label>
                      <input
                        type="number"
                        value={item.rw}
                        onChange={(e) => handleArrayItemChange("dataDusun", index, "rw", parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-500">Penduduk:</label>
                      <input
                        type="number"
                        value={item.penduduk}
                        onChange={(e) => handleArrayItemChange("dataDusun", index, "penduduk", parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-500">KK:</label>
                      <input
                        type="number"
                        value={item.kk}
                        onChange={(e) => handleArrayItemChange("dataDusun", index, "kk", parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveArrayItem("dataDusun", index)}
                      className="flex-shrink-0 px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Komposisi Agama */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Komposisi Agama</h3>
                <button
                  onClick={() =>
                    handleAddArrayItem("dataAgama", {
                      id: `a${Date.now()}`,
                      agama: "",
                      total: 0,
                      persentase: "",
                    })
                  }
                  className="px-3 py-1 bg-[#1B3A6D] text-white text-sm rounded-lg hover:bg-[#152f5a]"
                >
                  + Tambah
                </button>
              </div>
              <div className="space-y-3">
                {formData.dataAgama.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <input
                      type="text"
                      value={item.agama}
                      onChange={(e) => handleArrayItemChange("dataAgama", index, "agama", e.target.value)}
                      placeholder="Nama Agama"
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent"
                    />
                    <input
                      type="number"
                      value={item.total}
                      onChange={(e) => handleArrayItemChange("dataAgama", index, "total", parseInt(e.target.value) || 0)}
                      placeholder="Jumlah"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={item.persentase}
                      onChange={(e) => handleArrayItemChange("dataAgama", index, "persentase", e.target.value)}
                      placeholder="%"
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent"
                    />
                    <button
                      onClick={() => handleRemoveArrayItem("dataAgama", index)}
                      className="flex-shrink-0 px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Mata Pencaharian */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Mata Pencaharian</h3>
                <button
                  onClick={() =>
                    handleAddArrayItem("mataPencaharian", {
                      id: `mp${Date.now()}`,
                      jenis: "",
                      jumlah: 0,
                      icon: "👥",
                    })
                  }
                  className="px-3 py-1 bg-[#1B3A6D] text-white text-sm rounded-lg hover:bg-[#152f5a]"
                >
                  + Tambah
                </button>
              </div>
              <div className="space-y-3">
                {formData.mataPencaharian.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <input
                      type="text"
                      value={item.icon}
                      onChange={(e) => handleArrayItemChange("mataPencaharian", index, "icon", e.target.value)}
                      className="w-16 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent text-center"
                    />
                    <input
                      type="text"
                      value={item.jenis}
                      onChange={(e) => handleArrayItemChange("mataPencaharian", index, "jenis", e.target.value)}
                      placeholder="Jenis pekerjaan"
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent"
                    />
                    <input
                      type="number"
                      value={item.jumlah}
                      onChange={(e) => handleArrayItemChange("mataPencaharian", index, "jumlah", parseInt(e.target.value) || 0)}
                      placeholder="Jumlah"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent"
                    />
                    <button
                      onClick={() => handleRemoveArrayItem("mataPencaharian", index)}
                      className="flex-shrink-0 px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-[#1B3A6D] text-white font-medium rounded-lg hover:bg-[#152f5a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Menyimpan...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Simpan Perubahan
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProfilDesaForm;
