import React from "react";
import FormInput from "../common/FormInput";
import FormTextarea from "../common/FormTextarea";

interface AnnouncementBasicFieldsProps {
  title: string;
  content: string;
  onFieldChange: (field: string, value: string) => void;
  loading?: boolean;
}

const AnnouncementBasicFields = ({ title, content, onFieldChange, loading = false }: AnnouncementBasicFieldsProps) => {
  return (
    <>
      <FormInput
        label="Judul Pengumuman"
        name="title"
        value={title}
        placeholder="Masukkan judul pengumuman..."
        onChange={(e) => onFieldChange("title", e.target.value)}
        disabled={loading}
        required
      />

      <FormTextarea
        label="Isi Pengumuman"
        name="content"
        value={content}
        placeholder="Tulis isi pengumuman di sini..."
        rows={6}
        onChange={(e) => onFieldChange("content", e.target.value)}
        disabled={loading}
        required
      />
    </>
  );
};

export default AnnouncementBasicFields;
