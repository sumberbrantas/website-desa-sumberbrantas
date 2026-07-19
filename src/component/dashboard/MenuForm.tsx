"use client";

import { useState, useEffect } from "react";
import FormInput from "@/component/common/FormInput";
import FormTextarea from "@/component/common/FormTextarea";
import { MenuItem, AVAILABLE_ICONS } from "@/lib/menuService";

interface MenuFormProps {
  menu?: MenuItem;
  onSave: (data: {
    name: string;
    href: string;
    icon: string;
    order: number;
    isActive: boolean;
    targetBlank: boolean;
  }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const MenuForm = ({ menu, onSave, onCancel, loading }: MenuFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    href: "",
    icon: "FiHome",
    order: 1,
    isActive: true,
    targetBlank: false,
  });

  useEffect(() => {
    if (menu) {
      setFormData({
        name: menu.name,
        href: menu.href,
        icon: menu.icon || "FiHome",
        order: menu.order,
        isActive: menu.isActive,
        targetBlank: menu.targetBlank,
      });
    }
  }, [menu]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      ...formData,
      order: Number(formData.order),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Nama Menu"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Contoh: Destinasi Wisata"
          required
        />

        <FormInput
          label="URL/Href"
          name="href"
          value={formData.href}
          onChange={handleChange}
          placeholder="/destinations"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-black mb-2">Icon</label>
          <select
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          >
            {AVAILABLE_ICONS.map((icon) => (
              <option key={icon.name} value={icon.name}>
                {icon.label}
              </option>
            ))}
          </select>
        </div>

        <FormInput
          label="Urutan"
          name="order"
          type="number"
          value={String(formData.order)}
          onChange={handleChange}
          placeholder="1"
          required
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
          />
          <span className="text-sm text-gray-700">Menu Aktif</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="targetBlank"
            checked={formData.targetBlank}
            onChange={handleChange}
            className="w-4 h-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
          />
          <span className="text-sm text-gray-700">Buka di Tab Baru</span>
        </label>
      </div>

      {menu?.isBuiltIn && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-700">
            ⚠️ Menu ini adalah menu bawaan. Anda tidak dapat menghapus menu bawaan.
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          disabled={loading}
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50"
          style={{ backgroundColor: "var(--primary)" }}
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
};

export default MenuForm;
