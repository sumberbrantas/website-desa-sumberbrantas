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
  const variantClasses = variant === "primary" ? "bg-[#556846] text-white hover:bg-[#3d4f35]" : "border border-gray-300 text-gray-600 hover:bg-gray-50";

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </button>
  );
};

export default ActionButton;
