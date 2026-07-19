import React from "react";
import AnnouncementBasicFields from "./AnnouncementBasicFields";
import AnnouncementDateFields from "./AnnouncementDateFields";
import AnnouncementPriorityField from "./AnnouncementPriorityField";
import { FORM_FIELDS } from "@/constants/announcementFormConstants";

interface AnnouncementFormProps {
  formData?: {
    title?: string;
    content?: string;
    startDate?: string;
    endDate?: string;
    priority?: string;
  };
  onChange?: (field: string, value: string) => void;
  isEditing?: boolean;
  loading?: boolean;
}

const AnnouncementForm = ({ formData = {}, onChange, isEditing = false, loading = false }: AnnouncementFormProps) => {
  const handleFieldChange = (field: string, value: string) => {
    if (onChange) {
      onChange(field, value);
    }
  };

  return (
    <form className="space-y-4">
      <AnnouncementBasicFields title={formData.title || ""} content={formData.content || ""} onFieldChange={handleFieldChange} loading={loading} />

      <AnnouncementDateFields startDate={formData.startDate || ""} endDate={formData.endDate || ""} onFieldChange={handleFieldChange} loading={loading} />

      <AnnouncementPriorityField priority={formData.priority || "normal"} onFieldChange={handleFieldChange} loading={loading} />
    </form>
  );
};

export default AnnouncementForm;
