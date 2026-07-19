"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/component/common/PageHeader";
import FormInput from "@/component/common/FormInput";
import ActionButton from "@/component/common/ActionButton";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthActions } from "@/hooks/useAuth";
import CreditsFooter from "@/component/common/CreditsFooter";

const ProfilePage = () => {
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const { profile, user, refreshProfile } = useAuth();
  const { updateProfile, loading, error, clearError } = useAuthActions();

  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    role: profile?.role || "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        role: profile.role || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error, clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (success || error) {
      setSuccess(null);
      clearError();
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    const updateData = {
      name: formData.name,
    };

    const result = await updateProfile(user.uid, updateData);

    if (result.success) {
      setSuccess("Profil berhasil diperbarui!");
      setIsEditing(false);
      await refreshProfile();
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        role: profile.role || "",
      });
    }
    setIsEditing(false);
    setSuccess(null);
    clearError();
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3A6D] mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Memuat profil...</p>
        </div>
      </div>
    );
  }

  const headerActions = isEditing ? (
    <>
      <ActionButton variant="secondary" onClick={handleCancel} disabled={loading}>
        Batal
      </ActionButton>
      <ActionButton variant="primary" onClick={handleSave} disabled={loading}>
        {loading ? "Menyimpan..." : "Simpan"}
      </ActionButton>
    </>
  ) : (
    <ActionButton variant="primary" onClick={() => setIsEditing(true)}>
      Edit Profil
    </ActionButton>
  );

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Profil Pengguna" subtitle="Kelola informasi profil Anda" actions={headerActions} mounted={mounted} />

      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md smooth-transition">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md smooth-transition">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white app-card shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 bg-[#1B3A6D] rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">{profile.name?.charAt(0).toUpperCase() || "A"}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-gray-600 capitalize">{profile.role}</p>
            </div>
          </div>

          <form className="space-y-4">
            <FormInput label="Nama Lengkap" name="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama lengkap..." disabled={!isEditing} />

            <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Masukkan email..." disabled={true} />

            <FormInput label="Role" name="role" value={formData.role} onChange={handleInputChange} placeholder="Role pengguna..." disabled={true} />

            <div className="pt-4">
              <label className="block text-xs font-medium text-black mb-2">UID Pengguna</label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <code className="text-sm text-gray-600">{profile.uid}</code>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className={`w-full bg-gray-100 py-4 md:py-4 smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
        <CreditsFooter variant="light" />
      </div>
    </div>
  );
};

export default ProfilePage;
