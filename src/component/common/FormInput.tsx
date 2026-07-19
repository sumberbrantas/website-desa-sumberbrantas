import React from "react";

interface FormInputProps {
  label: string;
  id?: string;
  name?: string;
  type?: "text" | "email" | "password" | "date" | "number" | "url";
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  min?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const FormInput = ({ label, id, name, type = "text", value, defaultValue, placeholder, required = false, disabled = false, min, onChange, className = "" }: FormInputProps) => {
  return (
    <div>
      <label className="block text-xs font-medium text-black mb-2" htmlFor={id}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        min={min}
        className={`form-input app-form-input w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent text-black ${disabled ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""} ${className}`}
      />
    </div>
  );
};

export default FormInput;
