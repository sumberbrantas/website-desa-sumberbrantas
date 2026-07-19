import React from "react";
import FormInput from "../common/FormInput";

interface AnnouncementDateFieldsProps {
  startDate: string;
  endDate: string;
  onFieldChange: (field: string, value: string) => void;
  loading?: boolean;
}

const AnnouncementDateFields = ({ startDate, endDate, onFieldChange, loading = false }: AnnouncementDateFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <FormInput label="Tanggal Mulai" name="startDate" type="date" value={startDate} onChange={(e) => onFieldChange("startDate", e.target.value)} disabled={loading} required />
      <FormInput label="Tanggal Berakhir" name="endDate" type="date" value={endDate} onChange={(e) => onFieldChange("endDate", e.target.value)} disabled={loading} required />
    </div>
  );
};

export default AnnouncementDateFields;
