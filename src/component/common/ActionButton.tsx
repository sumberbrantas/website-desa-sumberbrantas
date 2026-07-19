import React from "react";

interface ActionButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const ActionButton = ({ children, variant = "primary", type = "button", onClick, disabled = false, className = "" }: ActionButtonProps) => {
  const baseClasses = "app-button transition-colors";
  const variantClasses = variant === "primary" ? "bg-[#1B3A6D] text-white hover:bg-[#152f5a]" : "border border-gray-300 text-gray-600 hover:bg-gray-50";

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </button>
  );
};

export default ActionButton;
