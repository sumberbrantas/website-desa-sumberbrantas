import React from "react";

interface SuccessMessageProps {
  message: string;
}

const SuccessMessage = ({ message }: SuccessMessageProps) => {
  return (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md smooth-transition">
      <p className="text-green-600 text-sm font-medium mb-2">✅ Email Berhasil Dikirim!</p>
      <p className="text-green-600 text-sm">{message}</p>
      <div className="mt-3 text-xs text-green-600">
        <p>📧 Periksa folder:</p>
        <ul className="list-disc list-inside ml-2 mt-1">
          <li>Kotak Masuk (Inbox)</li>
          <li>Folder Spam/Junk</li>
          <li>Folder Promosi (Gmail)</li>
        </ul>
        <p className="mt-2">⏰ Email akan tiba dalam 1-5 menit</p>
      </div>
    </div>
  );
};

export default SuccessMessage;
