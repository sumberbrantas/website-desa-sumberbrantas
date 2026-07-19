import React from "react";

interface ErrorMessageProps {
  error: string;
}

const ErrorMessage = ({ error }: ErrorMessageProps) => {
  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md smooth-transition">
      <p className="text-red-600 text-sm">{error}</p>
    </div>
  );
};

export default ErrorMessage;
