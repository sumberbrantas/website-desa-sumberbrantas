import React from "react";
import FormSelect from "../common/FormSelect";
import { PRIORITY_OPTIONS } from "@/constants/announcementFormConstants";

interface AnnouncementPriorityFieldProps {
  priority: string;
  onFieldChange: (field: string, value: string) => void;
  loading?: boolean;
}

const AnnouncementPriorityField = ({ priority, onFieldChange, loading = false }: AnnouncementPriorityFieldProps) => {
  return <FormSelect label="Tingkat Prioritas" name="priority" value={priority} options={PRIORITY_OPTIONS} onChange={(e) => onFieldChange("priority", e.target.value)} disabled={loading} />;
};

export default AnnouncementPriorityField;
