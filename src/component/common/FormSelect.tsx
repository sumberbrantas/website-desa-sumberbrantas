import React from "react";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

const FormSelect = ({ label, id, name, value, defaultValue, options, required = false, disabled = false, onChange, className = "" }: FormSelectProps) => {
  return (
    <div>
      <label className="block text-xs font-medium text-black mb-2" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`form-input app-form-input app-select w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent text-black ${
          disabled ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""
        } ${className}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;
