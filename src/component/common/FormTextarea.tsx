import React from "react";

interface FormTextareaProps {
  label: string;
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

const FormTextarea = ({ label, id, name, value, defaultValue, placeholder, rows = 6, required = false, disabled = false, onChange, className = "" }: FormTextareaProps) => {
  return (
    <div>
      <label className="block text-xs font-medium text-black mb-2" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
        className={`form-input app-form-input w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent text-black ${
          disabled ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""
        } ${className}`}
      />
    </div>
  );
};

export default FormTextarea;
