"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/component/common/PageHeader";
import FormInput from "@/component/common/FormInput";
import FormTextarea from "@/component/common/FormTextarea";
import ActionButton from "@/component/common/ActionButton";
import { useVillageSettings, useVillageSettingsActions } from "@/hooks/useVillageSettings";
import { VillageSettings } from "@/lib/villageSettingsService";
import Swal from "sweetalert2";

const SettingsPage = () => {
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { settings, loading, error, refetch } = useVillageSettings();
  const { updateSettings, uploadNewLogo, uploadNewIcon, error: actionError } = useVillageSettingsActions();

  const [formData, setFormData] = useState<Partial<VillageSettings>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [iconPreview, setIconPreview] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (settings) {
      setFormData({
        villageName: settings.villageName,
        villageTagline: settings.villageTagline,
        villageDescription: settings.villageDescription,
        videoUrl: settings.videoUrl,
        whatsappNumber: settings.whatsappNumber,
        whatsappMessage: settings.whatsappMessage,
        address: settings.address,
        email: settings.email,
        phone: settings.phone,
        socialLinks: settings.socialLinks,
        accommodationWhatsapp: settings.accommodationWhatsapp,
        accommodationWhatsappMessage: settings.accommodationWhatsappMessage,
      });
      setLogoPreview(settings.logoUrl);
      setIconPreview(settings.iconUrl);
    }
  }, [settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("social_")) {
      const socialKey = name.replace("social_", "");
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        Swal.fire("Error", "File harus berupa gambar", "error");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire("Error", "Ukuran file tidak boleh lebih dari 5MB", "error");
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        Swal.fire("Error", "File harus berupa gambar", "error");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire("Error", "Ukuran file tidak boleh lebih dari 5MB", "error");
        return;
      }
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      let logoUrl = settings?.logoUrl || "";
      let iconUrl = settings?.iconUrl || "";

      // Upload new logo if changed
      if (logoFile) {
        const logoResult = await uploadNewLogo(logoFile, settings?.logoUrl);
        if (logoResult) {
          logoUrl = logoResult.url;
        }
      }

      // Upload new icon if changed
      if (iconFile) {
        const iconResult = await uploadNewIcon(iconFile, settings?.iconUrl);
        if (iconResult) {
          iconUrl = iconResult.url;
        }
      }

      // Update settings
      const updateData = {
        ...formData,
        logoUrl,
        iconUrl,
      };

      await updateSettings(updateData);

      Swal.fire("Berhasil", "Pengaturan berhasil disimpan!", "success");
      setIsEditing(false);
      setLogoFile(null);
      setIconFile(null);
      refetch();
    } catch (err) {
      console.error("Error saving settings:", err);
      Swal.fire("Error", "Gagal menyimpan pengaturan", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (settings) {
      setFormData({
        villageName: settings.villageName,
        villageTagline: settings.villageTagline,
        villageDescription: settings.villageDescription,
        videoUrl: settings.videoUrl,
        whatsappNumber: settings.whatsappNumber,
        whatsappMessage: settings.whatsappMessage,
        address: settings.address,
        email: settings.email,
        phone: settings.phone,
        socialLinks: settings.socialLinks,
        accommodationWhatsapp: settings.accommodationWhatsapp,
        accommodationWhatsappMessage: settings.accommodationWhatsappMessage,
      });
      setLogoPreview(settings.logoUrl);
      setIconPreview(settings.iconUrl);
    }
    setIsEditing(false);
    setLogoFile(null);
    setIconFile(null);
  };

  if (loading && !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: "var(--primary)" }}></div>
          <p className="text-gray-600 text-sm">Memuat pengaturan...</p>
        </div>
      </div>
    );
  }

  const headerActions = isEditing ? (
    <>
      <ActionButton variant="secondary" onClick={handleCancel} disabled={isSaving}>
        Batal
      </ActionButton>
      <ActionButton variant="primary" onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Menyimpan..." : "Simpan"}
      </ActionButton>
    </>
  ) : (
    <ActionButton variant="primary" onClick={() => setIsEditing(true)}>
      Edit Pengaturan
    </ActionButton>
  );

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Pengaturan Desa"
        subtitle="Kelola informasi umum desa, branding, dan kontak"
        actions={headerActions}
        mounted={mounted}
      />

      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        {(error || actionError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md smooth-transition">
            <p className="text-red-600 text-sm">{error || actionError}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Dasar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Nama Desa"
                name="villageName"
                value={formData.villageName || ""}
                onChange={handleInputChange}
                placeholder="Masukkan nama desa..."
                disabled={!isEditing}
              />
              <FormInput
                label="Tagline"
                name="villageTagline"
                value={formData.villageTagline || ""}
                onChange={handleInputChange}
                placeholder="Contoh: Kecamatan Sumberpucung"
                disabled={!isEditing}
              />
            </div>
            <div className="mt-4">
              <FormTextarea
                label="Deskripsi Desa"
                name="villageDescription"
                value={formData.villageDescription || ""}
                onChange={handleInputChange}
                placeholder="Masukkan deskripsi singkat tentang desa..."
                rows={3}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Branding */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Branding</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo */}
              <div>
                <label className="block text-xs font-medium text-black mb-2">Logo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {logoPreview ? (
                    <div className="relative">
                      <img src={logoPreview} alt="Logo" className="max-h-24 mx-auto object-contain" />
                      {isEditing && (
                        <label className="mt-3 inline-block px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded cursor-pointer hover:bg-gray-200">
                          Ganti Logo
                          <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                        </label>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-500 text-sm mb-2">Belum ada logo</p>
                      {isEditing && (
                        <label className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded cursor-pointer hover:bg-gray-200">
                          Upload Logo
                          <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                        </label>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Icon */}
              <div>
                <label className="block text-xs font-medium text-black mb-2">Icon/Favicon</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {iconPreview ? (
                    <div className="relative">
                      <img src={iconPreview} alt="Icon" className="max-h-24 mx-auto object-contain" />
                      {isEditing && (
                        <label className="mt-3 inline-block px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded cursor-pointer hover:bg-gray-200">
                          Ganti Icon
                          <input type="file" accept="image/*" onChange={handleIconChange} className="hidden" />
                        </label>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-500 text-sm mb-2">Belum ada icon</p>
                      {isEditing && (
                        <label className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded cursor-pointer hover:bg-gray-200">
                          Upload Icon
                          <input type="file" accept="image/*" onChange={handleIconChange} className="hidden" />
                        </label>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Video */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Profile</h3>
            <FormInput
              label="URL YouTube"
              name="videoUrl"
              value={formData.videoUrl || ""}
              onChange={handleInputChange}
              placeholder="https://www.youtube.com/watch?v=..."
              disabled={!isEditing}
            />
            <p className="text-xs text-gray-500 mt-2">
              Masukkan link YouTube untuk video profile desa yang akan ditampilkan di halaman utama.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kontak</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Nomor WhatsApp"
                name="whatsappNumber"
                value={formData.whatsappNumber || ""}
                onChange={handleInputChange}
                placeholder="6281234567890"
                disabled={!isEditing}
              />
              <FormInput
                label="Email"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                placeholder="email@desa.id"
                disabled={!isEditing}
              />
              <FormInput
                label="Telepon"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
                placeholder="0212345678"
                disabled={!isEditing}
              />
              <FormInput
                label="Alamat"
                name="address"
                value={formData.address || ""}
                onChange={handleInputChange}
                placeholder="Jl. Desa No. 1, Kelurahan, Kecamatan"
                disabled={!isEditing}
              />
            </div>
            <div className="mt-4">
              <FormTextarea
                label="Pesan WhatsApp Default"
                name="whatsappMessage"
                value={formData.whatsappMessage || ""}
                onChange={handleInputChange}
                placeholder="Pesan default yang akan dikirim saat klik WhatsApp..."
                rows={2}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tautan Sosial Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Instagram"
                name="social_instagram"
                value={formData.socialLinks?.instagram || ""}
                onChange={handleInputChange}
                placeholder="https://instagram.com/..."
                disabled={!isEditing}
              />
              <FormInput
                label="Facebook"
                name="social_facebook"
                value={formData.socialLinks?.facebook || ""}
                onChange={handleInputChange}
                placeholder="https://facebook.com/..."
                disabled={!isEditing}
              />
              <FormInput
                label="YouTube"
                name="social_youtube"
                value={formData.socialLinks?.youtube || ""}
                onChange={handleInputChange}
                placeholder="https://youtube.com/..."
                disabled={!isEditing}
              />
              <FormInput
                label="TikTok"
                name="social_tiktok"
                value={formData.socialLinks?.tiktok || ""}
                onChange={handleInputChange}
                placeholder="https://tiktok.com/@..."
                disabled={!isEditing}
              />
              <FormInput
                label="Twitter/X"
                name="social_twitter"
                value={formData.socialLinks?.twitter || ""}
                onChange={handleInputChange}
                placeholder="https://x.com/..."
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Accommodation WhatsApp */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">WhatsApp Penginapan</h3>
            <p className="text-xs text-gray-500 mb-4">
              Nomor WhatsApp khusus untuk penginapan. Jika kosong, akan menggunakan nomor WhatsApp utama.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Nomor WA Penginapan"
                name="accommodationWhatsapp"
                value={formData.accommodationWhatsapp || ""}
                onChange={handleInputChange}
                placeholder="6281234567890"
                disabled={!isEditing}
              />
            </div>
            <div className="mt-4">
              <FormTextarea
                label="Pesan WA Penginapan"
                name="accommodationWhatsappMessage"
                value={formData.accommodationWhatsappMessage || ""}
                onChange={handleInputChange}
                placeholder="Pesan default untuk booking penginapan..."
                rows={2}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
